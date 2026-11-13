import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

// Manual Svix signature verification (avoids extra dependency)
function verifySvixSignature(
  headers: Headers,
  payload: string
): { valid: boolean; reason?: string } {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return { valid: false, reason: "CLERK_WEBHOOK_SIGNING_SECRET is not set" };
  }

  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatureHeader = headers.get("svix-signature");

  if (!id || !timestamp || !signatureHeader) {
    return { valid: false, reason: "Missing svix headers" };
  }

  // Reject events older than 5 minutes (replay protection)
  const timestampSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(timestampSeconds - parseInt(timestamp, 10)) > 300) {
    return { valid: false, reason: "Webhook timestamp too old" };
  }

  const secretParts = secret.split("_");
  if (secretParts.length !== 2 || secretParts[0] !== "whsec") {
    return { valid: false, reason: "Invalid webhook secret format" };
  }
  const secretBytes = Buffer.from(secretParts[1], "base64");

  const signedContent = `${id}.${timestamp}.${payload}`;
  const expectedSignature = createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  const providedSignatures = signatureHeader.split(" ");
  const isValid = providedSignatures.some((sig) => {
    try {
      const a = Buffer.from(sig, "base64");
      const b = Buffer.from(expectedSignature, "base64");
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });

  if (!isValid) {
    return { valid: false, reason: "Signature mismatch" };
  }

  return { valid: true };
}

async function ensureUniqueUsername(base: string): Promise<string> {
  const sanitized =
    base
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "creator";

  let username = sanitized;
  let suffix = 1;

  // Loop until a free username is found (bounded attempts)
  while (
    (await prisma.user.findUnique({ where: { username } })) !== null &&
    suffix < 100
  ) {
    username = `${sanitized}${suffix}`;
    suffix += 1;
  }

  return username;
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const verification = verifySvixSignature(request.headers, rawBody);
  if (!verification.valid) {
    return NextResponse.json(
      { error: verification.reason },
      { status: 401 }
    );
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, image_url, first_name, last_name, username } =
          event.data;

        const email = email_addresses.find((e) => e.id === event.data.primary_email_address_id)?.email_address || email_addresses[0]?.email_address;

        if (!email) {
          return NextResponse.json({ received: true, skipped: "no email" });
        }

        const displayName =
          [first_name, last_name].filter(Boolean).join(" ") || null;

        const data = {
          email,
          displayName,
          avatarUrl: image_url || null,
          username: username || (await ensureUniqueUsername(email.split("@")[0])),
        };

        await prisma.user.upsert({
          where: { clerkId: id },
          create: { clerkId: id, ...data },
          update: { ...data },
        });
        break;
      }

      case "user.deleted": {
        const { id } = event.data;
        if (id) {
          await prisma.user.deleteMany({ where: { clerkId: id } });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

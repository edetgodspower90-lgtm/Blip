export type MediaType = "VIDEO" | "IMAGE";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  isFollowing?: boolean;
}

export interface PostItem {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  caption: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  audioTitle: string;
  audioAuthor: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  content: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  replies?: CommentItem[];
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationItem {
  id: string;
  lastMessage?: DirectMessage;
  unreadCount: number;
  updatedAt: string;
  participant: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isOnline?: boolean;
  };
}

export interface AppNotification {
  id: string;
  sender: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  type: "LIKE" | "COMMENT" | "FOLLOW" | "MENTION";
  postThumbnail?: string;
  postId?: string;
  message?: string;
  createdAt: string;
  isRead: boolean;
}

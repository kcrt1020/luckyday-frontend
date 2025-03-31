export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

export interface UserProfile {
  nickname: string;
  bio: string;
  profileImage: string;
}

export interface NotificationSender {
  id: number;
  username: string;
  profile: {
    nickname: string;
    profileImage: string;
  };
}

export type NotificationType = "LIKE" | "COMMENT" | "FOLLOW";

export interface Notification {
  id: number;
  type: NotificationType;
  targetId: number;
  url: string;
  read: boolean;
  createdAt: string;
  sender: NotificationSender;
}

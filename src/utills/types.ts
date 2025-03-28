export interface User {
  id: number;
  userId: string;
  email: string;
  profile: UserProfile;
}

export interface UserProfile {
  nickname: string;
  bio: string;
  profileImage: string;
}

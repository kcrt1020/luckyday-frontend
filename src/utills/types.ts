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

import { useEffect, useState } from "react";
import { apiRequest } from "../utills/api";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import EditProfile from "../components/EditProfile";
import ViewProfile from "../components/ViewProfile";

export interface IProfile {
  nickname: string;
  profileImage?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  username: string;
  email: string;
  birthDate?: string | null;
}

export default function Profile() {
  const { username } = useParams();
  const currentUser = useCurrentUser();
  const isOwnProfile = currentUser?.username === username;

  const [profile, setProfile] = useState<IProfile>({
    nickname: "",
    profileImage: null,
    bio: "",
    location: "",
    website: "",
    email: "",
    username: "",
    birthDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await apiRequest(`/api/profile/${username}`);
      if (response) setProfile(response);
    } catch (error) {
      console.error("❌ 프로필 불러오기 실패:", error);
    }
  };

  return isEditing && isOwnProfile ? (
    <EditProfile
      profile={profile}
      onCancel={() => setIsEditing(false)}
      onSave={() => {
        fetchProfile();
        setIsEditing(false);
      }}
    />
  ) : (
    <ViewProfile
      profile={profile}
      isOwnProfile={isOwnProfile}
      onEdit={() => setIsEditing(true)}
    />
  );
}

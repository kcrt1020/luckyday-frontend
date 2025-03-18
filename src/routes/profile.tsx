import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import Timeline from "../components/timeline"; // ✅ Timeline 불러오기

interface IProfile {
  nickname: string;
  profileImage?: string | null;
  bio?: string;
  location?: string;
  website?: string;
  userId: string;
  email: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  height: 80vh;
`;

const ProfileUpload = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #81c147;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-width: 80px;
  min-height: 80px;

  svg {
    width: 50px; // ✅ 아이콘 크기 조정
    height: 50px;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>({
    nickname: "",
    profileImage: null,
    bio: "",
    location: "",
    website: "",
    email: "",
    userId: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("🚀 Fetching profile...");
      const response = await apiRequest("/api/profile/me");
      if (response) {
        console.log("✅ Profile fetched successfully:", response);
        setProfile(response);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  };

  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("profileImage", files[0]);

    try {
      const response = await apiRequest("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (response) {
        setProfile((prev) => ({
          ...prev,
          profileImage: response.profileImage,
        }));
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <Wrapper>
      <ProfileUpload htmlFor="profile">
        {profile.profileImage ? (
          <ProfileImg
            src={profile.profileImage}
            alt="User Profile"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            ></path>
          </svg>
        )}
      </ProfileUpload>
      <ProfileInput
        onChange={onProfileChange}
        id="profile"
        type="file"
        accept="image/*"
      />
      <Name>
        {profile.nickname || "Anonymous"} (@{profile.userId || "No ID"})
      </Name>

      {/* ✅ 타임라인 컴포넌트 재사용 */}
      <Timeline userId={profile.userId} />
    </Wrapper>
  );
}

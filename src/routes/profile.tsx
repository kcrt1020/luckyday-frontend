import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import Timeline from "../components/timeline";

interface IProfile {
  nickname: string;
  profileImage?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  userId: string;
  email: string;
  birth_date?: string | null;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
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
    width: 50px;
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
  font-weight: bold;
`;

const Bio = styled.p`
  font-size: 16px;
  text-align: center;
  max-width: 80%;
`;

const ExtraInfo = styled.div`
  font-size: 14px;
  color: grey;
  text-align: center;
`;

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>({
    nickname: "Anonymous",
    profileImage: null,
    bio: null,
    location: null,
    website: null,
    email: "",
    userId: "No ID",
    birth_date: null,
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
        setProfile({
          ...response,
          nickname: response.nickname || "Anonymous",
          userId: response.userId || "No ID",
          bio: response.bio || "소개가 없습니다.",
          location: response.location || "위치 정보 없음",
          website: response.website || "웹사이트 없음",
          birth_date: response.birth_date || "생년월일 정보 없음",
        });
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

    console.log([...formData]); // FormData 확인용

    try {
      const response = await apiRequest(
        "/api/profile/avatar",
        {
          method: "POST",
          body: formData,
        },
        false,
        true
      ); // ✅ isMultipart = true 추가

      if (!response) throw new Error("Failed to upload");

      setProfile((prev) => ({
        ...prev,
        profileImage: response.profileImage,
      }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <Wrapper>
      <ProfileUpload htmlFor="profile">
        {profile.profileImage ? (
          <ProfileImg
            src={`${API_URL}${profile.profileImage}`} // 업로드된 이미지 URL 생성
            alt="User Profile"
            onError={(e) => (e.currentTarget.style.display = "none")} // 이미지 로드 실패 시 숨김
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
        {profile.nickname} (@{profile.userId})
      </Name>

      <Bio>{profile.bio}</Bio>

      <ExtraInfo>
        <p>📍 {profile.location}</p>
        <p>
          🌐{" "}
          {profile.website && profile.website !== "웹사이트 없음" ? (
            <a
              href={profile.website || ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.website}
            </a>
          ) : (
            "웹사이트 없음"
          )}
        </p>
        <p>🎂 {profile.birth_date}</p>
      </ExtraInfo>

      {/* ✅ 타임라인 컴포넌트 추가 */}
      <Timeline userId={profile.userId} />
    </Wrapper>
  );
}

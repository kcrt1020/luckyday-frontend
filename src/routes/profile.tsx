import { useEffect, useState } from "react";
import styled from "styled-components";

const API_URL = import.meta.env.VITE_API_URL;

// 클로버 타입 정의
interface IClover {
  id: string;
  userId: string;
  imageUrl?: string;
  content: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const ProfileUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #81c147;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
`;

const ProfileInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Clovers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const [profile, setProfile] = useState({
    nickname: "",
    profileImage: "",
    bio: "",
    location: "",
    website: "",
  });

  const [clovers, setClovers] = useState<IClover[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);

      // 유저 ID 기반으로 클로버 가져오기
      fetchClovers(data.id);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchClovers = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/clovers?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clovers");
      }

      const data: IClover[] = await response.json();
      setClovers(data);
    } catch (error) {
      console.error("Error fetching clovers:", error);
    }
  };

  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("profileImage", files[0]);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile image");
      }

      const data = await response.json();
      setProfile((prev) => ({ ...prev, profileImage: data.profileImage }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <Wrapper>
      <ProfileUpload htmlFor="profile">
        {profile.profileImage ? (
          <ProfileImg src={profile.profileImage} />
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
      <Name>{profile.nickname || "Anonymous"}</Name>
      <Clovers>
        {clovers.length > 0 ? (
          clovers.map((clover) => <div key={clover.id}>{clover.content}</div>)
        ) : (
          <p>등록된 클로버가 없습니다.</p>
        )}
      </Clovers>
    </Wrapper>
  );
}

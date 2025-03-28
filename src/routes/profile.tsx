import { useEffect, useState } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import Timeline from "../components/timeline";
import FollowButton from "../components/FollowButton";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface IProfile {
  nickname: string;
  profileImage?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  userId: string;
  email: string;
  birthDate?: string | null;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 700px;
  margin: 40px auto;
`;

const ProfileUpload = styled.label`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    width: 50px;
    height: 50px;
    color: #fff;
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
  font-size: 24px;
  font-weight: bold;
`;

const Bio = styled.p`
  font-size: 16px;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`;

const ExtraInfo = styled.div`
  font-size: 14px;
  text-align: center;
  line-height: 1.6;

  p {
    margin: 4px 0;
  }

  a {
    color: #81c147;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  padding: 4px;
  background: transparent;
  color: inherit;
  text-align: center;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #81c147;
    outline: none;
  }
`;

export const StyledTextArea = styled.textarea`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 4px;
  font-size: 16px;
  background: transparent;
  color: inherit;
  resize: none;
  text-align: center;
  line-height: 1.5;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #81c147;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $secondary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$secondary ? "#f0f0f0" : "#81c147")};
  color: ${(props) => (props.$secondary ? "#333" : "white")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledDateInput = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 6px 8px;
  font-size: 16px;
  background: transparent;
  color: #fff;
  text-align: center;
  border-radius: 6px;

  &::-webkit-calendar-picker-indicator {
    filter: invert(43%) sepia(58%) saturate(486%) hue-rotate(63deg)
      brightness(92%) contrast(91%);
    cursor: pointer;
  }

  &:focus {
    border-color: #81c147;
    outline: none;
  }
`;

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>({
    nickname: "Anonymous",
    profileImage: null,
    bio: null,
    location: null,
    website: null,
    email: "",
    userId: "",
    birthDate: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [editProfile, setEditProfile] = useState({
    nickname: "",
    userId: "",
    bio: "",
    location: "",
    website: "",
    birthDate: "",
  });

  const { userId } = useParams();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const currentUser = useCurrentUser();
  const isOwnProfile = currentUser?.userId && userId === currentUser.userId;

  const fetchProfile = async () => {
    try {
      const response = await apiRequest(`/api/profile/${userId}`);
      if (response) {
        setProfile({
          ...response,
          nickname: response.nickname ?? "Anonymous",
          userId: response.userId ?? "",
          bio: response.bio ?? "",
          location: response.location ?? "",
          website: response.website ?? "",
          birthDate: response.birthDate ?? "",
        });

        setEditProfile({
          nickname: response.nickname ?? "",
          userId: response.userId ?? "",
          bio: response.bio ?? "",
          location: response.location ?? "",
          website: response.website ?? "",
          birthDate: response.birthDate ?? "",
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

    try {
      const response = await apiRequest(
        "/api/profile/avatar",
        {
          method: "POST",
          body: formData,
        },
        false,
        true
      );

      if (!response) throw new Error("Failed to upload");

      setProfile((prev) => ({
        ...prev,
        profileImage: response.profileImage,
      }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const profileToSave = {
      ...editProfile,
      birthDate: editProfile.birthDate || null,
    };

    console.log("📦 최종 전송 데이터:", profileToSave);

    try {
      const response = await apiRequest(
        "/api/profile/update",
        {
          method: "PUT",
          body: JSON.stringify(profileToSave),
          headers: {},
        },
        false,
        false
      );

      console.log("🟢 응답:", response);

      if (response) {
        setProfile((prev) => ({
          ...prev,
          ...editProfile,
          birthDate: editProfile.birthDate,
          profileImage: prev.profileImage,
          email: prev.email,
        }));
        setIsEditing(false);
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
      } else {
        console.log("❌ 저장 실패, 서버 응답 없음");
      }
    } catch (error) {
      console.error("🔥 저장 중 오류:", error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <Wrapper>
      {showSavedMessage && (
        <p style={{ color: "#81c147" }}>✅ 프로필이 저장되었습니다!</p>
      )}
      <ProfileUpload htmlFor="profile">
        {profile.profileImage ? (
          <ProfileImg
            src={`${API_URL}${profile.profileImage}`}
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

      {isEditing ? (
        <InputRow>
          <InputGroup>
            <StyledInput
              name="nickname"
              value={editProfile.nickname}
              onChange={handleEditChange}
              placeholder="닉네임"
            />
          </InputGroup>
          <InputGroup>
            <StyledInput
              name="userId"
              value={editProfile.userId}
              onChange={handleEditChange}
              placeholder="아이디"
            />
          </InputGroup>
        </InputRow>
      ) : (
        <Name>
          {profile.nickname} (@{profile.userId})
        </Name>
      )}

      {isEditing ? (
        <StyledTextArea
          name="bio"
          value={editProfile.bio}
          onChange={handleEditChange}
          placeholder="자기소개"
        />
      ) : (
        <Bio>{profile.bio}</Bio>
      )}

      <ExtraInfo>
        {isEditing ? (
          <>
            <StyledInput
              name="location"
              value={editProfile.location}
              onChange={handleEditChange}
              placeholder="위치"
            />
            <StyledInput
              name="website"
              value={editProfile.website}
              onChange={handleEditChange}
              placeholder="웹사이트"
            />
            <StyledDateInput
              name="birthDate"
              type="date"
              value={editProfile.birthDate}
              onChange={handleEditChange}
            />
          </>
        ) : (
          <>
            <p>📍 {profile.location}</p>
            <p>
              🌐{" "}
              {profile.website && profile.website !== "웹사이트 없음" ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              ) : (
                "웹사이트 없음"
              )}
            </p>
            <p>🎂 {profile.birthDate}</p>
          </>
        )}
      </ExtraInfo>

      {isOwnProfile && (
        <ButtonGroup>
          {isEditing ? (
            <>
              <Button onClick={handleSaveProfile}>저장</Button>
              <Button $secondary onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
          )}
        </ButtonGroup>
      )}

      {!isOwnProfile && <FollowButton targetUserId={profile.userId} />}

      <Timeline userId={profile.userId} />
    </Wrapper>
  );
}

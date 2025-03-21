import styled from "styled-components";
import { useEffect, useState } from "react";
import { format, addHours, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import { IClover } from "./timeline";
import CloverActions from "./CloverActions";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  &:hover {
    outline: none;
    border-color: #81c147;
  }
`;

const Column = styled.div``;

const ProfileWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  margin-right: 10px;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileSVG = styled.svg`
  width: 50%;
  height: 50%;
  fill: white;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  text-align: left;
`;

const Card = styled.div<{ $isReply?: boolean }>`
  width: 100%;
  padding: 15px;
  margin-top: ${(props) => (props.$isReply ? "10px" : "20px")};
  border-radius: 15px;
  background-color: ${(props) => (props.$isReply ? "#2a2a2a" : "#333")};
  border-left: ${(props) => (props.$isReply ? "3px solid #81c147" : "none")};
  margin-left: ${(props) => (props.$isReply ? "20px" : "0")};
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function Clover({
  id,
  email,
  userId,
  nickname,
  imageUrl,
  content,
  profileImage,
  createdAt,
  isReply,
}: IClover) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("🚨 로그인된 유저 정보 없음");
          return;
        }

        const response = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error("🚨 로그인된 유저 정보 가져오기 실패");

        const data = await response.json();
        setCurrentUser(data.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const formatTime = (createdAt: string) => {
    const formattedDateString = createdAt.replace(" ", "T");
    const utcDate = new Date(formattedDateString);

    if (isNaN(utcDate.getTime())) {
      console.error("🚨 Invalid Date Format:", createdAt);
      return "알 수 없음";
    }

    const kstDate = addHours(utcDate, 9);
    const now = new Date();
    const diffInMinutes = (now.getTime() - kstDate.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const currentYear = getYear(now);
    const createdYear = getYear(kstDate);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}분`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간`;
    } else {
      return createdYear === currentYear
        ? format(kstDate, "MM월 dd일")
        : format(kstDate, "yyyy년 MM월 dd일");
    }
  };

  if (isReply) {
    // ✅ 댓글용 Card 스타일
    return (
      <Card $isReply>
        <UserInfo>
          <ProfileWrapper>
            {profileImage !== "Unknown" ? (
              <ProfileImg src={`${API_URL}${profileImage}`} alt="Profile" />
            ) : (
              <ProfileSVG viewBox="0 0 24 24">
                <path d="..." />
              </ProfileSVG>
            )}
          </ProfileWrapper>
          {nickname} (@{userId}) • {formatTime(createdAt)}
        </UserInfo>
        <Payload>{content}</Payload>
      </Card>
    );
  }

  // ✅ 원글용 기존 Wrapper 레이아웃
  return (
    <Wrapper>
      <Column onClick={() => navigate(`/clovers/${id}`)}>
        <UserInfo>
          <ProfileWrapper>
            {profileImage !== "Unknown" ? (
              <ProfileImg src={`${API_URL}${profileImage}`} alt="Profile" />
            ) : (
              <ProfileSVG viewBox="0 0 24 24">
                <path d="..." />
              </ProfileSVG>
            )}
          </ProfileWrapper>
          {nickname} (@{userId}) • {formatTime(createdAt)}
        </UserInfo>
        <Payload>{content}</Payload>
        <CloverActions
          cloverId={Number(id)}
          currentUser={currentUser}
          authorEmail={email}
        />
      </Column>

      <Column>
        {imageUrl && <Photo src={`${API_URL}${imageUrl}`} alt="Clover Image" />}
      </Column>
    </Wrapper>
  );
}

import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  format,
  parse,
  differenceInMinutes,
  differenceInHours,
  getYear,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { IClover } from "./timeline";
import CloverActions from "./CloverActions";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  background-color: #222;
  cursor: pointer;
  &:hover {
    outline: none;
    border-color: #81c147;
  }
  gap: 15px;
`;

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
  width: 100%;
  max-height: 300px;
  object-fit: cover;
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

const ActionWrapper = styled.div`
  width: 100%;
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
  username,
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
  }, [API_URL]);

  const formatTime = (createdAt: string) => {
    // 소수점 3자리까지만 유지 (밀리초 단위로 처리)
    const sanitizedCreatedAt = createdAt
      .replace(" ", "T")
      .replace(/(\.\d{3})\d+$/, "$1");

    const kstDate = parse(
      sanitizedCreatedAt,
      "yyyy-MM-dd'T'HH:mm:ss.SSS",
      new Date()
    );

    if (isNaN(kstDate.getTime())) {
      console.error("🚨 Invalid Date Format:", createdAt);
      return "알 수 없음";
    }

    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, kstDate);
    const diffInHours = differenceInHours(now, kstDate);
    const currentYear = getYear(now);
    const createdYear = getYear(kstDate);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간`;
    } else {
      return createdYear === currentYear
        ? format(kstDate, "MM월 dd일")
        : format(kstDate, "yyyy년 MM월 dd일");
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  if (isReply) {
    // 댓글용 Card 스타일
    return (
      <Card $isReply>
        <UserInfo>
          <ProfileWrapper>
            {profileImage !== "Unknown" ? (
              <ProfileImg
                src={`${API_URL}${profileImage}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProfileClick();
                }}
                alt="Profile"
              />
            ) : (
              <ProfileSVG viewBox="0 0 24 24">
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
              </ProfileSVG>
            )}
          </ProfileWrapper>
          {nickname} (@{username}) • {formatTime(createdAt)}
        </UserInfo>
        <Payload>{content}</Payload>
      </Card>
    );
  }

  // 원글용 기존 Wrapper 레이아웃
  return (
    <Wrapper onClick={() => navigate(`/clovers/${id}`)}>
      {/* 유저 정보 + 글 */}
      <div>
        <UserInfo>
          <ProfileWrapper>
            {profileImage !== "Unknown" ? (
              <ProfileImg
                src={`${API_URL}${profileImage}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProfileClick();
                }}
                alt="Profile"
              />
            ) : (
              <ProfileSVG viewBox="0 0 24 24">
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
              </ProfileSVG>
            )}
          </ProfileWrapper>
          {nickname} (@{username}) • {formatTime(createdAt)}
        </UserInfo>
        <Payload>{content}</Payload>
      </div>

      {/* 이미지가 있을 경우에만 렌더링 */}
      {imageUrl && <Photo src={`${API_URL}${imageUrl}`} alt="Clover Image" />}

      {/* 액션 버튼 (댓글, 좋아요 등) */}
      <ActionWrapper onClick={(e) => e.stopPropagation()}>
        <CloverActions
          cloverId={Number(id)}
          currentUser={currentUser}
          authorEmail={email}
        />
      </ActionWrapper>
    </Wrapper>
  );
}

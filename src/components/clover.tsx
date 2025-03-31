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
import { IClover } from "./Timeline";
import CloverActions from "./CloverActions";

const Wrapper = styled.div<{ $isReply?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 15px;
  background-color: ${({ $isReply }) => ($isReply ? "#2a2a2a" : "#222")};
  margin-left: ${({ $isReply }) => ($isReply ? "20px" : "0")};
  border-left: ${({ $isReply }) => ($isReply ? "2px solid #81c147" : "none")};
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  gap: 15px;
  position: relative;

  &:hover {
    border-color: #81c147;
  }
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

export default function Clover({
  id,
  email,
  username,
  nickname,
  imageUrl,
  content,
  profileImage,
  createdAt,
  parent_clover_id,
  hideActions = false,
}: IClover & { hideActions?: boolean }) {
  const isReply = !!parent_clover_id;
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("유저 정보 실패");

        const data = await response.json();
        setCurrentUser(data.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, [API_URL]);

  const formatTime = (createdAt: string) => {
    const sanitized = createdAt
      .replace(" ", "T")
      .replace(/(\.\d{3})\d+$/, "$1");
    const date = parse(sanitized, "yyyy-MM-dd'T'HH:mm:ss.SSS", new Date());

    if (isNaN(date.getTime())) return "알 수 없음";

    const now = new Date();
    const diffMin = differenceInMinutes(now, date);
    const diffHour = differenceInHours(now, date);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;

    return getYear(now) === getYear(date)
      ? format(date, "MM월 dd일")
      : format(date, "yyyy년 MM월 dd일");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <Wrapper $isReply={isReply} onClick={() => navigate(`/clovers/${id}`)}>
      {isReply && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "-20px",
            fontSize: "16px",
            color: "#81c147",
          }}
        >
          ↳
        </div>
      )}

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

      {imageUrl && <Photo src={`${API_URL}${imageUrl}`} alt="Clover Image" />}

      {!hideActions && (
        <ActionWrapper onClick={(e) => e.stopPropagation()}>
          <CloverActions
            cloverId={Number(id)}
            currentUser={currentUser}
            authorEmail={email}
          />
        </ActionWrapper>
      )}
    </Wrapper>
  );
}

import styled from "styled-components";
import { useEffect, useState } from "react";
import { format, addHours, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import { IClover } from "./timeline";

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

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 14px;
  padding: 3px 9px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
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

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const response = await fetch(`${API_URL}/api/clovers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete clover");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting clover:", error);
    }
  };

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

  return (
    <Wrapper onClick={() => navigate(`/clovers/${id}`)}>
      {currentUser && currentUser === email && (
        <DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          X
        </DeleteButton>
      )}

      <Column>
        <UserInfo>
          <ProfileWrapper>
            {profileImage !== "Unknown" ? (
              <ProfileImg src={`${API_URL}${profileImage}`} alt="Profile" />
            ) : (
              <ProfileSVG viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path>
              </ProfileSVG>
            )}
          </ProfileWrapper>
          {nickname} (@{userId}) &nbsp;<span>{formatTime(createdAt)}</span>
        </UserInfo>
        <Payload>{content}</Payload>
      </Column>

      <Column>
        {imageUrl ? (
          <Photo src={`${API_URL}${imageUrl}`} alt="Clover Image" />
        ) : null}
      </Column>
    </Wrapper>
  );
}

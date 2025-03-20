import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { format, addHours } from "date-fns";

interface Clover {
  id: string;
  email: string;
  userId: string;
  nickname: string;
  imageUrl?: string;
  content: string;
  profileImage: string;
  createdAt: string;
}

const Wrapper = styled.div`
  width: 700px; /* 타임라인 크기에 맞춤 */
  margin: 20px auto;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  background-color: #222;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;

const ProfileWrapper = styled.div`
  width: 50px;
  height: 50px;
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

const Content = styled.p`
  font-size: 18px;
  margin-bottom: 15px;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const TimeStamp = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
`;

export default function CloverDetail() {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [clover, setClover] = useState<Clover | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClover = async () => {
      try {
        console.log("🟡 API 요청 시작...");

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("🚨 로그인된 유저 정보 없음");
          return;
        }

        console.log("🔵 토큰 확인:", token);

        const response = await fetch(`${API_URL}/api/clovers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🟠 서버 응답 상태 코드:", response.status);

        if (!response.ok) {
          throw new Error(`🚨 클로버 가져오기 실패 (HTTP ${response.status})`);
        }

        const data: Clover = await response.json();
        console.log("🟢 클로버 데이터:", data);

        setClover(data);
      } catch (error) {
        console.error("🚨 API 요청 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClover();
  }, [id, API_URL]);

  const formatTime = (createdAt: string) => {
    const utcDate = new Date(createdAt);
    const kstDate = addHours(utcDate, 9);
    return format(kstDate, "yyyy년 MM월 dd일 HH:mm");
  };

  if (loading) return <Wrapper>Loading...</Wrapper>;
  if (!clover) return <Wrapper>클로버 정보를 불러올 수 없습니다.</Wrapper>;

  return (
    <Wrapper>
      <UserInfo>
        <ProfileWrapper>
          {clover.profileImage !== "Unknown" ? (
            <ProfileImg
              src={`${API_URL}${clover.profileImage}`}
              alt="Profile"
            />
          ) : (
            <ProfileSVG viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path>
            </ProfileSVG>
          )}
        </ProfileWrapper>
        <div>
          {clover.nickname} (@{clover.userId}) &nbsp;
          <TimeStamp>{formatTime(clover.createdAt)}</TimeStamp>
        </div>
      </UserInfo>
      <Content>{clover.content}</Content>
      {clover.imageUrl && (
        <Image src={`${API_URL}${clover.imageUrl}`} alt="Clover" />
      )}
    </Wrapper>
  );
}

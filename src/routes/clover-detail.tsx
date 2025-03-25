import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { format, addHours } from "date-fns";
import Clover from "../components/clover";
import { apiRequest } from "../utills/api";
import CloverActions from "../components/CloverActions";

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
  width: 700px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  background-color: #222;
  color: white;
  text-align: left;
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

const ReplyFormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  background-color: black;
  color: white;
  resize: none;
  border: 2px solid white;
  &:focus {
    outline: none;
    border-color: #81c147;
  }
  &::placeholder {
    color: #aaa;
    font-size: 16px;
  }
`;

const ReplyButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ReplySubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #81c147;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover,
  &:active {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionWrapper = styled.div`
  width: 100%;
`;

export default function CloverDetail() {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  const [clover, setClover] = useState<Clover | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 댓글 관련 상태들
  const [replies, setReplies] = useState<Clover[]>([]);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // ✅ 원글 조회
  useEffect(() => {
    const fetchClover = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("🚨 로그인된 유저 정보 없음");
          return;
        }

        const response = await fetch(`${API_URL}/api/clovers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`🚨 클로버 가져오기 실패 (HTTP ${response.status})`);
        }

        const data: Clover = await response.json();
        setClover(data);
      } catch (error) {
        console.error("🚨 API 요청 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClover();
  }, [id, API_URL]);

  // ✅ 댓글 조회
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await apiRequest(`/api/clovers/replies/${id}`);
        setReplies(data);
      } catch (e) {
        console.error("❌ 댓글 불러오기 실패", e);
      }
    };

    if (id) fetchReplies();
  }, [id]);

  const fetchReplies = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/clovers/replies/${id}`);
      setReplies(data);
    } catch (e) {
      console.error("❌ 댓글 불러오기 실패", e);
    }
  }, [id]);

  // ✅ 댓글 등록
  const handleSubmitReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      const cloverData = JSON.stringify({
        content: reply,
        parentClover: { id: Number(id) },
      });

      const formData = new FormData();
      formData.append(
        "content",
        new Blob([cloverData], { type: "application/json" })
      );

      const res = await fetch(`${API_URL}/api/clovers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      // 등록 후 목록 새로고침
      await fetchReplies();
      setReply("");
    } catch (e) {
      console.error("❌ 댓글 등록 실패", e);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) fetchReplies();
  }, [id, fetchReplies]);

  // ✅ 시간 포맷
  const formatTime = (createdAt: string) => {
    const utcDate = new Date(createdAt);
    const kstDate = addHours(utcDate, 9);
    return format(kstDate, "yyyy년 MM월 dd일 HH:mm");
  };

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

  if (loading) return <Wrapper>Loading...</Wrapper>;
  if (!clover) return <Wrapper>클로버 정보를 불러올 수 없습니다.</Wrapper>;

  return (
    <Wrapper>
      {/* 원글 */}
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

      {/* 액션 버튼 (댓글, 좋아요 등) */}
      <ActionWrapper onClick={(e) => e.stopPropagation()}>
        <CloverActions
          cloverId={Number(id)}
          currentUser={currentUser}
          authorEmail={clover.email}
          disableCommentToggle
        />
      </ActionWrapper>

      <ReplyFormWrapper>
        <ReplyInput
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <ReplyButtonWrapper>
          <ReplySubmitButton onClick={handleSubmitReply} disabled={submitting}>
            등록
          </ReplySubmitButton>
        </ReplyButtonWrapper>
      </ReplyFormWrapper>

      <div style={{ marginTop: "30px" }}>
        {replies.map((reply) => (
          <Clover key={reply.id} {...reply} />
        ))}
      </div>
    </Wrapper>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import CloverActions from "../components/CloverActions";
import Clover from "../components/Clover";

interface CloverData {
  id: string;
  email: string;
  username: string;
  nickname: string;
  imageUrl?: string;
  content: string;
  profileImage: string;
  createdAt: string;
  parent_clover_id?: string | null;
}

const Wrapper = styled.div`
  width: 700px;
  margin: 20px auto;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const MainCloverBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
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

const Content = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: left;
`;

const Image = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
`;

const TimeStamp = styled.div`
  font-size: 14px;
  color: #aaa;
  text-align: right;
`;

const ReplyFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  background-color: black;
  color: white;
  resize: none;
  border: 2px solid white;
  &:focus {
    outline: none;
    border-color: #81c147;
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
  const [clover, setClover] = useState<CloverData | null>(null);
  const [parentClover, setParentClover] = useState<CloverData | null>(null);
  const [replies, setReplies] = useState<CloverData[]>([]);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchClover = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/clovers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: CloverData = await res.json();
        setClover(data);

        if (data.parent_clover_id && data.parent_clover_id !== data.id) {
          const parentRes = await fetch(
            `${API_URL}/api/clovers/${data.parent_clover_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (parentRes.ok) {
            const parentData: CloverData = await parentRes.json();
            if (parentData.id !== data.id) setParentClover(parentData);
          }
        }
      } catch (e) {
        console.error("클로버 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchClover();
  }, [id, API_URL]);

  const fetchReplies = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/clovers/replies/${id}`);
      setReplies(data);
    } catch (e) {
      console.error("댓글 불러오기 실패", e);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchReplies();
  }, [id, fetchReplies]);

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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("댓글 등록 실패");
      await fetchReplies();
      setReply("");
    } catch (e) {
      console.error("댓글 등록 실패", e);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCurrentUser(data.email);
      } catch (e) {
        console.error("유저 정보 조회 실패", e);
      }
    };
    fetchCurrentUser();
  }, [API_URL]);

  if (loading) return <Wrapper>Loading...</Wrapper>;
  if (!clover) return <Wrapper>클로버를 불러올 수 없습니다.</Wrapper>;

  return (
    <Wrapper>
      {parentClover && parentClover.id !== clover.id && (
        <div style={{ opacity: 0.6 }}>
          <Clover {...parentClover} hideActions />
        </div>
      )}

      <MainCloverBox>
        <UserInfo>
          <ProfileWrapper>
            {clover.profileImage !== "Unknown" ? (
              <ProfileImg src={`${API_URL}${clover.profileImage}`} />
            ) : (
              <div style={{ color: "black" }}>🤍</div>
            )}
          </ProfileWrapper>
          {clover.nickname} (@{clover.username})
        </UserInfo>
        <Content>{clover.content}</Content>
        {clover.imageUrl && (
          <Image src={`${API_URL}${clover.imageUrl}`} alt="clover" />
        )}
        <TimeStamp>
          {new Date(clover.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </TimeStamp>
      </MainCloverBox>

      <ActionWrapper onClick={(e) => e.stopPropagation()}>
        <CloverActions
          cloverId={Number(clover.id)}
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

      <div>
        {replies.map((reply) => (
          <Clover key={reply.id} {...reply} />
        ))}
      </div>
    </Wrapper>
  );
}

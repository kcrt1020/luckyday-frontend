import styled, { css, keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { IClover } from "./timeline";
import { apiRequest } from "../utills/api";

const API_URL = import.meta.env.VITE_API_URL; // ✅ 추가

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 20px;
  font-size: 16px;
  color: #ccc;
`;

const ActionItem = styled.button<{ $alignRight?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;

  ${(props) => props.$alignRight && "margin-left: auto;"}

  &:hover {
    color: #81c147;
  }
`;

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

const ActionIcon = styled.span<{ $animate: boolean }>`
  display: inline-block;
  ${(props) =>
    props.$animate &&
    css`
      animation: ${pop} 0.3s ease;
    `}
`;

const SlideDown = styled.div<{ $show: boolean }>`
  max-height: ${(props) => (props.$show ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 15px;
`;

interface CloverActionsProps {
  cloverId: number;
  currentUser: string | null;
  authorEmail: string;
}

export default function CloverActions({
  cloverId,
  currentUser,
  authorEmail,
}: CloverActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [animateLike, setAnimateLike] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<IClover[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const countRes = await apiRequest(`/api/cloverLike/${cloverId}/likes`);
        setLikeCount(countRes);

        const likedRes = await apiRequest(`/api/cloverLike/${cloverId}/liked`);
        setLiked(likedRes);
      } catch (e) {
        console.error("❌ 좋아요 정보 불러오기 실패", e);
      }
    };

    fetchLikeInfo();
  }, [cloverId]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await apiRequest(`/api/clovers/replies/${cloverId}`);
        setReplies(res);
      } catch (e) {
        console.error("❌ 댓글 목록 로드 실패", e);
      }
    };

    fetchReplies();
  }, [cloverId]);

  const toggleLike = async () => {
    try {
      const method = liked ? "DELETE" : "POST";

      await apiRequest(`/api/cloverLike/${cloverId}/like`, { method });

      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
    } catch (e) {
      console.error("❌ 좋아요 처리 중 오류", e);
    }
  };

  const toggleReply = () => setShowReply((prev) => !prev);

  const onSubmitReply = async () => {
    if (!reply.trim() || submitting) return;
    setSubmitting(true);

    try {
      const cloverData = JSON.stringify({
        content: reply,
        parentClover: { id: cloverId },
      });

      const formData = new FormData();
      formData.append(
        "content",
        new Blob([cloverData], { type: "application/json" })
      );

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      const res = await fetch(`${API_URL}/api/clovers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      const newReply = await res.json();
      setReplies((prev) => [newReply, ...prev]);
      setReply("");
    } catch (e) {
      console.error("❌ 댓글 등록 중 오류", e);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    const ok = confirm("클로버를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await apiRequest(`/api/clovers/${cloverId}`, {
        method: "DELETE",
      });
      window.location.reload();
    } catch (e) {
      console.error("❌ 삭제 중 오류", e);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ActionBar>
        <ActionItem onClick={toggleReply}>
          💬 댓글 ({replies.length})
        </ActionItem>

        <ActionItem onClick={toggleLike}>
          <ActionIcon $animate={animateLike}>{liked ? "🍀" : "○"}</ActionIcon>
          {likeCount > 0 && `${likeCount}`}
        </ActionItem>

        {currentUser && currentUser === authorEmail && (
          <ActionItem onClick={onDelete} $alignRight>
            🗑️ 삭제
          </ActionItem>
        )}
      </ActionBar>

      <SlideDown $show={showReply}>
        <ReplyInput
          placeholder="댓글을 입력하세요..."
          rows={3}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <ActionItem onClick={onSubmitReply}>등록</ActionItem>

        {replies.map((r) => (
          <div
            key={r.id}
            style={{
              marginTop: "10px",
              paddingLeft: "10px",
              borderLeft: "2px solid #81c147",
            }}
          >
            <strong>@{r.userId ?? "unknown"}</strong> {r.content}
          </div>
        ))}
      </SlideDown>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { Notification } from "../utills/types";

const Container = styled.div`
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px;
  color: white;
`;

const NotiItem = styled.div`
  background-color: #1a1a1a;
  border-left: 5px solid #81c147;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #222;
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Sub = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 6px;
`;

export default function NotificationPage() {
  const [notis, setNotis] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest("/api/notifications");
      if (Array.isArray(data)) {
        setNotis(data);
      }
    } catch (err) {
      console.error("알림 가져오기 실패", err);
    }
  };

  const formatNotification = (noti: Notification): string => {
    const nickname = noti.sender?.profile?.nickname;
    switch (noti.type) {
      case "LIKE":
        return `${nickname}님이 클로버에 좋아요를 눌렀습니다.`;
      case "COMMENT":
        return `${nickname}님이 댓글을 남겼습니다.`;
      case "FOLLOW":
        return `${nickname}님이 당신을 팔로우했습니다.`;
      default:
        return "새로운 알림이 도착했습니다.";
    }
  };

  const handleClick = (url: string) => {
    navigate(url);
  };

  return (
    <Container>
      <h2>알림 목록</h2>
      {notis.length === 0 ? (
        <Sub>알림이 없습니다.</Sub>
      ) : (
        notis.map((noti) => (
          <NotiItem key={noti.id} onClick={() => handleClick(noti.url)}>
            <Title>{formatNotification(noti)}</Title>
            <Sub>방금 전</Sub> {/* 시간 표시 확장 가능 */}
          </NotiItem>
        ))
      )}
    </Container>
  );
}

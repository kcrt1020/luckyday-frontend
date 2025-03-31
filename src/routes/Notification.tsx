import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { Notification } from "../utills/types";
import {
  parse,
  format,
  getYear,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";

const Wrapper = styled.div`
  width: 700px;
  margin: 40px auto;
  padding: 0 16px;
  color: white;
`;

const NotiItem = styled.div<{ $read: boolean }>`
  background-color: ${({ $read }) => ($read ? "#111" : "#1a1a1a")};
  border-left: 5px solid ${({ $read }) => ($read ? "#555" : "#81c147")};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  opacity: ${({ $read }) => ($read ? 0.6 : 1)};

  &:hover {
    background-color: ${({ $read }) => ($read ? "#1a1a1a" : "#222")};
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
`;

const NotiTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Sub = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 6px;
`;

const formatTime = (createdAt: string) => {
  const sanitized = createdAt.replace(" ", "T").replace(/(\.\d{3})\d+$/, "$1");
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

  const handleClick = async (url: string, id: number) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
      navigate(url);
    } catch (err) {
      console.error("알림 읽음 처리 실패", err);
    }
  };

  return (
    <Wrapper>
      <Title>알림 목록</Title>
      {notis.length === 0 ? (
        <Sub>알림이 없습니다.</Sub>
      ) : (
        notis.map((noti) => (
          <NotiItem
            key={noti.id}
            $read={noti.read}
            onClick={() => handleClick(noti.url, noti.id)}
          >
            <NotiTitle>{formatNotification(noti)}</NotiTitle>
            <Sub>{formatTime(noti.createdAt)}</Sub>
          </NotiItem>
        ))
      )}
    </Wrapper>
  );
}

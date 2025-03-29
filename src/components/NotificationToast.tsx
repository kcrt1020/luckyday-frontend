import { useNavigate } from "react-router-dom";
import { useNotificationToast } from "../hooks/useNotificationToast";
import styled, { keyframes } from "styled-components";
import { Notification } from "../utills/types";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
`;

const ToastWrapper = styled.div`
  width: 320px;
  background-color: #1a1a1a;
  color: #fff;
  padding: 16px;
  border-left: 5px solid #81c147;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: ${slideIn} 0.3s ease-out;
  cursor: pointer;
`;

const IconBox = styled.div`
  background-color: #81c147;
  color: black;
  padding: 8px;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextBox = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const Sub = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #999;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  font-size: 16px;
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

export default function NotificationToast() {
  const { toasts, removeToast } = useNotificationToast(); // 배열로 받아옴
  const navigate = useNavigate();

  const formatNotification = (noti: Notification): string => {
    console.log(noti.sender);
    const name = noti.sender?.profile?.nickname;
    switch (noti.type) {
      case "LIKE":
        return `${name}님이 클로버에 좋아요를 눌렀습니다.`;
      case "COMMENT":
        return `${name}님이 댓글을 남겼습니다.`;
      case "FOLLOW":
        return `${name}님이 당신을 팔로우했습니다.`;
      default:
        return "새로운 알림이 도착했습니다.";
    }
  };

  const handleClick = (noti: Notification) => {
    navigate(noti.url);
  };

  return (
    <ToastContainer>
      {toasts.map((noti) => (
        <ToastWrapper key={noti.id} onClick={() => handleClick(noti)}>
          <IconBox>🔔</IconBox>
          <TextBox>
            <Title>{formatNotification(noti)}</Title>
            <Sub>방금 전</Sub>
          </TextBox>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              removeToast(noti.id);
            }}
          >
            ✕
          </CloseButton>
        </ToastWrapper>
      ))}
    </ToastContainer>
  );
}

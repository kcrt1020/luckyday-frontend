import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";

const BellButton = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;

  svg {
    width: 30px;
    fill: white;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: white;
  color: #333;
  font-size: 13px;
  font-weight: 700;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  border: 1px solid #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
`;

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async (): Promise<number> => {
    const data = await apiRequest("/api/notifications/unread-count");
    return data;
  };

  useEffect(() => {
    const loadUnread = async () => {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    };
    loadUnread();
  }, []);

  const goToNotifications = () => {
    navigate("/notifications");
  };

  return (
    <BellButton onClick={goToNotifications}>
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 001.995-1.85L12 16H8a2 2 0 001.85 1.995L10 18z"
        />
      </svg>
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </BellButton>
  );
}

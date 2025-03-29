import { useEffect, useRef, useState } from "react";
import { Notification } from "../utills/types";
import { apiRequest } from "../utills/api";

export const useNotificationToast = () => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const knownIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(checkNewNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkNewNotifications = async () => {
    const list: Notification[] = await fetchNotifications();
    if (!list || !Array.isArray(list)) return;

    const newNotis = list.filter((n) => !knownIds.current.has(n.id));
    if (newNotis.length === 0) return;

    newNotis.forEach((n) => knownIds.current.add(n.id));

    // 새로운 알림들을 기존 알림 목록에 추가
    setToasts((prev) => [...prev, ...newNotis]);

    // 몇 초 후 자동으로 제거되게 설정
    newNotis.forEach((n) => {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== n.id));
      }, 30000); // 알림 표시 시간 (30초)
    });
  };

  const fetchNotifications = async () => {
    const data = await apiRequest("/api/notifications");
    return data;
  };

  return {
    toasts,
    removeToast: (id: number) =>
      setToasts((prev) => prev.filter((t) => t.id !== id)),
  };
};

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

    const newNotis = list.filter((n) => !knownIds.current.has(n.id) && !n.read);

    if (newNotis.length === 0) return;

    newNotis.forEach((n) => knownIds.current.add(n.id));

    setToasts((prev) => [...prev, ...newNotis]);

    // 몇 초 후 자동으로 제거되게 설정
    newNotis.forEach((n) => {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== n.id));
      }, 10000); // 알림 표시 시간 (10초)
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

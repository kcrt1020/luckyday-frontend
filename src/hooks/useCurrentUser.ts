import { useEffect, useState } from "react";
import { apiRequest } from "../utills/api";
import { User } from "../utills/types";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiRequest("/api/user/me");
        setCurrentUser(res);
      } catch (err) {
        console.error("❌ 로그인 유저 정보 가져오기 실패:", err);
      }
    };

    fetchUser();
  }, []);

  return currentUser;
}
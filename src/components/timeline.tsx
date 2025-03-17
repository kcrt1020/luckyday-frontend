import { useEffect, useState } from "react";
import styled from "styled-components";
import Clover from "./clover";
import { refreshAccessToken } from "../utills/auth"; // ✅ 리프레시 토큰 요청 함수 추가

export interface IClover {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  email: string;
  nickname: string;
  createdAt: string;
}

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [clovers, setClovers] = useState<IClover[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true); // ✅ fetchWithAuth 제거했으니 바로 true 처리
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const loadClovers = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const accessToken = localStorage.getItem("accessToken");

        // console.log("🔍 요청 전 액세스 토큰:", accessToken);

        const response = await fetch(`${API_URL}/api/clovers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // console.log("🔍 클로버 API 응답 상태 코드:", response.status);

        if (response.status === 401) {
          console.warn("🔄 401 발생 - 액세스 토큰 갱신 시도");

          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            console.log("✅ 새 액세스 토큰 발급 완료 - 재요청");

            const retryResponse = await fetch(`${API_URL}/api/clovers`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            if (retryResponse.ok) {
              const data: IClover[] = await retryResponse.json();
              setClovers(data);
              return;
            } else {
              console.error(
                "🚨 새 액세스 토큰으로도 요청 실패:",
                retryResponse.status
              );
            }
          } else {
            console.error("🚨 리프레시 토큰도 만료됨 - 로그아웃 처리");
            handleLogout();
            return;
          }
        }

        if (!response.ok) {
          throw new Error(`🚨 API 응답 실패: ${response.status}`);
        }

        const data: IClover[] = await response.json();
        setClovers(data);
      } catch (error) {
        console.error("🚨 클로버 가져오기 실패:", error);
      }
    };

    loadClovers();
    const interval = setInterval(loadClovers, 5000);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleLogout = () => {
    console.warn("🚨 세션 만료 - 로그아웃 처리");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <Wrapper>
      {clovers.length > 0 ? (
        clovers.map((clover) => <Clover key={clover.id} {...clover} />)
      ) : (
        <p>클로버가 없습니다.</p>
      )}
    </Wrapper>
  );
}

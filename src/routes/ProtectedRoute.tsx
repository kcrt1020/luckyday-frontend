import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { refreshAccessToken } from "../utills/auth";
import { apiRequest } from "../utills/api";

declare global {
  interface Window {
    fetchWithAuth: typeof fetch;
  }
}

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    console.warn("🚨 세션 만료 - 로그아웃 처리");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!window.fetchWithAuth) {
      console.log("🛠️ fetchWithAuth 설정 중...");

      window.fetchWithAuth = async (input, init = {}) => {
        try {
          let response = await apiRequest(input as string, init);

          // console.log("🔍 fetchWithAuth 요청:", input);
          // console.log("🔍 초기 응답 상태 코드:", response?.status);

          // ✅ 401 발생 시 액세스 토큰 갱신 후 재요청
          if (response?.status === 401) {
            console.warn("🔄 401 발생 - 새 토큰 요청");
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
              console.log("✅ 새 액세스 토큰 발급 완료:", newAccessToken);

              // ✅ 새로운 토큰을 localStorage에 저장
              localStorage.setItem("accessToken", newAccessToken);

              // ✅ 기존 요청에 갱신된 토큰을 반영
              const newHeaders = {
                ...init.headers,
                Authorization: `Bearer ${newAccessToken}`,
              };

              console.log("🔄 새 액세스 토큰으로 재요청...");
              response = await apiRequest(input as string, {
                ...init,
                headers: newHeaders,
              });

              console.log("🔍 최종 응답 상태 코드:", response?.status);

              // ✅ 만약 다시 401이 발생하면 강제 로그아웃
              if (response?.status === 401) {
                console.error("🚨 새 액세스 토큰으로도 401 발생 - 로그아웃");
                handleLogout();
              }
            } else {
              console.error("🚨 리프레시 토큰도 만료됨 - 로그아웃");
              handleLogout();
            }
          }

          return response;
        } catch (error) {
          console.error("❌ API 요청 오류:", error);
          return new Response(null, { status: 500 });
        }
      };
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

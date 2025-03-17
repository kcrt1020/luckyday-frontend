import { refreshAccessToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  isLogin = false
) => {
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    console.log("🔍 요청 URL:", `${API_URL}${url}`);
    console.log("🔍 요청 헤더:", headers);

    let response = await fetch(`${API_URL}${url}`, { ...options, headers });

    console.log("🔍 응답 상태 코드:", response.status);

    // ✅ 로그인 요청은 JSON을 바로 반환 (401 핸들링 X)
    if (isLogin) {
      return response.json(); // ✅ 로그인에서는 무조건 JSON 반환
    }

    // ✅ 401 발생 시 액세스 토큰 갱신 시도
    if (response.status === 401) {
      console.warn("🔄 액세스 토큰 만료됨. 새 토큰 요청...");
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        console.log("✅ 새 액세스 토큰 발급 완료!");

        headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${API_URL}${url}`, { ...options, headers });

        if (response.status === 401) {
          console.error("🚨 새 액세스 토큰으로도 401 발생 - 로그아웃 처리");
          handleLogout();
          return null;
        }
      } else {
        console.error("🚨 리프레시 토큰도 만료됨 - 로그아웃 처리");
        handleLogout();
        return null;
      }
    }

    return response.ok ? response.json() : null; // ✅ JSON 응답 보장
  } catch (error) {
    console.error("🚨 API 요청 중 오류 발생:", error);
    return null;
  }
};

// ✅ 로그아웃 처리 함수
const handleLogout = () => {
  console.warn("🚨 세션 만료 - 로그아웃 처리");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

import { refreshAccessToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ✅ API 요청을 수행하고, 필요하면 액세스 토큰을 자동 갱신하는 함수
 */
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  isLogin = false,
  isMultipart = false // ✅ 파일 업로드 요청인지 여부 추가
) => {
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ JWT 토큰 추가
    ...((!isMultipart && { "Content-Type": "application/json" }) as Record<
      string,
      string
    >), // ✅ 파일 업로드 시 Content-Type을 설정하지 않도록 처리
    ...(options.headers as Record<string, string>),
  };

  // console.log("🔍 API 요청 URL:", `${API_URL}${url}`);
  // console.log("🔍 API 요청 헤더:", headers);

  try {
    let response = await fetch(`${API_URL}${url}`, { ...options, headers });

    // console.log("🔍 응답 상태 코드:", response.status);

    if (isLogin) return response.json();

    if (response.status === 401) {
      console.warn("🔄 액세스 토큰 만료됨. 새 토큰 요청...");
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        console.log("✅ 새 액세스 토큰 발급 완료!");
        localStorage.setItem("accessToken", newAccessToken);
        headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${API_URL}${url}`, { ...options, headers });

        console.log("🔄 새 액세스 토큰으로 재요청 결과:", response.status);

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

    return response.ok ? response.json() : null;
  } catch (error) {
    console.error("🚨 API 요청 중 오류 발생:", error);
    return null;
  }
};

/**
 * ✅ 로그아웃 처리 (전역적으로 사용)
 */
export const handleLogout = () => {
  console.warn("🚨 세션 만료 - 로그아웃 처리");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

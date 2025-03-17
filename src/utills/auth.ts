export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.warn("🚨 리프레시 토큰 없음!");
    return null; // 🔄 단순히 null 반환 (로그아웃 로직은 apiRequest에서 처리)
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL;
    console.log("🔄 리프레시 토큰 요청 시작...");

    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.warn("🚨 리프레시 토큰 요청 실패!");
      return null;
    }

    const data = await response.json();
    if (!data.accessToken) {
      console.error("🚨 서버에서 새 액세스 토큰을 받지 못함:", data);
      return null;
    }

    console.log("✅ 새 액세스 토큰 발급 완료:", data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);

    return data.accessToken;
  } catch (error) {
    console.error("❌ 리프레시 토큰 요청 중 오류 발생:", error);
    return null;
  }
};

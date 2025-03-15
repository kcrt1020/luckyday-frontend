import { Navigate } from "react-router-dom";
import { useEffect } from "react";

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
  const token = localStorage.getItem("jwt");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!window.fetchWithAuth) {
      console.log("🛠️ fetchWithAuth가 설정되지 않아 초기화합니다.");

      window.fetchWithAuth = async (input, init = {}) => {
        const token = localStorage.getItem("jwt");

        const headers = {
          ...init?.headers,
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        };

        const response = await fetch(
          input instanceof Request ? input : `${input}`,
          { ...init, headers }
        );

        if (response.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("jwt"); // ✅ 토큰 삭제
          handleLogout();
        }

        return response;
      };
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

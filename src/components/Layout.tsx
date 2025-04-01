import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import NotificationToast from "./NotificationToast";
import SearchBar from "./SearchBar";

const Wrapper = styled.div`
  margin-left: 100px;
  width: calc(100% - 80px);
  max-width: 860px;
  background-color: inherit;
`;

const Menu = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 200px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  z-index: 100;

  // 화면이 작아지면 메뉴 숨기기
  @media (max-width: 1024px) {
    display: none;
  }
`;

// 메뉴 아이템 묶음 (상단)
const MenuTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

// 메뉴 버튼 스타일
const MenuItem = styled.div`
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
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
`;

// 오른쪽 메인 콘텐츠
const Content = styled.div`
  width: 100%;
  background-color: inherit;
  padding-top: 100px;
`;

export default function Layout() {
  const navigate = useNavigate();

  const onLogOut = async () => {
    const ok = confirm("로그아웃하시겠습니까?");
    if (!ok) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        alert("이미 로그아웃되었습니다.");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login");
    } catch (error) {
      console.error("🚨 로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await apiRequest("/api/user/me");
        console.log(data);
        setUsername(data.username);
      } catch (error) {
        console.error("❌ 로그인 유저 정보 가져오기 실패:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Wrapper>
      <SearchBar />
      <Menu>
        <MenuTop>
          <Link to="/">
            <MenuItem>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                ></path>
              </svg>
            </MenuItem>
          </Link>
          <Link to={`/profile/${username}`}>
            <MenuItem>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                ></path>
              </svg>
            </MenuItem>
          </Link>
          <NotificationBell />
          <MenuItem className="log-out" onClick={onLogOut}>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
              ></path>
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
              ></path>
            </svg>
          </MenuItem>
        </MenuTop>
      </Menu>

      <Content>
        <NotificationToast />
        <Outlet />
      </Content>
    </Wrapper>
  );
}

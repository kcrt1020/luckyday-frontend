import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 90vh; // ✅ 화면 전체를 덮도록 수정
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
  background-color: inherit;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
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

const SearchBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  border-top: 1px solid #ccc;
  z-index: 1000;
`;

const SearchInput = styled.input`
  width: 90%;
  max-width: 500px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 2px solid #81c147;
  border-radius: 10px;
  outline: none;

  &:focus {
    border-color: #5b9b2d;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  background-color: inherit; // ✅ 글로벌 스타일의 배경을 따라가도록 설정
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

      // console.log("🚀 로그아웃 요청 URL:", `${API_URL}/api/auth/logout`);
      // console.log("🔑 보낸 엑세스 토큰:", accessToken);
      // console.log("🔑 보낸 리프레쉬 토큰:", refreshToken);

      if (!accessToken || !refreshToken) {
        alert("이미 로그아웃되었습니다.");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // ✅ 토큰 삭제 & 로그인 페이지로 이동
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login");
    } catch (error) {
      console.error("🚨 로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const [userId, setUserId] = useState<string | null>(null); // 로그인 유저 ID 상태

  // 🔍 로그인 유저 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await apiRequest("/api/user/me"); // 로그인된 유저 정보
        setUserId(data.userId); // ✅ userId 저장
      } catch (error) {
        console.error("❌ 로그인 유저 정보 가져오기 실패:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword(""); // 입력값 초기화
    }
  };

  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>
            <svg
              data-slot="icon"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
              ></path>
            </svg>
          </MenuItem>
        </Link>
        <Link to={`/profile/${userId}`}>
          <MenuItem>
            <svg
              data-slot="icon"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
              ></path>
            </svg>
          </MenuItem>
        </Link>
        <MenuItem className="log-out" onClick={onLogOut}>
          <svg
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
            ></path>
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
            ></path>
          </svg>
        </MenuItem>
      </Menu>
      <Content>
        <Outlet />
      </Content>
      <SearchBarWrapper>
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleSearch}
        />
      </SearchBarWrapper>
    </Wrapper>
  );
}

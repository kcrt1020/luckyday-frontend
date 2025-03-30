import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 130px;
  right: 0;
  height: 100px;
  background-color: black;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 2px solid #fff;
  border-radius: 50px;
  overflow: hidden;
  width: 80%;
  max-width: 400px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
`;

const Button = styled.button`
  background-color: #81c147;
  border-radius: 30px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    fill: white;
  }

  &:hover {
    background-color: #6aa836;
  }
`;

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const keywordFromURL = searchParams.get("keyword") || "";
    setSearchKeyword(keywordFromURL);
  }, [searchParams]);

  const executeSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch();
  };

  return (
    <Wrapper>
      <Form>
        <Input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleSearch}
        />
        <Button onClick={executeSearch}>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.9 14.32a8 8 0 1 1 1.414-1.414l4.387 4.386a1 1 0 0 1-1.414 1.415l-4.387-4.387ZM14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
            ></path>
          </svg>
        </Button>
      </Form>
    </Wrapper>
  );
}

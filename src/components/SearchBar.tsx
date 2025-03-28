import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  outline: none;
`;

const Button = styled.button`
  background-color: #81c147;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  font-weight: bold;
  cursor: pointer;
`;

const SearchBar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!input.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(input.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="검색어를 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSearch}>🔍</Button>
    </Wrapper>
  );
};

export default SearchBar;

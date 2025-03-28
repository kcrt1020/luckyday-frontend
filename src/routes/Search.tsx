import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../utills/api";
import styled from "styled-components";

interface Clover {
  id: number;
  content: string;
  createdAt: string;
  email: string;
  userId: string;
  nickname: string;
  profileImage: string;
}

interface User {
  userId: string;
  nickname: string;
  profileImage: string;
}

interface TabProps {
  $active: boolean;
}

const Wrapper = styled.div`
  width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #ccc;
  margin-bottom: 1rem;
`;

const Tab = styled.div<TabProps>`
  flex: 1;
  text-align: center;
  padding: 0.8rem 0;
  font-weight: bold;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  background-color: ${({ $active }) => ($active ? "#81c147" : "transparent")};
  transition: all 0.3s ease;
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloverCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
`;

const Meta = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

const UserCard = styled(Meta)`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Highlight = styled.mark`
  background-color: #ffef9f;
  font-weight: bold;
`;

const NoResult = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
  font-size: 1rem;
`;

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [tab, setTab] = useState<"clover" | "user">("clover");
  const [clovers, setClovers] = useState<Clover[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!keyword) return;

    console.log("📡 API 요청 시작:", keyword); // ✅ 확인
    if (tab === "clover") {
      apiRequest(`/api/search/clovers/${encodeURIComponent(keyword)}`).then(
        (data) => {
          console.log("🌱 클로버 결과:", data);
          setClovers(data);
        }
      );
    } else {
      apiRequest(`/api/search/users/${encodeURIComponent(keyword)}`).then(
        (data) => {
          console.log("🧑‍💻 유저 결과:", data);
          setUsers(data || []);
        }
      );
    }
  }, [tab, keyword]);

  const highlight = (text: string) =>
    text
      .split(new RegExp(`(${keyword})`, "gi"))
      .map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <Highlight key={i}>{part}</Highlight>
        ) : (
          part
        )
      );

  return (
    <Wrapper>
      <Tabs>
        <Tab $active={tab === "clover"} onClick={() => setTab("clover")}>
          클로버
        </Tab>
        <Tab $active={tab === "user"} onClick={() => setTab("user")}>
          유저
        </Tab>
      </Tabs>

      {tab === "clover" && (
        <ResultList>
          {Array.isArray(clovers) && clovers.length > 0 ? (
            clovers.map((clover) => (
              <CloverCard key={clover.id}>
                <div>{highlight(clover.content)}</div>
                <Meta>
                  <img src={clover.profileImage} alt="프로필" />
                  <span>
                    {clover.nickname} ({clover.userId})
                  </span>
                </Meta>
              </CloverCard>
            ))
          ) : (
            <NoResult>검색 결과가 없습니다.</NoResult>
          )}
        </ResultList>
      )}

      {tab === "user" && (
        <ResultList>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user, i) => (
              <UserCard key={i}>
                <img src={user.profileImage} alt="프로필" />
                <span>
                  {highlight(user.nickname)} ({highlight(user.userId)})
                </span>
              </UserCard>
            ))
          ) : (
            <NoResult>검색된 유저가 없습니다.</NoResult>
          )}
        </ResultList>
      )}
    </Wrapper>
  );
};

export default Search;

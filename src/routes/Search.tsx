import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import Timeline from "../components/timeline";
import UserList from "../components/UserList";
import { User } from "../utills/types";

interface TabProps {
  $active: boolean;
}

const Wrapper = styled.div`
  width: 700px;
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

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [tab, setTab] = useState<"clover" | "user">("clover");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!keyword || tab !== "user") return;

    apiRequest(`/api/search/users/${encodeURIComponent(keyword)}`).then(
      (data) => setUsers(data || [])
    );
  }, [tab, keyword]);

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

      {tab === "clover" && <Timeline keyword={keyword} />}
      {tab === "user" && <UserList users={users} emptyText="검색 결과" />}
    </Wrapper>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import UserList from "../components/UserList";
import { User } from "../utills/types";
import Timeline from "../components/Timeline";

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
  justify-content: space-around;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div<TabProps>`
  padding: 12px 0;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? "#81c147" : "#888")};
  border-bottom: ${({ $active }) =>
    $active ? "2px solid #81c147" : "2px solid transparent"};
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #81c147;
  }
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

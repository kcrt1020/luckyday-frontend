import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { User } from "../utills/types";
import UserList from "../components/UserList";

const Wrapper = styled.div`
  width: 600px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
`;

const Tab = styled(Link)<{ active: boolean }>`
  padding: 8px 0;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#81c147" : "#888")};
  border-bottom: ${({ active }) => (active ? "2px solid #81c147" : "none")};
  text-decoration: none;

  &:hover {
    color: #81c147;
  }
`;

export default function FollowList() {
  const { type, username } = useParams<{ type: string; username: string }>();
  const [userList, setUserList] = useState<User[]>([]);

  const pageTitle = type === "following" ? "팔로잉" : "팔로워";

  useEffect(() => {
    const fetchList = async () => {
      try {
        const endpoint =
          type === "following"
            ? `/api/follow/following/${username}`
            : `/api/follow/followers/${username}`;
        const res = await apiRequest(endpoint);

        const formatted = (res as User[]).map((user) => ({
          ...user,
          profile: {
            nickname: user.profile?.nickname || "",
            profileImage: user.profile?.profileImage || "Unknown",
            bio: user.profile?.bio || "",
          },
        }));

        setUserList(formatted);
      } catch (err) {
        console.error("목록 불러오기 실패:", err);
      }
    };

    fetchList();
  }, [type, username]);

  return (
    <Wrapper>
      <Tabs>
        <Tab
          to={`/profile/following/${username}`}
          active={type === "following"}
        >
          팔로잉
        </Tab>
        <Tab
          to={`/profile/followers/${username}`}
          active={type === "followers"}
        >
          팔로워
        </Tab>
      </Tabs>

      <UserList users={userList} emptyText={pageTitle} />
    </Wrapper>
  );
}

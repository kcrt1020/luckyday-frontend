import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { User } from "../utills/types";
import FollowButton from "../components/FollowButton";
import { withSubjectParticle } from "../utills/korean";
import { useCurrentUser } from "../hooks/useCurrentUser";

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

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserItem = styled.li`
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: #333; */
`;

const UserInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex: 1;

  &:hover {
    color: #81c147;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileSVG = styled.svg`
  width: 50%;
  height: 50%;
  fill: white;
`;

const ProfileWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  margin-right: 10px;
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Nickname = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const Username = styled.div`
  font-size: 15px;
  color: #666;
`;

const Bio = styled.div`
  font-size: 14px;
  margin-top: 4px;
`;

const EmptyMsg = styled.p`
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
`;

export default function FollowListPage() {
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
        setUserList(res || []);
      } catch (err) {
        console.error("목록 불러오기 실패:", err);
      }
    };

    fetchList();
  }, [type, username]);

  const currentUser = useCurrentUser();
  const API_URL = import.meta.env.VITE_API_URL;
  return (
    <Wrapper>
      <Title>{pageTitle} 목록</Title>
      <Tabs>
        <Tab to={`/profile/following/${username}`} active={type === "following"}>
          팔로잉
        </Tab>
        <Tab to={`/profile/followers/${username}`} active={type === "followers"}>
          팔로워
        </Tab>
      </Tabs>

      <List>
        {userList.length > 0 ? (
          userList.map((user) => (
            <UserItem key={user.id}>
              <UserInfo to={`/profile/${user.username}`}>
                <ProfileWrapper>
                  {user.profile?.profileImage !== "Unknown" ? (
                    <ProfileImg
                      src={`${API_URL}${user.profile?.profileImage}`}
                      alt="User Profile"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <ProfileSVG viewBox="0 0 24 24">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        ></path>
                      </svg>
                    </ProfileSVG>
                  )}
                </ProfileWrapper>
                <UserText>
                  <NicknameRow>
                    <Nickname>{user.profile?.nickname}</Nickname>
                    <Username>@{user.username}</Username>
                  </NicknameRow>
                  <Bio>{user.profile?.bio}</Bio>
                </UserText>
              </UserInfo>

              {/* 본인 아닌 경우만 FollowButton 보이게 */}
              {user.username !== currentUser?.username && (
                <FollowButton targetUsername={user.username} />
              )}
            </UserItem>
          ))
        ) : (
          <EmptyMsg>표시할 {withSubjectParticle(pageTitle)} 없습니다.</EmptyMsg>
        )}
      </List>
    </Wrapper>
  );
}

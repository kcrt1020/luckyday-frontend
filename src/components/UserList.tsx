import styled from "styled-components";
import { Link } from "react-router-dom";
import { User } from "../utills/types";
import FollowButton from "./FollowButton";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { withSubjectParticle } from "../utills/korean";

interface UserListProps {
  users: User[];
  emptyText?: string;
}

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

const API_URL = import.meta.env.VITE_API_URL;

export default function UserList({ users, emptyText }: UserListProps) {
  const currentUser = useCurrentUser();

  if (!users.length) {
    return <EmptyMsg>{withSubjectParticle(emptyText || "결과")} 없습니다.</EmptyMsg>;
  }

  return (
    <List>
      {users.map((user) => (
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
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  ></path>
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

          {user.username !== currentUser?.username && (
            <FollowButton targetUsername={user.username} />
          )}
        </UserItem>
      ))}
    </List>
  );
}

import { useState, useEffect } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { User } from "../utills/types";

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingList, setFollowingList] = useState<User[]>([]); // 팔로잉 목록 기본값 빈 배열
  const [followersList, setFollowersList] = useState<User[]>([]); // 팔로워 목록 기본값 빈 배열
  const [followingCount, setFollowingCount] = useState(0); // 팔로잉 수
  const [followersCount, setFollowersCount] = useState(0); // 팔로워 수

  // 팔로우 상태 확인, 팔로잉/팔로워 목록 및 수를 가져오는 effect
  useEffect(() => {
    console.log("💬 targetUserId:", targetUserId);

    const fetchData = async () => {
      try {
        // 팔로우 상태 확인
        const followRes = await apiRequest(
          `/api/follow/status/${targetUserId}`
        );
        setIsFollowing(followRes?.isFollowing ?? false);

        // 팔로잉 목록 및 수
        const followingRes = await apiRequest(`/api/follow/following`);
        setFollowingList(followingRes || []); // 빈 배열로 기본값 설정
        const followingCountRes = await apiRequest(
          `/api/follow/following/count`
        );
        setFollowingCount(followingCountRes?.followingCount || 0); // 0으로 기본값 설정

        // 팔로워 목록 및 수
        const followersRes = await apiRequest(`/api/follow/followers`);
        setFollowersList(followersRes || []); // 빈 배열로 기본값 설정
        const followersCountRes = await apiRequest(
          `/api/follow/followers/count`
        );
        setFollowersCount(followersCountRes?.followersCount || 0); // 0으로 기본값 설정
      } catch (err) {
        console.error("팔로우 상태 확인 실패:", err);
      }
    };

    fetchData();
  }, [targetUserId]);

  // 팔로우/언팔로우 토글
  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await apiRequest(`/api/follow/${targetUserId}`, { method: "DELETE" });
      } else {
        await apiRequest(`/api/follow/${targetUserId}`, { method: "POST" });
      }
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("팔로우/언팔로우 실패:", err);
    }
  };

  return (
    <div>
      <Button onClick={handleToggleFollow} $isFollowing={isFollowing}>
        {isFollowing ? "언팔로우" : "팔로우"}
      </Button>

      {/* 팔로잉 목록 */}
      <div>
        <h3>팔로잉 목록 ({followingCount})</h3>
        <ul>
          {followingList && followingList.length > 0 ? (
            followingList.map((user) => <li key={user.id}>{user.userId}</li>)
          ) : (
            <li>팔로잉이 없습니다.</li>
          )}
        </ul>
      </div>

      {/* 팔로워 목록 */}
      <div>
        <h3>팔로워 목록 ({followersCount})</h3>
        <ul>
          {followersList && followersList.length > 0 ? (
            followersList.map((user) => <li key={user.id}>{user.userId}</li>)
          ) : (
            <li>팔로워가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

const Button = styled.button<{ $isFollowing: boolean }>`
  padding: 6px 14px;
  border: 1px solid #81c147;
  background-color: ${(props) => (props.$isFollowing ? "#222" : "#81c147")};
  color: ${(props) => (props.$isFollowing ? "#81c147" : "#fff")};
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

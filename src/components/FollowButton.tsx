import { useState, useEffect } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";
import { useNavigate } from "react-router-dom";

interface FollowButtonProps {
  targetUsername: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const FollowBtn = styled.button<{ $isFollowing: boolean }>`
  padding: 6px 16px;
  border: 1px solid #81c147;
  background-color: ${(props) => (props.$isFollowing ? "#000" : "#81c147")};
  color: ${(props) => (props.$isFollowing ? "#81c147" : "#fff")};
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const FollowStats = styled.div`
  display: flex;
  gap: 12px;
`;

const FollowItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 14px;

  strong {
    font-size: 16px;
    font-weight: bold;
  }

  &:hover span {
    color: #81c147;
  }
`;

export default function FollowButton({ targetUsername }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const navigate = useNavigate();

  // 팔로우 상태 및 수 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const followRes = await apiRequest(
          `/api/follow/status/${targetUsername}`
        );
        setIsFollowing(followRes?.isFollowing ?? false);

        const followingCountRes = await apiRequest(
          `/api/follow/following/count`
        );
        setFollowingCount(followingCountRes?.followingCount || 0);

        const followersCountRes = await apiRequest(
          `/api/follow/followers/count`
        );
        setFollowersCount(followersCountRes?.followersCount || 0);
      } catch (err) {
        console.error("팔로우 정보 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [targetUsername]);

  // 팔로우/언팔로우 토글
  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await apiRequest(`/api/follow/${targetUsername}`, { method: "DELETE" });
      } else {
        await apiRequest(`/api/follow/${targetUsername}`, { method: "POST" });
      }
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("팔로우/언팔로우 실패:", err);
    }
  };

  // 팔로잉/팔로워 페이지로 이동
  const goToFollowPage = (type: "following" | "followers") => {
    navigate(`/profile/${type}/${targetUsername}`);
  };

  return (
    <Wrapper>
      <FollowBtn onClick={handleToggleFollow} $isFollowing={isFollowing}>
        {isFollowing ? "언팔로우" : "팔로우"}
      </FollowBtn>

      <FollowStats>
        <FollowItem onClick={() => goToFollowPage("following")}>
          <strong>{followingCount}</strong>
          <span>팔로잉</span>
        </FollowItem>
        <FollowItem onClick={() => goToFollowPage("followers")}>
          <strong>{followersCount}</strong>
          <span>팔로워</span>
        </FollowItem>
      </FollowStats>
    </Wrapper>
  );
}

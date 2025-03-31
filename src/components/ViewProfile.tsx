import styled from "styled-components";
import { IProfile } from "../routes/Profile";
import FollowButton from "./FollowButton";
import Timeline from "./Timeline";

interface ViewProfileProps {
  profile: IProfile;
  isOwnProfile: boolean;
  onEdit: () => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  width: 700px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  width: 400px;
  background-color: #111;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 0 24px rgba(129, 193, 71, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #81c147;
`;

const Name = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 600;

  span {
    font-size: 16px;
    margin-left: 6px;
  }
`;

const BioBox = styled.div`
  width: 100%;
  background: #1c1c1c;
  border-radius: 12px;
  padding: 16px 20px;
  color: #ccc;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;
`;

const InfoList = styled.div`
  width: 100%;
  background: #1c1c1c;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #ccc;
  font-size: 14px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 8px;
`;

const Label = styled.span`
  font-weight: 500;
  color: #888;
`;

const Value = styled.span`
  color: #eee;

  a {
    color: #81c147;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

const Button = styled.button<{ $secondary?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: ${({ $secondary }) => ($secondary ? "#333" : "#81c147")};
  color: ${({ $secondary }) => ($secondary ? "#ddd" : "#fff")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $secondary }) => ($secondary ? "#444" : "#6aa436")};
  }
`;

export default function ViewProfile({
  profile,
  isOwnProfile,
  onEdit,
}: ViewProfileProps) {
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <Wrapper>
      <ProfileCard>
        <Avatar
          src={
            profile.profileImage
              ? `${API_URL}${profile.profileImage}`
              : "/default.png"
          }
          alt="프로필 사진"
        />
        <Name>
          {profile.nickname}
          <span>@{profile.username}</span>
        </Name>

        <BioBox>{profile.bio || "아직 자기소개가 없어요."}</BioBox>

        <InfoList>
          <InfoItem>
            <Label>위치</Label>
            <Value>{profile.location || "위치 미입력"}</Value>
          </InfoItem>
          <InfoItem>
            <Label>웹사이트</Label>
            <Value>
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noreferrer">
                  {profile.website}
                </a>
              ) : (
                "웹사이트 없음"
              )}
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>생일</Label>
            <Value>{profile.birthDate || "생일 미입력"}</Value>
          </InfoItem>
        </InfoList>

        <ButtonGroup>
          {isOwnProfile ? (
            <Button onClick={onEdit}>프로필 수정</Button>
          ) : (
            <FollowButton targetUsername={profile.username} />
          )}
        </ButtonGroup>
      </ProfileCard>

      <Timeline username={profile.username} />
    </Wrapper>
  );
}

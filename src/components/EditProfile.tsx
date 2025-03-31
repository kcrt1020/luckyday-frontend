import { useState } from "react";
import styled from "styled-components";
import { IProfile } from "../routes/Profile";
import { apiRequest } from "../utills/api";

interface EditProfileProps {
  profile: IProfile;
  onCancel: () => void;
  onSave: (profile: IProfile) => void;
}

const Wrapper = styled.div`
  display: flex;
  width: 400px;
  justify-content: center;
  padding: 0 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 700px;
  background-color: #111;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 0 24px rgba(129, 193, 71, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: #aaa;
  font-size: 14px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #eee;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #81c147;
  }
`;

const StyledTextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #eee;
  font-size: 14px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #81c147;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button<{ $secondary?: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ $secondary }) => ($secondary ? "#333" : "#81c147")};
  color: ${({ $secondary }) => ($secondary ? "#ddd" : "#fff")};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $secondary }) => ($secondary ? "#444" : "#6aa436")};
  }
`;

const PhotoUpload = styled.label`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #1a1a1a;
  border: 2px dashed #81c147;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  margin: 0 auto 20px;

  &:hover {
    background-color: #222;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadPlaceholder = styled.span`
  color: #888;
  font-size: 14px;
`;

export default function EditProfile({
  profile,
  onCancel,
  onSave,
}: EditProfileProps) {
  const [form, setForm] = useState({
    nickname: profile.nickname || "",
    username: profile.username || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    birthDate: profile.birthDate || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiRequest(
        "/api/profile/update",
        {
          method: "PUT",
          body: JSON.stringify(form),
          headers: {},
        },
        false,
        false
      );

      if (response) {
        onSave({ ...profile, ...form });
      } else {
        console.error("❌ 저장 실패 (응답 없음)");
      }
    } catch (e) {
      console.error("❌ 오류 발생", e);
    }
  };

  const [previewImg, setPreviewImg] = useState<string | null>(
    profile.profileImage
      ? `${import.meta.env.VITE_API_URL}${profile.profileImage}`
      : null
  );

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await apiRequest(
        "/api/profile/avatar",
        {
          method: "POST",
          body: formData,
        },
        false, // withCredentials
        true // isFormData
      );

      if (response?.profileImage) {
        setPreviewImg(
          `${import.meta.env.VITE_API_URL}${response.profileImage}`
        );
      } else {
        console.error("❌ 이미지 업로드 실패: 응답 없음");
      }
    } catch (error) {
      console.error("❌ 프로필 이미지 업로드 실패", error);
    }
  };

  return (
    <Wrapper>
      <FormCard>
        <Title>프로필 수정</Title>

        <PhotoUpload htmlFor="profile-image">
          {previewImg ? (
            <Avatar src={previewImg} alt="프로필 이미지" />
          ) : (
            <UploadPlaceholder>사진 등록</UploadPlaceholder>
          )}
        </PhotoUpload>
        <input
          type="file"
          id="profile-image"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfileImageChange}
        />

        <FormGroup>
          <Label>닉네임</Label>
          <StyledInput
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>아이디</Label>
          <StyledInput
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>자기소개</Label>
          <StyledTextArea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
          />
        </FormGroup>

        <FormGroup>
          <Label>위치</Label>
          <StyledInput
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>웹사이트</Label>
          <StyledInput
            name="website"
            value={form.website}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>생일</Label>
          <StyledInput
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
          />
        </FormGroup>

        <ButtonGroup>
          <Button onClick={handleSubmit}>저장</Button>
          <Button $secondary onClick={onCancel}>
            취소
          </Button>
        </ButtonGroup>
      </FormCard>
    </Wrapper>
  );
}

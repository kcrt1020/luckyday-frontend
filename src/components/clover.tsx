import styled from "styled-components";
import { IClover } from "./timeline";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const UserInfo = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Clover({
  id,
  email,
  userId,
  nickname,
  imageUrl,
  content,
}: IClover) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("🚨 로그인된 유저 정보 없음");
          return;
        }

        const response = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error("🚨 로그인된 유저 정보 가져오기 실패");

        const data = await response.json();
        setCurrentUser(data.email); // ✅ 현재 로그인한 유저의 이메일 저장
        console.log("🔍 현재 로그인한 유저 이메일:", data.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const response = await fetch(`${API_URL}/api/clovers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete clover");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting clover:", error);
    }
  };

  return (
    <Wrapper>
      <Column>
        <UserInfo>
          {nickname} (@{userId})
        </UserInfo>
        <Payload>{content}</Payload>
        {currentUser && currentUser === email && (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        )}
      </Column>
      <Column>
        {imageUrl ? (
          <Photo src={`${API_URL}${imageUrl}`} alt="Clover Image" />
        ) : null}
      </Column>
    </Wrapper>
  );
}

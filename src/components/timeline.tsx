import { useEffect, useState } from "react";
import styled from "styled-components";
import Clover from "./clover";
import { apiRequest } from "../utills/api";

export interface IClover {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  email: string;
  nickname: string;
  createdAt: string;
  profileImage: string;
}

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  flex-direction: column;
  background-color: #222;
`;

export default function Timeline({ userId }: { userId?: string }) {
  const [clovers, setClovers] = useState<IClover[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const loadClovers = async () => {
      try {
        let url = "/api/clovers"; // 기본적으로 전체 클로버 가져옴

        if (userId) {
          url = `/api/clovers/user/${userId}`; // ✅ 특정 유저의 클로버만 가져오는 API 사용
        }

        const data: IClover[] | null = await apiRequest(url, {
          method: "GET",
        });

        if (data) {
          setClovers(data);
        }
      } catch (error) {
        console.error("🚨 클로버 가져오기 실패:", error);
      }
    };

    loadClovers();
    const interval = setInterval(loadClovers, 5000);
    return () => clearInterval(interval);
  }, [isReady, userId]);

  return (
    <Wrapper>
      {clovers.length > 0 ? (
        clovers.map((clover) => <Clover key={clover.id} {...clover} />)
      ) : (
        <p>클로버가 없습니다.</p>
      )}
    </Wrapper>
  );
}

import { useEffect, useState, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import Clover from "./clover";
import { apiRequest } from "../utills/api";

export interface IClover {
  id: string;
  content: string;
  imageUrl?: string;
  username: string;
  email: string;
  nickname: string;
  createdAt: string;
  profileImage: string;
  isReply?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Spinner = styled.div`
  margin: 20px auto;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #81c147;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spin} 1s linear infinite;
`;

const FinishedMessage = styled.div`
  text-align: center;
  color: #81c147;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: ${fadeInUp} 0.6s ease-out;
  transition: all 0.3s ease;
`;

export default function Timeline({ username }: { username?: string }) {
  const [clovers, setClovers] = useState<IClover[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const loadClovers = async () => {
      try {
        let url = "/api/clovers";
        if (username) url = `/api/clovers/user/${username}`;

        const data: IClover[] | null = await apiRequest(url, { method: "GET" });
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
  }, [isReady, username]);

  const observeLastItem = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("✅ 마지막 아이템 화면에 보임! → visibleCount 증가");
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 5);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (node) observerRef.current.observe(node);
  }, []);

  const visibleClovers = clovers.slice(0, visibleCount);

  return (
    <>
      <Wrapper>
        {visibleClovers.length > 0 ? (
          visibleClovers.map((clover, index) => {
            const isLast = index === visibleClovers.length - 1;
            return (
              <div key={clover.id} ref={isLast ? observeLastItem : null}>
                <Clover {...clover} />
              </div>
            );
          })
        ) : (
          <p>클로버가 없습니다.</p>
        )}
      </Wrapper>

      {isLoadingMore && <Spinner />}

      {!isLoadingMore &&
        visibleCount >= clovers.length &&
        clovers.length > 0 && (
          <FinishedMessage>오늘의 클로버는 여기까지 ✨</FinishedMessage>
        )}
    </>
  );
}

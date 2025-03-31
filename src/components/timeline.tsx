import { useEffect, useState, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { apiRequest } from "../utills/api";
import Clover from "./Clover";

export interface IClover {
  id: string;
  content: string;
  imageUrl?: string;
  username: string;
  email: string;
  nickname: string;
  createdAt: string;
  profileImage: string;
  parent_clover_id?: string | null;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  overflow: visible !important;
`;

const CloverWrapper = styled.div<{ marginLeft?: number }>`
  padding-left: ${({ marginLeft }) => marginLeft || 0}px;
  overflow-wrap: break-word;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
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

export default function Timeline({
  username,
  keyword,
}: {
  username?: string;
  keyword?: string;
}) {
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
      let url = "/api/clovers";
      if (username) url = `/api/clovers/user/${username}`;
      const data: IClover[] | null = await apiRequest(url, { method: "GET" });

      if (data) {
        const filtered = keyword
          ? data.filter((clover) =>
              clover.content.toLowerCase().includes(keyword.toLowerCase())
            )
          : data;
        setClovers(filtered);
      }
    };

    loadClovers();

    const interval = setInterval(loadClovers, 5000);
    return () => clearInterval(interval);
  }, [isReady, username, keyword]);

  // 중복 제거 + 부모 포함 정렬
  const organizeClovers = (flatClovers: IClover[]) => {
    const cloverMap = new Map<string, IClover & { replies: IClover[] }>();

    flatClovers.forEach((clover) => {
      cloverMap.set(clover.id, { ...clover, replies: [] });
    });

    flatClovers.forEach((clover) => {
      if (clover.parent_clover_id) {
        const parent = cloverMap.get(clover.parent_clover_id);
        const child = cloverMap.get(clover.id);
        if (parent && child) parent.replies.push(child);
      }
    });

    const ordered: (IClover & { replies: IClover[] })[] = [];
    const seen = new Set<string>();

    [...flatClovers]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .forEach((clover) => {
        const current = cloverMap.get(clover.id);
        if (!current || seen.has(current.id)) return;

        if (current.parent_clover_id) {
          const parent = cloverMap.get(current.parent_clover_id);
          if (parent && !seen.has(parent.id)) {
            ordered.push(parent);
            seen.add(parent.id);
            parent.replies.forEach((r) => seen.add(r.id));
          }
        } else {
          ordered.push(current);
          seen.add(current.id);
        }
      });

    return ordered;
  };

  const renderClovers = (
    clovers: (IClover & { replies?: IClover[] })[],
    level = 0
  ) => {
    return clovers.map((clover, index) => {
      const isLast = index === clovers.length - 1;
      return (
        <CloverWrapper
          key={clover.id}
          ref={isLast ? observeLastItem : null}
          marginLeft={Math.min(level * 5, 30)}
        >
          <Clover
            {...clover}
            parent_clover_id={clover.parent_clover_id ?? null}
          />
          {level < 3 &&
            clover.replies &&
            clover.replies.length > 0 &&
            renderClovers(clover.replies, level + 1)}
        </CloverWrapper>
      );
    });
  };

  const observeLastItem = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 5);
          setIsLoadingMore(false);
        }, 500);
      }
    });

    if (node) observerRef.current.observe(node);
  }, []);

  const organizedClovers = organizeClovers(clovers);
  const visibleClovers = organizedClovers.slice(0, visibleCount);

  return (
    <>
      <Wrapper>
        {visibleClovers.length > 0 ? (
          renderClovers(visibleClovers)
        ) : (
          <p>클로버가 없습니다.</p>
        )}
      </Wrapper>

      {isLoadingMore && <Spinner />}

      {!isLoadingMore &&
        visibleCount >= organizedClovers.length &&
        organizedClovers.length > 0 && (
          <FinishedMessage>오늘의 클로버는 여기까지 ✨</FinishedMessage>
        )}
    </>
  );
}

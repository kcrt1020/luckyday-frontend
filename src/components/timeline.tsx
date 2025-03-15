import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  username: string;
  createdAt: string;
}

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isReady, setIsReady] = useState(false); // ✅ fetchWithAuth가 준비될 때까지 대기

  useEffect(() => {
    const checkFetchWithAuth = setInterval(() => {
      if (typeof window.fetchWithAuth === "function") {
        console.log("✅ fetchWithAuth가 정상적으로 설정됨!");
        setIsReady(true);
        clearInterval(checkFetchWithAuth); // ✅ fetchWithAuth가 설정되면 setInterval 종료
      }
    }, 100); // ✅ 100ms마다 fetchWithAuth가 설정되었는지 확인

    return () => clearInterval(checkFetchWithAuth);
  }, []);

  useEffect(() => {
    if (!isReady) return; // ✅ fetchWithAuth가 준비될 때까지 API 요청을 보내지 않음

    const API_URL = import.meta.env.VITE_API_URL;

    const loadTweets = async () => {
      try {
        const response = await window.fetchWithAuth(`${API_URL}/api/tweets`);

        if (!response.ok) {
          throw new Error(`🚨 API 응답 실패: ${response.status}`);
        }

        const data: ITweet[] = await response.json();
        setTweets(data);
      } catch (error) {
        console.error("🚨 트윗 가져오기 실패:", error);
      }
    };

    loadTweets();
    const interval = setInterval(loadTweets, 5000);

    return () => clearInterval(interval);
  }, [isReady]); // ✅ isReady가 true가 된 후 API 요청 시작

  return (
    <Wrapper>
      {tweets.length > 0 ? (
        tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
      ) : (
        <p>트윗이 없습니다.</p>
      )}
    </Wrapper>
  );
}

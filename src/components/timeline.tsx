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
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

  // ✅ 트윗 목록을 가져오는 함수
  const fetchTweets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tweets`);
      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }
      const data: ITweet[] = await response.json();
      setTweets(data);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    fetchTweets(); // ✅ 최초 실행 시 트윗 가져오기

    // ✅ 일정 간격(5초)마다 최신 트윗 가져오기
    const interval = setInterval(fetchTweets, 5000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

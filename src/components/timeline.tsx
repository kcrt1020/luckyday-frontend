import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  // useEffect(() => {
  //   const fetchTweets = async () => {
  //     // const tweetsQuery = query(
  //     //   collection(db, "tweets"),
  //     //   orderBy("createdAt", "desc"),
  //     //   limit(25)
  //     // );
  //     // const spanshot = await getDocs(tweetsQuery);
  //     // const tweets = spanshot.docs.map((doc) => {
  //     //   const { tweet, createdAt, userId, username, photo } = doc.data();
  //     //   return {
  //     //     tweet,
  //     //     createdAt,
  //     //     userId,
  //     //     username,
  //     //     photo,
  //     //     id: doc.id,
  //     //   };
  //     // });
  //     unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
  //       const tweets = snapshot.docs.map((doc) => {
  //         const { tweet, createdAt, userId, username, photo } = doc.data();
  //         return {
  //           tweet,
  //           createdAt,
  //           userId,
  //           username,
  //           photo,
  //           id: doc.id,
  //         };
  //       });
  //       setTweet(tweets);
  //     });
  //   };
  //   fetchTweets();
  //   return () => {
  //     unsubscribe && unsubscribe();
  //   };
  // }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

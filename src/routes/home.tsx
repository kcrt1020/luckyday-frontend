import styled from "styled-components";
import PostCloverForm from "../components/post-clover-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostCloverForm />
      <Timeline />
    </Wrapper>
  );
}

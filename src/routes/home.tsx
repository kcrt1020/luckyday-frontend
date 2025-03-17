import styled from "styled-components";
import PostCloverForm from "../components/post-clover-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  height: 80vh; /* 부모 높이를 명확히 설정 */
`;

export default function Home() {
  return (
    <Wrapper>
      <PostCloverForm />
      <Timeline />
    </Wrapper>
  );
}

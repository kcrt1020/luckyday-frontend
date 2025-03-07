import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  height: 90vh; /* 부모 높이를 명확히 설정 */
`;

export default function Home() {
  return <Wrapper></Wrapper>;
}

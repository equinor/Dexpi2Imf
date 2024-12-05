import Editor from "./components/Editor.tsx";
import styled from "styled-components";

const Page = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  text-align: center;
`;

function App() {
  return (
    <Page>
      <Editor />
    </Page>
  );
}

export default App;

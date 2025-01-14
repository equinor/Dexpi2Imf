import Pandid from "../diagram/Pandid.tsx";
import EditorSidebar from "./EditorSidebar.tsx";
import { useState } from "react";
import Tools from "../../enums/Tools.ts";
import Action from "../../types/Action.ts";
import { CommissioningPackageContextProvider } from "../../context/CommissioningPackageContext.tsx";
import ToolContext from "../../context/ToolContext.ts";
import EditorTopBar from "./EditorTopBar.tsx";
import styled from "styled-components";
import ActionContext from "../../context/ActionContext.ts";
import NodeTable from "../tables/NodeTable.tsx";
import DownloadButton from "../tables/DownloadButton.tsx";

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SideBarAndPandid = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export default function Editor() {
  const [activeTool, setActiveTool] = useState(Tools.BOUNDARY);
  const [action, setAction] = useState<Action>({ tool: null, node: "" });
  return (
    <CommissioningPackageContextProvider>
      <ToolContext.Provider value={{ activeTool, setActiveTool }}>
        <ActionContext.Provider value={{ action, setAction }}>
          <EditorContainer>
            <EditorTopBar />
            <SideBarAndPandid>
              <EditorSidebar />
              <Pandid />
            </SideBarAndPandid>
          </EditorContainer>
        </ActionContext.Provider>
      </ToolContext.Provider>
      <NodeTable />
    </CommissioningPackageContextProvider>
  );
}

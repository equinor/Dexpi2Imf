import EditorSidebar from "./EditorSidebar.tsx";
import { useState } from "react";
import Tools from "../../enums/Tools.ts";
import Action from "../../types/Action.ts";
import ToolContext from "../../context/ToolContext.ts";
import EditorTopBar from "./EditorTopBar.tsx";
import styled from "styled-components";
import ActionContext from "../../context/ActionContext.ts";
import NodeTable from "../tables/NodeTable.tsx";
import { SideSheet } from "@equinor/eds-core-react";
import PandIdGraphicalDataExample from "../diagram/PandIdGraphicalDataExample.tsx";
import { CommissioningPackageProvider } from "../../context/NewCommissioningPackageContextProvider.tsx";
import Pandid from "../diagram/Pandid.tsx";

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
  const [tableIsVisible, setTableIsVisible] = useState(false);
  const [isNewGraphics, setIsNewGraphics] = useState(false);
  return (
    <CommissioningPackageProvider>
      <ToolContext.Provider value={{ activeTool, setActiveTool }}>
        <ActionContext.Provider value={{ action, setAction }}>
          <EditorContainer>
            <EditorTopBar />
            <SideBarAndPandid>
              <EditorSidebar
                tableIsVisible={tableIsVisible}
                setTableIsVisible={setTableIsVisible}
                isNewGraphics={isNewGraphics}
                setIsNewGraphics={setIsNewGraphics}
              />
              {isNewGraphics ? <PandIdGraphicalDataExample /> : <Pandid />}
            </SideBarAndPandid>
          </EditorContainer>
        </ActionContext.Provider>
      </ToolContext.Provider>
      <SideSheet open={tableIsVisible}>
        <NodeTable />
      </SideSheet>
    </CommissioningPackageProvider>
  );
}

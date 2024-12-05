import { SideBar } from "@equinor/eds-core-react";
import { add, brush, texture } from "@equinor/eds-icons";
import styled from "styled-components";

const StyledSideBar = styled.div`
  height: 100%;
`;

export default function Sidebar() {
  return (
    <StyledSideBar>
      <SideBar>
        <SideBar.Content>
          <SideBar.Link icon={add} label={"New Commissioning Package"} />
          <SideBar.Link icon={brush} label={"Select Boundaries"} />
          <SideBar.Link icon={texture} label={"Select Inside of Boundary"} />
        </SideBar.Content>
      </SideBar>
    </StyledSideBar>
  );
}

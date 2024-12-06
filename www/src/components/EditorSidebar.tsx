import { SideBar, SidebarLinkProps } from "@equinor/eds-core-react";
import { add, boundaries, category, texture } from "@equinor/eds-icons";
import styled from "styled-components";
import React from "react";
import Tools from "../enums/Tools.ts";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";

const StyledSideBar = styled.div`
  height: 100%;
`;

interface EditorSidebarProps {
  activeTool: Tools;
  setActiveTool: React.Dispatch<React.SetStateAction<Tools>>;
}

export default function EditorSidebar({
  activeTool,
  setActiveTool,
}: EditorSidebarProps) {
  const context = useCommissioningPackageContext();

  const menuItemsInitial: SidebarLinkProps[] = [
    {
      label: "New commissioning package",
      icon: add,
      onClick: () => {},
      active: false,
    },
    {
      label: "Select boundaries",
      icon: boundaries,
      onClick: () => {
        setActiveTool(Tools.BOUNDARY);
      },
      active: activeTool === Tools.BOUNDARY,
    },
    {
      label: "Select inside of boundary",
      icon: texture,
      onClick: () => {
        setActiveTool(Tools.INSIDEBOUNDARY);
      },
      active: activeTool === Tools.INSIDEBOUNDARY,
    },
  ];
  return (
    <StyledSideBar>
      <SideBar>
        <SideBar.Content>
          {context?.commissioningPackages && (
            <SideBar.Accordion label={"Commissioning packages"} icon={category}>
              {context.commissioningPackages.map((commpckg) => (
                <SideBar.AccordionItem
                  label={commpckg.name}
                  key={commpckg.name}
                  onClick={() => {
                    context?.setActivePackage(commpckg);
                  }}
                />
              ))}
            </SideBar.Accordion>
          )}
          {menuItemsInitial.map((item, index) => (
            <SideBar.Link key={index} {...item} />
          ))}
        </SideBar.Content>
      </SideBar>
    </StyledSideBar>
  );
}

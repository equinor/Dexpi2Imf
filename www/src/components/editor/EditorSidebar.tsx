import { SideBar, SidebarLinkProps } from "@equinor/eds-core-react";
import {
  add,
  undo,
  redo,
  boundaries,
  category,
  texture,
  delete_to_trash,
} from "@equinor/eds-icons";
import styled from "styled-components";
import { useContext, useState } from "react";
import Tools from "../../enums/Tools.ts";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import ToolContext from "../../context/ToolContext.ts";
import CommissioningPackageCreationDialog from "./CommissioningPackageCreationDialog.tsx";
import CommissioningPackageDeletionDialog from "./CommissioningPackageDeletionDialog.tsx";
import useUndoRedo from "../../hooks/useUndoRedo.tsx";

const StyledSideBar = styled.div`
  height: 100%;
`;

export default function EditorSidebar() {
  const context = useCommissioningPackageContext();
  const { handleUndo, handleRedo } = useUndoRedo();
  const { activeTool, setActiveTool } = useContext(ToolContext);
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const menuItemsInitial: SidebarLinkProps[] = [
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
    {
      label: "Undo",
      icon: undo,
      onClick: async () => {
        await handleUndo();
      },
      active: false,
    },
    {
      label: "Redo",
      icon: redo,
      onClick: async () => {
        await handleRedo();
      },
      active: false,
    },
    {
      label: "Delete commissioning packages",
      icon: delete_to_trash,
      onClick: () => {
        setIsDeleteOpen(true);
      },
    },
  ];

  return (
    <>
      <CommissioningPackageCreationDialog
        open={isCreationOpen}
        setOpen={setIsCreationOpen}
      />
      <CommissioningPackageDeletionDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
      <StyledSideBar>
        <SideBar>
          <SideBar.Content>
            <SideBar.Button
              icon={add}
              onClick={() => {
                setIsCreationOpen(true);
              }}
              label={"Create new commissioning package"}
            />
            {context?.commissioningPackages && (
              <SideBar.Accordion
                label={"Commissioning packages"}
                icon={category}
              >
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
    </>
  );
}

import {Button, Checkbox, Dialog, SideBar, SidebarLinkProps, Table} from "@equinor/eds-core-react";
import { add, boundaries, category, texture, delete_to_trash } from "@equinor/eds-icons";
import styled from "styled-components";
import { useContext, useState } from "react";
import Tools from "../../enums/Tools.ts";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import ToolContext from "../../context/ToolContext.ts";
import CommissioningPackageCreationDialog from "./CommissioningPackageCreationDialog.tsx";

const StyledSideBar = styled.div`
  height: 100%;
`;

export default function EditorSidebar() {
  const context = useCommissioningPackageContext();
  const { activeTool, setActiveTool } = useContext(ToolContext);
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (packageId: string) => {
    setSelectedPackages((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(packageId)) {
        newSelected.delete(packageId);
      } else {
        newSelected.add(packageId);
      }
      return newSelected;
    });
  };

  const handleDelete = () => {
    selectedPackages.forEach((packageId) => {
      context?.deleteCommissioningPackage(packageId);
    });
    setIsDeleteOpen(false);
    setSelectedPackages(new Set());
  };

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
      <Dialog
          open={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
          }}
      >
        <Dialog.Header>
          <Dialog.Title>
            Delete Commissioning Packages
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          Choose which commissioning packages to delete:
          {context?.commissioningPackages.map((commpckg) => (
              <Table>
                <Table.Row>
                  <Table.Cell>
                    <Checkbox
                      key={commpckg.id}
                      label={commpckg.name}
                      name="multiple"
                      checked={selectedPackages.has(commpckg.id)}
                      onChange={() => handleCheckboxChange(commpckg.id)}
                  />
                  </Table.Cell>
                </Table.Row>
              </Table>
          ))}
        </Dialog.CustomContent>
        <Dialog.Actions>
          <Button onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={() => {
            setIsDeleteOpen(false);
          }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
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

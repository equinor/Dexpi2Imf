import { Button, Checkbox, Dialog, Table } from "@equinor/eds-core-react";
import React, { useEffect, useState } from "react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import { deletePackageAction } from "../../utils/CommissioningPackageActions.tsx";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteCommissioningPackageDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { context, dispatch } = useCommissioningPackages();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set(),
  );

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

  const handleDelete = async () => {
    for (const packageId of selectedPackages) {
      await deletePackageAction(packageId, dispatch);
    }
    onClose();
    setSelectedPackages(new Set());
  };

  useEffect(() => {
    if (isOpen && context?.activePackage) {
      setSelectedPackages(new Set([context.activePackage.id]));
    }
  }, [isOpen, context?.activePackage]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>Delete Commissioning Packages</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        Choose which commissioning packages to delete:
        <Table>
          <Table.Body>
            {context?.commissioningPackages.map((commpckg) => (
              <Table.Row key={commpckg.id}>
                <Table.Cell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: commpckg.color,
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                    ></div>
                    <Checkbox
                      label={commpckg.name}
                      name="multiple"
                      checked={selectedPackages.has(commpckg.id)}
                      onChange={() => handleCheckboxChange(commpckg.id)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button onClick={handleDelete}>Delete</Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteCommissioningPackageDialog;

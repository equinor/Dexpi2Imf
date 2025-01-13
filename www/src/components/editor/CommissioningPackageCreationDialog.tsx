import {
  Button,
  Dialog,
  Input,
  Label,
  NativeSelect,
} from "@equinor/eds-core-react";
import HighlightColors from "../../enums/HighlightColors.ts";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import CommissioningPackage from "../../types/CommissioningPackage.ts";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import ColorPreview from "./ColorPreview.tsx";
import { addCommissioningPackage } from "../../utils/Triplestore.ts";

const ColorSelectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
`;

interface CommissioningPackageCreationDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommissioningPackageCreationDialog(
  props: CommissioningPackageCreationDialogProps,
) {
  const context = useCommissioningPackageContext();
  const [commissioningPackage, setCommissioningPackage] = useState<
    CommissioningPackage | undefined
  >();
  const [id, setId] = useState<string>("");
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<
    HighlightColors | undefined
  >();

  async function handleCreate() {
    const newPackage = {
      id: "asset:" + id,
      name: name,
      color: selectedColor!,
      boundaryIds: [],
      internalIds: [],
    };

    await addCommissioningPackage(
      newPackage.id,
      newPackage.name,
      newPackage.color,
    );

    setCommissioningPackage(newPackage);
    props.setOpen(false);
  }

  useEffect(() => {
    if (!commissioningPackage) return;
    context.setCommissioningPackages((prev) => [...prev, commissioningPackage]);
    context.setActivePackage(commissioningPackage);
  }, [commissioningPackage]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(
      HighlightColors[event.target.value as keyof typeof HighlightColors],
    );
  };
  function handleCancel() {
    setSelectedColor(undefined);
    setCommissioningPackage(undefined);
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open} isDismissable>
      <Dialog.Header>New Commissioning Package</Dialog.Header>
      <Dialog.CustomContent>
        <Label htmlFor="commissioningPackageName" label={"Package ID"} />
        <Input
          id={"commissioningPackageName"}
          placeholder={"package-id"}
          value={id}
          required
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setId(e.currentTarget.value)
          }
          variant={/^[a-z0-9-]*$/.test(id) ? "success" : "warning"}
        ></Input>
        <Label htmlFor="commissioningPackageName" label={"Display Name"} />
        <Input
          id={"commissioningPackageName"}
          placeholder={"Display name"}
          value={name}
          required
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setName(e.currentTarget.value)
          }
        ></Input>
        <ColorSelectionContainer>
          <NativeSelect
            id={"color"}
            label={"Highlight color"}
            onChange={handleChange}
          >
            <option>Select a color</option>
            {Object.keys(HighlightColors).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </NativeSelect>
          {selectedColor && <ColorPreview color={selectedColor} />}
        </ColorSelectionContainer>
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          onClick={() => handleCreate()}
          disabled={!(id && name && selectedColor)}
        >
          Create
        </Button>
        <Button variant={"ghost"} onClick={() => handleCancel()}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

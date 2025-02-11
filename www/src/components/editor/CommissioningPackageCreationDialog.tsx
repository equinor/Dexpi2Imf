import {
  Button,
  Dialog,
  Input,
  Label,
  NativeSelect,
} from "@equinor/eds-core-react";
import HighlightColors from "../../enums/HighlightColors.ts";
import styled from "styled-components";
import React, { useState } from "react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import ColorPreview from "./ColorPreview.tsx";
import { addPackageAction } from "../../utils/CommissioningPackageActions.tsx";

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
  const { dispatch } = useCommissioningPackages();
  const [id, setId] = useState<string>("");
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<
    HighlightColors | undefined
  >();

  async function handleCreate() {
    const newPackage = {
      id: "https://assetid.equinor.com/plantx#" + id,
      name: name,
      color: selectedColor!,
      boundaryNodes: [],
      internalNodes: [],
      selectedInternalNodes: [],
    };

    await addPackageAction(newPackage, dispatch);
    clearFields();
    props.setOpen(false);
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(
      HighlightColors[event.target.value as keyof typeof HighlightColors],
    );
  };
  function handleCancel() {
    clearFields();
    props.setOpen(false);
  }

  function clearFields() {
    setSelectedColor(undefined);
    setName("");
    setId("");
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

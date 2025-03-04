import { TopBar, Typography } from "@equinor/eds-core-react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import ColorPreview from "./ColorPreview.tsx";

export default function EditorTopBar() {
  const { context } = useCommissioningPackages();
  return (
    <TopBar>
      <TopBar.Header>
        <ColorPreview color={context.activePackage.color} />
        <Typography>{context.activePackage.name}</Typography>
      </TopBar.Header>
    </TopBar>
  );
}

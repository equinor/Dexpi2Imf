import { TopBar, Typography } from "@equinor/eds-core-react";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import ColorPreview from "./ColorPreview.tsx";

export default function EditorTopBar() {
  const context = useCommissioningPackageContext();
  return (
    <TopBar>
      <TopBar.Header>
        <ColorPreview color={context.activePackage.color} />
        <Typography>{context.activePackage.name}</Typography>
      </TopBar.Header>
    </TopBar>
  );
}

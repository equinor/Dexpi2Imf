import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";

export interface ClickableComponentProps {
  onClick: (
    id: string,
    context: CommissioningPackageContextProps,
    tool: Tools,
  ) => Promise<void>;
}

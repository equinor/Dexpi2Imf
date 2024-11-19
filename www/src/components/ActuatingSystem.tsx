import { ActuatingSystemProps } from "../types/diagram/ActuatingSystem.ts";
import ActuatingSystemComponent from "./ActuatingSystemComponent.tsx";

export default function ActuatingSystem(props: ActuatingSystemProps) {
  const actuatingSystemComponents = props.ActuatingSystemComponent.filter(
    (component) => component.ComponentName,
  );
  return (
    <>
      {actuatingSystemComponents.map((component, index: number) => (
        <ActuatingSystemComponent key={index} {...component} />
      ))}
    </>
  );
}

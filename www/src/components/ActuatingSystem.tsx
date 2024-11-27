import { ActuatingSystemProps } from "../types/diagram/ActuatingSystem.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import SvgElement from "./SvgElement.tsx";

export default function ActuatingSystem(props: ActuatingSystemProps) {
  const height = useContext(PandidContext).height;
  const actuatingSystemComponents = props.ActuatingSystemComponent.filter(
    (component) => component.ComponentName,
  );
  return (
    <>
      {actuatingSystemComponents.map((component, index: number) => (
        <SvgElement
          key={index}
          componentName={component.ComponentName!}
          id={component.ID}
          position={component.Position}
          text={component.GenericAttributes}
        />
      ))}
    </>
  );
}

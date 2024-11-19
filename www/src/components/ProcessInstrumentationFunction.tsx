import useNoakaDexpiSvg from "../hooks/useNoakaDexpiSvg.ts";
import CenterLine from "./CenterLine.tsx";
import {
  InformationFlowProps,
  ProcessInstrumentationFunctionProps,
} from "../types/diagram/ProcessInstrumentationFunction.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";

export default function ProcessInstrumentationFunction(
  props: ProcessInstrumentationFunctionProps,
) {
  const height = useContext(PandidContext).height;
  const informationFlows: InformationFlowProps[] = Array.isArray(
    props.InformationFlow,
  )
    ? props.InformationFlow
    : [props.InformationFlow];
  const svg = useNoakaDexpiSvg(props.ComponentName);
  return (
    <>
      {svg && (
        <g
          transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      {informationFlows &&
        informationFlows.map((infoFlow: InformationFlowProps, index: number) =>
          infoFlow && infoFlow.CenterLine ? (
            <CenterLine
              key={index}
              centerLines={[infoFlow.CenterLine]}
              isInformationFlow={true}
            />
          ) : null,
        )}
    </>
  );
}

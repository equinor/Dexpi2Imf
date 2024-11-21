import CenterLine from "./CenterLine.tsx";
import {
  InformationFlowProps,
  ProcessInstrumentationFunctionProps,
  SignalOffPageConnectorProps,
} from "../types/diagram/ProcessInstrumentationFunction.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import useSerializeSvgWithoutEdits from "../hooks/useSerializeSvgWithoutEdits.tsx";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import { GenericAttributesProps } from "../types/diagram/Common.ts";

function SignalOffPageConnector(props: SignalOffPageConnectorProps) {
  const genericAttributes: GenericAttributesProps[] = Array.isArray(
    props.SignalOffPageConnectorReference.GenericAttributes,
  )
    ? props.SignalOffPageConnectorReference.GenericAttributes
    : [props.SignalOffPageConnectorReference.GenericAttributes];
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(props.ComponentName, genericAttributes[0]);
  return (
    <>
      {svg && (
        <g
          transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </>
  );
}

export default function ProcessInstrumentationFunction(
  props: ProcessInstrumentationFunctionProps,
) {
  const height = useContext(PandidContext).height;
  const informationFlows: InformationFlowProps[] = Array.isArray(
    props.InformationFlow,
  )
    ? props.InformationFlow
    : [props.InformationFlow];
  const svg = useSerializeSvgWithoutEdits(props.ComponentName);
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
      {props.SignalOffPageConnector && (
        <SignalOffPageConnector {...props.SignalOffPageConnector} />
      )}
    </>
  );
}

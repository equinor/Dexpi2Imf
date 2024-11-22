import CenterLine from "./CenterLine.tsx";
import {
  InformationFlowProps,
  ProcessInstrumentationFunctionProps,
} from "../types/diagram/ProcessInstrumentationFunction.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import useSerializeSvgWithoutEdits from "../hooks/useSerializeSvgWithoutEdits.tsx";
import { GenericAttributesProps } from "../types/diagram/Common.ts";
import SvgElement from "./SvgElement.tsx";

export default function ProcessInstrumentationFunction(
  props: ProcessInstrumentationFunctionProps,
) {
  const height = useContext(PandidContext).height;
  const informationFlows: InformationFlowProps[] = Array.isArray(
    props.InformationFlow,
  )
    ? props.InformationFlow
    : [props.InformationFlow];

  let genericAttributes = undefined;
  if (props.SignalOffPageConnector) {
    genericAttributes = Array.isArray(
      props.SignalOffPageConnector.SignalOffPageConnectorReference
        .GenericAttributes,
    )
      ? props.SignalOffPageConnector.SignalOffPageConnectorReference
          .GenericAttributes
      : [
          props.SignalOffPageConnector.SignalOffPageConnectorReference
            .GenericAttributes,
        ];
  }

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
      {props.SignalOffPageConnector && genericAttributes && (
        <SvgElement
          height={height}
          componentName={props.SignalOffPageConnector.ComponentName}
          id={props.SignalOffPageConnector.ID}
          position={props.SignalOffPageConnector.Position}
          text={genericAttributes as GenericAttributesProps}
        />
      )}
    </>
  );
}

import { GenericAttributesProps, LabelProps } from "../types/diagram/Common.ts";
import { addTextToNozzle, serializeElement } from "../utils/SvgEdit.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.tsx";

interface NozzleLabelProps {
  label: LabelProps;
  genericAttributes: GenericAttributesProps;
}

export default function NozzleLabel(props: NozzleLabelProps) {
  const height = useContext(PandidContext).height;
  const textElement = addTextToNozzle(
    props.label,
    props.genericAttributes,
    height,
  );
  const serializedElement = serializeElement(textElement);
  return (
    <>
      {serializedElement && (
        <g
          id={props.label.ID}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: serializedElement }}
        />
      )}
    </>
  );
}

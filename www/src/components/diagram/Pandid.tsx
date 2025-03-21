import { XMLParser } from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import React, { useEffect, useRef, useState } from "react";
import ProcessInstrumentationFunction from "./ProcessInstrumentationFunction.tsx";
import { EquipmentProps, XMLProps } from "../../types/diagram/Diagram.ts";
import { PipingNetworkSystemProps } from "../../types/diagram/Piping.ts";
import { ProcessInstrumentationFunctionProps } from "../../types/diagram/ProcessInstrumentationFunction.ts";
import { ActuatingSystemProps } from "../../types/diagram/ActuatingSystem.ts";
import ActuatingSystem from "./ActuatingSystem.tsx";
import PandidContext from "../../context/PandidContext.ts";
import PipeSystem from "./piping/PipeSystem.tsx";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import styled from "styled-components";
import { preloadSVGs } from "../../utils/SvgEdit.ts";
import ZoomableSVGWrapper from "../editor/ZoomableSVGWrapper.tsx";
import { getAllPackagesAction } from "../../utils/CommissioningPackageActions.tsx";

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
`;

//TODO - remove when new graphical format implemented
export default function Pandid() {
  const { dispatch } = useCommissioningPackages();

  const [xmlData, setXmlData] = useState<XMLProps | null>(null);
  const [equipments, setEquipments] = useState<EquipmentProps[]>([]);
  const [pipingNetworkSystems, setPipingNetworkSystems] = useState<
    PipingNetworkSystemProps[]
  >([]);
  const [processInstrumentationFunction, setProcessInstrumentationFunction] =
    useState<ProcessInstrumentationFunctionProps[]>();
  const [actuatingSystem, setActuatingSystem] = useState<
    ActuatingSystemProps[]
  >([]);
  const [svgMap, setSvgMap] = useState<Map<string, Element | null>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  // Step 1: Fetch existing commissioning packages
  useEffect(() => {
    (async () => {
      await getAllPackagesAction(dispatch);
    })();
  }, []);

  // Step 2: Read XML file from disk, parse as XMLProps
  useEffect(() => {
    fetch("/DISC_EXAMPLE-02-02.xml")
      .then((response) => response.text())
      .then((data) => {
        const result = parser.parse(data) as XMLProps;
        setXmlData(result);
      });
  }, []);

  // Step 3: When XML data is loaded, set all component states
  useEffect(() => {
    if (!xmlData) return;
    setEquipments(xmlData.PlantModel.Equipment);
    setPipingNetworkSystems(xmlData.PlantModel.PipingNetworkSystem);
    setProcessInstrumentationFunction(
      xmlData.PlantModel.ProcessInstrumentationFunction,
    );
    setActuatingSystem(xmlData.PlantModel.ActuatingSystem);

    // Create map from componentName to SVG
    const initializeSvgMap = async () => {
      const preloadedMap = await preloadSVGs(xmlData);
      setSvgMap(preloadedMap);
    };
    initializeSvgMap();
  }, [xmlData]);

  return (
    <SVGContainer ref={containerRef}>
      {xmlData && (
        <PandidContext.Provider
          value={{
            height: Number(xmlData.PlantModel.Drawing.Extent.Max.Y),
            svgMap,
            setSvgMap,
          }}
        >
          {" "}
          <ZoomableSVGWrapper
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          >
            <svg
              viewBox={`${xmlData.PlantModel.Drawing.Extent.Min.X} ${xmlData.PlantModel.Drawing.Extent.Min.Y} ${xmlData.PlantModel.Drawing.Extent.Max.X} ${xmlData.PlantModel.Drawing.Extent.Max.Y}`}
              width={"100%"}
              height={"100%"}
            >
              {equipments &&
                equipments.map((equipment: EquipmentProps, index: number) => (
                  <Equipment key={index} {...equipment} />
                ))}
              {pipingNetworkSystems &&
                pipingNetworkSystems.map(
                  (
                    pipingNetworkSystem: PipingNetworkSystemProps,
                    index: number,
                  ) => <PipeSystem key={index} {...pipingNetworkSystem} />,
                )}
              {processInstrumentationFunction &&
                processInstrumentationFunction.map(
                  (
                    processInstrumentationFunction: ProcessInstrumentationFunctionProps,
                    index: number,
                  ) => (
                    <ProcessInstrumentationFunction
                      key={index}
                      {...processInstrumentationFunction}
                    />
                  ),
                )}
              {actuatingSystem &&
                actuatingSystem.map(
                  (actuatingSystem: ActuatingSystemProps, index: number) => (
                    <ActuatingSystem key={index} {...actuatingSystem} />
                  ),
                )}
            </svg>
          </ZoomableSVGWrapper>
        </PandidContext.Provider>
      )}
    </SVGContainer>
  );
}

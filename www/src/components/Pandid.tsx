import { XMLParser } from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import { useCallback, useEffect, useState } from "react";
import ProcessInstrumentationFunction from "./ProcessInstrumentationFunction.tsx";
import { EquipmentProps, XMLProps } from "../types/diagram/Diagram.ts";
import { PipingNetworkSystemProps } from "../types/diagram/Piping.ts";
import { ProcessInstrumentationFunctionProps } from "../types/diagram/ProcessInstrumentationFunction.ts";
import { ActuatingSystemProps } from "../types/diagram/ActuatingSystem.ts";
import ActuatingSystem from "./ActuatingSystem.tsx";
import PandidContext from "../context/PandidContext.ts";
import PipeSystem from "./piping/PipeSystem.tsx";
import {
  BoundaryActions,
  BoundaryParts,
  makeSparqlAndUpdateStore,
} from "../utils/Triplestore.ts";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";

export default function Pandid() {
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
  const context = useCommissioningPackageContext();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  // Read XML file from disk, parse as XMLProps (TypeScript interface)
  useEffect(() => {
    fetch("/DISC_EXAMPLE-02-02.xml")
      .then((response) => response.text())
      .then((data) => {
        const result = parser.parse(data) as XMLProps;
        setXmlData(result);
      });
  }, []);

  // When XML data is loaded, set all component states
  useEffect(() => {
    if (!xmlData) return;
    setEquipments(xmlData.PlantModel.Equipment);
    setPipingNetworkSystems(xmlData.PlantModel.PipingNetworkSystem);
    setProcessInstrumentationFunction(
      xmlData.PlantModel.ProcessInstrumentationFunction,
    );
    setActuatingSystem(xmlData.PlantModel.ActuatingSystem);
  }, [xmlData]);

  const handleAddBoundary = useCallback(
    async (id: string, action: BoundaryActions, type: BoundaryParts) => {
      context.setBorderIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
      await makeSparqlAndUpdateStore(id, action, type);
    },

    [],
  );

  return (
    <>
      {xmlData && (
        <PandidContext.Provider
          value={{
            height: xmlData.PlantModel.Drawing.Extent.Max.Y,
          }}
        >
          <svg
            viewBox={`${xmlData.PlantModel.Drawing.Extent.Min.X} ${xmlData.PlantModel.Drawing.Extent.Min.Y} ${xmlData.PlantModel.Drawing.Extent.Max.X} ${xmlData.PlantModel.Drawing.Extent.Max.Y}`}
          >
            {equipments &&
              equipments.map((equipment: EquipmentProps, index: number) => (
                <Equipment
                  key={index}
                  isInBoundary={context.borderIds.includes(equipment.ID)}
                  equipment={equipment}
                  onClick={handleAddBoundary}
                />
              ))}
            {pipingNetworkSystems &&
              pipingNetworkSystems.map(
                (piping: PipingNetworkSystemProps, index: number) => (
                  <PipeSystem key={index} {...piping} />
                ),
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
        </PandidContext.Provider>
      )}
    </>
  );
}

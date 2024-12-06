import { XMLParser } from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import { useEffect, useState } from "react";
import ProcessInstrumentationFunction from "./ProcessInstrumentationFunction.tsx";
import { EquipmentProps, XMLProps } from "../types/diagram/Diagram.ts";
import { PipingNetworkSystemProps } from "../types/diagram/Piping.ts";
import { ProcessInstrumentationFunctionProps } from "../types/diagram/ProcessInstrumentationFunction.ts";
import { ActuatingSystemProps } from "../types/diagram/ActuatingSystem.ts";
import ActuatingSystem from "./ActuatingSystem.tsx";
import PandidContext from "../context/PandidContext.ts";
import PipeSystem from "./piping/PipeSystem.tsx";
import { cleanTripleStore } from "../utils/Triplestore.ts";
import selectHandleFunction from "../utils/HandlerFunctionHelper.tsx";
import Tools from "../enums/Tools.ts";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";

interface PandidProps {
  activeTool: Tools;
}

export default function Pandid({ activeTool }: PandidProps) {
  const context = useCommissioningPackageContext();

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

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  // Step 1: Clean triplestore on mount
  useEffect(() => {
    (async () => {
      await cleanTripleStore();
      context.setCommissioningPackages([]);
    })();
    console.log("Triplestore and state cleared");
  }, []);

  // Step 2: Read XML file from disk, parse as XMLProps
  useEffect(() => {
    fetch("/DISC_EXAMPLE-02-02.xml")
      .then((response) => response.text())
      .then((data) => {
        const result = parser.parse(data) as XMLProps;
        setXmlData(result);
      });
    console.log("XML fetched and parsed");
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
    console.log("Component states set");
  }, [xmlData]);

  /*  //TODO causes many rerenders
  useEffect(() => {
    (async () => {
      const nodeIds = await getNodeIdsInCommissioningPackage();
      //TODO: This logic needs to be improved when introducing multiple commissioning packages.
      // Default package name "asset:Package1" used.
      if (context.commissioningPackages.length < 1) {
        const newPackage: CommissioningPackageProps = {
          id: "asset:Package1",
          idsInPackage: nodeIds,
        };
        context.setCommissioningPackages([newPackage]);
        context.setActivePackageId(newPackage.id);
      } else {
        context.setCommissioningPackages(
          getUpdatedCommissioningPackages(nodeIds),
        );
      }
    })();
  }, [context]);*/

  /*  const getUpdatedCommissioningPackages = (ids: string[]) => {
    return context.commissioningPackages.map((pkg) => {
      if (pkg.id === context.activePackageId) {
        const updatedPackage: CommissioningPackageProps = {
          id: "asset:Package1",
          idsInPackage: ids,
        };
        return updatedPackage;
      } else {
        return pkg;
      }
    });
  };*/

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
                  {...equipment}
                  onClick={() =>
                    selectHandleFunction(equipment.ID, context, activeTool)
                  }
                />
              ))}
            {pipingNetworkSystems &&
              pipingNetworkSystems.map(
                (
                  pipingNetworkSystem: PipingNetworkSystemProps,
                  index: number,
                ) => (
                  <PipeSystem
                    key={index}
                    {...pipingNetworkSystem}
                    onClick={() =>
                      selectHandleFunction(
                        pipingNetworkSystem.ID,
                        context,
                        activeTool,
                      )
                    }
                  />
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

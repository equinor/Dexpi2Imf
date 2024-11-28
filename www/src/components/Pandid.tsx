import { XMLParser } from "fast-xml-parser";
import Equipment from "./Equipment.tsx";
import { useCallback, useEffect, useState } from "react";
import ProcessInstrumentationFunction from "./ProcessInstrumentationFunction.tsx";
import { EquipmentProps, XMLProps } from "../types/diagram/Diagram.ts";
import { PipingComponentProps, PipingNetworkSegmentProps, PipingNetworkSystemProps } from "../types/diagram/Piping.ts";
import { ProcessInstrumentationFunctionProps } from "../types/diagram/ProcessInstrumentationFunction.ts";
import { ensureArray } from "../utils/HelperFunctions.ts";
import { ActuatingSystemProps } from "../types/diagram/ActuatingSystem.ts";
import ActuatingSystem from "./ActuatingSystem.tsx";
import PandidContext from "../context/PandidContext.ts";
import PipeSystem from "./piping/PipeSystem.tsx";
import PipeSegment from "./piping/PipeSegment.tsx";
import React from "react";
import {
  BoundaryActions,
  BoundaryParts,
  makeSparqlAndUpdateStore,
  getNodeIdsInCommissioningPackage,
  cleanTripleStore,
} from "../utils/Triplestore.ts";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";
import PipingComponent from "./piping/PipingComponent.tsx";
import { CommissioningPackageProps } from "../context/CommissioningPackageContext.tsx";

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

  //Clean triplestore on render
  useEffect(() => {
    (async () => {
      await cleanTripleStore();
      context.setCommissioningPackages([]);
      context.setboundaryIds([]);
      context.setInternalIds([]);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const nodeIds = await getNodeIdsInCommissioningPackage();
      //TODO: This logic needs to be improved when introducing multiple commissioning packages.
      // Default package name "asset:Package1" used. 
      if (context.commissioningPackages.length < 1) {
        const newPackage: CommissioningPackageProps = {
          id: "asset:Package1",
          idsInPackage: nodeIds
        }
        context.setCommissioningPackages([newPackage]);
        context.setActivePackageId(newPackage.id);
      } else {
        context.setCommissioningPackages(getUpdatedCommissioningPackages(nodeIds))
      }
    })();
  }, [context]);

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

  const handleAddInternal = useCallback(
    async (id: string, action: BoundaryActions) => {
      context.setInternalIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
      await makeSparqlAndUpdateStore(id, action, BoundaryParts.InsideBoundary);

      if (context.boundaryIds.includes(id)) {
        context.setboundaryIds(prev => prev.filter((item) => item !== id));
        await makeSparqlAndUpdateStore(id, BoundaryActions.Delete, BoundaryParts.Boundary);
      } 
    },
    [context],
  );

  const handleAddBoundary = useCallback(
    async (id: string, action: BoundaryActions) => {
      context.setboundaryIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );

      if(context.internalIds.includes(id)) {
        context.setInternalIds(prev => prev.filter((item) => item !== id));
        await makeSparqlAndUpdateStore(id, BoundaryActions.Delete, BoundaryParts.InsideBoundary);
      }

      await makeSparqlAndUpdateStore(id, action, BoundaryParts.Boundary);
    },
    [context],
  );

  useEffect(() => {
    console.log(`internals: ${context.internalIds}`);
    console.log(`boundaries: ${context.boundaryIds}`);
  }, [context.boundaryIds, context.internalIds])


  const getUpdatedCommissioningPackages = (ids: string[]) => {
    return context.commissioningPackages.map(pkg => {
      if (pkg.id === context.activePackageId) {
        const updatedPackage: CommissioningPackageProps = {
          id: "asset:Package1",
          idsInPackage: ids
        };
        return updatedPackage;
      } else {
        return pkg;
      };
    })
  };

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
                  props={equipment}
                  clickableComponent={{
                    onClick: handleAddBoundary,
                    onShiftClick: handleAddInternal,
                  }}
                />
              ))}
            {pipingNetworkSystems &&
              pipingNetworkSystems.map((pipingNetworkSystem: PipingNetworkSystemProps, index: number) => (
                <React.Fragment key={index}>
                  <PipeSystem {...pipingNetworkSystem} />

                  {ensureArray(pipingNetworkSystem.PipingNetworkSegment).map((pipingNetworkSegment: PipingNetworkSegmentProps, segmentIndex: number) => (
                    <React.Fragment key={segmentIndex}>
                      <PipeSegment {...pipingNetworkSegment} />

                      {pipingNetworkSegment.PipingComponent &&
                        ensureArray(pipingNetworkSegment.PipingComponent).map((pipingComponent: PipingComponentProps, componentIndex: number) => (
                          <PipingComponent
                            key={componentIndex}
                            props={pipingComponent}
                            clickableComponent={{
                              onClick: handleAddBoundary,
                              onShiftClick: handleAddInternal
                            }}
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            }
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

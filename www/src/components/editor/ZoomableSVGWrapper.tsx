import { TOOL_AUTO, UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import { ReactElement, RefObject, useEffect, useRef, useState } from "react";

interface ZoomableSVGWrapperProps {
  containerRef: RefObject<HTMLDivElement>;
  children: ReactElement;
}

export default function ZoomableSVGWrapper({
  containerRef,
  children,
}: ZoomableSVGWrapperProps) {
  const Viewer = useRef<UncontrolledReactSVGPanZoom>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Dynamically update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
  }, []);

  // Fit SVG to screen on mount
  useEffect(() => {
    if (Viewer.current && dimensions.width > 0 && dimensions.height > 0) {
      requestAnimationFrame(() => {
        Viewer.current!.fitToViewer();
      });
    }
  }, [dimensions]);

  return (
    <>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <UncontrolledReactSVGPanZoom
          width={dimensions.width}
          height={dimensions.height}
          background={"#FFFFFF"}
          scaleFactorMin={1}
          scaleFactorMax={10}
          tool={TOOL_AUTO}
          ref={Viewer}
          detectAutoPan={false}
          onChangeValue={() => {}}
          onChangeTool={() => {}}
          toolbarProps={{ position: "none" }}
          detectWheel={true}
        >
          {children}
        </UncontrolledReactSVGPanZoom>
      )}
    </>
  );
}

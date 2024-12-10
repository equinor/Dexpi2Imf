import styled from "styled-components";
import HighlightColors from "../../types/HighlightColors.ts";

const ColorPreview = styled.div<{ color: HighlightColors }>`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export default ColorPreview;

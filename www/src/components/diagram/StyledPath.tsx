import styled from "styled-components";

//TODO - remove when new graphical format implemented
interface StyledPathProps {
  $isDashed: boolean;
}
const StyledPath = styled.path<StyledPathProps>`
  cursor: pointer;
  stroke: #000000;
  stroke-width: 0.25;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: ${({ $isDashed }) => ($isDashed ? "1,4" : "")};
`;

export default StyledPath;

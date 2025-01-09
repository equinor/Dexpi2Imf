import Tools from "../enums/Tools.ts";

export default interface Action {
  tool: Tools | null;
  node: string;
}

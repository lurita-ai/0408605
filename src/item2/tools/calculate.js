import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

function getcalculate() {
  return new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
}

export const calculate = defineTool({
  name: "calculate",  description: "進行數學計算",
  fn: getcalculate  ,
  parameters: z.object({
expression: z
.string()
.describe("數學運算式，例如 10 + 5 * 2"),
}),
});
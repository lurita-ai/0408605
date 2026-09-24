import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";
function calculate({ expression }) {
try {
const result = eval(expression);
return result.toString();
} catch (error) {
return `計算錯誤：${error.message}`;
}
}
export const calculateTool = defineTool({
name : "calculate",
description: "進行數學計算",
fn: calculate,
parameters: z.object({
expression: z.string()
.describe("計算公式，例如 10 + 5 * 2"),

}),
});
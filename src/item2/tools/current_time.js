import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

function getCurrentTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return {
    datetime: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    formatted: formatter.format(now),
  };
}

export const currentTimeTool = defineTool({
  name: "get_current_time",
  description: "取得目前日期與時間，包含時區資訊。",
  fn: getCurrentTime,
  parameters: z.object({}).strict().describe("目前時間工具，不需要參數"),
});

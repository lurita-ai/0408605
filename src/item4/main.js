import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });
const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const TOOL_MAP = Object.fromEntries(toolList.map((tool) => [tool.name, tool]));

await initMessage(
  "你是一位旅遊達人，請用繁體中文回答。若需要，請使用工具來查詢現在時間或天氣。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "歡迎詢問有關當地時間或天氣的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    let response = await client.responses.create({
      model: "gpt-5.5",
      input: getMessages(),
      tools,
      tool_choice: "auto",
    });

    const toolCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    if (toolCalls.length > 0) {
      const functionOutputs = [];

      for (const functionCall of toolCalls) {
        const tool = TOOL_MAP[functionCall.name];
        if (!tool) {
          throw new Error(`未註冊的 tool: ${functionCall.name}`);
        }

        const args = tool.parameters.parse(JSON.parse(functionCall.arguments));
        const result = await tool.fn(args);

        functionOutputs.push({
          type: "function_call_output",
          call_id: functionCall.call_id,
          output: JSON.stringify(result),
        });
      }

      response = await client.responses.create({
        model: "gpt-5.5",
        input: [...getMessages(), ...response.output, ...functionOutputs],
        tools,
        tool_choice: "auto",
      });
    }

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}

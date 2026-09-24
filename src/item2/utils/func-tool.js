export function defineTool({ name, description, fn, parameters }) {
  return {
    name,
    description,
    fn,
    parameters,
  };
}

export function toOpenAITool(tool) {
  const rawSchema =
    typeof tool.parameters?.toJSONSchema === "function"
      ? tool.parameters.toJSONSchema()
      : tool.parameters;

  const { $schema, $id, ...cleanSchema } = rawSchema || {};

  return {
    type: "function",
    name: tool.name,
    description: tool.description,
    parameters: cleanSchema,
    strict: true,
  };
}

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { toolSchemas } from './tools/schemas.js';
import { toolHandlers } from './tools/index.js';

const server = new Server(
  { name: 'nutrizia', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Object.entries(toolSchemas).map(([name, schema]) => ({
    name,
    description: schema.description,
    inputSchema: schema.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = toolHandlers[name];
  if (!handler) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ success: false, error: { code: 404, message: `Unknown tool: ${name}` } }) }],
      isError: true,
    };
  }
  try {
    return await handler(args || {});
  } catch (e) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ success: false, error: { code: 500, message: e.message } }) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);

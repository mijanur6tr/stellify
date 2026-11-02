import 'dotenv/config';
import { getGeminiClient, STELLIFY_BRAND_SYSTEM_PROMPT } from '../src/lib/ai/gemini';
import {
  AGENT_TOOL_DECLARATIONS,
  AgentToolOutputCollector,
  executeFindProducts,
  executeGetStorePolicy,
  executeTrackOrder,
  executeBookOrder,
} from '../src/lib/ai/agent-tools';
import { getAllActivePoliciesSummary } from '../src/lib/ai/rag';

async function simulateChat(userMessage: string, history: any[] = []) {
  console.log(`\n\x1b[36m>>> USER:\x1b[0m ${userMessage}`);
  const ai = getGeminiClient();
  const modelName = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

  const collector: AgentToolOutputCollector = { products: [] };
  const policiesSummary = await getAllActivePoliciesSummary();

  history.push({ role: 'user', parts: [{ text: userMessage }] });

  const systemInstruction = `
${STELLIFY_BRAND_SYSTEM_PROMPT}

<current_published_policies>
${policiesSummary}
</current_published_policies>
`;

  let currentResponse = await ai.models.generateContent({
    model: modelName,
    contents: [...history],
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: AGENT_TOOL_DECLARATIONS }],
    },
  });

  let loopCount = 0;
  while (currentResponse.functionCalls && currentResponse.functionCalls.length > 0 && loopCount < 3) {
    loopCount++;
    const candidateContent = currentResponse.candidates?.[0]?.content;
    if (candidateContent) history.push(candidateContent);

    for (const call of currentResponse.functionCalls) {
      console.log(`\x1b[33m[TOOL CALL]\x1b[0m ${call.name} with args:`, call.args);
      let toolResult: any = {};
      if (call.name === 'find_products') {
        toolResult = await executeFindProducts(call.args as any, collector);
      } else if (call.name === 'get_store_policy') {
        toolResult = await executeGetStorePolicy(call.args as any);
      } else if (call.name === 'track_order') {
        toolResult = await executeTrackOrder(call.args as any, collector);
      } else if (call.name === 'book_order') {
        toolResult = await executeBookOrder(call.args as any, collector);
      }

      history.push({
        role: 'tool',
        parts: [{ functionResponse: { name: call.name, response: toolResult } }],
      });
    }

    currentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [...history],
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: AGENT_TOOL_DECLARATIONS }],
      },
    });
  }

  const replyText = currentResponse.text?.trim() || '';
  console.log(`\x1b[32m<<< AGENT:\x1b[0m\n${replyText}`);
  if (collector.products.length > 0) {
    console.log(`\x1b[35m[UI Products Attached]:\x1b[0m`, collector.products.map(p => p.name));
  }
  if (collector.orderCard) {
    console.log(`\x1b[32m[UI OrderCard Attached]:\x1b[0m Order #${collector.orderCard.orderNumber}, Total: ৳${collector.orderCard.total}`);
  }
  return history;
}

async function runTests() {
  console.log('--- TESTING PURE AGENT ORCHESTRATION ---');

  // Test 1: Compact policy question
  await simulateChat('how to order your products?');

  // Test 2: Product recommendation
  await simulateChat('can you show me some product for going to wedding');

  // Test 3: Booking flow step 1 (asking to place order)
  const history: any[] = [];
  await simulateChat('can you place the order for me for the indra?', history);

  // Test 4: Booking flow step 2 (providing details)
  await simulateChat('My name is Nusrat Jahan, phone 01712345678, address House 12, Road 4, Dhanmondi, Dhaka, size 2-6', history);

  process.exit(0);
}

runTests().catch(console.error);

import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, STELLIFY_BRAND_SYSTEM_PROMPT } from '@/lib/ai/gemini';
import {
  AGENT_TOOL_DECLARATIONS,
  AgentToolOutputCollector,
  executeFindProducts,
  executeGetStorePolicy,
  executeTrackOrder,
  executeBookOrder,
} from '@/lib/ai/agent-tools';
import { getAllActivePoliciesSummary } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: 'Greetings from Stellify! How may I assist your style journey today?' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();
    const modelName = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

    // Output collector for interactive UI widgets
    const collector: AgentToolOutputCollector = {
      products: [],
    };

    // Retrieve active store policies from Neon PostgreSQL via RAG
    const policiesSummary = await getAllActivePoliciesSummary();

    // Map conversation history into Gemini format
    const geminiContents: any[] = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const systemInstruction = `
${STELLIFY_BRAND_SYSTEM_PROMPT}

<current_published_policies>
${policiesSummary}
</current_published_policies>
`;

    // 1. Initial agent invocation with tools
    let currentResponse = await ai.models.generateContent({
      model: modelName,
      contents: geminiContents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: AGENT_TOOL_DECLARATIONS }],
      },
    });

    let loopCount = 0;
    const maxLoops = 3;

    // 2. Pure Agent Orchestration Loop: Execute tools when model calls them
    while (
      currentResponse.functionCalls &&
      currentResponse.functionCalls.length > 0 &&
      loopCount < maxLoops
    ) {
      loopCount++;

      // Append assistant's tool-call response to conversation
      const candidateContent = currentResponse.candidates?.[0]?.content;
      if (candidateContent) {
        geminiContents.push(candidateContent);
      }

      // Execute all called tools in this step
      const functionResponseParts: any[] = [];

      for (const call of currentResponse.functionCalls) {
        let toolResult: any = {};

        if (call.name === 'find_products') {
          toolResult = await executeFindProducts(call.args as any, collector);
        } else if (call.name === 'get_store_policy') {
          toolResult = await executeGetStorePolicy(call.args as any);
        } else if (call.name === 'track_order') {
          toolResult = await executeTrackOrder(call.args as any, collector);
        } else if (call.name === 'book_order') {
          toolResult = await executeBookOrder(call.args as any, collector);
        } else {
          toolResult = { error: `Unknown tool: ${call.name}` };
        }

        functionResponseParts.push({
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        });
      }

      // Return tool outputs to the model under 'user' role
      geminiContents.push({
        role: 'user',
        parts: functionResponseParts,
      });

      // Re-invoke model with tool execution results
      currentResponse = await ai.models.generateContent({
        model: modelName,
        contents: geminiContents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: AGENT_TOOL_DECLARATIONS }],
        },
      });
    }

    const replyText =
      currentResponse.text?.trim() ||
      'Our atelier artisans are ready to help you discover or book your handcrafted bangle set.';

    return NextResponse.json({
      reply: replyText,
      products: collector.products.length > 0 ? collector.products : undefined,
      orderCard: collector.orderCard,
      trackingCard: collector.trackingCard,
    });
  } catch (err: any) {
    console.error('Chat Agent Orchestration Error:', err);
    return NextResponse.json(
      {
        reply:
          'Warm greetings from **Stellify**! All our thread-wrapped bangles are handcrafted in Mirpur-11 with Cash on Delivery across Bangladesh. May I help you find a collection, check policies, or book an order?',
      },
      { status: 200 }
    );
  }
}

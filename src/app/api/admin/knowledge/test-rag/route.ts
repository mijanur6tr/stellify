import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeDocs } from '@/lib/ai/rag';
import { getGeminiClient, STELLIFY_BRAND_SYSTEM_PROMPT } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { query, category } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // 1. Search matching knowledge documents via RAG
    const matches = await searchKnowledgeDocs(query, category, 3);

    // 2. Generate simulated agent answer based on retrieved policies
    let generatedReply = '';
    try {
      const ai = getGeminiClient();
      const modelName = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

      const ragContext = matches
        .map((m) => `[${m.category}] ${m.title}:\n${m.content}`)
        .join('\n\n');

      const prompt = `
${STELLIFY_BRAND_SYSTEM_PROMPT}

<retrieved_company_policies>
${ragContext || 'No specific document found. Use standard store policies.'}
</retrieved_company_policies>

Customer Inquiry: "${query}"

Generate a compact, to-the-point response strictly answering this customer inquiry using the retrieved policies above. Use bold formatting for key numbers and policies.
`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      generatedReply = response.text?.trim() || '';
    } catch (aiErr: any) {
      console.warn('Gemini generation in test-rag hit rate limit, using matched excerpt fallback:', aiErr.message);
      if (matches.length > 0) {
        generatedReply = `**${matches[0].title}**\n\n${matches[0].content.trim()}`;
      } else {
        generatedReply = 'We currently offer Cash on Delivery (COD) across all 64 districts in Bangladesh with ৳70 delivery inside Dhaka and ৳130 outside Dhaka.';
      }
    }

    return NextResponse.json({
      success: true,
      query,
      matches,
      generatedReply,
    });
  } catch (err: any) {
    console.error('Test RAG failed:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to execute RAG search' },
      { status: 500 }
    );
  }
}

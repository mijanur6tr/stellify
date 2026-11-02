import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function testToolRoundtrip() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const findProductsDeclaration = {
    name: 'find_products',
    description: 'Find handcrafted bangles and accessories by query, occasion, color, or price',
    parameters: {
      type: 'OBJECT' as any,
      properties: {
        query: { type: 'STRING' as any, description: 'Search term or collection name' },
        occasion: { type: 'STRING' as any, description: 'Occasion like wedding, bridal' },
      },
    },
  };

  const contents: any[] = [
    { role: 'user', parts: [{ text: 'Can you show me bangles suitable for a wedding?' }] },
  ];

  const firstResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      tools: [{ functionDeclarations: [findProductsDeclaration] }],
    },
  });

  const modelPart = firstResponse.candidates?.[0]?.content?.parts?.[0];
  console.log('Model part:', modelPart);

  // Append assistant message with function call
  contents.push(firstResponse.candidates![0].content);

  // Append tool response
  contents.push({
    role: 'tool',
    parts: [
      {
        functionResponse: {
          name: 'find_products',
          response: {
            products: [
              { name: 'Mehrish Crimson Mirror & Pearl Bangle Set', price: 1850, slug: 'mehrish-crimson-mirror-pearl' },
              { name: 'Indra Royal Cobalt Silk Bangle Set', price: 1650, slug: 'indra-royal-cobalt-silk' },
            ],
          },
        },
      },
    ],
  });

  const secondResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      tools: [{ functionDeclarations: [findProductsDeclaration] }],
    },
  });

  console.log('Final Assistant Reply:', secondResponse.text);
}

testToolRoundtrip().catch(console.error);

import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, STELLIFY_BRAND_SYSTEM_PROMPT } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, collectionName } = await req.json();

    const ai = getGeminiClient();
    const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

    const prompt = `
${STELLIFY_BRAND_SYSTEM_PROMPT}

TASK:
You are preparing a new product listing for Stellify handcrafted thread-wrapped bangles.
Image URL: ${imageUrl || 'Silk thread bangle with artisanal accents'}
${collectionName ? `Assigned Collection: ${collectionName}` : ''}

Please analyze this handcrafted jewelry piece and generate a complete, poetic, high-luxury draft product listing in Stellify's brand voice.
Return your answer strictly in valid JSON format with this exact structure:
{
  "name": "Full evocative product title (e.g. Indra Royal Cobalt Silk Bangle Set)",
  "collection": "Suggested or assigned collection name (e.g. Indra, Gulzar, Mehrish, Sitara, etc.)",
  "price": 1650,
  "compareAtPrice": 1850,
  "stock": 12,
  "shortDescription": "1-sentence summary for catalog grid cards highlighting silk thread color and motifs",
  "description": "2-3 paragraphs of poetic, heartfelt luxury description suitable for an editorial lookbook",
  "colours": "List of primary silk thread and accent colors (e.g. Cobalt Blue, Antique Gold)",
  "materials": "List of artisanal materials (e.g. Raw Silk Thread, Seed Pearls, Zari Trims, Glass Mirrors)",
  "occasion": "Ideal occasion (e.g. Wedding, Festive Reception, Daytime Soirée)",
  "tags": "comma-separated style tags"
}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = response.text || '';
    // Extract JSON block
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, draft: parsed });
    }

    return NextResponse.json({
      success: true,
      draft: {
        name: 'Handcrafted Artisanal Silk Bangle Set',
        collection: collectionName || 'Gulzar',
        price: 1650,
        compareAtPrice: 1850,
        stock: 10,
        shortDescription: 'Woven with pure silk threads, accented with delicate handcrafted trims.',
        description: 'Each bangle carries a story of its own, shaped by hands that know patience.',
        colours: 'Warm Gold, Silk Navy',
        materials: 'Silk Thread, Brass Leaf Accents',
        occasion: 'Festive & Bridal',
        tags: 'handcrafted, silk, bangles',
      },
    });
  } catch (err: any) {
    console.error('AI Listing Error:', err);
    return NextResponse.json({ error: err.message || 'AI analysis failed' }, { status: 500 });
  }
}

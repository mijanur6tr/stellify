import { prisma } from '@/lib/db/prisma';

export interface KnowledgeMatch {
  id: string;
  title: string;
  category: string;
  content: string;
  snippet: string;
  score: number;
}

/**
 * Searches published company policies, sizing guides, craft notes, and brand knowledge
 * using hybrid semantic scoring (category weight + token overlap + snippet extraction).
 */
export async function searchKnowledgeDocs(
  query: string,
  category?: string,
  limit: number = 3
): Promise<KnowledgeMatch[]> {
  try {
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery
      .split(/[\s,?.!-]+/)
      .filter((t) => t.length > 2);

    // Fetch all published knowledge docs from Neon PostgreSQL
    const docs = await prisma.knowledgeDoc.findMany({
      where: {
        isPublished: true,
        ...(category && category !== 'ALL'
          ? { category: { equals: category, mode: 'insensitive' } }
          : {}),
      },
    });

    if (!docs || docs.length === 0) {
      return [];
    }

    // Score each document
    const scored = docs.map((doc) => {
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      const categoryLower = doc.category.toLowerCase();

      let score = 0;

      // Category relevance match
      if (
        (cleanQuery.includes('policy') || cleanQuery.includes('delivery') || cleanQuery.includes('shipping') || cleanQuery.includes('payment') || cleanQuery.includes('cod')) &&
        doc.category === 'POLICY'
      ) {
        score += 40;
      }
      if (
        (cleanQuery.includes('size') || cleanQuery.includes('sizing') || cleanQuery.includes('measurement') || cleanQuery.includes('fit') || cleanQuery.includes('diameter')) &&
        doc.category === 'SIZING'
      ) {
        score += 40;
      }
      if (
        (cleanQuery.includes('care') || cleanQuery.includes('wash') || cleanQuery.includes('clean') || cleanQuery.includes('perfume') || cleanQuery.includes('water') || cleanQuery.includes('storage')) &&
        doc.category === 'CRAFT'
      ) {
        score += 40;
      }
      if (
        (cleanQuery.includes('story') || cleanQuery.includes('about') || cleanQuery.includes('contact') || cleanQuery.includes('atelier') || cleanQuery.includes('location') || cleanQuery.includes('address')) &&
        (doc.category === 'BRAND_STORY' || doc.category === 'FAQ')
      ) {
        score += 40;
      }

      // Exact title match bonus
      if (titleLower.includes(cleanQuery)) {
        score += 35;
      }

      // Token overlap scoring
      queryTokens.forEach((token) => {
        if (titleLower.includes(token)) score += 15;
        if (categoryLower.includes(token)) score += 10;
        const matches = (contentLower.match(new RegExp(token, 'g')) || []).length;
        score += Math.min(matches * 3, 25);
      });

      // Extract most relevant excerpt / snippet
      let snippet = doc.content.substring(0, 300);
      for (const token of queryTokens) {
        const idx = contentLower.indexOf(token);
        if (idx !== -1) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(doc.content.length, idx + 200);
          snippet = (start > 0 ? '...' : '') + doc.content.substring(start, end).trim() + (end < doc.content.length ? '...' : '');
          break;
        }
      }

      return {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        snippet,
        score,
      };
    });

    // Sort by score descending and return top matches
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (err) {
    console.error('Error searching knowledge docs:', err);
    return [];
  }
}

/**
 * Indexes a knowledge doc into EmbeddingChunk records for granular RAG retrieval.
 */
export async function syncKnowledgeDocChunks(doc: {
  id: string;
  title: string;
  category: string;
  content: string;
}): Promise<void> {
  try {
    // Delete existing chunks for this doc
    await prisma.embeddingChunk.deleteMany({
      where: {
        entityType: 'KNOWLEDGE_DOC',
        entityId: doc.id,
      },
    });

    // Split content into paragraph chunks
    const paragraphs = doc.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

    for (let i = 0; i < paragraphs.length; i++) {
      const chunkText = paragraphs[i];
      await prisma.embeddingChunk.create({
        data: {
          entityType: 'KNOWLEDGE_DOC',
          entityId: doc.id,
          title: `${doc.title} (Part ${i + 1})`,
          chunkText,
          metadata: {
            category: doc.category,
            chunkIndex: i,
          },
        },
      });
    }
  } catch (err) {
    console.warn('Failed to sync embedding chunks for doc:', doc.id, err);
  }
}

/**
 * Retrieves formatted policy text of all active policies for AI prompt injection.
 */
export async function getAllActivePoliciesSummary(): Promise<string> {
  try {
    const docs = await prisma.knowledgeDoc.findMany({
      where: { isPublished: true },
      orderBy: { category: 'asc' },
    });

    if (!docs || docs.length === 0) {
      return `
- Payment: Cash on Delivery (COD) ONLY across all 64 districts in Bangladesh.
- Delivery Charge: Inside Dhaka is ৳70 (2-3 business days), Outside Dhaka is ৳130 (3-5 business days).
- Sizing: Standard sizes 2-4 (2.25 in), 2-6 (2.375 in), 2-8 (2.50 in). Custom sizes: 2-2, 2-10 upon request.
- Atelier: House-47/1, Road-15/1, Block-C, Mirpur-11, Dhaka | 01644-711161.
      `.trim();
    }

    return docs
      .map(
        (d) =>
          `[Category: ${d.category}] **${d.title}**:\n${d.content.trim()}`
      )
      .join('\n\n');
  } catch (err) {
    console.warn('Failed to load active policies summary:', err);
    return 'Cash on Delivery only across Bangladesh. Delivery: ৳70 inside Dhaka, ৳130 outside Dhaka.';
  }
}

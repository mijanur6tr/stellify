import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { syncKnowledgeDocChunks } from '@/lib/ai/rag';

export async function GET() {
  try {
    const docs = await prisma.knowledgeDoc.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = docs.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      content: d.content,
      isPublished: d.isPublished,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, documents: formatted });
  } catch (err: any) {
    console.error('Failed to fetch knowledge docs:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch knowledge docs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, content, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Document title and content are required' },
        { status: 400 }
      );
    }

    const doc = await prisma.knowledgeDoc.create({
      data: {
        title: title.trim(),
        category: (category || 'POLICY').toUpperCase(),
        content: content.trim(),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    // Sync RAG chunks
    await syncKnowledgeDocChunks(doc);

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        content: doc.content,
        isPublished: doc.isPublished,
      },
    });
  } catch (err: any) {
    console.error('Failed to create knowledge doc:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create knowledge doc' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, category, content, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (category !== undefined) updateData.category = category.toUpperCase();
    if (content !== undefined) updateData.content = content.trim();
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

    const updated = await prisma.knowledgeDoc.update({
      where: { id },
      data: updateData,
    });

    // Sync RAG chunks
    await syncKnowledgeDocChunks(updated);

    return NextResponse.json({
      success: true,
      document: {
        id: updated.id,
        title: updated.title,
        category: updated.category,
        content: updated.content,
        isPublished: updated.isPublished,
      },
    });
  } catch (err: any) {
    console.error('Failed to update knowledge doc:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update knowledge doc' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Delete associated chunks
    await prisma.embeddingChunk.deleteMany({
      where: {
        entityType: 'KNOWLEDGE_DOC',
        entityId: id,
      },
    });

    // Delete doc
    await prisma.knowledgeDoc.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    console.error('Failed to delete knowledge doc:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete knowledge doc' },
      { status: 500 }
    );
  }
}

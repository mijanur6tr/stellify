import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const collection = searchParams.get('collection');
    const occasion = searchParams.get('occasion');
    const query = searchParams.get('q');

    const where: any = {
      isPublished: true,
    };

    if (collection && collection !== 'all') {
      where.collection = { slug: collection };
    }

    if (occasion && occasion !== 'all') {
      where.occasion = { contains: occasion, mode: 'insensitive' };
    }

    if (query && query.trim()) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { collection: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        collection: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      collection: p.collection.name,
      collectionSlug: p.collection.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      image: p.images[0]?.url || `/products/${p.collection.slug}.jpg`,
      colours: p.colours,
      occasion: p.occasion,
      materials: p.materials,
      shortDescription: p.shortDescription,
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (err: any) {
    console.error('Failed to fetch public products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

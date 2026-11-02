import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
      sku: p.sku,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock,
      isPublished: p.isPublished,
      isFeatured: p.isFeatured,
      collection: p.collection.name,
      collectionSlug: p.collection.slug,
      colours: p.colours,
      materials: p.materials,
      occasion: p.occasion,
      shortDescription: p.shortDescription,
      image: p.images[0]?.url || `/products/${p.collection.slug}.jpg`,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (err: any) {
    console.error('Failed to fetch admin products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      collectionName,
      price,
      compareAtPrice,
      stock,
      shortDescription,
      description,
      colours,
      materials,
      occasion,
      tags,
      imageUrl,
    } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Product name and price are required' }, { status: 400 });
    }

    // Find or create collection
    const targetCollectionName = collectionName || 'Gulzar';
    const targetCollectionSlug = targetCollectionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const collection = await prisma.collection.upsert({
      where: { slug: targetCollectionSlug },
      update: { name: targetCollectionName },
      create: {
        name: targetCollectionName,
        slug: targetCollectionSlug,
        description: `Handcrafted ${targetCollectionName} thread-wrapped bangle collection`,
        coverImage: imageUrl || '/products/gulzar.jpg',
      },
    });

    // Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const sku = `STL-${targetCollectionSlug.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const coloursArray = Array.isArray(colours)
      ? colours
      : typeof colours === 'string'
      ? colours.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Gold'];

    const materialsArray = Array.isArray(materials)
      ? materials
      : typeof materials === 'string'
      ? materials.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Silk Thread', 'Gold Accents'];

    const createdProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        shortDescription: shortDescription || `${name} handcrafted with soul.`,
        description: description || 'Each bangle carries a story of its own, shaped by hands that know patience.',
        price,
        compareAtPrice: compareAtPrice || null,
        stock: stock || 12,
        isPublished: true,
        isFeatured: false,
        colours: coloursArray,
        materials: materialsArray,
        occasion: occasion || 'Festive & Elegant',
        collectionId: collection.id,
        images: {
          create: {
            url: imageUrl || '/products/cream whirl.jpg',
            altText: name,
            sortOrder: 0,
            isPrimary: true,
          },
        },
      },
      include: {
        collection: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: createdProduct.id,
        name: createdProduct.name,
        slug: createdProduct.slug,
        price: Number(createdProduct.price),
        collection: createdProduct.collection.name,
      },
    });
  } catch (err: any) {
    console.error('Failed to create product:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPublished, stock, price, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (price !== undefined) updateData.price = Number(price);
    if (name !== undefined) updateData.name = name.trim();

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      product: {
        id: updated.id,
        name: updated.name,
        isPublished: updated.isPublished,
        stock: updated.stock,
        price: Number(updated.price),
      },
    });
  } catch (err: any) {
    console.error('Failed to update product:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted from atelier catalog' });
  } catch (err: any) {
    console.error('Failed to delete product:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete product' }, { status: 500 });
  }
}

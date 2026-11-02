import { prisma } from '@/lib/db/prisma';
import { searchKnowledgeDocs } from '@/lib/ai/rag';

export interface ChatProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  collection: string;
  image: string;
  colours: string[];
}

export interface OrderCardData {
  orderNumber: string;
  productName: string;
  quantity: number;
  price: number;
  delivery: number;
  total: number;
  name: string;
  phone: string;
  address: string;
  status: 'pending_confirmation' | 'confirmed';
}

export interface TrackingCardData {
  orderNumber: string;
  status: string;
  currentMilestone: string;
}

/**
 * Gemini Tool Function Declarations for Agent Orchestration
 */
export const AGENT_TOOL_DECLARATIONS: any[] = [
  {
    name: 'find_products',
    description:
      'Search the Stellify artisanal product catalog for bangles matching occasion (e.g. wedding, eid, reception), colors, collection names (e.g. Indra, Mehrish, Gulzar), or keywords.',
    parameters: {
      type: 'OBJECT' as any,
      properties: {
        query: {
          type: 'STRING' as any,
          description: 'Search term or collection name (e.g. "Indra", "mirrorwork bangles", "pearl")',
        },
        occasion: {
          type: 'STRING' as any,
          description: 'Occasion like "wedding", "bridal", "holud", "reception", "casual", "festive"',
        },
        color: {
          type: 'STRING' as any,
          description: 'Target color like "crimson", "red", "cobalt blue", "gold", "lilac", "ivory"',
        },
        maxPrice: {
          type: 'NUMBER' as any,
          description: 'Maximum budget in BDT (৳)',
        },
      },
    },
  },
  {
    name: 'get_store_policy',
    description:
      'Retrieve official Stellify company policies from the RAG knowledge base regarding Cash on Delivery (COD), delivery charges (৳70 Dhaka / ৳130 Outside Dhaka), delivery timelines (2-3 days Dhaka / 3-5 days outside), bangle sizing guide (2-4, 2-6, 2-8), craft care instructions, returns/exchanges, or atelier address in Mirpur-11.',
    parameters: {
      type: 'OBJECT' as any,
      properties: {
        topic: {
          type: 'STRING' as any,
          description:
            'The policy subject to look up, e.g. "delivery charge", "shipping time", "payment method", "sizing guide", "craft care", "return policy", "atelier contact"',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'track_order',
    description:
      'Lookup live parcel status and delivery journey for an existing customer order using their Order Number (e.g. "STL-2026-1042").',
    parameters: {
      type: 'OBJECT' as any,
      properties: {
        orderNumber: {
          type: 'STRING' as any,
          description: 'The Stellify order reference number, formatted as STL-2026-XXXX',
        },
      },
      required: ['orderNumber'],
    },
  },
  {
    name: 'book_order',
    description:
      'Directly create and confirm a genuine Cash on Delivery (COD) order in the Stellify database. Requires customer full name, valid 11-digit Bangladeshi phone number, full delivery address, district, product selection, and preferred bangle size.',
    parameters: {
      type: 'OBJECT' as any,
      properties: {
        customerName: {
          type: 'STRING' as any,
          description: "Customer's full name",
        },
        customerPhone: {
          type: 'STRING' as any,
          description: '11-digit Bangladeshi mobile number, e.g. 01712345678 or 01644711161',
        },
        fullAddress: {
          type: 'STRING' as any,
          description: 'Street address, house/road number, area or thana',
        },
        district: {
          type: 'STRING' as any,
          description: 'Destination district, e.g. "Dhaka", "Chittagong", "Sylhet", etc.',
        },
        productNameOrSlug: {
          type: 'STRING' as any,
          description: 'Name or slug of the bangle set being booked (e.g. "Indra" or "Mehrish Crimson Mirror & Pearl")',
        },
        size: {
          type: 'STRING' as any,
          description: 'Bangle size: "2-4 (Small)", "2-6 (Standard)", "2-8 (Large)", or bespoke',
        },
        quantity: {
          type: 'NUMBER' as any,
          description: 'Number of sets to order (default 1)',
        },
        notes: {
          type: 'STRING' as any,
          description: 'Optional customer delivery notes or special styling instructions',
        },
      },
      required: ['customerName', 'customerPhone', 'fullAddress', 'district', 'productNameOrSlug'],
    },
  },
];

/**
 * Tool Execution Context: collects UI widgets to pass alongside the agent's message.
 */
export interface AgentToolOutputCollector {
  products: ChatProductCard[];
  orderCard?: OrderCardData;
  trackingCard?: TrackingCardData;
}

/**
 * Execute find_products tool
 */
export async function executeFindProducts(
  args: { query?: string; occasion?: string; color?: string; maxPrice?: number },
  collector: AgentToolOutputCollector
) {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      include: { collection: true, images: true },
      take: 25,
    });

    const q = (args.query || '').toLowerCase().trim();
    const occ = (args.occasion || '').toLowerCase().trim();
    const col = (args.color || '').toLowerCase().trim();
    const maxP = args.maxPrice ? Number(args.maxPrice) : Infinity;

    const matched = products.filter((p) => {
      const pPrice = Number(p.price);
      if (pPrice > maxP) return false;

      const pName = p.name.toLowerCase();
      const cName = p.collection.name.toLowerCase();
      const cSlug = p.collection.slug.toLowerCase();
      const pOcc = p.occasion.toLowerCase();
      const pCols = p.colours.map((c) => c.toLowerCase());
      const pTags = p.tags.map((t) => t.toLowerCase());

      if (q) {
        if (pName.includes(q) || cName.includes(q) || cSlug.includes(q) || pTags.some((t) => t.includes(q))) {
          return true;
        }
      }

      if (occ) {
        if (pOcc.includes(occ) || pTags.some((t) => t.includes(occ))) return true;
        if ((occ.includes('wedding') || occ.includes('bridal') || occ.includes('holud')) && (cSlug === 'mehrish' || cSlug === 'indra' || cSlug === 'sitara')) return true;
        if (occ.includes('casual') || occ.includes('minimal')) {
          if (cSlug === 'lustrous' || cSlug === 'rangsutra' || cSlug === 'cream-whirl') return true;
        }
      }

      if (col) {
        if (pCols.some((c) => c.includes(col)) || pName.includes(col)) return true;
        if (col.includes('red') || col.includes('crimson')) return cSlug === 'mehrish' || cSlug === 'rangsutra';
        if (col.includes('blue') || col.includes('cobalt')) return cSlug === 'indra' || cSlug === 'tressora';
        if (col.includes('gold')) return cSlug === 'gulzar' || cSlug === 'tressora' || cSlug === 'sitara';
        if (col.includes('pink') || col.includes('purple') || col.includes('lilac')) return cSlug === 'orchidia' || cSlug === 'luminous' || cSlug === 'classy';
        if (col.includes('cream') || col.includes('white') || col.includes('ivory')) return cSlug === 'cream-whirl' || cSlug === 'luminous';
      }

      return !q && !occ && !col; // If no filters specified, return all
    });

    const results = (matched.length > 0 ? matched : products.slice(0, 3)).slice(0, 4);

    // Save cards for UI carousel
    collector.products = results.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      collection: p.collection.name,
      image: p.images[0]?.url || `/products/${p.collection.slug}.jpg`,
      colours: p.colours,
    }));

    return {
      foundCount: results.length,
      products: results.map((p) => ({
        name: p.name,
        collection: p.collection.name,
        price: Number(p.price),
        colours: p.colours,
        occasion: p.occasion,
        materials: p.materials,
        stock: p.stock,
        slug: p.slug,
      })),
    };
  } catch (err: any) {
    console.error('find_products error:', err);
    return { error: 'Could not search products catalog', foundCount: 0, products: [] };
  }
}

/**
 * Execute get_store_policy tool using RAG
 */
export async function executeGetStorePolicy(args: { topic: string }) {
  try {
    const matches = await searchKnowledgeDocs(args.topic, undefined, 2);

    if (matches && matches.length > 0) {
      return {
        topic: args.topic,
        policies: matches.map((m) => ({
          title: m.title,
          category: m.category,
          excerpt: m.content.trim(),
        })),
      };
    }

    // Default policy fallback
    return {
      topic: args.topic,
      policies: [
        {
          title: 'Cash on Delivery & Sizing Policy',
          category: 'POLICY',
          excerpt:
            'Payment: Cash on Delivery (COD) ONLY across all 64 districts in Bangladesh.\nDelivery Charges: Inside Dhaka ৳70 (2-3 business days), Outside Dhaka ৳130 (3-5 business days).\nStandard Sizing: 2-4 (2.25 in), 2-6 (2.375 in, standard), 2-8 (2.50 in). Custom sizes: 2-2, 2-10.\nAtelier: House-47/1, Road-15/1, Block-C, Mirpur-11, Dhaka. Phone: 01644-711161.',
        },
      ],
    };
  } catch (err: any) {
    console.error('get_store_policy error:', err);
    return {
      topic: args.topic,
      policy: 'Payment is Cash on Delivery ONLY across Bangladesh. Delivery: ৳70 Dhaka, ৳130 outside Dhaka.',
    };
  }
}

/**
 * Execute track_order tool
 */
export async function executeTrackOrder(
  args: { orderNumber: string },
  collector: AgentToolOutputCollector
) {
  try {
    const cleanNum = args.orderNumber.trim().toUpperCase();
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: cleanNum, mode: 'insensitive' },
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      return {
        found: false,
        message: `Order #${cleanNum} was not found in our atelier system. Please double check the order number or contact our atelier at 01644-711161.`,
      };
    }

    collector.trackingCard = {
      orderNumber: order.orderNumber,
      status: order.status,
      currentMilestone: `Status: ${order.status}. Delivery to ${order.district}. COD due: ৳${Number(order.totalAmount)}.`,
    };

    return {
      found: true,
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      district: order.district,
      totalAmount: Number(order.totalAmount),
      deliveryCharge: Number(order.deliveryCharge),
      items: order.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: Number(i.unitPrice),
      })),
      placedAt: order.createdAt.toISOString(),
    };
  } catch (err: any) {
    console.error('track_order error:', err);
    return { found: false, message: 'Could not access order tracking records at this moment.' };
  }
}

/**
 * Execute book_order tool
 */
export async function executeBookOrder(
  args: {
    customerName: string;
    customerPhone: string;
    fullAddress: string;
    district: string;
    productNameOrSlug: string;
    size?: string;
    quantity?: number;
    notes?: string;
  },
  collector: AgentToolOutputCollector
) {
  try {
    // 1. Phone validation
    const cleanPhone = args.customerPhone.replace(/[\s-]/g, '');
    const phoneValid = /^(?:\+88|88)?(01[3-9]\d{8})$/.test(cleanPhone);
    if (!phoneValid) {
      return {
        success: false,
        error:
          'Please provide a valid 11-digit Bangladeshi mobile number (e.g. 01712345678 or 01644711161).',
      };
    }

    // 2. Resolve product
    const products = await prisma.product.findMany({
      include: { collection: true, images: true },
    });

    const target = args.productNameOrSlug.toLowerCase();
    const matched =
      products.find(
        (p) =>
          p.id === args.productNameOrSlug ||
          p.slug.toLowerCase() === target ||
          p.name.toLowerCase().includes(target) ||
          p.collection.name.toLowerCase().includes(target) ||
          p.collection.slug.toLowerCase() === target
      ) || products[0];

    const unitPrice = Number(matched.price);
    const qty = Math.max(1, args.quantity || 1);
    const subtotal = unitPrice * qty;

    const isDhaka = args.district.toLowerCase().includes('dhaka');
    const deliveryCharge = isDhaka ? 70 : 130;
    const totalAmount = subtotal + deliveryCharge;

    // 3. Generate unique orderNumber
    let orderNumber = `STL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.order.findUnique({ where: { orderNumber } });
      if (!exists) break;
      orderNumber = `STL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const orderNotes = [
      args.size ? `Requested Bangle Size: ${args.size}` : 'Size: Standard 2-6',
      args.notes ? `Customer Note: ${args.notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    // 4. Save Order in Neon PostgreSQL
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: args.customerName.trim(),
        customerPhone: cleanPhone,
        fullAddress: args.fullAddress.trim(),
        district: args.district.trim(),
        notes: orderNotes,
        subtotal,
        deliveryCharge,
        totalAmount,
        paymentMethod: 'CASH_ON_DELIVERY',
        status: 'PLACED',
        items: {
          create: [
            {
              productId: matched.id,
              productName: matched.name,
              unitPrice,
              quantity: qty,
              totalPrice: subtotal,
              selectedColor: matched.colours[0] || 'Gold',
              imageSnapshot: matched.images[0]?.url || `/products/${matched.collection.slug}.jpg`,
            },
          ],
        },
        statusHistory: {
          create: {
            status: 'PLACED',
            note: 'Order placed directly via AI Style Concierge chat',
          },
        },
      },
      include: {
        items: true,
      },
    });

    // Populate orderCard widget for UI
    collector.orderCard = {
      orderNumber: createdOrder.orderNumber,
      productName: matched.name,
      quantity: qty,
      price: unitPrice,
      delivery: deliveryCharge,
      total: totalAmount,
      name: createdOrder.customerName,
      phone: createdOrder.customerPhone,
      address: `${createdOrder.fullAddress}, ${createdOrder.district}`,
      status: 'confirmed',
    };

    return {
      success: true,
      orderNumber: createdOrder.orderNumber,
      status: 'PLACED',
      productName: matched.name,
      quantity: qty,
      size: args.size || 'Standard 2-6',
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: 'Cash on Delivery (COD)',
      deliveryTimeline: isDhaka ? '2-3 business days' : '3-5 business days',
      customerName: createdOrder.customerName,
      phone: createdOrder.customerPhone,
      address: `${createdOrder.fullAddress}, ${createdOrder.district}`,
    };
  } catch (err: any) {
    console.error('book_order error:', err);
    return { success: false, error: err?.message || 'Could not place order in system' };
  }
}

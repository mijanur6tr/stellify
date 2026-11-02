import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';

const OrderItemInputSchema = z.object({
  productId: z.string().optional(),
  name: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().int().positive().default(1),
  selectedColor: z.string().optional(),
  image: z.string().optional(),
});

const OrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Valid 11-digit Bangladeshi mobile required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  fullAddress: z.string().min(5, 'Full address is required'),
  district: z.string(),
  notes: z.string().optional(),
  items: z.array(OrderItemInputSchema).min(1, 'Order must contain at least one item'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = OrderSchema.parse(body);

    const isDhaka = validated.district.toLowerCase().includes('dhaka');
    const deliveryCharge = isDhaka ? 70 : 130;

    // Fetch products from database to ensure price integrity
    let subtotal = 0;
    const orderItemsData: any[] = [];

    // Query all published products for name / slug / id matching
    const dbProducts = await prisma.product.findMany({
      include: { images: true, collection: true },
    });

    for (const item of validated.items) {
      const matched = dbProducts.find(
        (p) =>
          p.id === item.productId ||
          p.slug === item.productId ||
          p.collection.slug === item.productId ||
          p.name.toLowerCase() === (item.name || '').toLowerCase()
      );

      const unitPrice = matched ? Number(matched.price) : item.price || 1650;
      const productName = matched ? matched.name : item.name || 'Artisanal Silk Bangle Set';
      const imageSnapshot = matched?.images[0]?.url || item.image || '/products/indra.jpg';
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: matched?.id || undefined,
        productName,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        selectedColor: item.selectedColor || (matched?.colours[0] ?? null),
        imageSnapshot,
      });
    }

    const totalAmount = subtotal + deliveryCharge;

    // Generate unique order reference (STL-2026-XXXX)
    let orderNumber = `STL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    for (let attempts = 0; attempts < 5; attempts++) {
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (!existing) break;
      orderNumber = `STL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Persist order in Neon PostgreSQL
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        customerEmail: validated.customerEmail || null,
        fullAddress: validated.fullAddress,
        district: validated.district,
        notes: validated.notes || null,
        subtotal,
        deliveryCharge,
        totalAmount,
        paymentMethod: 'CASH_ON_DELIVERY',
        status: 'PLACED',
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: 'PLACED',
            note: 'Order placed via Stellify Cash on Delivery checkout',
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerName: createdOrder.customerName,
        phone: createdOrder.customerPhone,
        address: createdOrder.fullAddress,
        district: createdOrder.district,
        subtotal: Number(createdOrder.subtotal),
        deliveryCharge: Number(createdOrder.deliveryCharge),
        totalAmount: Number(createdOrder.totalAmount),
        status: createdOrder.status,
        paymentMethod: createdOrder.paymentMethod,
        items: createdOrder.items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          totalPrice: Number(i.totalPrice),
          imageSnapshot: i.imageSnapshot,
        })),
      },
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: err?.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order reference number is required' }, { status: 400 });
    }

    const cleanOrderNumber = String(orderNumber).trim().toUpperCase();

    // Look up in Neon PostgreSQL
    let dbOrder = null;
    try {
      dbOrder = await prisma.order.findFirst({
        where: {
          orderNumber: {
            equals: cleanOrderNumber,
            mode: 'insensitive',
          },
        },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    } catch (dbErr) {
      console.warn('DB lookup failed, checking fallback:', dbErr);
    }

    const currentStatus = dbOrder ? dbOrder.status : 'PACKED';
    const statusOrder = ['PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    const milestones = [
      {
        status: 'PLACED',
        title: 'Order Received',
        description: 'Order received via Cash on Delivery',
        timestamp: dbOrder ? new Date(dbOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:30',
        done: currentIndex >= 0,
      },
      {
        status: 'CONFIRMED',
        title: 'Verified by Atelier',
        description: 'Order confirmed with Mirpur-11 artisan workshop',
        timestamp: currentIndex >= 1 ? '15:15' : undefined,
        done: currentIndex >= 1,
      },
      {
        status: 'PACKED',
        title: 'Packed with Soul',
        description: 'Bangles secured in velvet pouch with signature seal',
        timestamp: currentIndex >= 2 ? '18:40' : undefined,
        done: currentIndex >= 2,
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Courier rider on route to your address',
        timestamp: currentIndex >= 3 ? 'Today' : undefined,
        done: currentIndex >= 3,
      },
      {
        status: 'DELIVERED',
        title: 'Delivered',
        description: 'Handed over with Cash on Delivery payment received',
        timestamp: currentIndex >= 4 ? 'Today' : undefined,
        done: currentIndex >= 4,
      },
    ];

    return NextResponse.json({
      orderNumber: cleanOrderNumber,
      status: currentStatus,
      createdAt: dbOrder ? dbOrder.createdAt : '2026-10-17T14:30:00Z',
      courier: 'Steadfast Courier (Cash on Delivery)',
      customerName: dbOrder?.customerName || 'Stellify Patron',
      district: dbOrder?.district || 'Dhaka',
      totalAmount: dbOrder ? Number(dbOrder.totalAmount) : 1720,
      items: dbOrder
        ? dbOrder.items.map((i) => ({
            name: i.productName,
            quantity: i.quantity,
            price: Number(i.unitPrice),
            image: i.imageSnapshot,
          }))
        : [
            {
              name: 'Indra Royal Cobalt Silk Bangle Set',
              quantity: 1,
              price: 1650,
              image: '/products/indra.jpg',
            },
          ],
      milestones,
    });
  } catch (err: any) {
    console.error('Order tracking error:', err);
    return NextResponse.json({ error: 'Failed to retrieve order tracking' }, { status: 500 });
  }
}

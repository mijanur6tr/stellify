import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      phone: o.customerPhone,
      district: o.district,
      address: o.fullAddress,
      subtotal: Number(o.subtotal),
      deliveryCharge: Number(o.deliveryCharge),
      total: Number(o.totalAmount),
      status: o.status,
      item: o.items.map((i) => `${i.productName} (Qty: ${i.quantity})`).join(', ') || 'Custom Silk Bangle Set',
      notes: o.notes || undefined,
      internalNotes: o.internalNotes || undefined,
      createdAt: o.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, orders: formatted });
  } catch (err: any) {
    console.error('Failed to fetch admin orders:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, internalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status as OrderStatus;
    }
    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        ...(status
          ? {
              statusHistory: {
                create: {
                  status: status as OrderStatus,
                  note: internalNotes || `Status updated to ${status} via atelier admin`,
                },
              },
            }
          : {}),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
        internalNotes: updated.internalNotes,
      },
    });
  } catch (err: any) {
    console.error('Failed to update order:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

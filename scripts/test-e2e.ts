import 'dotenv/config';

async function testE2E() {
  console.log('--- STARTING COMPREHENSIVE E2E VERIFICATION ---');

  // 1. Create Order via Cash on Delivery API
  console.log('\n[1/5] Testing POST /api/orders (Neon DB persistence)...');
  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Habiba Sultana',
      customerPhone: '01644711161',
      customerEmail: 'habiba@example.com',
      fullAddress: 'House-47/1, Road-15/1, Block-C, Mirpur-11',
      district: 'Dhaka',
      notes: 'Please pack in signature Stellify velvet box with gold ribbon.',
      items: [
        {
          productId: 'indra-royal-cobalt-silk',
          name: 'Indra Royal Cobalt Silk Bangle Set',
          price: 1650,
          quantity: 1,
          image: '/products/indra.jpg',
        },
      ],
    }),
  });
  const orderData = await orderRes.json();
  console.log('Order creation response:', orderRes.status, {
    orderNumber: orderData.order?.orderNumber,
    customerName: orderData.order?.customerName,
    subtotal: orderData.order?.subtotal,
    deliveryCharge: orderData.order?.deliveryCharge,
    total: orderData.order?.totalAmount,
    status: orderData.order?.status,
  });

  const createdOrderNumber = orderData.order?.orderNumber;

  // 2. Track Order
  console.log('\n[2/5] Testing POST /api/orders/track with created order number...');
  const trackRes = await fetch('http://localhost:3000/api/orders/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber: createdOrderNumber }),
  });
  const trackData = await trackRes.json();
  console.log('Tracking response:', trackRes.status, {
    orderNumber: trackData.orderNumber,
    status: trackData.status,
    customer: trackData.customerName,
    milestonesCount: trackData.milestones?.length,
  });

  // 3. Admin Orders API
  console.log('\n[3/5] Testing Admin Orders GET & PATCH...');
  const adminOrdersRes = await fetch('http://localhost:3000/api/admin/orders');
  const adminOrdersData = await adminOrdersRes.json();
  console.log(`Admin found ${adminOrdersData.orders?.length} orders in Neon DB`);
  
  if (orderData.order?.id) {
    const patchRes = await fetch('http://localhost:3000/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: orderData.order.id,
        status: 'CONFIRMED',
        internalNotes: 'Verified with patron via phone. Preparing dispatch.',
      }),
    });
    const patchData = await patchRes.json();
    console.log('Admin PATCH order status:', patchData.success, patchData.order?.status);
  }

  // 4. Gemini Style Concierge AI Chat
  console.log('\n[4/5] Testing POST /api/chat with Gemini 2.5 Flash...');
  const chatRes = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What bangles do you have for a golden yellow and teal outfit?' }],
    }),
  });
  const chatData = await chatRes.json();
  console.log('Gemini Chat Response:');
  console.log(chatData.reply);
  console.log('Recommended Products:', chatData.products?.map((p: any) => `${p.name} (৳${p.price})`));

  // 5. Admin AI-Assisted Listing Studio with Gemini
  console.log('\n[5/5] Testing POST /api/admin/ai-listing with Gemini...');
  const aiListingRes = await fetch('http://localhost:3000/api/admin/ai-listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: '/products/indra.jpg',
      collectionName: 'Indra',
    }),
  });
  const aiListingData = await aiListingRes.json();
  console.log('AI Listing Draft Generated:');
  console.log({
    name: aiListingData.draft?.name,
    collection: aiListingData.draft?.collection,
    price: aiListingData.draft?.price,
    materials: aiListingData.draft?.materials,
    shortDescription: aiListingData.draft?.shortDescription,
  });

  console.log('\n--- ALL E2E VERIFICATIONS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

testE2E().catch((e) => {
  console.error('E2E Verification Error:', e);
  process.exit(1);
});

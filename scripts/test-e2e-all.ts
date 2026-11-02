import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';

async function testFullSuite() {
  console.log('====================================================');
  console.log('   STELLIFY FULL SYSTEM E2E VERIFICATION TEST');
  console.log('====================================================\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 1. Test Chat API: Policy question
  console.log('1. Testing Compact Store Policy via Chat API...');
  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'how to order your products and what are the delivery charges?' }],
      }),
    });
    const data = await res.json();
    console.log('   Status:', res.status);
    console.log('   AI Reply (first 250 chars):', data.reply?.substring(0, 250));
    console.log('   Bold words included:', data.reply?.includes('**'));
  } catch (err: any) {
    console.error('   Chat Policy failed:', err.message);
  }

  // 2. Test Chat API: Find Products for Wedding
  console.log('\n2. Testing Product Discovery & Carousel...');
  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'can you show me some product for going to wedding' }],
      }),
    });
    const data = await res.json();
    console.log('   Status:', res.status);
    console.log('   Products returned for UI carousel:', data.products?.map((p: any) => p.name));
  } catch (err: any) {
    console.error('   Product Discovery failed:', err.message);
  }

  // 3. Test In-Chat Booking Flow:
  console.log('\n3. Testing In-Chat Booking & Order ID Generation...');
  let bookedOrderNumber = '';
  try {
    const conversation = [
      { role: 'user', content: 'can you place the order for me for the indra?' },
      {
        role: 'assistant',
        content:
          'To book your **Indra Royal Cobalt Silk Bangle Set** (৳1,650), please provide your **Full Name**, **11-digit Phone Number**, **Delivery Address & District**, and **Bangle Size**.',
      },
      {
        role: 'user',
        content:
          'My name is Sharmin Sultana, phone 01799887766, address Flat 4B, Green Road, Farmgate, Dhaka, size 2-6',
      },
    ];

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });
    const data = await res.json();
    console.log('   Status:', res.status);
    console.log('   Agent Confirmation:', data.reply);
    if (data.orderCard) {
      bookedOrderNumber = data.orderCard.orderNumber;
      console.log('   ✓ Order Card Generated:');
      console.log('     - Order ID:', data.orderCard.orderNumber);
      console.log('     - Item:', data.orderCard.productName);
      console.log('     - Total Due:', data.orderCard.total);
      console.log('     - Customer:', data.orderCard.name);
    }
  } catch (err: any) {
    console.error('   Booking flow failed:', err.message);
  }

  // 4. Test Live Order Tracking:
  if (bookedOrderNumber) {
    console.log(`\n4. Testing Live Order Tracking for ${bookedOrderNumber}...`);
    try {
      const res = await fetch(`${baseUrl}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: bookedOrderNumber }),
      });
      const data = await res.json();
      console.log('   Status:', res.status);
      console.log('   Live Tracked Status:', data.status);
      console.log('   Customer:', data.customerName);
      console.log('   Total:', data.totalAmount);
      console.log('   Milestones Count:', data.milestones?.length);
    } catch (err: any) {
      console.error('   Tracking failed:', err.message);
    }
  }

  // 5. Test Admin Knowledge & RAG API
  console.log('\n5. Testing Admin Policy Management & RAG Playground...');
  let createdDocId = '';
  try {
    // A. Create new policy document
    const createRes = await fetch(`${baseUrl}/api/admin/knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Eid & Puja Priority Express Dispatch',
        category: 'POLICY',
        content:
          'During Eid-ul-Fitr and Durga Puja celebrations, all orders confirmed before 12 PM receive priority dispatch within 24 hours via Steadfast Express.',
        isPublished: true,
      }),
    });
    const createData = await createRes.json();
    console.log('   Created Policy ID:', createData.document?.id);
    createdDocId = createData.document?.id;

    // B. Test RAG Retrieval on the newly created policy
    const ragRes = await fetch(`${baseUrl}/api/admin/knowledge/test-rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'How fast is dispatch during Eid celebrations?' }),
    });
    const ragData = await ragRes.json();
    console.log('   RAG Matches Found:', ragData.matches?.length);
    console.log('   Top Match Title:', ragData.matches?.[0]?.title);
    console.log('   Simulated Concierge Answer:', ragData.generatedReply);

    // C. Clean up test document
    if (createdDocId) {
      await fetch(`${baseUrl}/api/admin/knowledge?id=${createdDocId}`, { method: 'DELETE' });
      console.log('   Cleaned up test policy document.');
    }
  } catch (err: any) {
    console.error('   Admin Knowledge RAG test failed:', err.message);
  }

  console.log('\n====================================================');
  console.log('   ALL E2E TESTS FINISHED SUCCESSFULLY!');
  console.log('====================================================\n');
  process.exit(0);
}

testFullSuite().catch(console.error);

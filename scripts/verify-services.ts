import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';

async function verifyAll() {
  console.log('--- VERIFYING CONFIGURATION & SERVICES ---');
  
  // 1. Neon Database
  try {
    const colCount = await prisma.collection.count();
    const prodCount = await prisma.product.count();
    const kbCount = await prisma.knowledgeDoc.count();
    console.log(`[Neon DB]: Connected successfully!`);
    console.log(`  - Collections: ${colCount}`);
    console.log(`  - Products: ${prodCount}`);
    console.log(`  - Knowledge Docs: ${kbCount}`);
  } catch (error: any) {
    console.error(`[Neon DB]: Connection or query failed:`, error?.message || error);
  }

  // 2. Gemini AI
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Gemini AI]: GEMINI_API_KEY is not set');
    } else {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Say "Stellify AI is operational" in 5 words or less.',
      });
      console.log(`[Gemini AI]: Connected successfully! Response:`, response.text?.trim());
    }
  } catch (error: any) {
    console.error(`[Gemini AI]: Call failed:`, error?.message || error);
  }

  // 3. Cloudinary
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const ping = await cloudinary.api.ping();
    console.log(`[Cloudinary]: Connected successfully! Ping:`, ping);
  } catch (error: any) {
    console.error(`[Cloudinary]: Ping failed:`, error?.message || error);
  }
  
  process.exit(0);
}

verifyAll();

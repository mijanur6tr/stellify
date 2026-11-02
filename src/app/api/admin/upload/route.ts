import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await storageService.uploadImage(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json(
      { error: err.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, RotateCcw, Check, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewProductListingPage() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = React.useState<string>('/products/cream whirl.jpg');
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [publishError, setPublishError] = React.useState<string | null>(null);

  // AI draft form state
  const [formData, setFormData] = React.useState({
    name: 'Cream Whirl Artisanal Silk Bangle Set',
    collection: 'Cream Whirl',
    price: 1650,
    compareAtPrice: 1850,
    stock: 12,
    shortDescription:
      'Cream and ivory thread-wrapped bangles with delicate golden swirls and seed pearls.',
    description:
      'Subtle, understated elegance for timeless styling. Spun with ivory silk and accented with handcrafted golden whorls and delicate seed pearls. Each bangle carries a story of its own, shaped by hands that know patience.',
    colours: 'Cream, Ivory, Gold',
    materials: 'Ivory Silk Thread, Golden Spiral Wire, Seed Pearls',
    occasion: 'Daytime Elegance & Family Celebrations',
    tags: 'minimalist, ivory, cream-whirl, wedding',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadForm,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setSelectedImage(data.url);
      } else {
        alert(data.error || 'Failed to upload image to Cloudinary');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Network error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunAiVisionAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/admin/ai-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage,
          collectionName: formData.collection,
        }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setFormData((prev) => ({
          ...prev,
          ...data.draft,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setPublishError(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          collectionName: formData.collection,
          price: formData.price,
          compareAtPrice: formData.compareAtPrice,
          stock: formData.stock,
          shortDescription: formData.shortDescription,
          description: formData.description,
          colours: formData.colours,
          materials: formData.materials,
          occasion: formData.occasion,
          tags: formData.tags,
          imageUrl: selectedImage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      } else {
        setPublishError(data.error || 'Failed to publish product');
      }
    } catch (err: any) {
      console.error('Publish error:', err);
      setPublishError(err.message || 'Failed to publish product');
    } finally {
      setIsPublishing(false);
    }
  };

  const sampleImages = [
    { label: 'Cream Whirl', url: '/products/cream whirl.jpg' },
    { label: 'Gulzar', url: '/products/gulzar.jpg' },
    { label: 'Indra', url: '/products/indra.jpg' },
    { label: 'Mehrish', url: '/products/mehrish.jpg' },
    { label: 'Sitara', url: '/products/sitara.jpg' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#FAF7F2]/60 hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div>
        <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
          AI-Assisted Listing Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
          Create New <span className="italic text-[#C5A059]">Bangle Listing</span>
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-1 font-light">
          Upload or choose product photography. Gemini Vision analyzes the textures, materials, and colors to draft specifications in Stellify&apos;s quiet luxury brand voice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Selector & AI Trigger */}
        <div className="lg:col-span-5 bg-[#071326] border border-[#162B4C] p-6 rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#FAF7F2]">1. Product Photography</h3>
            <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-sans text-[#C5A059] hover:underline">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-[#C5A059]/30 bg-[#050B16]">
            <Image
              src={selectedImage}
              alt="Selected Product"
              fill
              className="object-cover object-center"
            />
          </div>

          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D4C9BA] block mb-2 font-medium">
              Choose Atelier Photo
            </span>
            <div className="grid grid-cols-5 gap-2">
              {sampleImages.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-[#C5A059] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.label} fill sizes="60px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#162B4C]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleRunAiVisionAnalysis}
              isLoading={isAnalyzing}
              className="w-full gap-2 shadow-[0_0_20px_rgba(197,160,89,0.15)]"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Draft Specs with Gemini Vision</span>
            </Button>
            <span className="text-[11px] text-[#FAF7F2]/50 font-sans block text-center mt-2">
              Auto-fills title, descriptions, colours, materials, and price in brand voice.
            </span>
          </div>
        </div>

        {/* Right Column: Editable Draft Form */}
        <div className="lg:col-span-7 bg-[#071326] border border-[#162B4C] p-6 sm:p-8 rounded-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#162B4C] mb-6">
            <h3 className="font-serif text-xl text-[#FAF7F2]">2. Verified Product Details</h3>
            <button
              type="button"
              onClick={handleRunAiVisionAnalysis}
              className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-sans"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Draft</span>
            </button>
          </div>

          {publishError && (
            <div className="p-3 mb-4 rounded-sm bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {publishError}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-5">
            <Input
              label="Listing Title *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                  Collection *
                </label>
                <select
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Gulzar">Gulzar</option>
                  <option value="Indra">Indra</option>
                  <option value="Mehrish">Mehrish</option>
                  <option value="Sitara">Sitara</option>
                  <option value="Orchidia">Orchidia</option>
                  <option value="Cream Whirl">Cream Whirl</option>
                  <option value="Lustrous">Lustrous</option>
                  <option value="Luminous">Luminous</option>
                  <option value="Classy">Classy</option>
                  <option value="Rangsutra">Rangsutra</option>
                  <option value="Tressora">Tressora</option>
                </select>
              </div>

              <Input
                label="Occasion"
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Price (৳ BDT) *"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <Input
                label="Compare Price"
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
              />
              <Input
                label="Inventory Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                Short Description (Catalog Cards)
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                Poetic Brand Narrative (Product Page)
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-xs text-[#FAF7F2] leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Thread Colours"
                value={formData.colours}
                onChange={(e) => setFormData({ ...formData, colours: e.target.value })}
              />
              <Input
                label="Materials Breakdown"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              />
            </div>

            <div className="pt-6 border-t border-[#162B4C] flex items-center justify-between">
              <span className="text-xs text-[#FAF7F2]/50 font-sans">
                Product will automatically embed into pgvector upon publishing.
              </span>

              <Button type="submit" size="lg" isLoading={isPublishing} className="gap-2">
                {success ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Published to Atelier!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Publish Bangle Set</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

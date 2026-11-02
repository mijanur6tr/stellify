import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const collections = [
  {
    name: 'Gulzar',
    slug: 'gulzar',
    description: 'Warm cocoa threads wrapped in earthy texture, crowned with delicate brushed gold leaf motifs.',
    story: 'Gulzar reflects the quiet poetry of autumn soil and brushed morning gold, balancing organic warmth with handcrafted poise.',
    coverImage: '/products/gulzar.jpg',
    isFeatured: true,
    sortOrder: 1,
    products: [
      {
        name: 'Gulzar Brushed Gold & Cocoa Bangle Set',
        slug: 'gulzar-brushed-gold-cocoa',
        sku: 'STL-GUL-01',
        shortDescription: 'Warm cocoa threads with brushed gold leaf motifs and raw textured edges.',
        description: 'Warm cocoa threads wrapped in natural texture. Finished with brushed gold leaf motifs and laser-edged rosettes. A handcrafted bangle built on pure craftsmanship, tactile and made for everyday luxury.',
        price: 1750,
        compareAtPrice: 1950,
        stock: 15,
        materials: ['Raw Silk Thread', 'Brushed Brass Leaf Accents', 'Textured Zari'],
        occasion: 'Festive & Elegant Daytime',
        colours: ['Cocoa Brown', 'Antique Gold'],
        tags: ['bestseller', 'earthy', 'handcrafted', 'gulzar'],
        isFeatured: true,
        image: '/products/gulzar.jpg',
      },
    ],
  },
  {
    name: 'Indra',
    slug: 'indra',
    description: 'Cobalt silk threads scattered with small white blossoms, pearl trims, and gold accents.',
    story: 'Indra channels royal midnight blues and celestial white blooms. Each piece is spun with pure silk threads, honoring timeless Bengali craftsmanship.',
    coverImage: '/products/indra.jpg',
    isFeatured: true,
    sortOrder: 2,
    products: [
      {
        name: 'Indra Royal Cobalt Silk Bangle Set',
        slug: 'indra-royal-cobalt-silk',
        sku: 'STL-IND-01',
        shortDescription: 'Cobalt silk threads with delicate white flowers, seed pearls, and gold-leaf lace.',
        description: 'Cobalt silk threads scattered with small white flowers and pearl trim. This handcrafted set reads as considered rather than decorative: the mark of deliberate, artisanal craftsmanship.',
        price: 1650,
        compareAtPrice: 1850,
        stock: 12,
        materials: ['Royal Blue Silk', 'Micro White Ceramic Flowers', 'Faux Pearls', 'Gold Cord'],
        occasion: 'Wedding & Evening Reception',
        colours: ['Cobalt Blue', 'White', 'Gold'],
        tags: ['signature', 'wedding', 'blue', 'indra'],
        isFeatured: true,
        image: '/products/indra.jpg',
      },
    ],
  },
  {
    name: 'Mehrish',
    slug: 'mehrish',
    description: 'Deep crimson threads enriched with mirror work and pearl clusters for grand celebrations.',
    story: 'Mehrish brings bridal warmth and festive splendor into sharp focus with reflective glass mirror inlays and delicate pearl edging.',
    coverImage: '/products/mehrish.jpg',
    isFeatured: true,
    sortOrder: 3,
    products: [
      {
        name: 'Mehrish Crimson Mirror & Pearl Bangle Set',
        slug: 'mehrish-crimson-mirror-pearl',
        sku: 'STL-MEH-01',
        shortDescription: 'Crimson silk thread bangles embellished with authentic mirrorwork and ivory pearl clusters.',
        description: 'Woven with rich crimson silk and traditional mirrorwork (aabhla) bordered by micro-pearl strings. Captures festive luminescence effortlessly.',
        price: 1850,
        compareAtPrice: 2100,
        stock: 10,
        materials: ['Crimson Silk Thread', 'Mirror Accents', 'Ivory Pearl Clusters'],
        occasion: 'Bridal & Holud',
        colours: ['Crimson Red', 'Ivory', 'Gold'],
        tags: ['bridal', 'festive', 'red', 'mehrish'],
        isFeatured: true,
        image: '/products/mehrish.jpg',
      },
    ],
  },
  {
    name: 'Sitara',
    slug: 'sitara',
    description: 'Rich magenta threads with intricate zardozi embroidery and antique metallic highlights.',
    story: 'Named after the stars, Sitara celebrates twilight celebrations with deep jewel tones and shimmering metallic cord embroidery.',
    coverImage: '/products/sitara.jpg',
    isFeatured: true,
    sortOrder: 4,
    products: [
      {
        name: 'Sitara Magenta Zardozi Silk Bangle Set',
        slug: 'sitara-magenta-zardozi',
        sku: 'STL-SIT-01',
        shortDescription: 'Fuchsia silk threads adorned with intricate golden zardozi embroidery motifs.',
        description: 'Crafted with fine magenta silk and delicate metallic threadwork. Designed to complement rich georgette and silk sarees.',
        price: 1600,
        compareAtPrice: 1800,
        stock: 8,
        materials: ['Magenta Silk Thread', 'Metallic Zardozi Cord', 'Gold Sequins'],
        occasion: 'Festive & Party Wear',
        colours: ['Magenta', 'Gold'],
        tags: ['festive', 'zardozi', 'sitara'],
        isFeatured: true,
        image: '/products/sitara.jpg',
      },
    ],
  },
  {
    name: 'Orchidia',
    slug: 'orchidia',
    description: 'Pastel lilac silk bangles with delicate micro-pearl and stone botanicals.',
    story: 'Orchidia is quiet poetry in soft lavender, inspired by dew-touched petals and gentle morning light.',
    coverImage: '/products/orchidia.jpg',
    isFeatured: true,
    sortOrder: 5,
    products: [
      {
        name: 'Orchidia Lilac Floral Bangle Set',
        slug: 'orchidia-lilac-floral',
        sku: 'STL-ORC-01',
        shortDescription: 'Pastel lilac silk wrap with handcrafted botanical stone accents and pearl trim.',
        description: 'A delicate pastel statement in soft lavender and ivory beads. Lightweight, poetic, and effortlessly refined.',
        price: 1550,
        compareAtPrice: 1750,
        stock: 14,
        materials: ['Lavender Silk Thread', 'Soft Glass Crystals', 'Pearl Trim'],
        occasion: 'Daytime Soirée & Eid',
        colours: ['Lavender', 'Ivory'],
        tags: ['pastel', 'delicate', 'orchidia'],
        isFeatured: true,
        image: '/products/orchidia.jpg',
      },
    ],
  },
  {
    name: 'Lustrous',
    slug: 'lustrous',
    description: 'Champagne-toned natural thread wrap adorned with polished stones and geometric accents.',
    story: 'Lustrous combines raw champagne silk with geometric metallic studs, creating a modern artisanal rhythm.',
    coverImage: '/products/lustrous.jpg',
    isFeatured: false,
    sortOrder: 6,
    products: [
      {
        name: 'Lustrous Champagne Geometric Bangle Set',
        slug: 'lustrous-champagne-geometric',
        sku: 'STL-LUS-01',
        shortDescription: 'Natural champagne thread wrap with polished diamond-cut stones and floral studs.',
        description: 'This set of handcrafted bangles features a beautifully textured, natural-toned thread wrap, adorned with polished stones and delicate floral motifs.',
        price: 1700,
        compareAtPrice: 1900,
        stock: 11,
        materials: ['Champagne Thread', 'Polished Acrylic Stones', 'Metallic Studs'],
        occasion: 'Reception & Contemporary Chic',
        colours: ['Champagne', 'Cream', 'Gold'],
        tags: ['neutral', 'contemporary', 'lustrous'],
        isFeatured: true,
        image: '/products/lustrous.jpg',
      },
    ],
  },
  {
    name: 'Luminous',
    slug: 'luminous',
    description: 'Pristine off-white threads accented with delicate pink oval beads and floral bead clusters.',
    story: 'Luminous evokes pure serenity with crisp ivory silk and candy-pink oval beads resembling cherry blossom buds.',
    coverImage: '/products/luminous.jpg',
    isFeatured: false,
    sortOrder: 7,
    products: [
      {
        name: 'Luminous Ivory & Pink Floral Bangle Set',
        slug: 'luminous-ivory-pink',
        sku: 'STL-LUM-01',
        shortDescription: 'Off-white thread-wrapped bangles with delicate pink oval beads and floral bead clusters.',
        description: 'Crafted for gentle grace, this set pairs crisp ivory silk thread with hand-sewn pink bead clusters.',
        price: 1500,
        compareAtPrice: 1650,
        stock: 16,
        materials: ['Off-White Silk Thread', 'Pastel Pink Oval Beads', 'Bead Clusters'],
        occasion: 'Casual Elegance & Gifting',
        colours: ['Off-White', 'Soft Pink'],
        tags: ['gentle', 'pink', 'luminous'],
        isFeatured: false,
        image: '/products/luminous.jpg',
      },
    ],
  },
  {
    name: 'Classy',
    slug: 'classy',
    description: 'Deep violet and soft lavender silk wrap with starburst silver/gold accents.',
    story: 'Classy plays with gradient purple depths, marrying rich plum tones with celestial starburst inlays.',
    coverImage: '/products/classy.jpg',
    isFeatured: false,
    sortOrder: 8,
    products: [
      {
        name: 'Classy Violet Starburst Bangle Set',
        slug: 'classy-violet-starburst',
        sku: 'STL-CLA-01',
        shortDescription: 'Deep violet silk thread with silver-toned floral and starburst embellishments.',
        description: 'An elegant set featuring contrasting shades of deep violet and soft lavender, adorned with starburst embellishments.',
        price: 1650,
        compareAtPrice: 1850,
        stock: 9,
        materials: ['Deep Violet Silk', 'Silver Studs', 'Lavender Thread'],
        occasion: 'Evening Gatherings',
        colours: ['Violet', 'Lavender', 'Silver'],
        tags: ['purple', 'starburst', 'classy'],
        isFeatured: false,
        image: '/products/classy.jpg',
      },
    ],
  },
  {
    name: 'Rangsutra',
    slug: 'rangsutra',
    description: 'A bold, statement trio of bangles in crimson and black criss-cross thread geometry.',
    story: 'Rangsutra represents modern boldness: sharp contrast, tactile criss-cross weaving, and edgy black stud accents.',
    coverImage: '/products/rangsutra.jpg',
    isFeatured: false,
    sortOrder: 9,
    products: [
      {
        name: 'Rangsutra Crimson & Noir Criss-Cross Bangle Set',
        slug: 'rangsutra-crimson-noir',
        sku: 'STL-RAN-01',
        shortDescription: 'A trio of bold statement bangles featuring crimson red thread and black criss-cross cord.',
        description: 'Designed to captivate with intricate detailing and contrasting textures. Hand-knotted criss-cross patterns over rich red silk.',
        price: 1450,
        compareAtPrice: 1600,
        stock: 15,
        materials: ['Crimson Thread', 'Black Cord', 'Noir Studs'],
        occasion: 'Modern Fusion & Casual Statement',
        colours: ['Crimson Red', 'Black'],
        tags: ['bold', 'geometric', 'rangsutra'],
        isFeatured: false,
        image: '/products/rangsutra.jpg',
      },
    ],
  },
  {
    name: 'Tressora',
    slug: 'tressora',
    description: 'Peacock teal and mustard golden silk thread bangles with repeating geometric patterns.',
    story: 'Tressora combines vibrant aquatic teal with warm golden yellow silk, evoking traditional geometric hand-weaving.',
    coverImage: '/products/tressora.jpg',
    isFeatured: false,
    sortOrder: 10,
    products: [
      {
        name: 'Tressora Peacock Teal & Gold Bangle Set',
        slug: 'tressora-teal-gold',
        sku: 'STL-TRE-01',
        shortDescription: 'Vibrant teal and golden yellow silk threads with rhythmic chevron stitching and rhinestone studs.',
        description: 'A pair of handcrafted bright teal and golden yellow silk thread bangles, embellished with repeating geometric patterns.',
        price: 1550,
        compareAtPrice: 1750,
        stock: 12,
        materials: ['Peacock Teal Silk', 'Golden Yellow Silk', 'Rhinestone Studs'],
        occasion: 'Festive Celebrations & Mehendi',
        colours: ['Peacock Teal', 'Golden Yellow'],
        tags: ['vibrant', 'teal', 'tressora'],
        isFeatured: false,
        image: '/products/tressora.jpg',
      },
    ],
  },
  {
    name: 'Cream Whirl',
    slug: 'cream-whirl',
    description: 'Pristine ivory and warm cream thread wrap with delicate golden spirals and micro-pearl accents.',
    story: 'Cream Whirl celebrates quiet minimalism, blending rich cream silk with fine metallic thread swirls.',
    coverImage: '/products/cream whirl.jpg',
    isFeatured: true,
    sortOrder: 11,
    products: [
      {
        name: 'Cream Whirl Artisanal Silk Bangle Set',
        slug: 'cream-whirl-artisanal-silk',
        sku: 'STL-CRW-01',
        shortDescription: 'Cream and ivory thread-wrapped bangles with delicate golden swirls and seed pearls.',
        description: 'Subtle, understated elegance for timeless styling. Spun with ivory silk and accented with handcrafted golden whorls.',
        price: 1650,
        compareAtPrice: 1850,
        stock: 10,
        materials: ['Ivory Silk Thread', 'Golden Spiral Wire', 'Seed Pearls'],
        occasion: 'Daytime Elegance & Family Celebrations',
        colours: ['Cream', 'Ivory', 'Gold'],
        tags: ['minimalist', 'ivory', 'cream-whirl'],
        isFeatured: true,
        image: '/products/cream whirl.jpg',
      },
    ],
  },
];

const knowledgeDocs = [
  {
    title: 'Cash on Delivery and Shipping Policy',
    category: 'POLICY',
    content: `
# Delivery & Payment Policy
- **Payment Method**: We accept **Cash on Delivery (COD) ONLY** across all 64 districts in Bangladesh. Customers pay in cash when the parcel is handed to them by the courier delivery agent.
- **Delivery Charges**:
  - Inside Dhaka: ৳70
  - Outside Dhaka (all other districts): ৳130
- **Delivery Timeline**:
  - Inside Dhaka: 2 to 3 business days.
  - Outside Dhaka: 3 to 5 business days.
- **Courier Partners**: Steadfast Courier and Pathao.
- **Verification**: You will receive a phone confirmation before dispatch.
    `,
  },
  {
    title: 'Bangle Sizing Guide',
    category: 'SIZING',
    content: `
# Stellify Bangle Sizing Guide
Our bangles follow standard Bangladeshi jewelry sizing:
- **Size 2-4 (Small)**: Inner diameter 2.25 inches (57.2 mm). Ideal for petite wrists.
- **Size 2-6 (Medium)**: Inner diameter 2.375 inches (60.3 mm). Our standard, most common size.
- **Size 2-8 (Large)**: Inner diameter 2.50 inches (63.5 mm). Comfortable for broader wrists.
- **Custom Sizing**: If you need size 2-2 or 2-10, please mention it in the order notes or chat with us.
    `,
  },
  {
    title: 'Artisanal Craft & Care Instructions',
    category: 'CRAFT',
    content: `
# Handcrafted Care & Longevity
Each Stellify bangle is delicately thread-wrapped by skilled artisans:
- **Keep Away from Water**: Do not immerse bangles in water or wear while washing hands/bathing.
- **Perfume & Sprays**: Apply perfumes, lotions, and hairsprays before putting on your bangles.
- **Storage**: Store inside the provided Stellify velvet pouch or a moisture-free jewelry box to preserve thread sheen and stone polish.
    `,
  },
  {
    title: 'Brand Story & Philosophy',
    category: 'BRAND_STORY',
    content: `
# Stellify: Handcrafted with Soul
"Let your style speak uniquely!"
Stellify was born out of love for Bengali artisanal heritage and modern, quiet luxury.
Each bangle carries a story of its own, shaped by hands that know patience, poured into gold that never rushes itself.
This is not just metal. This is memory wrapped around a wrist, quiet in its glow, loud in its meaning.
Studio Address: House-47/1, Road-15/1, Block-C, Mirpur-11, Dhaka, Bangladesh.
Phone: 01644-711161 | Email: habibanipa94@gmail.com | Instagram: @_stellify_official
    `,
  },
];

export async function main() {
  console.log('🌱 Starting Stellify database seed...');

  // 1. Seed Collections and Products
  for (const colData of collections) {
    const { products, ...colFields } = colData;

    const collection = await prisma.collection.upsert({
      where: { slug: colFields.slug },
      update: colFields,
      create: colFields,
    });

    console.log(`✓ Collection: ${collection.name}`);

    for (const prodData of products) {
      const { image, ...productDetails } = prodData;
      const product = await prisma.product.upsert({
        where: { slug: productDetails.slug },
        update: {
          ...productDetails,
          collectionId: collection.id,
        },
        create: {
          ...productDetails,
          collectionId: collection.id,
        },
      });

      // Primary product image
      await prisma.productImage.deleteMany({
        where: { productId: product.id },
      });

      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: image,
          altText: product.name,
          sortOrder: 0,
          isPrimary: true,
        },
      });

      console.log(`  └─ Product: ${product.name} (৳${product.price})`);
    }
  }

  // 2. Seed Knowledge Documents
  for (const doc of knowledgeDocs) {
    const existing = await prisma.knowledgeDoc.findFirst({
      where: { title: doc.title },
    });

    if (existing) {
      await prisma.knowledgeDoc.update({
        where: { id: existing.id },
        data: doc,
      });
    } else {
      await prisma.knowledgeDoc.create({
        data: doc,
      });
    }
    console.log(`✓ KnowledgeDoc: ${doc.title}`);
  }

  console.log('✅ Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

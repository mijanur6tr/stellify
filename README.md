# Stellify

Stellify is a full-stack storefront for a Bangladeshi boutique specialising in handcrafted thread-wrapped bangles and accessories. The application combines a customer shopping experience with guest carts, favourites, checkout, order tracking, an atelier administration area, and an AI-powered style concierge.

## Features

- Browse featured collections and published products.
- View product details, materials, colours, occasions, pricing, and stock.
- Maintain a guest cart and favourites without requiring customer accounts.
- Place cash-on-delivery orders across Bangladesh.
- Track orders using an order number and customer phone number.
- Manage products, product images, orders, and knowledge documents from the admin area.
- Generate or enrich product listings with Gemini.
- Answer product, policy, sizing, and order questions with the Gemini style concierge and retrieval-augmented knowledge.
- Upload product images to Cloudinary, with a local `public/uploads` fallback for development.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router and Turbopack
- React 19 and TypeScript
- Tailwind CSS 4
- PostgreSQL with [Prisma](https://www.prisma.io/)
- Gemini through `@google/genai`
- Cloudinary for optional image storage
- `jose` for cookie/JWT utilities
- Zod for request validation

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Google Gemini API key for chat and AI listing features
- A Cloudinary account only if remote image storage is needed

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://localhost:5432/stellify?sslmode=require"

# Gemini
GEMINI_API_KEY="your-gemini-api-key"
# Optional; defaults to gemini-2.5-flash
GEMINI_CHAT_MODEL="gemini-2.5-flash"

# Authentication signing secret
AUTH_SECRET="replace-with-a-long-random-secret"

# Image storage
# Omit this or use another value to store files in public/uploads during development.
STORAGE_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Do not commit `.env` or expose any of these values in client-side code.

`DATABASE_URL`, `GEMINI_API_KEY`, and `AUTH_SECRET` should be configured for a complete deployment. If Cloudinary is not fully configured, the application automatically uses local storage under `public/uploads`.

### 3. Prepare the database

Apply the Prisma schema to the configured PostgreSQL database:

```bash
npx prisma db push
```

Load the sample catalog and knowledge data:

```bash
npm run seed
```

The seed command runs `prisma/seed.ts`. Run it only when you want to create or refresh the seed data for your environment.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Execute the Prisma seed script |

## Application routes

### Customer experience

| Route | Purpose |
| --- | --- |
| `/` | Brand home page and featured content |
| `/shop` | Product catalogue |
| `/products/[slug]` | Product details |
| `/favourites` | Guest favourites |
| `/checkout` | Checkout and cash-on-delivery order placement |
| `/order-tracking` | Order status lookup |

### Administration

| Route | Purpose |
| --- | --- |
| `/admin/login` | Atelier management login |
| `/admin` | Dashboard |
| `/admin/products` | Product management |
| `/admin/products/new` | Create a product and upload images |
| `/admin/orders` | Review and update orders |
| `/admin/knowledge` | Manage AI knowledge documents and test RAG responses |

The corresponding API handlers are under `src/app/api`. Customer APIs include products, orders, order tracking, and chat; admin APIs include products, orders, uploads, AI listing, and knowledge documents.

## Project structure

```text
prisma/
  schema.prisma       Database models and relations
  seed.ts             Seed catalog and knowledge data
public/               Static assets and local upload destination
src/app/              App Router pages and API route handlers
src/components/       Reusable UI, layout, chat, and page sections
src/context/          Client-side store state for cart and favourites
src/lib/ai/           Gemini client, tools, and retrieval logic
src/lib/auth/         JWT and password utilities
src/lib/db/           Prisma client setup
src/lib/storage/      Cloudinary and local storage implementations
scripts/              Service checks and end-to-end/agent test scripts
```

## Data model

The Prisma schema contains:

- Products, collections, and product images
- Guest sessions, cart items, and favourites
- Orders, order items, and order status history
- Admin users
- Knowledge documents and embedding chunks for AI retrieval

The database provider is PostgreSQL. `EmbeddingChunk` is designed to work with a PostgreSQL `pgvector` column added outside the Prisma model, so confirm that the required vector extension and deployment migrations are available before enabling production RAG workloads.

## Store policies represented in the application

- Payment method: cash on delivery.
- Delivery inside Dhaka: ৳70, typically 2–3 business days.
- Delivery outside Dhaka: ৳130, typically 3–5 business days.
- Standard bangle sizes: 2-4, 2-6, and 2-8.

Update the policy prompt and knowledge documents together whenever a store policy changes so the website and AI concierge remain consistent.

## Production checklist

Before deploying:

1. Use a managed PostgreSQL database and apply the schema through a reviewed migration process rather than relying on `db push`.
2. Set a strong, unique `AUTH_SECRET`.
3. Configure Cloudinary or another durable image-storage strategy; local `public/uploads` is not suitable for ephemeral production instances.
4. Verify Gemini quotas, model availability, and error handling.
5. Review the admin authentication flow and replace the current simulated login gate with server-side credential verification and authorization before exposing `/admin`.
6. Configure HTTPS, secure cookie settings, rate limiting, request logging, backups, and monitoring.
7. Test checkout, order tracking, uploads, admin actions, and the AI concierge against the production database.

## Contributing

1. Create a focused branch.
2. Make the smallest change that addresses the issue.
3. Run the relevant checks:

   ```bash
   npm run lint
   npm run build
   ```

4. Describe database, environment-variable, and migration changes in the pull request.

## License

This project is private (`"private": true` in `package.json`). No open-source license is currently specified.
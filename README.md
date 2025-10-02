# Empower Orphans Website

A modern, production-ready Next.js 15 website for Empower Orphans - a student-led nonprofit supporting orphaned and vulnerable children.

## 🚀 Features

- **Modern Design System**: Beautiful UI with gradients, glassmorphism, shadows, and smooth animations
- **Framer Motion Animations**: GPU-accelerated animations for smooth performance
- **Supabase Integration**: Secure server-side queries for events and hero images
- **Responsive**: Mobile-first design that looks great on all devices
- **Type-Safe**: Built with TypeScript for reliability
- **SEO Optimized**: Meta tags and semantic HTML for better search rankings
- **Performance First**: Optimized images and assets for fast loading

## 🎨 Color Palette

- Primary Teal: `#0e869d`
- Light Background: `#c6f1f8`
- Accent Blue: `#79d3ff`
- Secondary Accent: `#45bfd6`
- Dark Text: `#0f5360`

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd efinal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🗂️ Project Structure

```
efinal/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── donate/            # Donate page (placeholder)
│   ├── events/            # Events page (dynamic from Supabase)
│   ├── programs/          # Programs page (placeholder)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── HeroCarousel.tsx   # Hero slider
│   ├── About.tsx          # About section
│   ├── DonationProgress.tsx
│   ├── Contact.tsx
│   ├── ChaptersJoin.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilities and configs
│   ├── supabase.ts        # Supabase client
│   └── config.ts          # Site configuration
└── public/                # Static assets

```

## 🔒 Security

- All sensitive keys are stored in `.env` files (never committed)
- Supabase queries use server-side rendering where possible
- User input is sanitized in forms
- HttpOnly and Secure cookies for future authentication

## 🌐 Pages

- **Home (/)**: Hero carousel, about, donations, contact, join chapters
- **About (/about)**: Team information and mission
- **Events (/events)**: Dynamic events from Supabase
- **Donate (/donate)**: Placeholder for future Stripe integration
- **Programs (/programs)**: Placeholder for program details

## 📝 License

Copyright © 2025 Empower Orphans. All rights reserved.


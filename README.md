# ولاد عرب - Luxury Streetwear Website

A modern, professional luxury streetwear e-commerce website featuring a dark, minimalist design with high-quality fashion imagery and refined animations.

---

## 🚀 Quick Links

- **New here?** Start with [QUICKSTART.md](QUICKSTART.md) - Get running in 3 steps!
- **Need setup help?** See [SETUP.md](SETUP.md)
- **Want to deploy?** Check [DEPLOYMENT.md](DEPLOYMENT.md)
- **Understand the code?** Read [ARCHITECTURE.md](ARCHITECTURE.md)
- **Project overview:** See [PROJECT.md](PROJECT.md)

---

## Features

- 🎨 **Luxury Design**: Dark minimalist aesthetic with premium typography
- 🌍 **Bilingual Support**: French (default) and English language switching
- 💰 **Tunisian Currency**: Prices displayed in TND (Tunisian Dinar)
- 🛒 **Shopping Cart**: Fully functional sliding cart panel
- 📱 **Responsive Design**: Works beautifully on all devices
- ✨ **Smooth Animations**: Powered by Motion (Framer Motion)
- 🎬 **Scroll Video Effect**: Apple-style scroll-triggered image transitions
- 🌐 **Arabic Branding**: Premium Arabic typography with proper RTL support

## Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite 6** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Motion** - Animations (formerly Framer Motion)
- **Lucide React** - Icons

## Setup Instructions

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or extract the project**

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Add the logo image:**
   
   Place the Marque logo image in the `/public` folder with the filename:
   - `f1c97467f912436f82a69b06050f8e87665000a0.png`
   
   This is the red script logo that appears in the navbar and hero section.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── public/                          # Static assets
│   └── f1c97467f912436f82a69b06050f8e87665000a0.png
├── src/
│   ├── app/
│   │   ├── components/             # React components
│   │   │   ├── Navbar.tsx          # Top navigation with cart & language
│   │   │   ├── ScrollVideoSection.tsx  # Hero with scroll effect
│   │   │   ├── FeaturedProduct.tsx # Product showcase
│   │   │   ├── CartPanel.tsx       # Shopping cart sidebar
│   │   │   ├── Footer.tsx          # Footer with links
│   │   │   ├── figma/              # Utility components
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx # i18n context
│   │   └── App.tsx                 # Main app component
│   ├── styles/                     # Global styles
│   │   ├── index.css              # Main stylesheet entry
│   │   ├── tailwind.css           # Tailwind imports
│   │   ├── theme.css              # Design tokens
│   │   └── fonts.css              # Font imports (Amiri, Tajawal)
│   └── main.tsx                    # React entry point
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## Configuration

### Language Toggle

The site supports French (default) and English. Users can switch languages using the globe icon in the navbar.

### Currency

All prices are displayed in **TND (Tunisian Dinar)**.

### Product

Currently showcases the **Heritage Jacket** ("Veste Heritage" in French) at **1,299 TND**.

## Customization

### Adding More Products

Edit `/src/app/App.tsx` and add product data to the state or create a products array.

### Changing Translations

Edit `/src/app/contexts/LanguageContext.tsx` to modify or add translations.

### Styling

- Global styles: `/src/styles/`
- Tailwind theme tokens: `/src/styles/theme.css`
- Custom fonts: `/src/styles/fonts.css`

### Images

The hero section uses Unsplash images for the scroll video effect. These are defined in `/src/app/components/ScrollVideoSection.tsx`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Private project - All rights reserved © 2026 ولاد عرب

## Notes

- The logo image must be placed in the `/public` folder for the site to work correctly
- Make sure all dependencies are installed before running
- For production, build the project and serve the `dist` folder with any static hosting service
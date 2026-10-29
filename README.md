# Luxura Store

Luxura Store is a modern e-commerce storefront built with Next.js, TypeScript, and CSS Modules. The project delivers a premium shopping experience with a refined user interface, product-focused layouts, and core storefront flows such as browsing, cart management, authentication, and checkout navigation.

Designed with a luxury lifestyle brand aesthetic, Luxura combines clean design principles with a scalable front-end architecture to showcase a realistic and polished online retail experience.

## Overview

This project simulates a high-end online shopping platform with:
- a premium landing page
- featured product collections
- category-based browsing
- shopping cart interactions
- login and registration flows
- checkout and contact experiences
- admin and dashboard interfaces

## Features

- Responsive storefront with premium hero section
- Product catalog and featured collection layout
- Dynamic product cards with pricing and category metadata
- Interactive shopping cart drawer
- Multi-page ecommerce navigation
- Authentication pages for sign-in and registration
- Checkout flow and order journey
- About, contact, dashboard, and admin sections
- Modern Next.js App Router architecture
- TypeScript-based frontend development

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- ESLint
- Node.js

## Project Structure

```bash
e-commerce-website/
├── public/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── admin/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── product/
│   │   ├── products/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── components/
│   │   ├── AuthGuard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   └── *.module.css
│   └── data/
│       └── products.ts
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── package-lock.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/baselserhan/e-commerce-website.git
cd e-commerce-website
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Available Scripts

```bash
npm run dev     # Start the development server
npm run build   # Build the application for production
npm run start   # Start the production server
npm run lint    # Run ESLint checks
```

## Design and UX Goals

The project is designed to reflect a premium digital retail brand through:
- elegant typography and spacing
- strong visual hierarchy
- minimalist product-focused layouts
- high-contrast call-to-action elements
- immersive marketing sections
- consistent UI patterns across storefront pages

## Contributing

Contributions are welcome. If you would like to improve the project, please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## Contact

For questions, collaboration, or support, feel free to reach out through the repository or the contact details provided in the project.

## License

This project does not currently include a license file. Please review repository ownership and licensing terms before commercial or public reuse.

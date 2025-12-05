# SoleStore - Premium Shoe E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features a complete shopping experience with admin dashboard, cart management, and secure checkout.

## 🚀 Features

### Customer Features
- **Modern Homepage** with hero section, featured products, and categories
- **Product Listing** with advanced filtering (brand, size, color, price, category)
- **Product Details** with image gallery, size selection, and inventory management
- **Shopping Cart** with quantity updates and real-time pricing
- **Checkout Flow** with shipping address and payment integration
- **Responsive Design** - mobile-first approach with smooth animations
- **Wishlist** functionality
- **Search** with autocomplete

### Admin Features
- **Secure Admin Portal** with middleware authentication (username: admin, password: admin)
- **Product Management** - add, edit, delete products
- **Order Management** - view and manage customer orders
- **Analytics Dashboard** - revenue, orders, and performance metrics
- **Inventory Tracking** - real-time stock management

### Technical Features
- **Next.js 14 App Router** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management with persistence
- **Supabase** for database and authentication
- **Stripe** integration ready for payments

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Install Dependencies**
```bash
cd shoe-ecommerce
npm install
```

2. **Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Supabase (Optional - uses sample data by default)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

3. **Run Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Customer Flow
1. Browse products on homepage or navigate to /products
2. Filter products by brand, size, color, or price
3. Click on a product to view details
4. Select size and add to cart
5. View cart at /cart
6. Proceed to checkout at /checkout
7. Complete shipping and payment information

### Admin Access
1. Navigate to `http://localhost:3000/admin/login`
2. Login with credentials:
   - **Username:** admin
   - **Password:** admin
3. Access admin dashboard to manage:
   - Products (add/edit/delete)
   - Orders (view and manage)
   - Analytics (revenue, orders, metrics)

## 📁 Project Structure

```
shoe-ecommerce/
├── app/                          # Next.js 14 App Router
│   ├── admin/                    # Admin dashboard
│   │   ├── login/                # Admin login page
│   │   ├── dashboard/            # Main admin dashboard
│   │   ├── products/             # Product management
│   │   ├── orders/               # Order management
│   │   └── analytics/            # Analytics dashboard
│   ├── products/                 # Product pages
│   │   ├── [slug]/               # Individual product detail
│   │   └── page.tsx              # Product listing
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ui/                       # UI components (Button, Input, Card, etc.)
│   ├── layout/                   # Layout components (Header, Footer)
│   ├── product/                  # Product-related components
│   ├── cart/                     # Cart components
│   ├── checkout/                 # Checkout components
│   └── admin/                    # Admin components
├── lib/                          # Utilities and configurations
│   ├── supabase/                 # Supabase client
│   ├── stripe/                   # Stripe configuration
│   └── utils/                    # Helper functions and sample data
├── store/                        # Zustand state management
│   └── cartStore.ts              # Cart state with persistence
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All types
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   └── icons/                    # Icon assets
├── styles/                       # Global styles
├── middleware.ts                 # Next.js middleware (admin auth)
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

## 🛠️ Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Supabase** - Backend and database
- **Stripe** - Payment processing

## 🎨 Design Features

- **Mobile-first responsive design**
- **Smooth page transitions and animations**
- **Sticky add-to-cart buttons on mobile**
- **Image galleries with hover effects**
- **Card-based layouts**
- **Dark mode ready** (color system supports it)
- **Custom animations** (fade, slide, scale)
- **Loading states** and skeletons
- **Toast notifications** for user feedback

## 🔒 Admin Authentication

The admin panel is protected by middleware that checks for authentication cookies. 

**Default Credentials:**
- Username: `admin`
- Password: `admin`

To change credentials, update the login logic in `/app/admin/login/page.tsx`.

## 📊 Sample Data

The application includes comprehensive sample data:
- 8 sample products (Nike, Adidas, Jordan, Converse, Reebok)
- Product variants (sizes, colors, inventory)
- Multiple product images
- Categories and brands
- Rating and reviews data

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📝 Environment Setup

For full functionality, set up:

1. **Supabase** (optional - uses sample data):
   - Create project at supabase.com
   - Create tables using schema in `/lib/supabase/schema.sql`
   - Add connection strings to `.env.local`

2. **Stripe** (optional):
   - Create account at stripe.com
   - Get API keys from dashboard
   - Add keys to `.env.local`

## 🎯 Customization

### Branding
- Update logo in `/components/layout/Header.tsx`
- Modify colors in `/tailwind.config.ts`
- Change fonts in `/app/layout.tsx`

### Products
- Add products in `/lib/utils/sample-data.ts`
- Or connect to Supabase database

### Styling
- Global styles in `/app/globals.css`
- Tailwind config in `/tailwind.config.ts`
- Component styles use Tailwind utility classes

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions:
1. Check the code comments for guidance
2. Review the README
3. Examine component examples in the codebase

## ✨ Features Roadmap

- [ ] User authentication (customer accounts)
- [ ] Order history for customers
- [ ] Product reviews and ratings
- [ ] Wishlist with persistence
- [ ] Advanced search with Algolia
- [ ] Email notifications
- [ ] Inventory alerts
- [ ] Multi-currency support
- [ ] Shipping rate calculation
- [ ] Return management

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

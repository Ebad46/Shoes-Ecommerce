import { Product, ProductVariant } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Air Max 270 React',
    slug: 'air-max-270-react',
    description: 'The Nike Air Max 270 React combines two iconic Air Max cushioning systems for the first time. The resulting hybrid offers unprecedented comfort and style. Features a breathable mesh upper with synthetic leather overlays for durability.',
    brand: 'Nike',
    base_price: 159.99,
    is_active: true,
    category: 'Running',
    rating: 4.5,
    reviews_count: 128,
    images: [
      {
        id: '1-1',
        product_id: '1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        alt: 'Air Max 270 React - Front View',
        position: 1,
      },
      {
        id: '1-2',
        product_id: '1',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        alt: 'Air Max 270 React - Side View',
        position: 2,
      },
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ultraboost 22',
    slug: 'ultraboost-22',
    description: 'Experience endless energy with every step. The adidas Ultraboost 22 features responsive Boost cushioning and a flexible Primeknit upper that adapts to your foot. Perfect for long runs and daily training.',
    brand: 'Adidas',
    base_price: 189.99,
    is_active: true,
    category: 'Running',
    rating: 4.8,
    reviews_count: 256,
    images: [
      {
        id: '2-1',
        product_id: '2',
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
        alt: 'Ultraboost 22 - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    name: 'Jordan 1 Retro High',
    slug: 'jordan-1-retro-high',
    description: 'The Air Jordan 1 Retro High OG remixes the classic design with premium materials and signature details. This timeless silhouette has been a streetwear staple since 1985.',
    brand: 'Jordan',
    base_price: 179.99,
    is_active: true,
    category: 'Lifestyle',
    rating: 4.9,
    reviews_count: 512,
    images: [
      {
        id: '3-1',
        product_id: '3',
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
        alt: 'Jordan 1 Retro High - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    name: 'Chuck Taylor All Star',
    slug: 'chuck-taylor-all-star',
    description: 'The iconic Converse Chuck Taylor All Star is a timeless classic. This legendary sneaker features a durable canvas upper, rubber toe cap, and signature star ankle patch.',
    brand: 'Converse',
    base_price: 64.99,
    is_active: true,
    category: 'Casual',
    rating: 4.6,
    reviews_count: 892,
    images: [
      {
        id: '4-1',
        product_id: '4',
        url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
        alt: 'Chuck Taylor All Star - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '5',
    name: 'Classic Leather',
    slug: 'reebok-classic-leather',
    description: 'The Reebok Classic Leather features a soft garment leather upper that\'s lightweight and durable. A timeless design that never goes out of style.',
    brand: 'Reebok',
    base_price: 74.99,
    is_active: true,
    category: 'Casual',
    rating: 4.4,
    reviews_count: 345,
    images: [
      {
        id: '5-1',
        product_id: '5',
        url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
        alt: 'Classic Leather - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: '6',
    name: 'Zoom Pegasus 40',
    slug: 'zoom-pegasus-40',
    description: 'Meet the Nike Pegasus 40 - your trusted daily trainer. ReactX foam cushioning delivers a smooth, responsive ride with improved energy return for your runs.',
    brand: 'Nike',
    base_price: 139.99,
    is_active: true,
    category: 'Running',
    rating: 4.7,
    reviews_count: 423,
    images: [
      {
        id: '6-1',
        product_id: '6',
        url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
        alt: 'Zoom Pegasus 40 - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
  {
    id: '7',
    name: 'Stan Smith',
    slug: 'stan-smith',
    description: 'Clean, classic, and endlessly versatile. The adidas Stan Smith is a tennis icon that has transcended the court to become a fashion staple.',
    brand: 'Adidas',
    base_price: 89.99,
    is_active: true,
    category: 'Casual',
    rating: 4.8,
    reviews_count: 678,
    images: [
      {
        id: '7-1',
        product_id: '7',
        url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
        alt: 'Stan Smith - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '8',
    name: 'Dunk Low Retro',
    slug: 'dunk-low-retro',
    description: 'The Nike Dunk Low Retro returns with crisp overlays and classic team colors. This basketball icon has become a streetwear must-have.',
    brand: 'Nike',
    base_price: 119.99,
    is_active: true,
    category: 'Lifestyle',
    rating: 4.6,
    reviews_count: 789,
    images: [
      {
        id: '8-1',
        product_id: '8',
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        alt: 'Dunk Low Retro - Front View',
        position: 1,
      },
    ],
    created_at: '2024-01-22T10:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
  }
];

export const sampleVariants: ProductVariant[] = [
  // Air Max 270 React variants
  { id: 'v1-1', product_id: '1', sku: 'AM270R-BK-7', size: '7', color: 'Black', price: 159.99, inventory_count: 15, is_available: true },
  { id: 'v1-2', product_id: '1', sku: 'AM270R-BK-8', size: '8', color: 'Black', price: 159.99, inventory_count: 12, is_available: true },
  { id: 'v1-3', product_id: '1', sku: 'AM270R-BK-9', size: '9', color: 'Black', price: 159.99, inventory_count: 20, is_available: true },
  { id: 'v1-4', product_id: '1', sku: 'AM270R-BK-10', size: '10', color: 'Black', price: 159.99, inventory_count: 8, is_available: true },
  { id: 'v1-5', product_id: '1', sku: 'AM270R-BK-11', size: '11', color: 'Black', price: 159.99, inventory_count: 5, is_available: true },
  
  // Ultraboost 22 variants
  { id: 'v2-1', product_id: '2', sku: 'UB22-WH-7', size: '7', color: 'White', price: 189.99, inventory_count: 18, is_available: true },
  { id: 'v2-2', product_id: '2', sku: 'UB22-WH-8', size: '8', color: 'White', price: 189.99, inventory_count: 22, is_available: true },
  { id: 'v2-3', product_id: '2', sku: 'UB22-WH-9', size: '9', color: 'White', price: 189.99, inventory_count: 16, is_available: true },
  { id: 'v2-4', product_id: '2', sku: 'UB22-WH-10', size: '10', color: 'White', price: 189.99, inventory_count: 0, is_available: false },
  
  // Jordan 1 variants
  { id: 'v3-1', product_id: '3', sku: 'J1RH-RW-8', size: '8', color: 'Red/White', price: 179.99, inventory_count: 3, is_available: true },
  { id: 'v3-2', product_id: '3', sku: 'J1RH-RW-9', size: '9', color: 'Red/White', price: 179.99, inventory_count: 7, is_available: true },
  { id: 'v3-3', product_id: '3', sku: 'J1RH-RW-10', size: '10', color: 'Red/White', price: 179.99, inventory_count: 12, is_available: true },
  
  // Chuck Taylor variants
  { id: 'v4-1', product_id: '4', sku: 'CT-BK-7', size: '7', color: 'Black', price: 64.99, inventory_count: 45, is_available: true },
  { id: 'v4-2', product_id: '4', sku: 'CT-BK-8', size: '8', color: 'Black', price: 64.99, inventory_count: 52, is_available: true },
  { id: 'v4-3', product_id: '4', sku: 'CT-BK-9', size: '9', color: 'Black', price: 64.99, inventory_count: 38, is_available: true },
  { id: 'v4-4', product_id: '4', sku: 'CT-BK-10', size: '10', color: 'Black', price: 64.99, inventory_count: 41, is_available: true },
];

export const categories = [
  'Running',
  'Lifestyle',
  'Basketball',
  'Training',
  'Casual',
  'Walking',
];

export const brands = [
  'Nike',
  'Adidas',
  'Jordan',
  'Converse',
  'Reebok',
  'New Balance',
  'Puma',
  'Vans',
];

export const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

export const colors = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Gray',
  'Brown',
  'Navy',
  'Beige',
];

import { Product, ProductVariant } from '@/types';
import productsDataJson from './product_data.json';

// Helper function to get products from localStorage
const getLocalStorageProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('admin_products');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading products from localStorage:', error);
    return [];
  }
};

// Helper function to get variants from localStorage
const getLocalStorageVariants = (): ProductVariant[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('admin_variants');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading variants from localStorage:', error);
    return [];
  }
};

// Load base products from JSON
const baseProducts: Product[] = productsDataJson.products as Product[];
const baseVariants: ProductVariant[] = productsDataJson.variants as ProductVariant[];

// Export products (JSON + localStorage combined)
export const sampleProducts: Product[] = [
  ...baseProducts,
  ...getLocalStorageProducts(),
];

// Export variants (JSON + localStorage combined)
export const sampleVariants: ProductVariant[] = [
  ...baseVariants,
  ...getLocalStorageVariants(),
];

// Categories
export const categories = [
  'Running',
  'Lifestyle',
  'Basketball',
  'Training',
  'Casual',
  'Walking',
];

// Brands
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

// Sizes
export const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

// Colors
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
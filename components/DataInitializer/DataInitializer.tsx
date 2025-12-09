    'use client';

import { useEffect } from 'react';
import productData from '@/lib/utils/product_data.json';

export default function DataInitializer() {
  useEffect(() => {
    // Check if data is already loaded
    const isInitialized = localStorage.getItem('data_initialized');
    
    if (!isInitialized) {
      // Load JSON data into localStorage
      localStorage.setItem('admin_products', JSON.stringify(productData.products));
      localStorage.setItem('admin_variants', JSON.stringify(productData.variants));
      localStorage.setItem('data_initialized', 'true');
      
      console.log('✅ Initial data loaded: ', {
        products: productData.products.length,
        variants: productData.variants.length
      });
    }
  }, []);

  return null; // This component renders nothing
}
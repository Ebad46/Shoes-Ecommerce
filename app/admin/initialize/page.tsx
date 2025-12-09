'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import productData from '@/lib/utils/product_data.json';
import toast from 'react-hot-toast';
import { Database, Trash2, Download } from 'lucide-react';

export default function InitializePage() {
  const [status, setStatus] = useState('');

  const loadJsonToLocalStorage = () => {
    try {
      // Load products
      localStorage.setItem('admin_products', JSON.stringify(productData.products));
      
      // Load variants
      localStorage.setItem('admin_variants', JSON.stringify(productData.variants));
      
      setStatus(`✅ Loaded ${productData.products.length} products and ${productData.variants.length} variants into localStorage`);
      toast.success('JSON data loaded successfully!');
    } catch (error) {
      setStatus('❌ Error loading data');
      toast.error('Failed to load data');
    }
  };

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      localStorage.removeItem('admin_products');
      localStorage.removeItem('admin_variants');
      localStorage.removeItem('cart-storage');
      setStatus('🗑️ All data cleared');
      toast.success('LocalStorage cleared');
    }
  };

  const viewData = () => {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const variants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
    
    console.log('Products:', products);
    console.log('Variants:', variants);
    
    setStatus(`📊 Products: ${products.length}, Variants: ${variants.length} (Check console for details)`);
    toast.success('Data logged to console');
  };

  const exportData = () => {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const variants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
    
    const data = {
      products,
      variants
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.json';
    a.click();
    
    toast.success('Data exported!');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Data Initialization</h1>
            <p className="text-neutral-600 mb-8">
              Manage your product data and localStorage
            </p>

            <div className="space-y-4">
              {/* Load JSON to localStorage */}
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-neutral-900">Load JSON to LocalStorage</h3>
                  <p className="text-sm text-neutral-600">
                    Import all products and variants from JSON file
                  </p>
                </div>
                <Button icon={<Database size={18} />} onClick={loadJsonToLocalStorage}>
                  Load Data
                </Button>
              </div>

              {/* View Data */}
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-neutral-900">View Data</h3>
                  <p className="text-sm text-neutral-600">
                    Check what's currently in localStorage
                  </p>
                </div>
                <Button variant="outline" onClick={viewData}>
                  View
                </Button>
              </div>

              {/* Export Data */}
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-neutral-900">Export Data</h3>
                  <p className="text-sm text-neutral-600">
                    Download localStorage data as JSON
                  </p>
                </div>
                <Button variant="outline" icon={<Download size={18} />} onClick={exportData}>
                  Export
                </Button>
              </div>

              {/* Clear Data */}
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-neutral-900">Clear All Data</h3>
                  <p className="text-sm text-neutral-600">
                    Remove all products, variants, and cart data
                  </p>
                </div>
                <Button variant="danger" icon={<Trash2 size={18} />} onClick={clearLocalStorage}>
                  Clear
                </Button>
              </div>
            </div>

            {/* Status */}
            {status && (
              <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
                <p className="text-sm font-mono text-neutral-900">{status}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
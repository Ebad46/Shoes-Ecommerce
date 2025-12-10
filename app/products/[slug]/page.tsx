'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  base_price: number;
  is_active: boolean;
  category: string;
  rating: number;
  reviews_count: number;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface Variant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  inventory_count: number;
  is_available: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allVariants, setAllVariants] = useState<Variant[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  
  const { addItem } = useCartStore();

  // Load products and variants from localStorage only
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const variants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
    setAllProducts(products);
    setAllVariants(variants);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const product = allProducts.find((p) => p.slug === slug);

  // Get variants for this product
  const productVariants = allVariants.filter(
    (v: Variant) => v.product_id === product?.id
  );

  // Get unique sizes and colors
  const availableSizes = Array.from(new Set(productVariants.map((v: Variant) => v.size))).sort();
  const availableColors = Array.from(new Set(productVariants.map((v: Variant) => v.color)));

  // Auto-select first available options
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableSizes, availableColors, selectedSize, selectedColor]);

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="p-8 sm:p-12 text-center w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4">Product Not Found</h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="w-full">
            <Button icon={<ArrowLeft size={18} />} className="w-full">Back to Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Find the selected variant
    const selectedVariant = productVariants.find(
      (v: Variant) => v.size === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) {
      // If no variants exist, create a default variant
      const defaultVariant: Variant = {
        id: `${product.id}-default`,
        product_id: product.id,
        sku: `${product.id}-DEFAULT`,
        size: selectedSize || 'One Size',
        color: selectedColor || 'Default',
        price: product.base_price,
        inventory_count: 999,
        is_available: true,
      };
      
      addItem(product, defaultVariant, 1);
      toast.success(`${product.name} added to cart!`);
      return;
    }

    if (!selectedVariant.is_available || selectedVariant.inventory_count < 1) {
      toast.error('This size is currently out of stock');
      return;
    }

    addItem(product, selectedVariant, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      

      {/* Product Details */}
      <main className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Images */}
            <div className="order-1 md:order-1">
              {/* Main Image */}
              <div className="relative aspect-square bg-neutral-100 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden mb-3 sm:mb-4">
                <Image
                  src={product.images[selectedImage]?.url || '/placeholder.png'}
                  alt={product.images[selectedImage]?.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 sm:gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-neutral-100 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${
                        selectedImage === index
                          ? 'border-neutral-900'
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="order-2 md:order-2">
              {/* Brand & Title */}
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base md:text-lg text-neutral-600 mb-1 sm:mb-2">{product.brand}</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={isMobile ? 16 : 20}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-neutral-600">
                  {product.rating} ({product.reviews_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <p className="text-3xl sm:text-4xl font-bold text-neutral-900">{formatPrice(product.base_price)}</p>
              </div>

              {/* Description */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 sm:mb-3">Description</h2>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2 sm:mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {availableSizes.map((size) => {
                      const variant = productVariants.find(
                        (v: Variant) => v.size === size && v.color === selectedColor
                      );
                      const isAvailable = variant?.is_available && (variant?.inventory_count || 0) > 0;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`min-w-[50px] sm:min-w-[60px] px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 font-semibold text-sm sm:text-base transition-all ${
                            isSelected
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : isAvailable
                              ? 'border-neutral-300 hover:border-neutral-900 bg-white text-neutral-900 active:scale-95'
                              : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2 sm:mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {availableColors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 font-semibold transition-all flex items-center gap-2 text-sm sm:text-base active:scale-95 ${
                            isSelected
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-300 hover:border-neutral-900 bg-white text-neutral-900'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {isSelected && <Check size={isMobile ? 16 : 18} />}
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
                <Button 
                  className="flex-1 text-sm sm:text-base py-2 sm:py-3" 
                  size="lg"
                  icon={<ShoppingCart size={isMobile ? 18 : 20} />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  icon={<Heart size={isMobile ? 16 : 18} />}
                  className="text-sm sm:text-base py-2 sm:py-3"
                  onClick={handleAddToWishlist}
                >
                  <span className="hidden xs:inline">Wishlist</span>
                  <span className="inline xs:hidden">Save</span>
                </Button>
              </div>

              {/* Product Details Card */}
              <Card className="border-neutral-200">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-neutral-900 mb-3 sm:mb-4 text-sm sm:text-base">Product Details</h3>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-neutral-600">Brand:</span>
                      <span className="font-medium text-neutral-900 text-right">{product.brand}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-neutral-600">Category:</span>
                      <span className="font-medium text-neutral-900 text-right">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-neutral-600">Status:</span>
                      <Badge variant={product.is_active ? 'success' : 'default'} size="sm">
                        {product.is_active ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
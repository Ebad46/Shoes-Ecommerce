'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, TruckIcon, RefreshCw, ShieldCheck, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { sampleProducts, sampleVariants } from '@/lib/utils/sample-data';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const product = sampleProducts.find((p) => p.slug === params.slug);
  const variants = sampleVariants.filter((v) => v.product_id === product?.id);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const availableSizes = [...new Set(variants.map((v) => v.size))];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      toast.error('Please select a size');
      return;
    }

    addItem(product, selectedVariant, quantity);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900">
            Products
          </Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100"
            >
              <Image
                src={product.images[selectedImage]?.url || product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all ${
                  isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-neutral-900'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>

              {/* Share Button */}
              <button className="absolute top-4 left-4 p-3 rounded-full bg-white/90 text-neutral-900 backdrop-blur-sm">
                <Share2 size={20} />
              </button>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <Image src={image.url} alt={image.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="info" size="sm">
                {product.brand}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                  />
                ))}
              </div>
              <span className="text-neutral-900 font-medium">{product.rating}</span>
              <span className="text-neutral-500">({product.reviews_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-neutral-900">
                  {formatPrice(product.base_price)}
                </span>
                {product.base_price > 100 && (
                  <span className="text-xl text-neutral-500 line-through">
                    {formatPrice(product.base_price * 1.2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 mt-2">Free shipping on this item</p>
            </div>

            {/* Description */}
            <p className="text-neutral-700 leading-relaxed mb-6">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-neutral-900">Select Size</h3>
                <Link href="/size-guide" className="text-sm text-neutral-600 hover:text-neutral-900 underline">
                  Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => {
                  const variant = variants.find((v) => v.size === size);
                  const isAvailable = variant?.is_available;
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : isAvailable
                          ? 'border-neutral-300 text-neutral-900 hover:border-neutral-900'
                          : 'border-neutral-200 text-neutral-400 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && selectedVariant.inventory_count <= 5 && (
                <p className="text-sm text-orange-600 mt-2">
                  Only {selectedVariant.inventory_count} left in stock!
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3 mb-8">
              <Button
                onClick={handleAddToCart}
                size="lg"
                fullWidth
                disabled={!selectedSize}
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" fullWidth>
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TruckIcon className="text-neutral-700 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-neutral-900">Free Delivery</h4>
                    <p className="text-sm text-neutral-600">Orders over $100 ship free</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="text-neutral-700 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-neutral-900">30-Day Returns</h4>
                    <p className="text-sm text-neutral-600">Easy returns & exchanges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-neutral-700 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-neutral-900">Authenticity Guaranteed</h4>
                    <p className="text-sm text-neutral-600">100% genuine products</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Details Accordion */}
            <div className="mt-8 space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-neutral-50 rounded-lg">
                  <span className="font-semibold">Product Details</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="p-4 text-sm text-neutral-700 space-y-2">
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Style:</strong> {product.slug}</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-neutral-50 rounded-lg">
                  <span className="font-semibold">Shipping & Returns</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="p-4 text-sm text-neutral-700 space-y-2">
                  <p>Free standard shipping on orders over $100</p>
                  <p>30-day return policy - no questions asked</p>
                  <p>International shipping available</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

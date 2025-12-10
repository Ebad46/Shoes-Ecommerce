'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

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
  compare_price?: number;
  is_active: boolean;
  category: string;
  rating: number;
  reviews_count: number;
  images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Product Image Container */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden w-full flex-shrink-0">
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 375px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
            />
            
            {/* Category Badge */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
              <Badge variant="info" size="sm" className="text-xs sm:text-sm">
                {product.category}
              </Badge>
            </div>

            {/* Discount Badge */}
            {product.compare_price && product.compare_price > product.base_price && (
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                <Badge variant="danger" size="sm" className="text-xs sm:text-sm">
                  {Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)}% OFF
                </Badge>
              </div>
            )}

            {/* Quick Add to Cart (hover/mobile) */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                fullWidth
                icon={<ShoppingCart size={14} />}
                onClick={(e) => {
                  e.preventDefault();
                  // Quick add functionality can be added here
                }}
                className="text-xs sm:text-sm"
              >
                Quick Add
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
            {/* Brand */}
            <p className="text-xs sm:text-sm text-neutral-600 mb-1 truncate">
              {product.brand}
            </p>

            {/* Product Name */}
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-700 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2 sm:mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-600 ml-1">
                {product.rating} <span className="hidden xs:inline">({product.reviews_count})</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap mt-auto">
              <p className="text-lg sm:text-xl font-bold text-neutral-900">
                {formatPrice(product.base_price)}
              </p>
              {product.compare_price && product.compare_price > product.base_price && (
                <p className="text-xs sm:text-sm text-neutral-500 line-through">
                  {formatPrice(product.compare_price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
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
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Product Image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            <Image
  src={product.images[0]?.url || '/placeholder.png'}
  alt={product.images[0]?.alt || product.name}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-500"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  quality={75}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
/>
            
            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="info">{product.category}</Badge>
            </div>

            {/* Discount Badge */}
            {product.compare_price && product.compare_price > product.base_price && (
              <div className="absolute top-3 left-3">
                <Badge variant="danger">
                  {Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)}% OFF
                </Badge>
              </div>
            )}

            {/* Quick Add to Cart (hover) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                fullWidth
                icon={<ShoppingCart size={16} />}
                onClick={(e) => {
                  e.preventDefault();
                  // Quick add functionality can be added here
                }}
              >
                Quick Add
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-sm text-neutral-600 mb-1">{product.brand}</p>

            {/* Product Name */}
            <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-700 transition-colors min-h-[3rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-600">
                {product.rating} ({product.reviews_count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-neutral-900">
                {formatPrice(product.base_price)}
              </p>
              {product.compare_price && product.compare_price > product.base_price && (
                <p className="text-sm text-neutral-500 line-through">
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
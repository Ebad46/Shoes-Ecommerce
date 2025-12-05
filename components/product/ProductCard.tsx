'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage = product.images[0]?.url || '/placeholder-shoe.jpg';
  const secondaryImage = product.images[1]?.url || primaryImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:opacity-0`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Secondary Image (Hover) */}
          <Image
            src={secondaryImage}
            alt={`${product.name} - alternate view`}
            fill
            className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100"
          />

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-neutral-900 hover:bg-white'
              }`}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          {/* Sale Badge */}
          {product.base_price > 100 && (
            <div className="absolute top-3 left-3">
              <Badge variant="danger" size="sm">
                Sale
              </Badge>
            </div>
          )}

          {/* Low Stock Indicator */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge variant="warning" size="sm">
              Only 3 left!
            </Badge>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-neutral-900">{product.rating}</span>
          <span className="text-sm text-neutral-500">({product.reviews_count})</span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-neutral-500">{product.brand}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900">
              {formatPrice(product.base_price)}
            </span>
            {product.base_price > 100 && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(product.base_price * 1.2)}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart functionality will be handled in product page
            }}
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>

        {/* Color Options Preview */}
        <div className="flex gap-1.5 mt-2">
          <div className="w-4 h-4 rounded-full bg-neutral-900 border-2 border-white ring-1 ring-neutral-300"></div>
          <div className="w-4 h-4 rounded-full bg-white border-2 border-white ring-1 ring-neutral-300"></div>
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white ring-1 ring-neutral-300"></div>
          <span className="text-xs text-neutral-500 ml-1">+2</span>
        </div>
      </div>
    </motion.div>
  );
}

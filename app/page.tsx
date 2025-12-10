'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TruckIcon, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { sampleProducts, categories } from '@/lib/utils/sample-data';

export default function Home() {
  const featuredProducts = sampleProducts.slice(0, 4);
  const newArrivals = sampleProducts.slice(4, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-neutral-150 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/40 z-10" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920)',
            }}
          />
        </div>

        <div className="relative z-20 w-full px-3 sm:px-4 md:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight"
              >
                Step Into
                <br />
                <span className="gradient-text">Excellence</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-200 mb-4 sm:mb-6 md:mb-8 max-w-lg"
              >
                Discover the latest collection of premium sneakers. Authentic products, unbeatable prices.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4"
              >
                <Link href="/products" className="w-full xs:w-auto">
                  <Button size="lg" icon={<ArrowRight size={20} />} className="w-full xs:w-auto text-xs sm:text-sm md:text-base">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/products?sale=true" className="w-full xs:w-auto">
                  <Button variant="outline" size="lg" className="w-full xs:w-auto bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-neutral-900 text-xs sm:text-sm md:text-base">
                    View Sale
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 sm:py-10 md:py-12 bg-white border-b border-neutral-200">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 sm:gap-4"
              >
                <div className="p-2 sm:p-3 bg-neutral-900 rounded-lg flex-shrink-0">
                  <TruckIcon className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-0.5 sm:mb-1">Free Shipping</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">On orders over $100</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-3 sm:gap-4"
              >
                <div className="p-2 sm:p-3 bg-neutral-900 rounded-lg flex-shrink-0">
                  <ShieldCheck className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-0.5 sm:mb-1">100% Authentic</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Guaranteed genuine products</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-3 sm:gap-4"
              >
                <div className="p-2 sm:p-3 bg-neutral-900 rounded-lg flex-shrink-0">
                  <RefreshCw className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-0.5 sm:mb-1">Easy Returns</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">30-day return policy</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 sm:gap-4"
              >
                <div className="p-2 sm:p-3 bg-neutral-900 rounded-lg flex-shrink-0">
                  <Headphones className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-0.5 sm:mb-1">24/7 Support</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Always here to help</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-10 sm:py-12 md:py-16 bg-neutral-50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-2 sm:mb-4">Shop by Category</h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
                Find the perfect shoes for your lifestyle
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/products?category=${category}`}
                    className="group block p-3 sm:p-4 md:p-6 bg-white rounded-lg sm:rounded-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all duration-300 hover:shadow-medium h-full"
                  >
                    <div className="text-center">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-neutral-900 group-hover:text-neutral-700 transition line-clamp-2">
                        {category}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1 sm:mb-2">Featured Products</h2>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600">Handpicked favorites for you</p>
              </div>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" icon={<ArrowRight size={18} />} className="w-full sm:w-auto text-xs sm:text-sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 sm:py-12 md:py-16 bg-neutral-900 text-white">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4"
              >
                New Year Sale
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 mb-4 sm:mb-6 md:mb-8"
              >
                Up to 40% off on selected items
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <Link href="/products?sale=true">
                  <Button size="lg" variant="secondary" icon={<ArrowRight size={20} />} className="text-xs sm:text-sm md:text-base">
                    Shop Sale
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1 sm:mb-2">New Arrivals</h2>
                <p className="text-xs sm:text-sm md:text-base text-neutral-600">Just landed - check out our newest styles</p>
              </div>
              <Link href="/products?sort=newest" className="w-full sm:w-auto">
                <Button variant="outline" icon={<ArrowRight size={18} />} className="w-full sm:w-auto text-xs sm:text-sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
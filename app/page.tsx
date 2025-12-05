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
      <section className="relative h-[600px] lg:h-[700px] bg-neutral-150 overflow-hidden">
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

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
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
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Step Into
              <br />
              <span className="gradient-text">Excellence</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-neutral-200 mb-8 max-w-lg"
            >
              Discover the latest collection of premium sneakers. Authentic products, unbeatable prices.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button size="lg" icon={<ArrowRight size={20} />}>
                  Shop Now
                </Button>
              </Link>
              <Link href="/products?sale=true">
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-neutral-900">
                  View Sale
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-neutral-900 rounded-lg">
                <TruckIcon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Free Shipping</h3>
                <p className="text-sm text-neutral-600">On orders over $100</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-neutral-900 rounded-lg">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">100% Authentic</h3>
                <p className="text-sm text-neutral-600">Guaranteed genuine products</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-neutral-900 rounded-lg">
                <RefreshCw className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Easy Returns</h3>
                <p className="text-sm text-neutral-600">30-day return policy</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-neutral-900 rounded-lg">
                <Headphones className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">24/7 Support</h3>
                <p className="text-sm text-neutral-600">Always here to help</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Shop by Category</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Find the perfect shoes for your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/products?category=${category}`}
                  className="group block p-6 bg-white rounded-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all duration-300 hover:shadow-medium"
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700 transition">
                      {category}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-2">Featured Products</h2>
              <p className="text-neutral-600">Handpicked favorites for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline" icon={<ArrowRight size={18} />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              New Year Sale
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Up to 40% off on selected items
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/products?sale=true">
                <Button size="lg" variant="secondary" icon={<ArrowRight size={20} />}>
                  Shop Sale
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-2">New Arrivals</h2>
              <p className="text-neutral-600">Just landed - check out our newest styles</p>
            </div>
            <Link href="/products?sort=newest">
              <Button variant="outline" icon={<ArrowRight size={18} />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>
    </div>
  );
}

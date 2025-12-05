'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">SoleStore</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Your premium destination for authentic sneakers and athletic footwear. Quality guaranteed.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Running" className="text-neutral-400 hover:text-white transition text-sm">
                  Running Shoes
                </Link>
              </li>
              <li>
                <Link href="/products?category=Lifestyle" className="text-neutral-400 hover:text-white transition text-sm">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/products?category=Basketball" className="text-neutral-400 hover:text-white transition text-sm">
                  Basketball
                </Link>
              </li>
              <li>
                <Link href="/products?sale=true" className="text-neutral-400 hover:text-white transition text-sm">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-neutral-400 hover:text-white transition text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-neutral-400 hover:text-white transition text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-neutral-400 hover:text-white transition text-sm">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-neutral-900 font-medium py-2.5 rounded-lg hover:bg-neutral-100 transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              © {currentYear} SoleStore. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-white transition text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

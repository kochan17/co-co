'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-navy-900 group-hover:text-teal-600 transition-colors">
            CoCo
          </span>
        </Link>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            無料診断を受ける
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-navy-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4">
          <button className="w-full px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg transition-all">
            無料診断を受ける
          </button>
        </div>
      )}
    </header>
  );
}

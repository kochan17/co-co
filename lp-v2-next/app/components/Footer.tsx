import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">CoCo</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              中小企業の業務変革を支援する<br />
              AIエージェント開発パートナー
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div>
              <h3 className="font-bold mb-3 text-sm">サービス</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">AI社員構築</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">補助金申請サポート</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-sm">企業情報</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">会社概要</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-navy-700 text-center text-sm text-gray-500">
          © 2026 CoCo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

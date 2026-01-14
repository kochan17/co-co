'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import { ArrowRight, CheckCircle, Bot, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">

        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-teal-900 via-navy-900 to-navy-800 text-white overflow-hidden">
          <div className="container mx-auto px-6 py-24 md:py-32 max-w-7xl relative z-10">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 mb-6">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-teal-300">リスキリング補助金対象</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                人を採れないなら、<br />
                <span className="text-teal-400">AIを雇えばいい。</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                採用難も、退職リスクも、もう終わり。<br />
                <span className="text-white font-semibold">実質50万円</span>で、あなたの会社専用の<br />
                「AI社員チーム」を構築します。
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  無料診断を受ける
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white font-bold text-lg rounded-lg transition-all hover:bg-white/5">
                  サービス詳細を見る
                </button>
              </div>
            </div>
          </div>

          {/* Decorative gradient circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </section>

        {/* TRUST SECTION - Numbers */}
        <section className="py-16 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-2">75<span className="text-3xl">%</span></div>
                <div className="text-sm text-gray-600">初期コスト削減率</div>
                <div className="text-xs text-gray-500 mt-1">補助金活用で200万→50万</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-2">3<span className="text-3xl">名</span></div>
                <div className="text-sm text-gray-600">AI社員の標準構成</div>
                <div className="text-xs text-gray-500 mt-1">議事録・FAQ・分析Bot</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-2">0<span className="text-3xl">%</span></div>
                <div className="text-sm text-gray-600">退職リスク</div>
                <div className="text-xs text-gray-500 mt-1">知見が永久に会社に残る</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Numbered */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 rounded-full border border-teal-500/30 bg-teal-50 text-teal-700 text-sm font-bold mb-4">
                CoCoの特徴
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-4">
                知能の<span className="text-teal-600">永久循環</span>システム
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                使うほどに賢くなる「AIの学習ループ」で、<br />
                企業の最強の資産を構築します。
              </p>
            </div>

            <div className="space-y-16">
              {/* Feature 01 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="text-teal-600 font-bold text-sm mb-2">01</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                    自律学習ループ
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    日々の業務ログから、AIが勝手にマニュアルを更新。<br />
                    人が教える手間を最小化し、知見が自動で蓄積されます。
                  </p>
                  <ul className="space-y-3">
                    {['会話履歴の自動解析', 'ナレッジベースの自動更新', '回答精度の継続的改善'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12 flex items-center justify-center">
                  <Bot className="w-32 h-32 text-teal-600/20" />
                </div>
              </div>

              {/* Feature 02 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-12 flex items-center justify-center">
                  <Users className="w-32 h-32 text-teal-600/20" />
                </div>
                <div className="order-1 md:order-2">
                  <div className="text-teal-600 font-bold text-sm mb-2">02</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                    退職リスクゼロ
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    優秀な社員が辞めても、積み上げた知能は会社に残ります。<br />
                    属人化からの脱却を実現します。
                  </p>
                  <ul className="space-y-3">
                    {['ノウハウの永続的保存', '引き継ぎ期間の大幅短縮', '組織の知的資産化'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 03 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="text-teal-600 font-bold text-sm mb-2">03</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                    指数関数的成長
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    複利のように、組織の生産性が向上し続けます。<br />
                    導入後も、使えば使うほど賢くなる仕組みです。
                  </p>
                  <ul className="space-y-3">
                    {['業務効率の継続的向上', 'コスト削減の累積効果', '競争優位性の確立'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-12 flex items-center justify-center">
                  <TrendingUp className="w-32 h-32 text-teal-600/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-gradient-to-br from-teal-900 to-navy-900 text-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              まずは無料診断から<br />始めませんか？
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              御社の業務課題をヒアリングし、<br />
              最適なAI導入プランをご提案します。
            </p>
            <button className="group px-10 py-5 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xl rounded-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto">
              無料診断を申し込む
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

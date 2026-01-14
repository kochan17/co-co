'use client';

import { motion } from 'framer-motion';
import { Activity, BarChart3, Check, Clock, Cpu, FileText, Zap } from 'lucide-react';

const mockActivities = [
  { id: 1, text: "議事録の要約完了 (定例MTG)", time: "Just now" },
  { id: 2, text: "顧客メールの下書き作成", time: "2s ago" },
  { id: 3, text: "日報データの集計", time: "5s ago" },
  { id: 4, text: "スケジュール調整 (鈴木様)", time: "12s ago" },
];

export default function GlassDashboard() {
  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      <motion.div
        initial={{ rotateX: 10, rotateY: -10, opacity: 0, scale: 0.9 }}
        whileInView={{ rotateX: 5, rotateY: -5, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, type: "spring" }}
        className="glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/20"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">CoCo AI Runtime</h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-slate-500 font-mono">ONLINE / IDLE: 12ms</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Efficiency Score</div>
            <div className="text-xl font-bold text-cyan-500 font-mono">98.4%</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Activity Feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3 h-3" /> Live Activity
            </h4>
            <div className="space-y-2">
              {mockActivities.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/40 border border-white/20 hover:bg-white/60 transition-colors"
                >
                  <div className="pt-0.5">
                    <Check className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 font-medium">{item.text}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Metrics & Processing */}
          <div className="space-y-6">

            {/* Chart Simulation */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-3 h-3" /> Workload Reduction
              </h4>
              <div className="h-24 bg-white/20 rounded-lg border border-white/10 flex items-end justify-between p-2 gap-1 overflow-hidden">
                {[40, 65, 45, 80, 55, 90, 75, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                    className="w-full bg-cyan-400/80 rounded-sm"
                  />
                ))}
              </div>
            </div>

            {/* Queue Status */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-cyan-700">Task Queue</span>
                <span className="text-xs font-bold text-cyan-700">Empty</span>
              </div>
              <div className="w-full bg-cyan-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  whileInView={{ width: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="bg-cyan-500 h-full rounded-full"
                />
              </div>
              <p className="text-[10px] text-cyan-600/80 mt-2 flex items-center gap-1">
                <Zap className="w-3 h-3" /> All tasks processed automatically.
              </p>
            </div>

          </div>
        </div>

        {/* Reflection Glare */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}

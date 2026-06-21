import { useEffect, useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import { ParamPanel } from '@/components/ParamPanel';
import { ResultPanel } from '@/components/ResultPanel';
import { ComparisonPanel } from '@/components/ComparisonPanel';
import { ConstraintPanel } from '@/components/ConstraintPanel';
import { CategoryPanel } from '@/components/CategoryPanel';
import { TieredDiscountPanel } from '@/components/TieredDiscountPanel';
import { BreakEvenPanel } from '@/components/BreakEvenPanel';

export default function ConfigPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(212, 168, 83, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-[1800px]">
        <header
          className={`mb-6 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-gold to-amber-goldDark flex items-center justify-center shadow-lg shadow-amber-gold/20">
              <BarChart3 size={22} className="text-navy-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">促销损益测算系统</h1>
              <p className="text-navy-400 text-sm">参数配置 · 3874 · v2.0 多品类+阶梯折扣+保本反解</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-amber-gold/80 text-sm flex-wrap">
            <Sparkles size={16} />
            <span>多品类加权 · 阶梯折扣引擎 · 保本临界反解 · 敏感度排序 · 全联动实时计算</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* 左栏：全局参数 + 品类列表 */}
          <div
            className={`xl:col-span-3 space-y-5 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <ParamPanel />
            <CategoryPanel />
          </div>

          {/* 中栏：测算结果 + 常态对比 + 保本与敏感度 */}
          <div
            className={`xl:col-span-6 space-y-5 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ResultPanel />
              <ComparisonPanel />
            </div>
            <BreakEvenPanel />
          </div>

          {/* 右栏：阶梯折扣 + 约束校验 */}
          <div
            className={`xl:col-span-3 space-y-5 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <TieredDiscountPanel />
            <ConstraintPanel />
          </div>
        </div>

        <footer
          className={`mt-10 text-center text-navy-500 text-sm transition-all duration-700 delay-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>
            调整任意参数/品类/档位，所有指标实时联动刷新 · 客流占比≠100%时禁止出具最终结论 · 纯前端计算无后端依赖
          </p>
        </footer>
      </div>
    </div>
  );
}

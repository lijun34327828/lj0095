import React, { useMemo } from 'react';
import { ShieldAlert, TrendingUp, Target, Sparkles, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator';
import { formatCurrency, formatPercent } from '@/utils/calculation';
import { cn } from '@/lib/utils';

const MIN_DISCOUNT = 0;
const MAX_DISCOUNT = 90;

export const BreakEvenPanel: React.FC = () => {
  const { params, result, setParam } = useCalculatorStore();
  const { discountRate, useTieredDiscount } = params;
  const { breakEvenDiscountRate, sensitivityRanking, activityNetProfit } = result;

  const sliderPct = ((discountRate - MIN_DISCOUNT) / (MAX_DISCOUNT - MIN_DISCOUNT)) * 100;

  const breakEvenInfo = useMemo(() => {
    if (breakEvenDiscountRate === null) {
      return { type: 'never' as const, text: '当前参数组合下，任意折扣均亏损', tip: '需提高商品均价或降低固定成本' };
    }
    if (breakEvenDiscountRate >= 95) {
      return { type: 'always' as const, text: '当前参数组合下，即使 90% 折扣仍盈利', tip: '安全边际充足，可考虑加大促销力度' };
    }
    const be = breakEvenDiscountRate;
    const diff = discountRate - be;
    if (diff > 0.1) {
      return {
        type: 'loss' as const,
        text: `保本临界折扣：${be.toFixed(1)}%（${(100 - be).toFixed(1)}折）`,
        tip: `当前超出 ${diff.toFixed(1)} 个百分点，进入亏损区`,
      };
    }
    if (diff < -0.1) {
      return {
        type: 'profit' as const,
        text: `保本临界折扣：${be.toFixed(1)}%（${(100 - be).toFixed(1)}折）`,
        tip: `距临界点尚有 ${Math.abs(diff).toFixed(1)} 个百分点安全边际`,
      };
    }
    return { type: 'edge' as const, text: `当前处于保本临界区（≈ ${be.toFixed(1)}%）`, tip: '微小波动即可能改变盈亏方向' };
  }, [breakEvenDiscountRate, discountRate]);

  const breakEvenMarker =
    breakEvenDiscountRate !== null && breakEvenDiscountRate < 95
      ? ((breakEvenDiscountRate - MIN_DISCOUNT) / (MAX_DISCOUNT - MIN_DISCOUNT)) * 100
      : null;

  const maxImpact = sensitivityRanking.length > 0 ? sensitivityRanking[0].impact : 1;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
        <Target size={20} className="text-amber-gold" />
        保本测算与敏感度分析
      </h3>

      {/* 保本折扣滑块 */}
      <div
        className={cn(
          'rounded-xl p-5 border backdrop-blur-sm transition-all',
          breakEvenInfo.type === 'loss' && 'bg-warning-red/10 border-warning-red/40',
          breakEvenInfo.type === 'profit' && 'bg-success-green/10 border-success-green/30',
          breakEvenInfo.type === 'edge' && 'bg-amber-gold/10 border-amber-gold/40',
          (breakEvenInfo.type === 'never' || breakEvenInfo.type === 'always') &&
            'bg-navy-800/60 border-navy-700/50'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                breakEvenInfo.type === 'loss' && 'bg-warning-red/20 text-warning-red',
                breakEvenInfo.type === 'profit' && 'bg-success-green/20 text-success-green',
                breakEvenInfo.type === 'edge' && 'bg-amber-gold/20 text-amber-gold',
                (breakEvenInfo.type === 'never' || breakEvenInfo.type === 'always') &&
                  'bg-navy-700/50 text-navy-400'
              )}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <div
                className={cn(
                  'font-bold text-base',
                  breakEvenInfo.type === 'loss' && 'text-warning-red',
                  breakEvenInfo.type === 'profit' && 'text-success-green',
                  breakEvenInfo.type === 'edge' && 'text-amber-gold',
                  (breakEvenInfo.type === 'never' || breakEvenInfo.type === 'always') && 'text-navy-200'
                )}
              >
                {breakEvenInfo.text}
              </div>
              <div className="text-xs text-navy-400 mt-1">{breakEvenInfo.tip}</div>
            </div>
          </div>
          {activityNetProfit !== undefined && (
            <div className="text-right">
              <div className="text-[11px] text-navy-400 mb-0.5">当前净收益</div>
              <div
                className={cn(
                  'font-mono font-bold text-lg',
                  activityNetProfit >= 0 ? 'text-success-green' : 'text-warning-red'
                )}
              >
                {formatCurrency(activityNetProfit)}
              </div>
            </div>
          )}
        </div>

        {/* 折扣滑块带标记 */}
        <div className="mt-2 relative">
          <div className="relative h-3 bg-navy-900/80 rounded-full overflow-hidden">
            <div
              className={cn(
                'absolute left-0 top-0 h-full transition-all duration-300',
                breakEvenMarker !== null && sliderPct <= breakEvenMarker
                  ? 'bg-gradient-to-r from-success-green to-success-green'
                  : breakEvenMarker !== null
                  ? 'bg-gradient-to-r from-success-green via-amber-gold to-warning-red'
                  : 'bg-gradient-to-r from-amber-goldDark via-amber-gold to-amber-goldLight'
              )}
              style={{ width: `${sliderPct}%` }}
            />
            {breakEvenMarker !== null && (
              <div
                className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
                style={{ left: `${breakEvenMarker}%` }}
              />
            )}
            <input
              type="range"
              min={MIN_DISCOUNT}
              max={MAX_DISCOUNT}
              step={0.5}
              value={discountRate}
              onChange={(e) => setParam('discountRate', parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>

          <div className="flex justify-between mt-1.5 text-[10px] text-navy-500">
            <span>{MIN_DISCOUNT}%（无折扣）</span>
            <span>{MAX_DISCOUNT}%（一折）</span>
          </div>

          {breakEvenMarker !== null && (
            <div
              className="absolute -top-8 transform -translate-x-1/2 z-10 pointer-events-none"
              style={{ left: `${breakEvenMarker}%` }}
            >
              <div className="bg-navy-900 border border-warning-red/50 rounded px-2 py-0.5 flex items-center gap-1 shadow-lg">
                <AlertTriangle size={10} className="text-warning-red" />
                <span className="text-[10px] text-warning-red font-mono font-bold whitespace-nowrap">
                  保本线 {breakEvenDiscountRate!.toFixed(1)}%
                </span>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-navy-900 mx-auto" />
            </div>
          )}

          <div
            className="absolute -bottom-0 transform -translate-x-1/2 z-10 pointer-events-none"
            style={{ left: `${sliderPct}%` }}
          >
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-amber-gold mx-auto" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success-green/60" />
              <span className="text-navy-300">盈利区</span>
            </div>
            {breakEvenMarker !== null && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                  <span className="text-warning-red/80">保本临界点</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-warning-red/60" />
                  <span className="text-navy-300">亏损区</span>
                </div>
              </>
            )}
          </div>
          <div className="text-navy-400">
            {useTieredDiscount && <span className="opacity-70">阶梯模式：此值作为未达档位品类的基础折扣</span>}
          </div>
        </div>
      </div>

      {/* 敏感度排序 */}
      <div className="bg-navy-800/60 backdrop-blur-sm rounded-xl p-5 border border-navy-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-gold" />
            <span className="font-semibold text-navy-100 text-sm">参数敏感度排序</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-navy-400">
            <Sparkles size={12} />
            <span>按对净收益的边际影响绝对值降序</span>
          </div>
        </div>

        <div className="space-y-3">
          {sensitivityRanking.map((item, idx) => {
            const pct = maxImpact > 0 ? (item.impact / maxImpact) * 100 : 0;
            const rankColors = ['text-amber-gold', 'text-navy-200', 'text-navy-300', 'text-navy-400', 'text-navy-500'];
            const barColors = [
              'from-amber-goldDark to-amber-gold',
              'from-navy-500 to-navy-400',
              'from-navy-600 to-navy-500',
              'from-navy-700 to-navy-600',
              'from-navy-800 to-navy-700',
            ];

            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold',
                        idx === 0
                          ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40'
                          : 'bg-navy-700/60 text-navy-300'
                      )}
                    >
                      {idx + 1}
                    </div>
                    <span className={cn('font-medium', rankColors[idx])}>{item.label}</span>
                    {idx === 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-gold bg-amber-gold/10 px-1.5 py-0.5 rounded border border-amber-gold/30">
                        <ArrowUpRight size={10} />
                        影响最大
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-navy-200 font-semibold">
                      ¥{item.impact.toFixed(2)}
                    </span>
                    <span className="text-navy-500 ml-1">/ {item.unit}</span>
                  </div>
                </div>
                <div className="h-2 bg-navy-900/80 rounded-full overflow-hidden ml-7">
                  <div
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                      barColors[idx]
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-navy-700/50 text-[11px] text-navy-400 leading-relaxed">
          💡 敏感度越高的参数，微调对净收益影响越大。建议优先优化排名靠前的参数以提升活动收益。
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency, formatPercent } from '@/utils/calculation';

export const ComparisonPanel: React.FC = () => {
  const { result } = useCalculatorStore();
  const { normalNetProfit, activityNetProfit, profitLossDiff, profitLossRate, normalRevenue, activityRevenue } = result;

  const animatedNormal = useAnimatedNumber(normalNetProfit, 400, 2);
  const animatedActivity = useAnimatedNumber(activityNetProfit, 400, 2);
  const animatedDiff = useAnimatedNumber(profitLossDiff, 400, 2);
  const animatedRate = useAnimatedNumber(profitLossRate, 400, 1);

  const isPositive = profitLossDiff >= 0;
  const maxValue = Math.max(Math.abs(normalNetProfit), Math.abs(activityNetProfit));
  const normalWidth = maxValue > 0 ? (Math.abs(normalNetProfit) / maxValue) * 100 : 0;
  const activityWidth = maxValue > 0 ? (Math.abs(activityNetProfit) / maxValue) * 100 : 0;

  const revenueMax = Math.max(normalRevenue, activityRevenue);
  const normalRevenueWidth = revenueMax > 0 ? (normalRevenue / revenueMax) * 100 : 0;
  const activityRevenueWidth = revenueMax > 0 ? (activityRevenue / revenueMax) * 100 : 0;

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
        <BarChart3 size={20} className="text-amber-gold" />
        常态营收对比
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-navy-800/60 backdrop-blur-sm rounded-xl p-4 border border-navy-700/50">
          <div className="text-navy-400 text-sm mb-1">无活动营收</div>
          <div className="text-xl font-mono font-bold text-white">{formatCurrency(normalRevenue)}</div>
          <div className="mt-2 h-2 bg-navy-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-navy-500 rounded-full transition-all duration-500"
              style={{ width: `${normalRevenueWidth}%` }}
            />
          </div>
        </div>

        <div className="bg-navy-800/60 backdrop-blur-sm rounded-xl p-4 border border-amber-gold/30">
          <div className="text-amber-gold/80 text-sm mb-1">活动营收</div>
          <div className="text-xl font-mono font-bold text-amber-gold">{formatCurrency(activityRevenue)}</div>
          <div className="mt-2 h-2 bg-navy-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-goldDark to-amber-gold rounded-full transition-all duration-500"
              style={{ width: `${activityRevenueWidth}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-navy-800/40 backdrop-blur-sm rounded-xl p-5 border border-navy-700/50">
        <div className="text-navy-300 text-sm mb-3">净收益对比</div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-navy-300">常态净收益</span>
              <span className="font-mono text-navy-200">{formatCurrency(animatedNormal)}</span>
            </div>
            <div className="h-3 bg-navy-900/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-navy-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${normalWidth}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-amber-gold/90">活动净收益</span>
              <span className="font-mono text-amber-gold">{formatCurrency(animatedActivity)}</span>
            </div>
            <div className="h-3 bg-navy-900/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-goldDark to-amber-gold rounded-full transition-all duration-500 ease-out"
                style={{ width: `${activityWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl p-5 border transition-all duration-300 ${
          isPositive
            ? 'bg-success-green/10 border-success-green/40'
            : 'bg-warning-red/10 border-warning-red/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-navy-300 text-sm mb-1">损益差值</div>
            <div className={`text-3xl font-mono font-bold ${isPositive ? 'text-success-green' : 'text-warning-red'}`}>
              {isPositive ? '+' : ''}{formatCurrency(animatedDiff)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-navy-400 text-sm mb-1">变化幅度</div>
            <div className={`text-xl font-mono font-bold flex items-center justify-end gap-1 ${
              isPositive ? 'text-success-green' : 'text-warning-red'
            }`}>
              {isPositive ? (
                <TrendingUp size={20} />
              ) : profitLossDiff < 0 ? (
                <TrendingDown size={20} />
              ) : (
                <Minus size={20} />
              )}
              {isPositive ? '+' : ''}{formatPercent(animatedRate)}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-navy-700/50">
          <p className="text-sm text-navy-400">
            {isPositive
              ? `活动相比常态增加收益 ${formatCurrency(Math.abs(profitLossDiff))}，增长 ${formatPercent(Math.abs(profitLossRate))}`
              : `活动相比常态减少收益 ${formatCurrency(Math.abs(profitLossDiff))}，下降 ${formatPercent(Math.abs(profitLossRate))}`}
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Calculator, TrendingDown, Package, DollarSign, ShoppingCart, Droplets, Layers, ChevronRight } from 'lucide-react';
import { DataCard } from './DataCard';
import { useCalculatorStore } from '@/store/calculator';
import { formatCurrency, formatPercent } from '@/utils/calculation';
import { cn } from '@/lib/utils';

export const ResultPanel: React.FC = () => {
  const { result, constraints } = useCalculatorStore();
  const {
    totalConcession,
    materialLossCost,
    inventoryLossCost,
    activityNetProfit,
    activityRevenue,
    totalCost,
    categoryResults,
  } = result;

  const totalTrafficShare = categoryResults.reduce((sum, c) => sum + c.trafficCount, 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
        <Calculator size={20} className="text-amber-gold" />
        AI 实时测算
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <DataCard
          label="活动总让利"
          value={totalConcession}
          format="currency"
          icon={<TrendingDown size={18} />}
        />

        <DataCard
          label="物料损耗成本"
          value={materialLossCost}
          format="currency"
          icon={<Package size={18} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DataCard
          label="库存损耗成本"
          value={inventoryLossCost}
          format="currency"
          icon={<Droplets size={18} />}
        />

        <DataCard
          label="总成本"
          value={totalCost}
          format="currency"
          icon={<DollarSign size={18} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DataCard
          label="活动营收"
          value={activityRevenue}
          format="currency"
          icon={<ShoppingCart size={18} />}
        />

        <DataCard
          label="净收益"
          value={activityNetProfit}
          format="currency"
          icon={<DollarSign size={18} />}
          highlight
          warning={constraints.isLossWarning}
        />
      </div>

      {/* 品类加权汇总明细 */}
      <div className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-navy-200 text-sm font-medium">
            <Layers size={16} className="text-amber-gold" />
            品类加权汇总明细
          </div>
          <div className="text-[11px] text-navy-500">
            共 {categoryResults.length} 品类 · 合计 {totalTrafficShare.toFixed(0)} 人
          </div>
        </div>

        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
          {categoryResults.map((cr) => {
            const sharePct = totalTrafficShare > 0 ? (cr.trafficCount / totalTrafficShare) * 100 : 0;
            return (
              <div
                key={cr.categoryId}
                className={cn(
                  'bg-navy-900/50 rounded-lg p-3 border transition-all',
                  cr.netProfit >= 0
                    ? 'border-navy-700/40 hover:border-success-green/30'
                    : 'border-warning-red/20 hover:border-warning-red/40'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-navy-100 font-semibold text-sm">{cr.categoryName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-700/60 text-navy-300 font-mono">
                      {cr.trafficCount.toFixed(0)}人 · {sharePct.toFixed(1)}%
                    </span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1',
                        cr.hitTierId
                          ? 'bg-amber-gold/15 text-amber-gold border border-amber-gold/30'
                          : 'bg-navy-700/40 text-navy-400 border border-navy-600/30'
                      )}
                    >
                      <ChevronRight size={9} />
                      {cr.hitTierLabel} · {cr.appliedDiscountRate.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    className={cn(
                      'font-mono font-bold text-sm',
                      cr.netProfit >= 0 ? 'text-success-green' : 'text-warning-red'
                    )}
                  >
                    {cr.netProfit >= 0 ? '+' : ''}
                    {formatCurrency(cr.netProfit)}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <div className="text-navy-500">让利</div>
                    <div className="text-navy-300 font-mono">{formatCurrency(cr.totalConcession)}</div>
                  </div>
                  <div>
                    <div className="text-navy-500">库存损耗</div>
                    <div className="text-navy-300 font-mono">{formatCurrency(cr.inventoryLossCost)}</div>
                  </div>
                  <div>
                    <div className="text-navy-500">营收</div>
                    <div className="text-navy-200 font-mono font-semibold">
                      {formatCurrency(cr.activityRevenue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-navy-500">毛利</div>
                    <div className="text-amber-gold font-mono font-semibold">
                      {formatCurrency(cr.grossProfit)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/50">
        <div className="text-navy-400 text-xs mb-2">成本明细</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-navy-300">活动物料固定成本（按占比分摊）</span>
            <span className="font-mono text-navy-200">{formatCurrency(materialLossCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-navy-300">库存损耗成本（品类加权）</span>
            <span className="font-mono text-navy-200">{formatCurrency(inventoryLossCost)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-navy-700/50">
            <span className="text-navy-200 font-medium">总成本</span>
            <span className="font-mono text-amber-gold font-bold">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </div>

      {!constraints.canIssueConclusion && (
        <div className="bg-warning-red/10 border border-warning-red/40 rounded-xl p-4 animate-glow">
          <div className="flex items-start gap-3">
            <div className="text-warning-red mt-0.5 animate-breathe">
              <TrendingDown size={20} />
            </div>
            <div>
              <div className="text-warning-red font-bold text-sm mb-1">⚠ 无法出具最终结论</div>
              <div className="text-warning-red/80 text-xs">{constraints.trafficRatioMsg}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

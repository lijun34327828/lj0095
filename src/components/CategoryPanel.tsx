import React from 'react';
import { Plus, Trash2, Layers, Users, Tag, Percent as PercentIcon, Droplets, RefreshCw, AlertCircle } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator';
import { formatCurrency } from '@/utils/calculation';
import { cn } from '@/lib/utils';

export const CategoryPanel: React.FC = () => {
  const {
    params,
    constraints,
    result,
    addCategory,
    removeCategory,
    updateCategory,
    normalizeTrafficRatios,
  } = useCalculatorStore();

  const { categories, estimatedTraffic, avgItemPrice, inventoryLossRate } = params;
  const { categoryResults } = result;

  const handleNameChange = (id: string, value: string) => {
    updateCategory(id, 'name', value);
  };

  const handleNumberChange = (
    id: string,
    field: 'trafficRatio' | 'avgPrice' | 'grossMarginRate' | 'inventoryLossRate',
    rawValue: string,
    min: number,
    max: number
  ) => {
    const num = parseFloat(rawValue);
    if (isNaN(num)) return;
    const clamped = Math.max(min, Math.min(max, num));
    updateCategory(id, field, clamped);
  };

  const effectiveAvgBase = 89;
  const effectiveLossBase = 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
          <Layers size={20} className="text-amber-gold" />
          多品类拆分测算
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={normalizeTrafficRatios}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-navy-300 hover:text-amber-gold
              bg-navy-800/60 hover:bg-navy-700/60 rounded-lg border border-navy-700/50
              hover:border-amber-gold/40 transition-all duration-200"
          >
            <RefreshCw size={14} />
            归一化占比
          </button>
          <button
            onClick={addCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-navy-100
              bg-gradient-to-r from-amber-goldDark to-amber-gold hover:from-amber-gold hover:to-amber-goldLight
              rounded-lg shadow-lg shadow-amber-gold/20 transition-all duration-200"
          >
            <Plus size={14} />
            新增品类
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium',
          constraints.isTrafficRatioInvalid
            ? 'bg-warning-red/10 border-warning-red/40 text-warning-red'
            : 'bg-success-green/10 border-success-green/30 text-success-green'
        )}
      >
        <div className="flex items-center gap-2">
          {constraints.isTrafficRatioInvalid ? (
            <AlertCircle size={16} />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>
          )}
          <span>
            客流占比合计：
            <span className="font-mono font-bold ml-1">
              {constraints.trafficRatioSum.toFixed(1)}%
            </span>
            {constraints.isTrafficRatioInvalid && ' / 需等于100%'}
          </span>
        </div>
        {!constraints.isTrafficRatioInvalid && (
          <span className="text-xs opacity-80">✓ 校验通过</span>
        )}
      </div>

      <div className="space-y-3 max-h-[calc(100vh-520px)] overflow-y-auto pr-1 custom-scrollbar">
        {categories.map((cat, idx) => {
          const catResult = categoryResults.find((r) => r.categoryId === cat.id);
          const effectivePrice = cat.avgPrice * (avgItemPrice / effectiveAvgBase);
          const effectiveLoss = cat.inventoryLossRate * (inventoryLossRate / effectiveLossBase);
          const trafficCount = estimatedTraffic * (cat.trafficRatio / 100);
          const isRatioInvalid = constraints.isTrafficRatioInvalid;

          return (
            <div
              key={cat.id}
              className="bg-navy-800/60 backdrop-blur-sm rounded-xl border border-navy-700/50 hover:border-navy-600/70 transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700/50 bg-navy-900/40">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-gold/30 to-amber-gold/10 flex items-center justify-center text-xs font-bold text-amber-gold border border-amber-gold/30">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleNameChange(cat.id, e.target.value)}
                    className="flex-1 bg-transparent text-navy-100 font-semibold text-sm focus:outline-none focus:ring-0 border-b border-transparent focus:border-amber-gold/50 transition-all max-w-[140px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {catResult && (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-md font-medium',
                        catResult.netProfit >= 0
                          ? 'bg-success-green/15 text-success-green'
                          : 'bg-warning-red/15 text-warning-red'
                      )}
                    >
                      净收益 {formatCurrency(catResult.netProfit)}
                    </span>
                  )}
                  <button
                    onClick={() => removeCategory(cat.id)}
                    disabled={categories.length <= 1}
                    className={cn(
                      'p-1.5 rounded-md transition-all duration-200',
                      categories.length <= 1
                        ? 'text-navy-600 cursor-not-allowed'
                        : 'text-navy-400 hover:text-warning-red hover:bg-warning-red/10'
                    )}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-navy-400 mb-1.5">
                      <Users size={12} />
                      客流占比
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cat.trafficRatio}
                        min={0}
                        max={100}
                        step={0.5}
                        onChange={(e) =>
                          handleNumberChange(cat.id, 'trafficRatio', e.target.value, 0, 100)
                        }
                        className={cn(
                          'w-full bg-navy-900/80 font-mono text-sm px-2.5 py-1.5 rounded-md border transition-all focus:outline-none focus:ring-1',
                          isRatioInvalid
                            ? 'text-warning-red border-warning-red/40 focus:border-warning-red/60 focus:ring-warning-red/30'
                            : 'text-navy-200 border-navy-600/50 focus:border-amber-gold/60 focus:ring-amber-gold/30'
                        )}
                      />
                      <span className="text-navy-400 text-sm ml-2 w-6">%</span>
                    </div>
                    <div className="text-[10px] text-navy-500 mt-1">
                      ≈ {trafficCount.toFixed(0)} 人 / ¥
                      {(trafficCount * effectivePrice).toFixed(0)} 流水
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-navy-400 mb-1.5">
                      <Tag size={12} />
                      品类均价
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cat.avgPrice}
                        min={1}
                        max={9999}
                        step={1}
                        onChange={(e) =>
                          handleNumberChange(cat.id, 'avgPrice', e.target.value, 1, 9999)
                        }
                        className="w-full bg-navy-900/80 text-navy-200 font-mono text-sm px-2.5 py-1.5 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/30 transition-all focus:outline-none"
                      />
                      <span className="text-navy-400 text-sm ml-2 w-6">元</span>
                    </div>
                    <div className="text-[10px] text-navy-500 mt-1">
                      联动后 ≈ ¥{effectivePrice.toFixed(1)}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-navy-400 mb-1.5">
                      <PercentIcon size={12} />
                      毛利率
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cat.grossMarginRate}
                        min={0}
                        max={90}
                        step={0.5}
                        onChange={(e) =>
                          handleNumberChange(cat.id, 'grossMarginRate', e.target.value, 0, 90)
                        }
                        className="w-full bg-navy-900/80 text-navy-200 font-mono text-sm px-2.5 py-1.5 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/30 transition-all focus:outline-none"
                      />
                      <span className="text-navy-400 text-sm ml-2 w-6">%</span>
                    </div>
                    {catResult && (
                      <div className="text-[10px] text-amber-gold/70 mt-1">
                        毛利 {formatCurrency(catResult.grossProfit)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-navy-400 mb-1.5">
                      <Droplets size={12} />
                      库存损耗率
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cat.inventoryLossRate}
                        min={0}
                        max={30}
                        step={0.1}
                        onChange={(e) =>
                          handleNumberChange(cat.id, 'inventoryLossRate', e.target.value, 0, 30)
                        }
                        className="w-full bg-navy-900/80 text-navy-200 font-mono text-sm px-2.5 py-1.5 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/30 transition-all focus:outline-none"
                      />
                      <span className="text-navy-400 text-sm ml-2 w-6">%</span>
                    </div>
                    <div className="text-[10px] text-navy-500 mt-1">
                      联动后 ≈ {effectiveLoss.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {catResult && (
                  <div className="pt-3 border-t border-navy-700/50 grid grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-navy-900/50 rounded-md px-2 py-1.5">
                      <div className="text-navy-500">让利</div>
                      <div className="text-navy-200 font-mono font-semibold">
                        {formatCurrency(catResult.totalConcession)}
                      </div>
                    </div>
                    <div className="bg-navy-900/50 rounded-md px-2 py-1.5">
                      <div className="text-navy-500">营收</div>
                      <div className="text-navy-200 font-mono font-semibold">
                        {formatCurrency(catResult.activityRevenue)}
                      </div>
                    </div>
                    <div className="bg-navy-900/50 rounded-md px-2 py-1.5">
                      <div className="text-navy-500">折扣</div>
                      <div
                        className={cn(
                          'font-mono font-semibold',
                          catResult.hitTierId ? 'text-amber-gold' : 'text-navy-300'
                        )}
                      >
                        {catResult.appliedDiscountRate.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Plus, Trash2, Layers3, Tag, Percent, CheckCircle2, XCircle, ToggleLeft, ToggleRight, ShoppingBag } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculator';
import { cn } from '@/lib/utils';

export const TieredDiscountPanel: React.FC = () => {
  const {
    params,
    result,
    addDiscountTier,
    removeDiscountTier,
    updateDiscountTier,
    toggleTieredDiscount,
  } = useCalculatorStore();

  const { discountTiers, useTieredDiscount, categories, avgItemPrice, discountRate } = params;
  const { categoryResults } = result;

  const sortedTiers = [...discountTiers].sort((a, b) => a.threshold - b.threshold);

  const handleThresholdChange = (id: string, raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    updateDiscountTier(id, 'threshold', Math.max(0, Math.min(99999, Math.round(num))));
  };

  const handleDiscountChange = (id: string, raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    updateDiscountTier(id, 'discountRate', Math.max(0, Math.min(90, num)));
  };

  const getMatchedCategories = (tierId: string) => {
    return categoryResults.filter((r) => r.hitTierId === tierId);
  };

  const getNoTierCategories = () => {
    return categoryResults.filter((r) => !r.hitTierId && r.hitTierLabel === '未达档位');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
          <Layers3 size={20} className="text-amber-gold" />
          阶梯折扣引擎
        </h3>
        <button
          onClick={() => toggleTieredDiscount(!useTieredDiscount)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border',
            useTieredDiscount
              ? 'bg-gradient-to-r from-amber-gold/20 to-amber-gold/5 border-amber-gold/40 text-amber-gold'
              : 'bg-navy-800/60 border-navy-700/50 text-navy-400 hover:text-navy-200'
          )}
        >
          {useTieredDiscount ? (
            <ToggleRight size={18} />
          ) : (
            <ToggleLeft size={18} />
          )}
          {useTieredDiscount ? '阶梯模式' : '统一折扣'}
        </button>
      </div>

      {!useTieredDiscount && (
        <div className="bg-navy-800/40 border border-navy-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-700/50 flex items-center justify-center text-navy-300">
              <Tag size={18} />
            </div>
            <div className="flex-1">
              <div className="text-navy-400 text-xs mb-0.5">当前使用统一折扣</div>
              <div className="text-amber-gold font-mono font-bold text-xl">
                {discountRate.toFixed(0)}% OFF · {100 - discountRate}折
              </div>
            </div>
          </div>
        </div>
      )}

      {useTieredDiscount && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-xs text-navy-400 flex items-center gap-1.5">
              <ShoppingBag size={13} />
              按消费门槛分档，各品类均价自动匹配档位
            </div>
            <button
              onClick={addDiscountTier}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-navy-100
                bg-gradient-to-r from-amber-goldDark to-amber-gold hover:from-amber-gold hover:to-amber-goldLight
                rounded-lg shadow-md shadow-amber-gold/20 transition-all duration-200"
            >
              <Plus size={13} />
              新增档位
            </button>
          </div>

          <div className="space-y-2.5">
            {sortedTiers.length === 0 && (
              <div className="bg-navy-800/40 border border-dashed border-navy-600/50 rounded-xl p-8 text-center">
                <div className="text-navy-500 text-sm mb-1">暂无折扣档位</div>
                <div className="text-navy-600 text-xs">点击上方按钮添加档位规则</div>
              </div>
            )}

            {sortedTiers.map((tier, idx) => {
              const matched = getMatchedCategories(tier.id);
              const matchedNames = matched.map((m) => m.categoryName);
              const discountOff = 100 - tier.discountRate;

              return (
                <div
                  key={tier.id}
                  className={cn(
                    'bg-navy-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 overflow-hidden',
                    matched.length > 0
                      ? 'border-amber-gold/30 hover:border-amber-gold/50'
                      : 'border-navy-700/50 hover:border-navy-600/70'
                  )}
                >
                  <div className="flex items-stretch">
                    <div
                      className={cn(
                        'w-2 flex-shrink-0',
                        idx === 0 && 'bg-gradient-to-b from-navy-500 to-navy-400',
                        idx === 1 && 'bg-gradient-to-b from-amber-goldDark to-amber-gold',
                        idx >= 2 && 'bg-gradient-to-b from-warning-red/80 to-warning-red'
                      )}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-0.5 rounded bg-navy-700/60 text-navy-300 font-medium">
                            档位 {idx + 1}
                          </div>
                          {matched.length > 0 && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-gold">
                              <CheckCircle2 size={12} />
                              <span>命中 {matched.length} 个品类</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeDiscountTier(tier.id)}
                          className="p-1 rounded-md text-navy-400 hover:text-warning-red hover:bg-warning-red/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-1.5 text-[11px] text-navy-400 mb-1.5">
                            <Tag size={11} />
                            消费门槛
                          </label>
                          <div className="flex items-center">
                            <span className="text-navy-500 text-sm mr-1.5">满</span>
                            <input
                              type="number"
                              value={tier.threshold}
                              min={0}
                              max={99999}
                              step={10}
                              onChange={(e) => handleThresholdChange(tier.id, e.target.value)}
                              className="flex-1 bg-navy-900/80 text-navy-200 font-mono text-sm px-2 py-1.5 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/30 transition-all focus:outline-none"
                            />
                            <span className="text-navy-500 text-sm ml-1.5">元</span>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[11px] text-navy-400 mb-1.5">
                            <Percent size={11} />
                            折扣力度
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tier.discountRate}
                              min={0}
                              max={90}
                              step={0.5}
                              onChange={(e) => handleDiscountChange(tier.id, e.target.value)}
                              className="flex-1 bg-navy-900/80 text-amber-gold font-mono font-semibold text-sm px-2 py-1.5 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:ring-1 focus:ring-amber-gold/30 transition-all focus:outline-none"
                            />
                            <span className="text-navy-400 text-xs whitespace-nowrap">
                              % OFF · {discountOff}折
                            </span>
                          </div>
                        </div>
                      </div>

                      {matchedNames.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-navy-700/50">
                          <div className="text-[11px] text-navy-500 mb-1.5">命中品类</div>
                          <div className="flex flex-wrap gap-1.5">
                            {matched.map((m) => (
                              <div
                                key={m.categoryId}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-gold/10 border border-amber-gold/30 text-[11px] text-amber-gold"
                              >
                                <ShoppingBag size={10} />
                                {m.categoryName}
                                <span className="text-amber-gold/60 font-mono">
                                  ¥{getEffectivePriceDisplay(m.categoryId, categories, avgItemPrice)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {getNoTierCategories().length > 0 && (
            <div className="bg-navy-800/40 border border-warning-red/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={14} className="text-warning-red/70" />
                <span className="text-xs text-warning-red/80 font-medium">
                  未达到最低档位门槛的品类（使用基础折扣 {discountRate}%）
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getNoTierCategories().map((m) => (
                  <div
                    key={m.categoryId}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-warning-red/10 border border-warning-red/30 text-[11px] text-warning-red/80"
                  >
                    <ShoppingBag size={10} />
                    {m.categoryName}
                    <span className="font-mono opacity-70">
                      ¥{getEffectivePriceDisplay(m.categoryId, categories, avgItemPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-navy-800/30 border border-navy-700/40 rounded-lg p-3">
            <div className="text-[11px] text-navy-400 leading-relaxed">
              💡 调整档位门槛或折扣时，受影响品类的让利、营收、净收益将自动重算。
              基础折扣 {discountRate}% 会作用于未达档位的品类，可在上方参数面板调整。
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function getEffectivePriceDisplay(
  categoryId: string,
  categories: any[],
  globalAvgPrice: number
): string {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return '0';
  const eff = cat.avgPrice * (globalAvgPrice / 89);
  return eff.toFixed(0);
}

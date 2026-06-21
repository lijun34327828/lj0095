import React from 'react';
import { Percent, Users, Tag, Package, Droplets, RotateCcw, Link2, ArrowRight } from 'lucide-react';
import { ParamSlider } from './ParamSlider';
import { useCalculatorStore } from '@/store/calculator';
import { cn } from '@/lib/utils';

export const ParamPanel: React.FC = () => {
  const { params, setParam, resetParams, result } = useCalculatorStore();
  const { breakEvenDiscountRate } = result;

  const globalAvgBase = 89;
  const globalLossBase = 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
          <Tag size={20} className="text-amber-gold" />
          全局联动参数
        </h3>
        <button
          onClick={resetParams}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-navy-300 hover:text-amber-gold 
            bg-navy-800/60 hover:bg-navy-700/60 rounded-lg border border-navy-700/50 
            hover:border-amber-gold/40 transition-all duration-200"
        >
          <RotateCcw size={14} />
          重置
        </button>
      </div>

      <div className="bg-navy-800/40 border border-amber-gold/20 rounded-xl p-3">
        <div className="flex items-start gap-2 text-[11px] text-amber-gold/80 leading-relaxed">
          <Link2 size={13} className="mt-0.5 flex-shrink-0" />
          <div>
            五项全局参数与品类、阶梯折扣深度耦合：
            <span className="text-amber-gold">折扣力度</span>作用于未达档位品类；
            <span className="text-amber-gold">客流</span>按品类占比拆分；
            <span className="text-amber-gold">均价</span>联动缩放所有品类实际均价；
            <span className="text-amber-gold">损耗率</span>联动放大各品类损耗。
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <ParamSlider
            label="折扣力度"
            value={params.discountRate}
            min={0}
            max={90}
            step={0.5}
            unit="%"
            icon={<Percent size={18} />}
            onChange={(v) => setParam('discountRate', v)}
            description={
              params.useTieredDiscount
                ? '阶梯模式下：未达档位品类的基础折扣（同时影响保本反解）'
                : '统一折扣模式下：作用于所有品类'
            }
          />
          {breakEvenDiscountRate !== null && breakEvenDiscountRate < 95 && (
            <div
              className={cn(
                'absolute -right-1 top-7 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1',
                params.discountRate > breakEvenDiscountRate
                  ? 'bg-warning-red/20 text-warning-red border border-warning-red/40'
                  : 'bg-success-green/20 text-success-green border border-success-green/40'
              )}
            >
              <ArrowRight size={10} />
              保本线 {breakEvenDiscountRate.toFixed(1)}%
            </div>
          )}
        </div>

        <ParamSlider
          label="预估总客流"
          value={params.estimatedTraffic}
          min={50}
          max={2000}
          step={10}
          unit="人"
          icon={<Users size={18} />}
          onChange={(v) => setParam('estimatedTraffic', v)}
          description="各品类按客流占比拆分到店人数，权重汇总让利与营收"
        />

        <div className="relative">
          <ParamSlider
            label="商品均价水平"
            value={params.avgItemPrice}
            min={10}
            max={500}
            step={1}
            unit="元"
            icon={<Package size={18} />}
            onChange={(v) => setParam('avgItemPrice', v)}
            description={`基准¥${globalAvgBase}，缩放系数×${(params.avgItemPrice / globalAvgBase).toFixed(2)}，联动所有品类实际均价`}
          />
          <div className="absolute right-14 -bottom-0.5 text-[10px] text-amber-gold/70 font-mono">
            ×{(params.avgItemPrice / globalAvgBase).toFixed(2)}
          </div>
        </div>

        <ParamSlider
          label="活动物料固定成本"
          value={params.fixedMaterialCost}
          min={0}
          max={10000}
          step={100}
          unit="元"
          icon={<Droplets size={18} />}
          onChange={(v) => setParam('fixedMaterialCost', v)}
          description="按品类客流占比分摊计入各品类净收益计算"
        />

        <div className="relative">
          <ParamSlider
            label="库存损耗率水平"
            value={params.inventoryLossRate}
            min={0}
            max={20}
            step={0.1}
            unit="%"
            icon={<Droplets size={18} />}
            onChange={(v) => setParam('inventoryLossRate', v)}
            description={`基准${globalLossBase}%，系数×${(params.inventoryLossRate / globalLossBase).toFixed(2)}，联动放大各品类实际损耗率`}
          />
          <div className="absolute right-14 -bottom-0.5 text-[10px] text-amber-gold/70 font-mono">
            ×{(params.inventoryLossRate / globalLossBase).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

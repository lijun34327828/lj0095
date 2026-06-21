import React from 'react';
import { Calculator, TrendingDown, Package, DollarSign, ShoppingCart, Droplets } from 'lucide-react';
import { DataCard } from './DataCard';
import { useCalculatorStore } from '@/store/calculator';

export const ResultPanel: React.FC = () => {
  const { result, constraints } = useCalculatorStore();
  const { totalConcession, materialLossCost, inventoryLossCost, activityNetProfit, activityRevenue, totalCost } = result;

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

      <div className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/50">
        <div className="text-navy-400 text-xs mb-2">成本明细</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-navy-300">活动物料固定成本</span>
            <span className="font-mono text-navy-200">¥{materialLossCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-navy-300">库存损耗成本</span>
            <span className="font-mono text-navy-200">¥{inventoryLossCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-navy-700/50">
            <span className="text-navy-200 font-medium">总成本</span>
            <span className="font-mono text-amber-gold font-bold">
              ¥{totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

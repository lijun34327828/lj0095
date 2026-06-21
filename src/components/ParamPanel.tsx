import React from 'react';
import { Percent, Users, Tag, Package, Droplets, RotateCcw } from 'lucide-react';
import { ParamSlider } from './ParamSlider';
import { useCalculatorStore } from '@/store/calculator';

export const ParamPanel: React.FC = () => {
  const { params, setParam, resetParams } = useCalculatorStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
          <Tag size={20} className="text-amber-gold" />
          联动参数配置
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

      <div className="space-y-3">
        <ParamSlider
          label="折扣力度"
          value={params.discountRate}
          min={0}
          max={90}
          step={1}
          unit="%"
          icon={<Percent size={18} />}
          onChange={(v) => setParam('discountRate', v)}
          description="促销折扣比例，折扣越大让利越多"
        />

        <ParamSlider
          label="预估客流"
          value={params.estimatedTraffic}
          min={50}
          max={2000}
          step={10}
          unit="人"
          icon={<Users size={18} />}
          onChange={(v) => setParam('estimatedTraffic', v)}
          description="活动期间预估到店顾客数量"
        />

        <ParamSlider
          label="单品均价"
          value={params.avgItemPrice}
          min={10}
          max={500}
          step={1}
          unit="元"
          icon={<Package size={18} />}
          onChange={(v) => setParam('avgItemPrice', v)}
          description="活动商品的平均单价"
        />

        <ParamSlider
          label="活动物料固定成本"
          value={params.fixedMaterialCost}
          min={0}
          max={10000}
          step={100}
          unit="元"
          icon={<Droplets size={18} />}
          onChange={(v) => setParam('fixedMaterialCost', v)}
          description="海报、展架、装饰等固定物料费用"
        />

        <ParamSlider
          label="库存损耗率"
          value={params.inventoryLossRate}
          min={0}
          max={20}
          step={0.5}
          unit="%"
          icon={<Droplets size={18} />}
          onChange={(v) => setParam('inventoryLossRate', v)}
          description="因促销活动增加的库存损耗比例"
        />
      </div>
    </div>
  );
};

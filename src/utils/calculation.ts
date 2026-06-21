import { CalculationParams, CalculationResult, ConstraintResult, NormalConfig } from '@/types/calculation';

export function calculateProfitLoss(
  params: CalculationParams,
  normalConfig: NormalConfig
): CalculationResult {
  const { discountRate, estimatedTraffic, avgItemPrice, fixedMaterialCost, inventoryLossRate } = params;
  const { normalTraffic, normalDiscountRate, normalMaterialCost, normalLossRate } = normalConfig;

  const discountDecimal = discountRate / 100;
  const lossDecimal = inventoryLossRate / 100;
  const normalDiscountDecimal = normalDiscountRate / 100;
  const normalLossDecimal = normalLossRate / 100;

  const totalConcession = estimatedTraffic * avgItemPrice * discountDecimal;
  const inventoryLossCost = estimatedTraffic * avgItemPrice * lossDecimal;
  const materialLossCost = fixedMaterialCost;
  const activityRevenue = estimatedTraffic * avgItemPrice * (1 - discountDecimal);
  const activityNetProfit = activityRevenue - materialLossCost - inventoryLossCost;

  const normalRevenue = normalTraffic * avgItemPrice * (1 - normalDiscountDecimal);
  const normalLossCost = normalTraffic * avgItemPrice * normalLossDecimal;
  const normalNetProfit = normalRevenue - normalMaterialCost - normalLossCost;

  const profitLossDiff = activityNetProfit - normalNetProfit;
  const profitLossRate = normalNetProfit !== 0 ? (profitLossDiff / Math.abs(normalNetProfit)) * 100 : 0;

  return {
    totalConcession,
    materialLossCost,
    inventoryLossCost,
    activityRevenue,
    activityNetProfit,
    normalRevenue,
    normalNetProfit,
    profitLossDiff,
    profitLossRate,
  };
}

export function checkConstraints(
  params: CalculationParams,
  result: CalculationResult,
  normalConfig: NormalConfig
): ConstraintResult {
  const { estimatedTraffic } = params;
  const { maxStoreCapacity } = normalConfig;
  const { activityNetProfit } = result;

  const isLossWarning = activityNetProfit < 0;
  let lossWarningMsg = '';

  if (isLossWarning) {
    const lossAmount = Math.abs(activityNetProfit).toFixed(2);
    lossWarningMsg = `当前折扣力度下活动将亏损 ¥${lossAmount}，建议提高折扣价格或降低固定成本`;
  }

  const isTrafficOverflow = estimatedTraffic > maxStoreCapacity;
  const trafficSuggestions: string[] = [];

  if (isTrafficOverflow) {
    const overflowPercent = (((estimatedTraffic - maxStoreCapacity) / maxStoreCapacity) * 100).toFixed(1);
    trafficSuggestions.push(`预估客流超出门店接待上限 ${overflowPercent}%`);
    trafficSuggestions.push('建议分时段促销，分散客流压力');
    trafficSuggestions.push('可考虑增加临时收银台和服务人员');
    trafficSuggestions.push('推荐预约制，控制到店人数');
  }

  return {
    isLossWarning,
    lossWarningMsg,
    isTrafficOverflow,
    trafficSuggestions,
    maxStoreCapacity,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

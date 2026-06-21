import {
  CalculationParams,
  CalculationResult,
  ConstraintResult,
  NormalConfig,
  CategoryResult,
  SensitivityItem,
  DiscountTier,
} from '@/types/calculation';

const GLOBAL_AVG_PRICE_BASE = 89;
const GLOBAL_LOSS_RATE_BASE = 3;

function matchTierForPrice(price: number, tiers: DiscountTier[]): DiscountTier | null {
  if (!tiers || tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => b.threshold - a.threshold);
  for (const tier of sorted) {
    if (price >= tier.threshold) return tier;
  }
  return null;
}

function getEffectiveAvgPrice(categoryAvgPrice: number, globalAvgPrice: number): number {
  return categoryAvgPrice * (globalAvgPrice / GLOBAL_AVG_PRICE_BASE);
}

function getEffectiveLossRate(categoryLossRate: number, globalLossRate: number): number {
  return categoryLossRate * (globalLossRate / GLOBAL_LOSS_RATE_BASE);
}

function computeCore(
  params: CalculationParams,
  normalConfig: NormalConfig,
  overrideDiscountRate?: number,
  overrideTraffic?: number,
  overrideAvgPrice?: number,
  overrideMaterialCost?: number,
  overrideLossRate?: number
): {
  categoryResults: CategoryResult[];
  totals: {
    totalConcession: number;
    inventoryLossCost: number;
    activityRevenue: number;
    grossProfit: number;
  };
} {
  const {
    discountRate,
    estimatedTraffic,
    avgItemPrice,
    fixedMaterialCost,
    inventoryLossRate,
    categories,
    discountTiers,
    useTieredDiscount,
  } = params;

  const effDiscountRate = overrideDiscountRate ?? discountRate;
  const effTraffic = overrideTraffic ?? estimatedTraffic;
  const effAvgPrice = overrideAvgPrice ?? avgItemPrice;
  const effMaterialCost = overrideMaterialCost ?? fixedMaterialCost;
  const effLossRate = overrideLossRate ?? inventoryLossRate;

  const categoryResults: CategoryResult[] = [];
  let totalConcession = 0;
  let totalInventoryLossCost = 0;
  let totalActivityRevenue = 0;
  let totalGrossProfit = 0;

  for (const cat of categories) {
    const catTrafficCount = effTraffic * (cat.trafficRatio / 100);
    const catEffectivePrice = getEffectiveAvgPrice(cat.avgPrice, effAvgPrice);
    const catEffectiveLossRate = getEffectiveLossRate(cat.inventoryLossRate, effLossRate);

    let appliedDiscount = effDiscountRate;
    let hitTierId: string | null = null;
    let hitTierLabel = '基础折扣';

    if (useTieredDiscount) {
      const matchedTier = matchTierForPrice(catEffectivePrice, discountTiers);
      if (matchedTier) {
        appliedDiscount = matchedTier.discountRate;
        hitTierId = matchedTier.id;
        hitTierLabel = `满${matchedTier.threshold}元打${100 - matchedTier.discountRate}折`;
      } else if (discountTiers.length > 0) {
        hitTierLabel = '未达档位';
      }
    }

    const discountDecimal = appliedDiscount / 100;
    const lossDecimal = catEffectiveLossRate / 100;
    const marginDecimal = cat.grossMarginRate / 100;

    const catRevenueBeforeDiscount = catTrafficCount * catEffectivePrice;
    const catConcession = catRevenueBeforeDiscount * discountDecimal;
    const catInventoryLoss = catRevenueBeforeDiscount * lossDecimal;
    const catRevenue = catRevenueBeforeDiscount * (1 - discountDecimal);
    const catGrossProfit = catRevenue * marginDecimal;

    totalConcession += catConcession;
    totalInventoryLossCost += catInventoryLoss;
    totalActivityRevenue += catRevenue;
    totalGrossProfit += catGrossProfit;

    const catMaterialShare = effMaterialCost * (cat.trafficRatio / 100);
    const catNetProfit = catGrossProfit - catMaterialShare - catInventoryLoss;

    categoryResults.push({
      categoryId: cat.id,
      categoryName: cat.name,
      trafficCount: catTrafficCount,
      hitTierId,
      hitTierLabel,
      appliedDiscountRate: appliedDiscount,
      totalConcession: catConcession,
      inventoryLossCost: catInventoryLoss,
      activityRevenue: catRevenue,
      grossProfit: catGrossProfit,
      netProfit: catNetProfit,
    });
  }

  return {
    categoryResults,
    totals: {
      totalConcession,
      inventoryLossCost: totalInventoryLossCost,
      activityRevenue: totalActivityRevenue,
      grossProfit: totalGrossProfit,
    },
  };
}

export function calculateProfitLoss(
  params: CalculationParams,
  normalConfig: NormalConfig
): CalculationResult {
  const { fixedMaterialCost, categories } = params;
  const { normalTraffic, normalDiscountRate, normalMaterialCost, normalLossRate, maxStoreCapacity } = normalConfig;

  const { categoryResults, totals } = computeCore(params, normalConfig);

  const materialLossCost = fixedMaterialCost;
  const totalCost = materialLossCost + totals.inventoryLossCost;
  const activityNetProfit = totals.grossProfit - materialLossCost - totals.inventoryLossCost;

  let weightedNormalAvgPrice = 0;
  if (categories && categories.length > 0) {
    for (const cat of categories) {
      weightedNormalAvgPrice += cat.avgPrice * (cat.trafficRatio / 100);
    }
  } else {
    weightedNormalAvgPrice = params.avgItemPrice;
  }

  const normalDiscountDecimal = normalDiscountRate / 100;
  const normalLossDecimal = normalLossRate / 100;
  const normalRevenue = normalTraffic * weightedNormalAvgPrice * (1 - normalDiscountDecimal);
  const normalLossCost = normalTraffic * weightedNormalAvgPrice * normalLossDecimal;

  let normalMarginRate = 0;
  if (categories && categories.length > 0) {
    for (const cat of categories) {
      normalMarginRate += cat.grossMarginRate * (cat.trafficRatio / 100);
    }
  } else {
    normalMarginRate = 30;
  }
  const normalGrossProfit = normalRevenue * (normalMarginRate / 100);
  const normalNetProfit = normalGrossProfit - normalMaterialCost - normalLossCost;

  const profitLossDiff = activityNetProfit - normalNetProfit;
  const profitLossRate = normalNetProfit !== 0 ? (profitLossDiff / Math.abs(normalNetProfit)) * 100 : 0;

  const breakEvenDiscountRate = findBreakEvenDiscount(params, normalConfig);
  const sensitivityRanking = computeSensitivity(params, normalConfig);

  return {
    totalConcession: totals.totalConcession,
    materialLossCost,
    inventoryLossCost: totals.inventoryLossCost,
    totalCost,
    activityRevenue: totals.activityRevenue,
    activityNetProfit,
    normalRevenue,
    normalNetProfit,
    profitLossDiff,
    profitLossRate,
    categoryResults,
    breakEvenDiscountRate,
    sensitivityRanking,
  };
}

function findBreakEvenDiscount(
  params: CalculationParams,
  normalConfig: NormalConfig
): number | null {
  let lo = 0;
  let hi = 90;

  const evalNet = (dr: number): number => {
    const { totals } = computeCore(params, normalConfig, dr);
    return totals.grossProfit - params.fixedMaterialCost - totals.inventoryLossCost;
  };

  const valAtLo = evalNet(lo);
  const valAtHi = evalNet(hi);

  if (valAtLo < 0 && valAtHi < 0) return null;
  if (valAtLo >= 0 && valAtHi >= 0) return 95;

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const val = evalNet(mid);
    if (val >= 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return Math.round(((lo + hi) / 2) * 10) / 10;
}

function computeSensitivity(
  params: CalculationParams,
  normalConfig: NormalConfig
): SensitivityItem[] {
  const base = calculateProfitLossBase(params, normalConfig);

  const deltaTraffic = params.estimatedTraffic * 0.01 || 1;
  const afterTraffic = calculateProfitLossBase(
    { ...params, estimatedTraffic: params.estimatedTraffic + deltaTraffic },
    normalConfig
  );
  const impactTraffic = Math.abs(afterTraffic - base) / deltaTraffic;

  const deltaAvgPrice = params.avgItemPrice * 0.01 || 1;
  const afterAvgPrice = calculateProfitLossBase(
    { ...params, avgItemPrice: params.avgItemPrice + deltaAvgPrice },
    normalConfig
  );
  const impactAvgPrice = Math.abs(afterAvgPrice - base) / deltaAvgPrice;

  const deltaDiscount = 0.1;
  const afterDiscount = calculateProfitLossBase(
    { ...params, discountRate: params.discountRate + deltaDiscount },
    normalConfig
  );
  const impactDiscount = Math.abs(afterDiscount - base) / deltaDiscount;

  const deltaMaterial = params.fixedMaterialCost * 0.01 || 10;
  const afterMaterial = calculateProfitLossBase(
    { ...params, fixedMaterialCost: params.fixedMaterialCost + deltaMaterial },
    normalConfig
  );
  const impactMaterial = Math.abs(afterMaterial - base) / deltaMaterial;

  const deltaLoss = 0.1;
  const afterLoss = calculateProfitLossBase(
    { ...params, inventoryLossRate: params.inventoryLossRate + deltaLoss },
    normalConfig
  );
  const impactLoss = Math.abs(afterLoss - base) / deltaLoss;

  const items: SensitivityItem[] = [
    { name: 'discountRate', label: '折扣力度', impact: impactDiscount, unit: '每1%折扣' },
    { name: 'estimatedTraffic', label: '预估客流', impact: impactTraffic, unit: '每1位顾客' },
    { name: 'avgItemPrice', label: '商品均价', impact: impactAvgPrice, unit: '每1元均价' },
    { name: 'fixedMaterialCost', label: '物料成本', impact: impactMaterial, unit: '每1元投入' },
    { name: 'inventoryLossRate', label: '库存损耗率', impact: impactLoss, unit: '每0.1%损耗' },
  ];

  return items.sort((a, b) => b.impact - a.impact);
}

function calculateProfitLossBase(
  params: CalculationParams,
  normalConfig: NormalConfig
): number {
  const { totals } = computeCore(params, normalConfig);
  return totals.grossProfit - params.fixedMaterialCost - totals.inventoryLossCost;
}

export function checkConstraints(
  params: CalculationParams,
  result: CalculationResult,
  normalConfig: NormalConfig
): ConstraintResult {
  const { estimatedTraffic, categories } = params;
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

  const trafficRatioSum = categories.reduce((sum, c) => sum + c.trafficRatio, 0);
  const isTrafficRatioInvalid = Math.abs(trafficRatioSum - 100) > 0.01;
  let trafficRatioMsg = '';
  if (isTrafficRatioInvalid) {
    const diff = (trafficRatioSum - 100).toFixed(1);
    trafficRatioMsg = `各品类客流占比之和为 ${trafficRatioSum.toFixed(1)}%，${diff.startsWith('-') ? '缺少' : '超出'} ${Math.abs(Number(diff))}%，必须等于100%才能出具最终结论`;
  }

  const canIssueConclusion = !isTrafficRatioInvalid;

  return {
    isLossWarning,
    lossWarningMsg,
    isTrafficOverflow,
    trafficSuggestions,
    maxStoreCapacity,
    isTrafficRatioInvalid,
    trafficRatioSum,
    trafficRatioMsg,
    canIssueConclusion,
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

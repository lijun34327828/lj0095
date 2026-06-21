export interface Category {
  id: string;
  name: string;
  trafficRatio: number;
  avgPrice: number;
  grossMarginRate: number;
  inventoryLossRate: number;
}

export interface DiscountTier {
  id: string;
  threshold: number;
  discountRate: number;
}

export interface CategoryResult {
  categoryId: string;
  categoryName: string;
  trafficCount: number;
  hitTierId: string | null;
  hitTierLabel: string;
  appliedDiscountRate: number;
  totalConcession: number;
  inventoryLossCost: number;
  activityRevenue: number;
  grossProfit: number;
  netProfit: number;
}

export interface SensitivityItem {
  name: string;
  label: string;
  impact: number;
  unit: string;
}

export interface CalculationParams {
  discountRate: number;
  estimatedTraffic: number;
  avgItemPrice: number;
  fixedMaterialCost: number;
  inventoryLossRate: number;
  categories: Category[];
  discountTiers: DiscountTier[];
  useTieredDiscount: boolean;
}

export interface CalculationResult {
  totalConcession: number;
  materialLossCost: number;
  inventoryLossCost: number;
  totalCost: number;
  activityRevenue: number;
  activityNetProfit: number;
  normalRevenue: number;
  normalNetProfit: number;
  profitLossDiff: number;
  profitLossRate: number;
  categoryResults: CategoryResult[];
  breakEvenDiscountRate: number | null;
  sensitivityRanking: SensitivityItem[];
}

export interface ConstraintResult {
  isLossWarning: boolean;
  lossWarningMsg: string;
  isTrafficOverflow: boolean;
  trafficSuggestions: string[];
  maxStoreCapacity: number;
  isTrafficRatioInvalid: boolean;
  trafficRatioSum: number;
  trafficRatioMsg: string;
  canIssueConclusion: boolean;
}

export interface NormalConfig {
  normalTraffic: number;
  normalDiscountRate: number;
  normalMaterialCost: number;
  normalLossRate: number;
  maxStoreCapacity: number;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: uid(),
    name: '日用百货',
    trafficRatio: 35,
    avgPrice: 59,
    grossMarginRate: 25,
    inventoryLossRate: 2,
  },
  {
    id: uid(),
    name: '食品饮料',
    trafficRatio: 40,
    avgPrice: 35,
    grossMarginRate: 35,
    inventoryLossRate: 4,
  },
  {
    id: uid(),
    name: '服饰鞋包',
    trafficRatio: 25,
    avgPrice: 189,
    grossMarginRate: 45,
    inventoryLossRate: 1,
  },
];

export const DEFAULT_DISCOUNT_TIERS: DiscountTier[] = [
  { id: uid(), threshold: 100, discountRate: 5 },
  { id: uid(), threshold: 200, discountRate: 10 },
  { id: uid(), threshold: 400, discountRate: 20 },
];

export const DEFAULT_PARAMS: CalculationParams = {
  discountRate: 20,
  estimatedTraffic: 500,
  avgItemPrice: 89,
  fixedMaterialCost: 2000,
  inventoryLossRate: 3,
  categories: DEFAULT_CATEGORIES,
  discountTiers: DEFAULT_DISCOUNT_TIERS,
  useTieredDiscount: true,
};

export const DEFAULT_NORMAL_CONFIG: NormalConfig = {
  normalTraffic: 300,
  normalDiscountRate: 0,
  normalMaterialCost: 500,
  normalLossRate: 1,
  maxStoreCapacity: 800,
};

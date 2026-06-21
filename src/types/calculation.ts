export interface CalculationParams {
  discountRate: number;
  estimatedTraffic: number;
  avgItemPrice: number;
  fixedMaterialCost: number;
  inventoryLossRate: number;
}

export interface CalculationResult {
  totalConcession: number;
  materialLossCost: number;
  inventoryLossCost: number;
  activityRevenue: number;
  activityNetProfit: number;
  normalRevenue: number;
  normalNetProfit: number;
  profitLossDiff: number;
  profitLossRate: number;
}

export interface ConstraintResult {
  isLossWarning: boolean;
  lossWarningMsg: string;
  isTrafficOverflow: boolean;
  trafficSuggestions: string[];
  maxStoreCapacity: number;
}

export interface NormalConfig {
  normalTraffic: number;
  normalDiscountRate: number;
  normalMaterialCost: number;
  normalLossRate: number;
  maxStoreCapacity: number;
}

export const DEFAULT_PARAMS: CalculationParams = {
  discountRate: 20,
  estimatedTraffic: 500,
  avgItemPrice: 89,
  fixedMaterialCost: 2000,
  inventoryLossRate: 3,
};

export const DEFAULT_NORMAL_CONFIG: NormalConfig = {
  normalTraffic: 300,
  normalDiscountRate: 0,
  normalMaterialCost: 500,
  normalLossRate: 1,
  maxStoreCapacity: 800,
};

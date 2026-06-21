import { create } from 'zustand';
import {
  CalculationParams,
  CalculationResult,
  ConstraintResult,
  NormalConfig,
  DEFAULT_PARAMS,
  DEFAULT_NORMAL_CONFIG,
  Category,
  DiscountTier,
} from '@/types/calculation';
import { calculateProfitLoss, checkConstraints } from '@/utils/calculation';

const uid = () => Math.random().toString(36).slice(2, 10);

interface CalculatorState {
  params: CalculationParams;
  normalConfig: NormalConfig;
  result: CalculationResult;
  constraints: ConstraintResult;
  setParam: <K extends keyof CalculationParams>(key: K, value: CalculationParams[K]) => void;
  setNormalConfig: <K extends keyof NormalConfig>(key: K, value: NormalConfig[K]) => void;
  resetParams: () => void;
  recalculate: () => void;
  addCategory: () => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, field: keyof Category, value: number | string) => void;
  addDiscountTier: () => void;
  removeDiscountTier: (id: string) => void;
  updateDiscountTier: (id: string, field: keyof DiscountTier, value: number) => void;
  toggleTieredDiscount: (enabled: boolean) => void;
  normalizeTrafficRatios: () => void;
}

function recalcAll(params: CalculationParams, normalConfig: NormalConfig) {
  const newResult = calculateProfitLoss(params, normalConfig);
  const newConstraints = checkConstraints(params, newResult, normalConfig);
  return { result: newResult, constraints: newConstraints };
}

const initialResult = calculateProfitLoss(DEFAULT_PARAMS, DEFAULT_NORMAL_CONFIG);
const initialConstraints = checkConstraints(DEFAULT_PARAMS, initialResult, DEFAULT_NORMAL_CONFIG);

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  params: { ...DEFAULT_PARAMS, categories: JSON.parse(JSON.stringify(DEFAULT_PARAMS.categories)), discountTiers: JSON.parse(JSON.stringify(DEFAULT_PARAMS.discountTiers)) },
  normalConfig: { ...DEFAULT_NORMAL_CONFIG },
  result: initialResult,
  constraints: initialConstraints,

  setParam: (key, value) => {
    set((state) => {
      const newParams = { ...state.params, [key]: value };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  setNormalConfig: (key, value) => {
    set((state) => {
      const newConfig = { ...state.normalConfig, [key]: value };
      const { result, constraints } = recalcAll(state.params, newConfig);
      return { normalConfig: newConfig, result, constraints };
    });
  },

  resetParams: () => {
    set((state) => {
      const freshCategories = JSON.parse(JSON.stringify(DEFAULT_PARAMS.categories));
      const freshTiers = JSON.parse(JSON.stringify(DEFAULT_PARAMS.discountTiers));
      const newParams = { ...DEFAULT_PARAMS, categories: freshCategories, discountTiers: freshTiers };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  recalculate: () => {
    const { params, normalConfig } = get();
    const { result, constraints } = recalcAll(params, normalConfig);
    set({ result, constraints });
  },

  addCategory: () => {
    set((state) => {
      const newCat: Category = {
        id: uid(),
        name: `品类${state.params.categories.length + 1}`,
        trafficRatio: 10,
        avgPrice: 89,
        grossMarginRate: 30,
        inventoryLossRate: 2,
      };
      const newParams = { ...state.params, categories: [...state.params.categories, newCat] };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  removeCategory: (id) => {
    set((state) => {
      if (state.params.categories.length <= 1) return {};
      const newParams = { ...state.params, categories: state.params.categories.filter((c) => c.id !== id) };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  updateCategory: (id, field, value) => {
    set((state) => {
      const newCategories = state.params.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      );
      const newParams = { ...state.params, categories: newCategories };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  addDiscountTier: () => {
    set((state) => {
      const maxThreshold = state.params.discountTiers.length > 0
        ? Math.max(...state.params.discountTiers.map((t) => t.threshold))
        : 0;
      const maxDiscount = state.params.discountTiers.length > 0
        ? Math.max(...state.params.discountTiers.map((t) => t.discountRate))
        : 0;
      const newTier: DiscountTier = {
        id: uid(),
        threshold: maxThreshold + 200,
        discountRate: Math.min(maxDiscount + 5, 80),
      };
      const newParams = { ...state.params, discountTiers: [...state.params.discountTiers, newTier] };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  removeDiscountTier: (id) => {
    set((state) => {
      if (state.params.discountTiers.length <= 0) return {};
      const newParams = { ...state.params, discountTiers: state.params.discountTiers.filter((t) => t.id !== id) };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  updateDiscountTier: (id, field, value) => {
    set((state) => {
      const newTiers = state.params.discountTiers.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      );
      const newParams = { ...state.params, discountTiers: newTiers };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  toggleTieredDiscount: (enabled) => {
    set((state) => {
      const newParams = { ...state.params, useTieredDiscount: enabled };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },

  normalizeTrafficRatios: () => {
    set((state) => {
      const sum = state.params.categories.reduce((s, c) => s + c.trafficRatio, 0);
      if (sum === 0) return {};
      const scale = 100 / sum;
      let runningSum = 0;
      const newCategories = state.params.categories.map((c, i) => {
        if (i === state.params.categories.length - 1) {
          return { ...c, trafficRatio: Math.round((100 - runningSum) * 10) / 10 };
        }
        const ratio = Math.round(c.trafficRatio * scale * 10) / 10;
        runningSum += ratio;
        return { ...c, trafficRatio: ratio };
      });
      const newParams = { ...state.params, categories: newCategories };
      const { result, constraints } = recalcAll(newParams, state.normalConfig);
      return { params: newParams, result, constraints };
    });
  },
}));

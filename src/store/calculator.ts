import { create } from 'zustand';
import { CalculationParams, CalculationResult, ConstraintResult, NormalConfig, DEFAULT_PARAMS, DEFAULT_NORMAL_CONFIG } from '@/types/calculation';
import { calculateProfitLoss, checkConstraints } from '@/utils/calculation';

interface CalculatorState {
  params: CalculationParams;
  normalConfig: NormalConfig;
  result: CalculationResult;
  constraints: ConstraintResult;
  setParam: <K extends keyof CalculationParams>(key: K, value: number) => void;
  setNormalConfig: <K extends keyof NormalConfig>(key: K, value: number) => void;
  resetParams: () => void;
  recalculate: () => void;
}

const initialResult = calculateProfitLoss(DEFAULT_PARAMS, DEFAULT_NORMAL_CONFIG);
const initialConstraints = checkConstraints(DEFAULT_PARAMS, initialResult, DEFAULT_NORMAL_CONFIG);

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  params: { ...DEFAULT_PARAMS },
  normalConfig: { ...DEFAULT_NORMAL_CONFIG },
  result: initialResult,
  constraints: initialConstraints,

  setParam: (key, value) => {
    set((state) => {
      const newParams = { ...state.params, [key]: value };
      const newResult = calculateProfitLoss(newParams, state.normalConfig);
      const newConstraints = checkConstraints(newParams, newResult, state.normalConfig);
      return {
        params: newParams,
        result: newResult,
        constraints: newConstraints,
      };
    });
  },

  setNormalConfig: (key, value) => {
    set((state) => {
      const newConfig = { ...state.normalConfig, [key]: value };
      const newResult = calculateProfitLoss(state.params, newConfig);
      const newConstraints = checkConstraints(state.params, newResult, newConfig);
      return {
        normalConfig: newConfig,
        result: newResult,
        constraints: newConstraints,
      };
    });
  },

  resetParams: () => {
    set((state) => {
      const newResult = calculateProfitLoss(DEFAULT_PARAMS, state.normalConfig);
      const newConstraints = checkConstraints(DEFAULT_PARAMS, newResult, state.normalConfig);
      return {
        params: { ...DEFAULT_PARAMS },
        result: newResult,
        constraints: newConstraints,
      };
    });
  },

  recalculate: () => {
    const { params, normalConfig } = get();
    const newResult = calculateProfitLoss(params, normalConfig);
    const newConstraints = checkConstraints(params, newResult, normalConfig);
    set({
      result: newResult,
      constraints: newConstraints,
    });
  },
}));

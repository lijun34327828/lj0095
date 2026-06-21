import React from 'react';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency, formatPercent, formatNumber } from '@/utils/calculation';

interface DataCardProps {
  label: string;
  value: number;
  format?: 'currency' | 'percent' | 'number';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  warning?: boolean;
  decimals?: number;
  suffix?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  format = 'currency',
  icon,
  trend = 'neutral',
  highlight = false,
  warning = false,
  decimals = 2,
  suffix = '',
}) => {
  const animatedValue = useAnimatedNumber(value, 400, decimals);

  const displayValue = (() => {
    switch (format) {
      case 'currency':
        return formatCurrency(animatedValue);
      case 'percent':
        return formatPercent(animatedValue);
      case 'number':
        return formatNumber(animatedValue, decimals);
      default:
        return animatedValue.toFixed(decimals);
    }
  })();

  const getTextColor = () => {
    if (warning) return 'text-warning-red';
    if (highlight) return 'text-amber-gold';
    if (trend === 'up' && value > 0) return 'text-success-green';
    if (trend === 'down' && value < 0) return 'text-warning-red';
    return 'text-white';
  };

  const getBorderColor = () => {
    if (warning) return 'border-warning-red/40';
    if (highlight) return 'border-amber-gold/40';
    return 'border-navy-700/50';
  };

  const getBgClass = () => {
    if (warning) return 'bg-warning-red/5';
    if (highlight) return 'bg-amber-gold/5';
    return 'bg-navy-800/60';
  };

  return (
    <div
      className={`${getBgClass()} backdrop-blur-sm rounded-xl p-4 border ${getBorderColor()} 
        hover:border-opacity-80 transition-all duration-300 group relative overflow-hidden`}
    >
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-gold/10 via-transparent to-transparent opacity-60" />
      )}
      {warning && (
        <div className="absolute inset-0 bg-gradient-to-br from-warning-red/10 via-transparent to-transparent opacity-60" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-navy-300 text-sm font-medium">{label}</span>
          {icon && (
            <div className={`${getTextColor()} opacity-70 group-hover:opacity-100 transition-opacity`}>
              {icon}
            </div>
          )}
        </div>

        <div className={`text-2xl font-mono font-bold ${getTextColor()} tracking-tight`}>
          {displayValue}
          {suffix && <span className="text-sm text-navy-400 font-normal ml-1">{suffix}</span>}
        </div>

        {trend !== 'neutral' && (
          <div className={`text-xs mt-1 flex items-center gap-1 ${getTextColor()}`}>
            {trend === 'up' && value > 0 && <span>↑ 同比增长</span>}
            {trend === 'down' && value < 0 && <span>↓ 同比下降</span>}
          </div>
        )}
      </div>
    </div>
  );
};

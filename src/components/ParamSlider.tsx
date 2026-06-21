import React from 'react';
import { Settings2 } from 'lucide-react';

interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
  description?: string;
}

export const ParamSlider: React.FC<ParamSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  icon,
  onChange,
  description,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) newValue = min;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  return (
    <div className="bg-navy-800/60 backdrop-blur-sm rounded-xl p-5 border border-navy-700/50 hover:border-navy-600/70 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-amber-gold opacity-80 group-hover:opacity-100 transition-opacity">
              {icon}
            </div>
          )}
          <span className="text-navy-200 font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={step}
            className="w-20 bg-navy-900/80 text-amber-gold font-mono text-right px-2 py-1 rounded-md border border-navy-600/50 focus:border-amber-gold/60 focus:outline-none focus:ring-1 focus:ring-amber-gold/30 transition-all text-sm"
          />
          <span className="text-navy-400 text-sm w-8">{unit}</span>
        </div>
      </div>

      <div className="relative h-2 bg-navy-900/80 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-goldDark via-amber-gold to-amber-goldLight rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-navy-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>

      {description && (
        <p className="mt-2 text-xs text-navy-500 flex items-center gap-1">
          <Settings2 size={12} />
          {description}
        </p>
      )}
    </div>
  );
};

import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  label?: string;
  icon?: React.ReactNode;
}

export const Slider: React.FC<SliderProps> = ({ value, min, max, onChange, label, icon }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs text-neutral-500 uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </div>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand"
      />
    </div>
  );
};
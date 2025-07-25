import { useState } from 'preact/hooks';
import { Palette } from 'lucide-preact';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#fef08a', // Yellow
  '#fbbf24', // Amber
  '#fb7185', // Rose
  '#a78bfa', // Purple
  '#60a5fa', // Blue
  '#34d399', // Emerald
  '#f97316', // Orange
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
];

export function ColorPicker({ currentColor, onColorChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e: any) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:opacity-60"
        title="Change color"
      >
        <Palette size={14} className="text-white/70" />
      </button>

      {isOpen && (
        <div
          className="absolute top-6 left-0 bg-white shadow-lg border border-gray-200 p-2 z-50"
          style={{ minWidth: '100px' }}
        >
          <div className="grid grid-cols-5 gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className={`w-4 h-4 border ${
                  currentColor === color ? 'border-gray-600' : 'border-gray-300'
                } hover:border-gray-600 transition-colors`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { FormatState, ExcelColor, NegativeMode, ZeroMode } from '../types';
import { Palette } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  state: FormatState;
  updateState: (section: keyof FormatState, key: string, value: any) => void;
}

const COLORS: ExcelColor[] = ['Black', 'Blue', 'Cyan', 'Green', 'Magenta', 'Red', 'White', 'Yellow'];

const ColorPicker: React.FC<{ value: ExcelColor; onChange: (c: ExcelColor) => void }> = ({ value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
      <Palette className="w-3.5 h-3.5" /> Color
      <Tooltip text="Sets the text color for this zone. 'Default' uses the user's theme color." />
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? (e.target.value as ExcelColor) : null)}
      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
    >
      <option value="">Default (Auto)</option>
      {COLORS.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>
);

const ZoneBuilder: React.FC<Props> = ({ state, updateState }) => {
  const [activeTab, setActiveTab] = useState<'positive' | 'negative' | 'zero' | 'text'>('positive');

  const tabs = [
    { id: 'positive', label: 'Positive' },
    { id: 'negative', label: 'Negative' },
    { id: 'zero', label: 'Zero' },
    { id: 'text', label: 'Text' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
      {/* Compact Tab Header */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? `border-indigo-500 text-indigo-700 bg-indigo-50/50`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Compact Tab Content */}
      <div className="p-4">
        {activeTab === 'positive' && (
          <div className="space-y-4">
            <ColorPicker
              value={state.positive.color}
              onChange={(c) => updateState('positive', 'color', c)}
            />
            
            <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
               <input
                type="checkbox"
                checked={state.positive.padding}
                onChange={(e) => updateState('positive', 'padding', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      Alignment Padding
                      <Tooltip text="Adds a hidden spacer '_)' to the right so positive numbers align vertically with negative numbers in parentheses." />
                  </span>
                  <span className="text-xs text-gray-500 block">Adds <code>_)</code> to align with negatives.</span>
              </div>
            </label>
          </div>
        )}

        {activeTab === 'negative' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                  Format Mode
                  <Tooltip text="Choose how negative values appear: standard minus, red text, parentheses, or both." />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'minus', label: '-1.23', sub: 'Standard' },
                  { id: 'color', label: '1.23', sub: 'Color' },
                  { id: 'paren', label: '(1.23)', sub: 'Parens' },
                  { id: 'parenColor', label: '(1.23)', sub: 'Red ()' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateState('negative', 'mode', option.id as NegativeMode);
                      if ((option.id === 'color' || option.id === 'parenColor') && !state.negative.color) {
                        updateState('negative', 'color', 'Red');
                      }
                    }}
                    className={`px-3 py-2 rounded-md border text-left transition-all ${
                      state.negative.mode === option.id
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${
                        state.negative.mode === option.id ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                        {option.label}
                    </div>
                    <div className="text-[10px] text-gray-500">{option.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <ColorPicker
              value={state.negative.color}
              onChange={(c) => updateState('negative', 'color', c)}
            />
          </div>
        )}

        {activeTab === 'zero' && (
          <div className="space-y-4">
             <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                  Display Logic
                  <Tooltip text="Determines what is shown when the cell value is exactly 0." />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                    { id: 'number', label: '0.00', desc: 'Number' },
                    { id: 'dash', label: '-', desc: 'Dash' },
                    { id: 'hide', label: '', desc: 'Blank' },
                    { id: 'text', label: 'Text', desc: 'Custom' }
                ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
                        state.zero.mode === opt.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}>
                        <input
                            type="radio"
                            name="zeroMode"
                            checked={state.zero.mode === opt.id}
                            onChange={() => updateState('zero', 'mode', opt.id as ZeroMode)}
                            className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <div>
                            <div className="text-xs font-medium text-gray-700">{opt.desc}</div>
                            {opt.label && <div className="text-[10px] text-gray-400 font-mono truncate">{opt.label}</div>}
                        </div>
                    </label>
                ))}
              </div>
            </div>

            {state.zero.mode === 'text' && (
              <div className="animate-fade-in">
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Custom Text</label>
                 <input
                  type="text"
                  value={state.zero.customText}
                  onChange={(e) => updateState('zero', 'customText', e.target.value)}
                  placeholder='e.g. Free'
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                 />
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-2.5">
                <p className="text-xs text-blue-800">
                    <strong className="font-mono">@</strong> = Input. Quotes added automatically.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                        Prefix
                        <Tooltip text="Text displayed before the cell's content." />
                    </label>
                    <input
                        type="text"
                        value={state.text.prefix}
                        onChange={(e) => updateState('text', 'prefix', e.target.value)}
                        placeholder='Name: '
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                        Suffix
                        <Tooltip text="Text displayed after the cell's content." />
                    </label>
                    <input
                        type="text"
                        value={state.text.suffix}
                        onChange={(e) => updateState('text', 'suffix', e.target.value)}
                        placeholder='kg'
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                    />
                </div>
            </div>
            {/* Removed the large internal preview box to save space */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneBuilder;
import React from 'react';
import { Settings, Coins, Hash, Scaling, Percent, AlignHorizontalJustifyStart } from 'lucide-react';
import { GlobalSettings as GlobalSettingsType, ScaleMode } from '../types';
import Tooltip from './Tooltip';

interface Props {
  settings: GlobalSettingsType;
  updateSettings: (key: keyof GlobalSettingsType, value: any) => void;
}

const GlobalSettings: React.FC<Props> = ({ settings, updateSettings }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Settings className="w-4 h-4 text-indigo-600" />
        <h2 className="text-base font-semibold text-gray-800">Global Formatting</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decimals */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Decimals
              <Tooltip text="Sets the number of fixed digits to display after the decimal point (e.g., 0.00)." />
            </label>
            <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
              {settings.decimals}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={settings.decimals}
            onChange={(e) => updateSettings('decimals', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block mt-2"
          />
        </div>

        {/* Integer Padding (Leading Zeros) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlignHorizontalJustifyStart className="w-3.5 h-3.5" /> Leading Zeros
              <Tooltip text="Ensures the number has at least this many digits by adding zeros to the front (e.g., 5 becomes 005)." />
            </label>
             <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
              {settings.integerPadding}
            </span>
          </div>
           <input
            type="range"
            min="1"
            max="10"
            value={settings.integerPadding}
            onChange={(e) => updateSettings('integerPadding', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block mt-2"
          />
        </div>

        {/* Separator */}
        <div className="space-y-1.5 flex flex-col justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
              Thousands Separator
              <Tooltip text="Adds a comma separator every thousand (e.g., 1,000)." />
          </label>
           <button
            onClick={() => updateSettings('separator', !settings.separator)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
             <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.separator ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${settings.separator ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="text-xs text-gray-600">{settings.separator ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>

        {/* Percentage */}
        <div className="space-y-1.5 flex flex-col justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" /> Percentage
                <Tooltip text="Multiplies the value by 100 and displays it with a % symbol (e.g., 0.1 becomes 10%)." />
            </label>
             <button
            onClick={() => updateSettings('percentage', !settings.percentage)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
             <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.percentage ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${settings.percentage ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="text-xs text-gray-600">{settings.percentage ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>

        {/* Scale */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Scaling className="w-3.5 h-3.5" /> Scale
            <Tooltip text="Divides the number by 1,000 (K) or 1,000,000 (M) for compact display without changing the real value." />
          </label>
          <div className="flex gap-1">
            {(['none', 'K', 'M'] as ScaleMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSettings('scale', mode)}
                className={`flex-1 py-1.5 text-xs rounded border transition-all ${
                  settings.scale === mode
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode === 'none' ? 'None' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" /> Currency
            <Tooltip text="Adds a currency symbol (like $) or text (USD) before or after the number." />
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.currencySymbol}
              onChange={(e) => updateSettings('currencySymbol', e.target.value)}
              placeholder="$"
              className="w-12 px-2 py-1.5 bg-white border border-gray-300 rounded text-sm text-center focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
            <button
              onClick={() => updateSettings('currencyPosition', settings.currencyPosition === 'prefix' ? 'suffix' : 'prefix')}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-gray-600"
            >
              {settings.currencyPosition === 'prefix' ? 'Prefix ($1)' : 'Suffix (1$)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
import React from 'react';
import { DateTimeState, DateOrder, DurationUnit, SmartDurationType } from '../types';
import { Calendar, Clock, Globe, Hourglass, Type, Sparkles, AlertTriangle } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  state: DateTimeState;
  updateState: (key: keyof DateTimeState, value: any) => void;
}

const LOCALES = [
  { code: '', label: 'None (Default)' },
  { code: '[$-en-US]', label: 'English (US)' },
  { code: '[$-en-GB]', label: 'English (UK)' },
  { code: '[$-fr-FR]', label: 'French (France)' },
  { code: '[$-de-DE]', label: 'German (Germany)' },
  { code: '[$-es-ES]', label: 'Spanish (Spain)' },
  { code: '[$-ja-JP]', label: 'Japanese (Japan)' },
  { code: '[$-zh-CN]', label: 'Chinese (China)' },
  { code: '[$-x-sysdate]', label: 'System Long Date' },
];

const DateTimeBuilder: React.FC<Props> = ({ state, updateState }) => {
  
  const isDuration = state.mode === 'duration';
  
  // Conflict Logic: Excel fails if you mix Date tokens with Elapsed Days [d] or Elapsed Mins [m]
  // We only allow Date + Duration if the leading unit is 'hours' [h].
  const isDateDisabled = isDuration && (
      state.smartDuration !== 'none' || 
      (state.leadingDurationUnit !== 'hours')
  );

  // Hierarchy Logic: 
  // If [m] is leading, we cannot show hours (h).
  // If [s] is leading, we cannot show hours (h) or minutes (m).
  const isHourDisabled = isDuration && (state.leadingDurationUnit === 'minutes' || state.leadingDurationUnit === 'seconds');
  const isMinuteDisabled = isDuration && (state.leadingDurationUnit === 'seconds');

  const handleSmartPreset = (type: SmartDurationType) => {
    updateState('smartDuration', type);
    if (type !== 'none') {
        updateState('hourFormat', 'none');
        updateState('minuteFormat', 'none');
        updateState('secondFormat', 'none');
        updateState('useDate', false); 
    }
  };

  const handleLeadingUnitChange = (unit: DurationUnit) => {
      updateState('leadingDurationUnit', unit);
      
      if (isDuration) {
          // Date conflict handling
          if (unit !== 'hours') {
              updateState('useDate', false);
          }

          // UX: Restore defaults when moving up the hierarchy, disable when moving down
          if (unit === 'hours') {
              // Restore Hour if it was disabled/none
              if (state.hourFormat === 'none') updateState('hourFormat', 'hh');
              // We don't touch minutes/seconds as they are valid children of Hours
          } 
          else if (unit === 'minutes') {
              // Disable parent (Hours)
              updateState('hourFormat', 'none');
              // Restore Minute if it was disabled/none (Ensure the leading unit is visible)
              if (state.minuteFormat === 'none') updateState('minuteFormat', 'mm');
          } 
          else if (unit === 'seconds') {
              // Disable parents (Hours, Minutes)
              updateState('hourFormat', 'none');
              updateState('minuteFormat', 'none');
              // Restore Second if it was disabled/none (Ensure the leading unit is visible)
              if (state.secondFormat === 'none') updateState('secondFormat', 'ss');
          }
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      
      {/* Mode Toggle Bar */}
      <div className="flex border-b border-gray-200">
        <button
            onClick={() => {
                updateState('mode', 'clock');
                updateState('smartDuration', 'none');
                updateState('hourSuffix', ':');
                updateState('minuteSuffix', '');
                updateState('useDate', true);
            }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                !isDuration 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
            <Clock className="w-4 h-4" />
            Standard Clock
        </button>
        <button
            onClick={() => {
                updateState('mode', 'duration');
                 updateState('hourSuffix', 'h ');
                 updateState('minuteSuffix', 'm ');
            }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                isDuration 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
            <Hourglass className="w-4 h-4" />
            Elapsed Duration
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Date Section */}
        <div className={`space-y-4 ${isDateDisabled ? 'opacity-50 grayscale' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Date Configuration</h3>
            </div>
            
            {isDateDisabled ? (
                <div className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Disabled in this mode
                </div>
            ) : (
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={state.useDate} 
                        onChange={(e) => updateState('useDate', e.target.checked)} 
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            )}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${state.useDate && !isDateDisabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sequence</label>
                <div className="flex rounded-md shadow-sm">
                    {(['DMY', 'MDY', 'YMD'] as DateOrder[]).map((order) => (
                        <button
                            key={order}
                            onClick={() => updateState('dateOrder', order)}
                            className={`flex-1 px-3 py-2 text-sm border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 ${
                                state.dateOrder === order 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 z-10 font-medium' 
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {order}
                        </button>
                    ))}
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Separator</label>
                <div className="flex gap-2">
                    <select 
                        value={state.dateSeparator}
                        onChange={(e) => updateState('dateSeparator', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                    >
                        <option value="/">Slash (/)</option>
                        <option value="-">Dash (-)</option>
                        <option value=".">Dot (.)</option>
                        <option value=" ">Space ( )</option>
                        <option value=", ">Comma (, )</option>
                        <option value="custom">Custom...</option>
                    </select>
                    {state.dateSeparator === 'custom' && (
                         <input 
                            type="text" 
                            value={state.customDateSeparator}
                            onChange={(e) => updateState('customDateSeparator', e.target.value)}
                            className="w-16 px-2 py-2 bg-white border border-gray-300 rounded-md text-sm text-center text-gray-900"
                            placeholder="-"
                         />
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Day Format</label>
                <select 
                    value={state.dayFormat}
                    onChange={(e) => updateState('dayFormat', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                >
                    <option value="d">d (1-31)</option>
                    <option value="dd">dd (01-31)</option>
                    <option value="ddd">ddd (Mon)</option>
                    <option value="dddd">dddd (Monday)</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Month Format</label>
                <select 
                    value={state.monthFormat}
                    onChange={(e) => updateState('monthFormat', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                >
                    <option value="m">m (1-12)</option>
                    <option value="mm">mm (01-12)</option>
                    <option value="mmm">mmm (Jan)</option>
                    <option value="mmmm">mmmm (January)</option>
                    <option value="mmmmm">mmmmm (J)</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year Format</label>
                <select 
                    value={state.yearFormat}
                    onChange={(e) => updateState('yearFormat', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                >
                    <option value="yy">yy (25)</option>
                    <option value="yyyy">yyyy (2025)</option>
                </select>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Time / Duration Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {isDuration ? <Hourglass className="w-5 h-5 text-indigo-600" /> : <Clock className="w-5 h-5 text-indigo-600" />}
                <h3 className="text-lg font-semibold text-gray-800">
                    {isDuration ? 'Duration Config' : 'Time Config'}
                </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={state.useTime} onChange={(e) => updateState('useTime', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

           <div className={`space-y-4 transition-opacity ${state.useTime ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
             
             {isDuration && (
                 <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-lg p-3 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-800 font-semibold text-sm">
                        <Sparkles className="w-4 h-4" />
                        Magic Scaling Presets
                        <Tooltip text="Advanced logic presets. 'Auto Scale' changes units (mins vs hours) based on the size of the number." />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         {(['none', 'auto_scale', 'composite_text', 'timer'] as SmartDurationType[]).map(type => (
                             <button
                                key={type}
                                onClick={() => handleSmartPreset(type)}
                                className={`px-3 py-2 text-xs rounded border text-left transition-colors ${
                                    state.smartDuration === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 hover:bg-white/80'
                                }`}
                             >
                                <span className="font-bold block mb-0.5 capitalize">{type.replace('_', ' ')}</span>
                                {type === 'none' && 'Manual Builder'}
                                {type === 'auto_scale' && 'Mins < 1h, Hrs > 1h'}
                                {type === 'composite_text' && 'Standard [h] mm ss'}
                                {type === 'timer' && 'Smart mm:ss / hh:mm:ss'}
                             </button>
                         ))}
                    </div>
                 </div>
             )}

             {isDuration && state.smartDuration === 'none' ? (
                // DURATION MANUAL CONTROLS
                <>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Accumulate By (Leading Unit)
                        <Tooltip text="The unit that accumulates total time. [h] allows hours > 24. [m] allows minutes > 60." />
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* REMOVED DAYS - Excel does not support [d] elapsed */}
                        {(['hours', 'minutes', 'seconds'] as DurationUnit[]).map((unit) => (
                             <button
                                key={unit}
                                onClick={() => handleLeadingUnitChange(unit)}
                                className={`px-2 py-1.5 text-xs rounded border capitalize ${
                                    state.leadingDurationUnit === unit
                                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                    : 'bg-white border-gray-300 text-gray-600'
                                }`}
                             >
                                {unit}
                             </button>
                        ))}
                    </div>
                    {isDateDisabled && (
                        <p className="text-[10px] text-amber-600 mt-1">
                            Note: Selecting Minutes or Seconds as leading unit disables Calendar Dates to prevent token conflicts.
                        </p>
                    )}
                 </div>
                 
                 {/* HOURS */}
                 <div className={`grid grid-cols-12 gap-2 items-end ${isHourDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="col-span-8 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Hour</label>
                        <select 
                            value={state.hourFormat}
                            onChange={(e) => updateState('hourFormat', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                        >
                            <option value="none">None</option>
                            {isDuration && state.leadingDurationUnit === 'hours' ? (
                                <option value="hh">[h] (Elapsed Hours)</option> 
                            ) : (
                                <>
                                    <option value="h">h (5 or 17)</option>
                                    <option value="hh">hh (05 or 17)</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="col-span-4 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Type className="w-3 h-3"/> Suffix</label>
                        <input
                            type="text"
                            value={state.hourSuffix}
                            onChange={(e) => updateState('hourSuffix', e.target.value)}
                            placeholder=':'
                            className="w-full px-2 py-2 bg-white border border-gray-300 rounded text-sm font-mono text-gray-900"
                        />
                    </div>
                </div>

                {/* MINUTES */}
                <div className={`grid grid-cols-12 gap-2 items-end ${isMinuteDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="col-span-8 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Minute</label>
                        <select 
                            value={state.minuteFormat}
                            onChange={(e) => updateState('minuteFormat', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                        >
                            <option value="none">None</option>
                            {isDuration && state.leadingDurationUnit === 'minutes' ? (
                                <option value="mm">[m] (Elapsed Mins)</option>
                            ) : (
                                <>
                                    <option value="m">m (5)</option>
                                    <option value="mm">mm (05)</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="col-span-4 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Type className="w-3 h-3"/> Suffix</label>
                        <input
                            type="text"
                            value={state.minuteSuffix}
                            onChange={(e) => updateState('minuteSuffix', e.target.value)}
                            placeholder=':'
                            className="w-full px-2 py-2 bg-white border border-gray-300 rounded text-sm font-mono text-gray-900"
                        />
                    </div>
                </div>

                {/* SECONDS */}
                <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-8 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Second</label>
                        <select 
                            value={state.secondFormat}
                            onChange={(e) => updateState('secondFormat', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-gray-900"
                        >
                            <option value="none">None</option>
                            {isDuration && state.leadingDurationUnit === 'seconds' ? (
                                <option value="ss">[s] (Elapsed Secs)</option>
                            ) : (
                                <>
                                    <option value="s">s (9)</option>
                                    <option value="ss">ss (09)</option>
                                    <option value="ss.00">ss.00 (09.00)</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="col-span-4 space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Type className="w-3 h-3"/> Suffix</label>
                        <input
                            type="text"
                            value={state.secondSuffix}
                            onChange={(e) => updateState('secondSuffix', e.target.value)}
                            placeholder=''
                            className="w-full px-2 py-2 bg-white border border-gray-300 rounded text-sm font-mono text-gray-900"
                        />
                    </div>
                </div>
                </>
             ) : null}

             {!isDuration && (
                // CLOCK MODE CONTROLS
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">12-Hour Clock</label>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={state.use12Hour}
                                    onChange={(e) => updateState('use12Hour', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-600">Enable AM/PM</span>
                            </div>
                            <select 
                                value={state.amPmFormat}
                                disabled={!state.use12Hour}
                                onChange={(e) => updateState('amPmFormat', e.target.value)}
                                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 text-gray-900"
                            >
                                <option value="AM/PM">AM/PM</option>
                                <option value="am/pm">am/pm</option>
                                <option value="A/P">A/P</option>
                                <option value="a/p">a/p</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* STANDARD CLOCK DROPDOWNS */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Time Segments</label>
                        <div className="grid grid-cols-3 gap-2">
                             <select 
                                value={state.hourFormat}
                                onChange={(e) => updateState('hourFormat', e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono text-gray-900"
                            >
                                <option value="none">No Hour</option>
                                <option value="h">h</option>
                                <option value="hh">hh</option>
                            </select>
                            <select 
                                value={state.minuteFormat}
                                onChange={(e) => updateState('minuteFormat', e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono text-gray-900"
                            >
                                <option value="none">No Min</option>
                                <option value="m">m</option>
                                <option value="mm">mm</option>
                            </select>
                             <select 
                                value={state.secondFormat}
                                onChange={(e) => updateState('secondFormat', e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono text-gray-900"
                            >
                                <option value="none">No Sec</option>
                                <option value="s">s</option>
                                <option value="ss">ss</option>
                            </select>
                        </div>
                     </div>
                 </div>
             )}
             
        
           </div>
        </div>
        
        <div className="h-px bg-gray-200" />

        {/* Locale Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Advanced: Locale & Region</h3>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Locale Code
                    <Tooltip text="Forces the date to display in a specific language (e.g. [$-en-GB]) regardless of the user's system settings." />
                </label>
                <div className="flex gap-2">
                    <select
                        value={LOCALES.some(l => l.code === state.localeCode) ? state.localeCode : 'custom'}
                        onChange={(e) => {
                            if (e.target.value !== 'custom') {
                                updateState('localeCode', e.target.value);
                            } else {
                                // If switching to custom, keep current value but user focuses on input
                            }
                        }}
                        className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900"
                    >
                        {LOCALES.map(loc => (
                            <option key={loc.label} value={loc.code}>{loc.label}</option>
                        ))}
                        <option value="custom">Custom...</option>
                    </select>
                    <input
                        type="text"
                        value={state.localeCode}
                        onChange={(e) => updateState('localeCode', e.target.value)}
                        placeholder='e.g. [$-en-GB]'
                        className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono placeholder:text-gray-400 text-gray-900"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    Prepend a region code to force specific language displays (e.g. <code>[$-en-US]</code> for US English).
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DateTimeBuilder;
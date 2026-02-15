import React from 'react';
import { ConditionalState, ConditionalRule, ConditionOperator, ExcelColor } from '../types';
import { Plus, Trash2, Palette, BarChart3, AlertCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  state: ConditionalState;
  updateState: (state: ConditionalState) => void;
}

const COLORS: ExcelColor[] = ['Black', 'Blue', 'Cyan', 'Green', 'Magenta', 'Red', 'White', 'Yellow'];
const OPERATORS: ConditionOperator[] = ['>', '>=', '<', '<=', '=', '<>'];

const ConditionalBuilder: React.FC<Props> = ({ state, updateState }) => {

  const addRule = () => {
    // Excel supports up to 2 conditions + 1 default = 3 sections total
    if (state.rules.length >= 3) return;
    const newRule: ConditionalRule = {
        id: Math.random().toString(36).substr(2, 9),
        condition: { operator: '>', value: 0 },
        color: null,
        format: '0.00'
    };
    // Insert before the last rule (usually default) if exists, else append
    const rules = [...state.rules];
    if (rules.length > 0 && !rules[rules.length - 1].condition) {
        rules.splice(rules.length - 1, 0, newRule);
    } else {
        rules.push(newRule);
    }
    updateState({ rules });
  };

  const removeRule = (index: number) => {
    const rules = [...state.rules];
    rules.splice(index, 1);
    updateState({ rules });
  };

  const updateRule = (index: number, field: keyof ConditionalRule | 'operator' | 'value', val: any) => {
    const rules = [...state.rules];
    const rule = { ...rules[index] };

    if (field === 'operator' || field === 'value') {
        if (rule.condition) {
            rule.condition = { ...rule.condition, [field]: val };
        }
    } else {
        (rule as any)[field] = val;
    }
    rules[index] = rule;
    updateState({ rules });
  };

  const insertKPI = (index: number) => {
      // Inserts a progress bar character into the format
      const rules = [...state.rules];
      const current = rules[index].format;
      rules[index].format = '"█████"';
      updateState({ rules });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
       <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
           <h3 className="font-semibold text-gray-800 flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-indigo-600"/> Rules Logic
               <Tooltip text="Excel supports a maximum of 3 sections: Condition 1, Condition 2, and 'Else' (Default)." />
           </h3>
           <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
               {state.rules.length} / 3 Sections Used
           </span>
       </div>

       <div className="bg-blue-50 border-b border-blue-100 p-2.5 px-4 text-xs text-blue-800 leading-tight">
          <strong>Constraints:</strong> Excel Conditional Formats support max 2 explicit conditions and 1 else (3 total).
       </div>

       <div className="p-4 space-y-4">
           {state.rules.map((rule, index) => {
               const isDefault = !rule.condition;
               return (
                   <div key={rule.id} className="relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm transition-shadow hover:shadow-md hover:border-indigo-200 group">
                       
                       {/* Header: Condition */}
                       <div className="flex items-center gap-2 mb-3">
                           <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isDefault ? 'bg-gray-100 text-gray-600' : 'bg-indigo-100 text-indigo-700'}`}>
                               {isDefault ? 'ELSE / DEFAULT' : `IF CONDITION ${index + 1}`}
                           </div>
                           {!isDefault && (
                               <div className="flex items-center gap-2 ml-2">
                                   <select
                                        value={rule.condition?.operator}
                                        onChange={(e) => updateRule(index, 'operator', e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block px-2 py-1"
                                   >
                                       {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                                   </select>
                                   <input
                                        type="number"
                                        value={rule.condition?.value}
                                        onChange={(e) => updateRule(index, 'value', parseFloat(e.target.value))}
                                        className="w-20 bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block px-2 py-1"
                                   />
                               </div>
                           )}
                           
                           {!isDefault && (
                               <button 
                                onClick={() => removeRule(index)}
                                className="ml-auto text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Rule"
                               >
                                   <Trash2 className="w-4 h-4" />
                               </button>
                           )}
                       </div>

                       {/* Body: Format & Color */}
                       <div className="grid grid-cols-12 gap-3 items-end">
                           <div className="col-span-4 space-y-1">
                               <label className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                   <Palette className="w-3 h-3"/> Color
                               </label>
                               <select
                                    value={rule.color || ''}
                                    onChange={(e) => updateRule(index, 'color', e.target.value || null)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded focus:ring-indigo-500 focus:border-indigo-500 block px-2 py-1.5"
                               >
                                   <option value="">None</option>
                                   {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                           
                           <div className="col-span-8 space-y-1">
                               <label className="text-[10px] font-semibold text-gray-500 uppercase flex items-center justify-between">
                                   <span>Format String</span>
                                   <button 
                                    onClick={() => insertKPI(index)}
                                    className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded transition-colors"
                                   >
                                       <BarChart3 className="w-3 h-3"/> Insert Bar
                                   </button>
                               </label>
                               <input
                                    type="text"
                                    value={rule.format}
                                    onChange={(e) => updateRule(index, 'format', e.target.value)}
                                    placeholder='e.g. 0.00 "USD"'
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm font-mono rounded focus:ring-indigo-500 focus:border-indigo-500 block px-2 py-1.5"
                               />
                           </div>
                       </div>
                   </div>
               );
           })}

           {state.rules.length < 3 && (
                <button
                    onClick={addRule}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Conditional Rule
                </button>
           )}
       </div>
    </div>
  );
};

export default ConditionalBuilder;
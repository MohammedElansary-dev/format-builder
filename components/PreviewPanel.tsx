import React, { useState, useMemo } from 'react';
import { Copy, Check, AlertCircle, RefreshCcw, FileSpreadsheet } from 'lucide-react';
import { FormatState, DateTimeState, AppMode, ConditionalState } from '../types';
import { generateExcelString, formatNumberPreview, generateDateTimeString, formatDateTimePreview, generateConditionalString } from '../utils/excelFormatter';

interface Props {
  mode: AppMode;
  numberState: FormatState;
  dateState: DateTimeState;
  conditionalState?: ConditionalState;
}

const PreviewPanel: React.FC<Props> = ({ mode, numberState, dateState, conditionalState }) => {
  const [copied, setCopied] = useState(false);

  // --- LOCAL SAMPLE DATA STATE ---
  // Number Mode
  const [samplePos, setSamplePos] = useState<number>(1234.56);
  const [sampleNeg, setSampleNeg] = useState<number>(-1234.56);
  const [sampleZero, setSampleZero] = useState<number>(0);
  const [sampleText, setSampleText] = useState<string>('Input');

  // Date Mode
  const [sampleDate, setSampleDate] = useState<string>('2025-10-25T14:30');
  const [sampleDuration, setSampleDuration] = useState<number>(100000); // seconds

  let code = '';
  if (mode === 'number') code = generateExcelString(numberState);
  else if (mode === 'datetime') code = generateDateTimeString(dateState);
  else if (mode === 'conditional' && conditionalState) code = generateConditionalString(conditionalState);

  // --- VALIDATION LOGIC ---
  const validationErrors = useMemo(() => {
      const errors: string[] = [];
      const bracketMatches = code.match(/\[([a-zA-Z]+)\]/g);
      if (bracketMatches) {
          const validColors = ['Black', 'Blue', 'Cyan', 'Green', 'Magenta', 'Red', 'White', 'Yellow'];
          const timeTokens = ['h', 'hh', 'm', 'mm', 's', 'ss', 'd'];
          
          bracketMatches.forEach(match => {
              const content = match.slice(1, -1);
              if (!validColors.includes(content) && !timeTokens.includes(content.toLowerCase())) {
                   errors.push(`Invalid tag "${match}". Only standard 8 colors (e.g. [Red]) or time units (e.g. [h]) are allowed.`);
              }
          });
      }

      const codeWithoutQuotes = code.replace(/"[^"]*"/g, '');
      if (codeWithoutQuotes.includes('&')) errors.push('Character "&" detected. Custom formats cannot perform concatenation.');
      if (codeWithoutQuotes.match(/[0-9]\*24/)) errors.push('Calculations (like *24) are not supported in Custom Formats.');

      return errors;
  }, [code]);


  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColorClass = (excelColor: string | null | undefined) => {
    switch(excelColor) {
        case 'Red': return 'text-red-600';
        case 'Blue': return 'text-blue-600';
        case 'Green': return 'text-green-600';
        case 'Cyan': return 'text-cyan-600';
        case 'Magenta': return 'text-fuchsia-600';
        case 'Yellow': return 'text-yellow-600';
        case 'White': return 'text-white bg-gray-800 rounded px-1'; 
        default: return 'text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            {mode === 'conditional' ? 'Guidance' : 'Live Preview'}
          </h3>
          {mode !== 'conditional' && (
            <button 
                onClick={() => {
                    setSamplePos(1234.56); setSampleNeg(-1234.56); setSampleText('Input');
                    setSampleDate('2025-10-25T14:30'); setSampleDuration(100000);
                }}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Reset Sample Data"
            >
                <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          
          {/* NUMBER MODE */}
          {mode === 'number' && (
            <>
              <div className="grid grid-cols-12 bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-6">
                <div className="col-span-3">Zone</div>
                <div className="col-span-4">Sample Data (Editable)</div>
                <div className="col-span-5 text-right">Result</div>
              </div>
              {/* Positive */}
              <div className="grid grid-cols-12 py-3 px-6 items-center text-sm hover:bg-gray-50 transition-colors">
                <div className="col-span-3 font-medium text-gray-700">Positive</div>
                <div className="col-span-4">
                     <input type="number" value={samplePos} onChange={e => setSamplePos(parseFloat(e.target.value))} className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className={`col-span-5 font-mono font-bold truncate text-right ${getColorClass(numberState.positive.color)}`}>
                  {formatNumberPreview(samplePos, numberState)}
                </div>
              </div>
              {/* Negative */}
              <div className="grid grid-cols-12 py-3 px-6 items-center text-sm hover:bg-gray-50 transition-colors">
                <div className="col-span-3 font-medium text-gray-700">Negative</div>
                 <div className="col-span-4">
                     <input type="number" value={sampleNeg} onChange={e => setSampleNeg(parseFloat(e.target.value))} className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className={`col-span-5 font-mono font-bold truncate text-right ${getColorClass(numberState.negative.color)}`}>
                   {formatNumberPreview(sampleNeg, numberState)}
                </div>
              </div>
              {/* Zero */}
              <div className="grid grid-cols-12 py-3 px-6 items-center text-sm hover:bg-gray-50 transition-colors">
                <div className="col-span-3 font-medium text-gray-700">Zero</div>
                 <div className="col-span-4">
                     <input type="number" value={sampleZero} disabled className="w-24 px-2 py-1 border border-transparent bg-transparent text-gray-400 text-sm cursor-not-allowed" />
                </div>
                <div className="col-span-5 font-mono font-bold truncate text-right text-gray-500">
                   {formatNumberPreview(0, numberState, true)}
                </div>
              </div>
              {/* Text */}
              <div className="grid grid-cols-12 py-3 px-6 items-center text-sm hover:bg-gray-50 transition-colors">
                <div className="col-span-3 font-medium text-gray-700">Text</div>
                 <div className="col-span-4">
                     <input type="text" value={sampleText} onChange={e => setSampleText(e.target.value)} className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="col-span-5 font-mono font-bold truncate text-right text-gray-900">
                  {numberState.text.prefix + sampleText + numberState.text.suffix}
                </div>
              </div>
            </>
          )}

          {/* DATE TIME MODE */}
          {mode === 'datetime' && (
            <>
               <div className="grid grid-cols-12 bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-6">
                <div className="col-span-5">Sample Input</div>
                <div className="col-span-7 text-right">Preview Result</div>
              </div>
              <div className="grid grid-cols-12 py-6 px-6 items-center text-sm hover:bg-gray-50 transition-colors">
                <div className="col-span-5">
                    {dateState.mode === 'duration' ? (
                        <div className="space-y-1">
                             <label className="text-xs text-gray-400">Total Seconds</label>
                             <input 
                                type="number" 
                                value={sampleDuration} 
                                onChange={e => setSampleDuration(parseInt(e.target.value))} 
                                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-gray-700 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                            />
                        </div>
                    ) : (
                        <div className="space-y-1">
                             <label className="text-xs text-gray-400">Date Picker</label>
                             <input 
                                type="datetime-local" 
                                value={sampleDate} 
                                onChange={e => setSampleDate(e.target.value)} 
                                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-gray-700 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                            />
                        </div>
                    )}
                </div>
                <div className="col-span-7 font-mono font-bold text-lg truncate text-right text-indigo-900">
                  {formatDateTimePreview(dateState, new Date(sampleDate), sampleDuration)}
                </div>
              </div>
            </>
          )}

          {/* CONDITIONAL MODE REPLACEMENT */}
          {mode === 'conditional' && (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-gray-50/30">
                  <div className="bg-indigo-50 p-3 rounded-full mb-4">
                      <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-2">Use Excel for Verification</h3>
                  <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                      Advanced conditional formatting relies on Excel's internal calculation engine. 
                      Copy the generated code below and paste it directly into Excel's 
                      <strong> Custom Format</strong> dialog to view the results.
                  </p>
              </div>
          )}
        </div>
      </div>
      
      {/* Validation Warning Area */}
      {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2 text-red-800 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" /> Potential Errors Detected
              </div>
              <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                  {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                  ))}
              </ul>
          </div>
      )}

      {/* Code Output */}
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-300">Excel Format String</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="p-6 font-mono text-lg text-green-400 break-all leading-relaxed">
            {code}
        </div>
        <div className="px-6 py-3 bg-gray-950/50 border-t border-gray-800 text-xs text-gray-500">
            Paste this directly into the "Type" field in Excel's Format Cells {'>'} Custom.
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
import React, { useState } from 'react';
import { FormatState, DateTimeState, GlobalSettings as GlobalSettingsType, AppMode, ConditionalState } from './types';
import GlobalSettings from './components/GlobalSettings';
import ZoneBuilder from './components/ZoneBuilder';
import DateTimeBuilder from './components/DateTimeBuilder';
import ConditionalBuilder from './components/ConditionalBuilder';
import PreviewPanel from './components/PreviewPanel';
import ExamplesGallery from './components/ExamplesGallery';
import { FileSpreadsheet, Calculator, CalendarClock, Wand2, BookOpen, HelpCircle, Github, Linkedin } from 'lucide-react';

const INITIAL_NUMBER_STATE: FormatState = {
  global: {
    decimals: 2,
    separator: true,
    scale: 'none',
    currencySymbol: '$',
    currencyPosition: 'prefix',
    integerPadding: 1,
    percentage: false
  },
  positive: {
    color: null,
    padding: true
  },
  negative: {
    color: 'Red',
    mode: 'paren'
  },
  zero: {
    mode: 'dash',
    customText: 'Free'
  },
  text: {
    prefix: '',
    suffix: ''
  }
};

const INITIAL_DATE_STATE: DateTimeState = {
  mode: 'clock',
  useDate: true,
  useTime: true,
  localeCode: '',
  dateOrder: 'DMY',
  dateSeparator: '/',
  customDateSeparator: '-',
  dayFormat: 'dd',
  monthFormat: 'mm',
  yearFormat: 'yyyy',
  
  leadingDurationUnit: 'hours',
  smartDuration: 'none',
  hourFormat: 'hh',
  minuteFormat: 'mm',
  secondFormat: 'none',
  
  daySuffix: '',
  hourSuffix: ':',
  minuteSuffix: '',
  secondSuffix: '',

  use12Hour: false,
  amPmFormat: 'AM/PM'
};

const INITIAL_CONDITIONAL_STATE: ConditionalState = {
    rules: [
        { id: '1', condition: { operator: '>=', value: 100 }, color: 'Green', format: '"High" 0.0' },
        { id: '2', condition: { operator: '<', value: 50 }, color: 'Red', format: '"Low" 0.0' },
        { id: '3', color: 'Blue', format: '0.0' } // Default/Else
    ]
};

const MODES = [
  { id: 'number', label: 'Number Format', icon: Calculator },
  { id: 'datetime', label: 'Date & Time', icon: CalendarClock },
  { id: 'conditional', label: 'Advanced Logic', icon: Wand2 },
  { id: 'examples', label: 'Cheat Sheet', icon: BookOpen },
] as const;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('number');
  const [numberState, setNumberState] = useState<FormatState>(INITIAL_NUMBER_STATE);
  const [dateState, setDateState] = useState<DateTimeState>(INITIAL_DATE_STATE);
  const [conditionalState, setConditionalState] = useState<ConditionalState>(INITIAL_CONDITIONAL_STATE);
  
  // React State for image loading error (Best Practice)
  const [logoError, setLogoError] = useState(false);

  const updateGlobal = (key: keyof GlobalSettingsType, value: any) => {
    setNumberState(prev => ({
      ...prev,
      global: { ...prev.global, [key]: value }
    }));
  };

  const updateZone = (section: keyof FormatState, key: string, value: any) => {
    setNumberState(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FormatState] as any),
        [key]: value
      }
    }));
  };

  const updateDateState = (key: keyof DateTimeState, value: any) => {
    setDateState(prev => ({ ...prev, [key]: value }));
  };

  const updateConditionalState = (newState: ConditionalState) => {
      setConditionalState(newState);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">

            {!logoError ? (
              <img 
                src="logo.png" 
                alt="Format Builder Logo" 
                className="w-10 h-10 object-contain rounded-lg"
                onError={() => setLogoError(true)}
              />
            ) : (
              // Fallback UI rendered conditionally via React State
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
            )}

            <div>
                {/* 
                   SEO OPTIMIZATION: 
                   Using "Excel Custom Format Builder" in H1 matches user search intent 
                   better than just "Format Builder".
                */}
                <h1 className="text-xl font-bold text-gray-900 leading-none">Excel Format Builder</h1>
                <p className="text-xs text-gray-500 mt-1">Generate 4-zone logic codes for Excel & Google Sheets</p>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
              <a 
                href="https://github.com/MohammedElansary-dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="GitHub"
              >
                  <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/mohammed-elansary/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                  <Linkedin className="w-5 h-5" />
              </a>
              
              <div className="h-5 w-px bg-gray-200 mx-1"></div>

              <a 
                href="https://support.microsoft.com/en-us/office/review-guidelines-for-customizing-a-number-format-c0a1d1fa-d3f4-4018-96b7-9c9354dd99f5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Read Guidelines"
              >
                <HelpCircle className="w-5 h-5" />
              </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex items-center gap-1">
                {MODES.map((m) => {
                    const isActive = mode === m.id;
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id as AppMode)}
                            title={!isActive ? m.label : ''}
                            className={`flex items-center gap-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-md px-5 py-2.5' 
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 px-3 py-2.5'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className={`${isActive ? 'block' : 'hidden'} whitespace-nowrap`}>
                                {m.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

        {mode === 'examples' ? (
             <ExamplesGallery />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Panel: Builder Controls */}
            <div className="lg:col-span-5 space-y-6">
                
                {mode === 'number' && (
                    <>
                        <GlobalSettings 
                            settings={numberState.global} 
                            updateSettings={updateGlobal} 
                        />
                        <div className="h-px bg-gray-200 my-6" />
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 px-1">Zone Editor</h2>
                        <ZoneBuilder 
                            state={numberState} 
                            updateState={updateZone} 
                        />
                    </>
                )}

                {mode === 'datetime' && (
                    <DateTimeBuilder 
                        state={dateState} 
                        updateState={updateDateState}
                    />
                )}

                {mode === 'conditional' && (
                    <ConditionalBuilder 
                        state={conditionalState}
                        updateState={updateConditionalState}
                    />
                )}
            </div>

            {/* Right Panel: Preview & Output */}
            <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">How this mode works</h4>
                    {mode === 'number' && (
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Excel formats use 4 zones separated by semicolons: <br/>
                            <code className="bg-blue-100 px-1 rounded">Positive; Negative; Zero; Text</code>. <br/>
                            The tool automatically constructs this string based on your settings.
                        </p>
                    )}
                    {mode === 'datetime' && (
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Date codes (d, m, y) and Time codes (h, m, s) are combined. <br/>
                            <strong>Elapsed Time:</strong> Using brackets like <code>[h]</code> displays accumulated duration. 
                            <strong>Smart Durations:</strong> Can auto-scale units (e.g. show minutes if &lt; 1 hour).
                        </p>
                    )}
                    {mode === 'conditional' && (
                        <p className="text-xs text-blue-800 leading-relaxed">
                            <strong>Advanced Logic:</strong> Define up to 3 specific conditions (like <code>&gt;100</code>). 
                            Excel evaluates them left-to-right. Useful for coloring specific ranges or creating KPI dashboards with symbols.
                        </p>
                    )}
                </div>
                <PreviewPanel 
                    mode={mode} 
                    numberState={numberState} 
                    dateState={dateState}
                    conditionalState={conditionalState}
                />
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
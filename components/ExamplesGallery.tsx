import React, { useState } from 'react';
import { Copy, Check, Hash, Calendar, Coins, FlaskConical, Type } from 'lucide-react';

interface ExampleItem {
  name: string;
  code: string;
  sample: string;
}

interface Category {
  title: string;
  icon: any;
  items: ExampleItem[];
}

const CATEGORIES: Category[] = [
  {
    title: "Numbers",
    icon: Hash,
    items: [
      { name: "Plus and minus signs", code: "+#,##0;-#,##0;0", sample: "+12,345" },
      { name: "Thousands (only)", code: "#,##0,", sample: "12" },
      { name: "Millions", code: "#,##0,,\" M\"", sample: "0 M" },
      { name: "Hide Zeros", code: "#,##0.0;-#,##0.0;", sample: "12,345.0" },
      { name: "Hide Text", code: "#,##0.0;-#,##0.0;0.0;", sample: "12,345.6" },
      { name: "Space as separator", code: "# ##0", sample: "12 345" }
    ]
  },
  {
    title: "Currency",
    icon: Coins,
    items: [
      { name: "US Currency (Parens)", code: "$#,##0_);$(#,##0)", sample: "$(12,345)" },
      { name: "USD Code Prefix", code: "[$USD] #,##0;[$USD] -#,##0", sample: "USD 12,345" },
      { name: "Euro Suffix (€)", code: "#,##0\" €\"", sample: "12,345 €" }
    ]
  },
  {
    title: "Dates & Time",
    icon: Calendar,
    items: [
      { name: "ISO 8601 (YMD)", code: "yyyy-mm-dd", sample: "2008-12-30" },
      { name: "Day of Week", code: "dddd", sample: "Thursday" },
      { name: "Period Separated", code: "mm\\.dd\\.yyyy", sample: "12.30.2008" },
      { name: "Date & Time", code: "m/d/yyyy h:mm am/pm", sample: "12/30/2008 6:01 PM" },
      { name: "Elapsed Time (Stopwatch)", code: "[h]:mm:ss", sample: "15:46:38" }
    ]
  },
  {
    title: "Scientific & Other",
    icon: FlaskConical,
    items: [
      { name: "Fractions", code: "#/#", sample: "1/8" },
      { name: "Percent w/ Separator", code: "#,##0%", sample: "12,345%" },
      { name: "Text Prefix", code: "\"Delivered in \"@", sample: "Delivered in 4 days" },
      { name: "Scientific Notation", code: "#0.0E+0", sample: "1.23E+3" },
      { name: "Degrees Fahrenheit", code: "0\"°F\"", sample: "123°F" },
      { name: "Degrees Celsius", code: "0.0#\"°C\"", sample: "1.23°C" }
    ]
  }
];

const ExamplesGallery: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Common Format Cheat Sheet</h2>
            <p className="text-indigo-700 max-w-2xl mx-auto">
                A collection of the most useful Excel custom number format patterns. Click any code block to copy it directly to your clipboard.
            </p>
        </div>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                    <div key={cat.title} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                            <Icon className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-semibold text-gray-800">{cat.title}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cat.items.map((item, idx) => {
                                const id = `${cat.title}-${idx}`;
                                const isCopied = copiedIndex === id;
                                return (
                                    <div key={id} className="p-4 hover:bg-gray-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                                <span className="text-xs text-gray-500 font-mono">Example: {item.sample}</span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(item.code, id)}
                                                className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                                                    isCopied 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 shadow-sm'
                                                }`}
                                            >
                                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                {isCopied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <code className="block bg-gray-900 text-green-400 text-xs font-mono p-2.5 rounded-lg break-all">
                                                {item.code}
                                            </code>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default ExamplesGallery;
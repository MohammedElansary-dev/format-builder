export type ExcelColor = 'Black' | 'Green' | 'White' | 'Blue' | 'Magenta' | 'Yellow' | 'Cyan' | 'Red' | null;

export type NegativeMode = 'minus' | 'color' | 'paren' | 'parenColor';

export type ZeroMode = 'number' | 'dash' | 'hide' | 'text';

export type ScaleMode = 'none' | 'K' | 'M';

export interface GlobalSettings {
  decimals: number;
  separator: boolean;
  scale: ScaleMode;
  currencySymbol: string;
  currencyPosition: 'prefix' | 'suffix';
  integerPadding: number; // Minimum digits (leading zeros)
  percentage: boolean;    // Format as percent (multiplies by 100)
}

export interface PositiveZone {
  color: ExcelColor;
  padding: boolean; // Adds _)
}

export interface NegativeZone {
  color: ExcelColor;
  mode: NegativeMode;
}

export interface ZeroZone {
  mode: ZeroMode;
  customText: string;
}

export interface TextZone {
  prefix: string;
  suffix: string;
}

export interface FormatState {
  global: GlobalSettings;
  positive: PositiveZone;
  negative: NegativeZone;
  zero: ZeroZone;
  text: TextZone;
}

export type DateOrder = 'DMY' | 'MDY' | 'YMD';
export type DateSeparator = '/' | '-' | '.' | ' ' | ', ' | 'custom';
export type DurationUnit = 'days' | 'hours' | 'minutes' | 'seconds';

// New: Smart Duration Presets
export type SmartDurationType = 'none' | 'auto_scale' | 'composite_text' | 'timer';

export interface DateTimeState {
  mode: 'clock' | 'duration'; // Switch between Time of Day and Elapsed Time
  useDate: boolean;
  useTime: boolean;
  localeCode: string; 
  
  // Date
  dateOrder: DateOrder;
  dateSeparator: DateSeparator;
  customDateSeparator: string;
  dayFormat: 'd' | 'dd' | 'ddd' | 'dddd';
  monthFormat: 'm' | 'mm' | 'mmm' | 'mmmm' | 'mmmmm';
  yearFormat: 'yy' | 'yyyy';

  // Time & Duration
  leadingDurationUnit: DurationUnit;
  smartDuration: SmartDurationType; // New: Logic for advanced Duration presets
  
  hourFormat: 'none' | 'h' | 'hh'; 
  minuteFormat: 'none' | 'm' | 'mm'; 
  secondFormat: 'none' | 's' | 'ss' | 'ss.00';
  
  // Suffixes
  daySuffix: string;
  hourSuffix: string;
  minuteSuffix: string;
  secondSuffix: string;

  use12Hour: boolean; // toggles AM/PM (Only for 'clock' mode)
  amPmFormat: 'AM/PM' | 'am/pm' | 'A/P' | 'a/p';
}

// New: Conditional Logic Types
export type ConditionOperator = '>' | '>=' | '<' | '<=' | '=' | '<>';

export interface ConditionalRule {
  id: string;
  condition?: {
    operator: ConditionOperator;
    value: number;
  }; // If undefined, it acts as "Else"
  color: ExcelColor;
  format: string;
}

export interface ConditionalState {
  rules: ConditionalRule[];
}

export type AppMode = 'number' | 'datetime' | 'conditional' | 'examples';
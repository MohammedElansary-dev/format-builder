import { FormatState, DateTimeState, ExcelColor, ConditionalState } from '../types';

// --- SHARED UTILS ---

const escapeText = (text: string): string => {
  if (!text) return '';
  const safeText = text.replace(/"/g, '\\"');
  return `"${safeText}"`;
};

const getColorTag = (color: ExcelColor): string => {
  return color ? `[${color}]` : '';
};

// --- NUMBER FORMATTING ---

const getBaseNumberFormat = (
  decimals: number,
  separator: boolean,
  scale: 'none' | 'K' | 'M',
  integerPadding: number = 1,
  percentage: boolean = false
): string => {
  let fmt = '';
  const zeros = '0'.repeat(Math.max(1, integerPadding));
  if (separator) fmt = `#,##${zeros}`; else fmt = zeros;
  if (decimals > 0) fmt += '.' + '0'.repeat(decimals);
  if (percentage) fmt += '%';
  if (scale === 'K') fmt += ', "K"';
  else if (scale === 'M') fmt += ',, "M"';
  return fmt;
};

const applyCurrency = (fmt: string, symbol: string, position: 'prefix' | 'suffix'): string => {
  if (!symbol) return fmt;
  const escapedSymbol = escapeText(symbol);
  if (position === 'prefix') return `${escapedSymbol} ${fmt}`;
  else return `${fmt} ${escapedSymbol}`;
};

export const generateExcelString = (state: FormatState): string => {
  const { global, positive, negative, zero, text } = state;
  const baseFmt = getBaseNumberFormat(global.decimals, global.separator, global.scale, global.integerPadding, global.percentage);
  const positiveBase = applyCurrency(baseFmt, global.currencySymbol, global.currencyPosition);
  
  let posStr = getColorTag(positive.color) + positiveBase;
  if (positive.padding) posStr += '_)';

  let negStr = '';
  const negBase = applyCurrency(baseFmt, global.currencySymbol, global.currencyPosition);
  
  if (negative.mode === 'minus') negStr = getColorTag(negative.color) + '-' + negBase; 
  else if (negative.mode === 'color') negStr = getColorTag(negative.color || 'Red') + negBase; 
  else if (negative.mode === 'paren') negStr = getColorTag(negative.color) + `(${negBase})`;
  else if (negative.mode === 'parenColor') negStr = getColorTag(negative.color || 'Red') + `(${negBase})`;

  let zeroStr = '';
  if (zero.mode === 'number') zeroStr = getColorTag(null) + applyCurrency(getBaseNumberFormat(global.decimals, false, 'none', global.integerPadding, global.percentage), global.currencySymbol, global.currencyPosition); 
  else if (zero.mode === 'dash') zeroStr = global.percentage ? `"-"` : `"-"`; 
  else if (zero.mode === 'hide') zeroStr = ''; 
  else if (zero.mode === 'text') zeroStr = escapeText(zero.customText);

  let textStr = `${escapeText(text.prefix)}@${escapeText(text.suffix)}`;

  return `${posStr};${negStr};${zeroStr};${textStr}`;
};

// Calculates the PREVIEW string for a single number based on state
export const formatNumberPreview = (value: number, state: FormatState, isZero: boolean = false): string => {
    const { global } = state;
    
    // Handle Zero Text Mode special case
    if (isZero && state.zero.mode === 'text') return state.zero.customText;
    if (isZero && state.zero.mode === 'dash') return '-';
    if (isZero && state.zero.mode === 'hide') return '';

    let v = Math.abs(value);
    
    // Scaling Logic
    let suffix = '';
    if (global.scale === 'K') { v /= 1000; suffix = ' K'; }
    else if (global.scale === 'M') { v /= 1000000; suffix = ' M'; }
    
    // Percentage Logic
    if (global.percentage) { v *= 100; suffix += '%'; }

    // Formatting Logic (JS equivalent of Excel)
    let s = v.toLocaleString('en-US', {
        minimumFractionDigits: global.decimals,
        maximumFractionDigits: global.decimals,
        useGrouping: global.separator,
        minimumIntegerDigits: global.integerPadding
    });

    s += suffix;

    // Currency
    if (global.currencySymbol) {
        if (global.currencyPosition === 'prefix') s = `${global.currencySymbol} ${s}`;
        else s = `${s} ${global.currencySymbol}`;
    }

    // Negative Handling
    if (value < 0) {
        if (state.negative.mode.includes('paren')) s = `(${s})`;
        else if (state.negative.mode === 'minus') s = `-${s}`;
    }
    
    // Positive Padding (Visual Mock)
    if (value > 0 && state.positive.padding) {
        s += ' '; // Simple space to mimic _)
    }

    return s;
};

// --- DATE TIME FORMATTING ---

const getSafeSeparator = (sep: string, custom?: string): string => {
    if (sep === 'custom') return escapeText(custom || '');
    if (sep === ' ') return ' ';
    return escapeText(sep);
};

export const generateDateTimeString = (state: DateTimeState): string => {
  const parts: string[] = [];
  const isDuration = state.mode === 'duration';

  // --- SMART DURATIONS ---
  if (isDuration && state.smartDuration !== 'none') {
      if (state.smartDuration === 'auto_scale') return `[<0.0416667][Blue][m] "mins";[h] "hours"`;
      if (state.smartDuration === 'composite_text') return `[h]"h "mm"m "ss"s"`; 
      if (state.smartDuration === 'timer') return `[<0.0416667][Blue]mm:ss;[h]:mm:ss`;
  }

  // --- STANDARD LOGIC ---
  if (state.useDate) {
    const d = state.dayFormat;
    const m = state.monthFormat;
    const y = state.yearFormat;
    const sep = getSafeSeparator(state.dateSeparator, state.customDateSeparator);
    let dateStr = state.dateOrder === 'DMY' ? `${d}${sep}${m}${sep}${y}` : state.dateOrder === 'MDY' ? `${m}${sep}${d}${sep}${y}` : `${y}${sep}${m}${sep}${d}`;
    parts.push(dateStr);
  }

  if (state.useTime) {
    let timeParts: string[] = [];
    if (isDuration) {
        const canShowHours = state.leadingDurationUnit !== 'minutes' && state.leadingDurationUnit !== 'seconds';
        if (state.hourFormat !== 'none' && canShowHours) {
            let h: string = state.hourFormat;
            if (state.leadingDurationUnit === 'hours') h = '[h]'; 
            timeParts.push(`${h}${escapeText(state.hourSuffix)}`);
        }

        const canShowMinutes = state.leadingDurationUnit !== 'seconds';
        if (state.minuteFormat !== 'none' && canShowMinutes) {
            let m: string = state.minuteFormat;
            if (state.leadingDurationUnit === 'minutes') m = '[m]';
            timeParts.push(`${m}${escapeText(state.minuteSuffix)}`);
        }

        if (state.secondFormat !== 'none') {
             let s: string = state.secondFormat;
             if (state.leadingDurationUnit === 'seconds') s = s === 'ss.00' ? '[ss].00' : '[s]';
             timeParts.push(`${s}${escapeText(state.secondSuffix)}`);
        }
    } else {
        if (state.hourFormat !== 'none') timeParts.push(`${state.hourFormat}${escapeText(state.hourSuffix)}`);
        if (state.minuteFormat !== 'none') timeParts.push(`${state.minuteFormat}${escapeText(state.minuteSuffix)}`);
        if (state.secondFormat !== 'none') timeParts.push(`${state.secondFormat}${escapeText(state.secondSuffix)}`);
    }

    if (timeParts.length > 0) {
        let timeStr = timeParts.join('');
        if (!isDuration && state.use12Hour) timeStr += ` ${state.amPmFormat}`;
        parts.push(timeStr);
    }
  }

  let fullFormat = parts.join(' ');
  if (state.localeCode && state.localeCode.trim()) fullFormat = `${state.localeCode.trim()}${fullFormat}`;
  return fullFormat;
};

// Generates a fake "Live Preview" by parsing the generated string and replacing tokens
export const formatDateTimePreview = (
    state: DateTimeState, 
    sampleDate: Date, 
    sampleDurationSeconds: number
): string => {
    // 1. Get the Excel Format String
    let fmt = generateDateTimeString(state);

    // Remove Locale codes [$-...] and color codes [Red] for the visual preview
    fmt = fmt.replace(/\[\$-[a-zA-Z0-9-]+\]/g, '').replace(/\[[a-zA-Z]+\]/g, '');
    
    // Remove quotes around literals for easier replacement (simplified approach)
    // We keep the literals, but stripped of quotes.
    fmt = fmt.replace(/"([^"]*)"/g, '$1'); 
    fmt = fmt.replace(/\\(.)/g, '$1'); // Unescape escaped chars

    // --- DURATION LOGIC ([h], [m], etc) ---
    if (state.mode === 'duration') {
        const totalSeconds = Math.floor(sampleDurationSeconds);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);

        // Logic for "Timer" preset or [m] vs [h]
        if (state.smartDuration === 'auto_scale') {
            if (totalMinutes < 60) return `${totalMinutes} mins`;
            return `${Math.floor(totalHours)} hours`;
        }
        if (state.smartDuration === 'timer') {
            const remSec = totalSeconds % 60;
            const remMin = totalMinutes % 60;
            const pad = (n: number) => n.toString().padStart(2, '0');
            if (totalHours === 0) return `${pad(remMin)}:${pad(remSec)}`;
            return `${totalHours}:${pad(remMin)}:${pad(remSec)}`;
        }

        // Manual [h], [m], [s] replacement
        // Note: Excel tokens are tricky. [h] means total hours. h means hours mod 24 (usually).
        // Since we removed brackets via regex above, we look for h, m, s patterns.
        
        let result = fmt;

        // Leading Unit overrides
        let h = 0, m = 0, s = 0;
        
        if (state.leadingDurationUnit === 'seconds') {
            s = totalSeconds; // [s]
            // hours and mins hidden usually
        } else if (state.leadingDurationUnit === 'minutes') {
            m = totalMinutes; // [m]
            s = totalSeconds % 60; 
        } else {
            // Hours (standard default)
            h = totalHours; // [h]
            m = totalMinutes % 60;
            s = totalSeconds % 60;
        }

        const pad = (n: number, isDouble: boolean) => isDouble ? n.toString().padStart(2, '0') : n.toString();

        // Replace Hour tokens
        result = result.replace(/hh/g, pad(h, true)).replace(/h/g, pad(h, false));
        // Replace Minute tokens
        result = result.replace(/mm/g, pad(m, true)).replace(/m/g, pad(m, false));
        // Replace Second tokens
        result = result.replace(/ss\.00/g, pad(s, true)+'.00').replace(/ss/g, pad(s, true)).replace(/s/g, pad(s, false));

        return result;
    }

    // --- DATE/TIME LOGIC (Clock) ---
    const d = sampleDate;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let result = fmt;

    // YEAR
    result = result.replace(/yyyy/g, d.getFullYear().toString());
    result = result.replace(/yy/g, d.getFullYear().toString().slice(-2));

    // MONTH (Must handle 'm' carefully so it doesn't conflict with minutes)
    // Excel usually context-matches 'm' after 'h' as minutes. 
    // Here we use the state to know if monthFormat is used.
    if (state.useDate) {
        // We use a temporary placeholder for Month to avoid clashing with Minute replacements later
        const M = d.getMonth();
        if (state.monthFormat === 'mmmmm') result = result.replace(/mmmmm/g, months[M]);
        else if (state.monthFormat === 'mmmm') result = result.replace(/mmmm/g, monthsFull[M]);
        else if (state.monthFormat === 'mmm') result = result.replace(/mmm/g, monthsShort[M]);
        else if (state.monthFormat === 'mm') result = result.replace(/mm/g, '##MONTH_MM##'); // Placeholder
        else if (state.monthFormat === 'm') result = result.replace(/m/g, '##MONTH_M##');
    }

    // DAY
    result = result.replace(/dddd/g, daysFull[d.getDay()]);
    result = result.replace(/ddd/g, daysShort[d.getDay()]);
    result = result.replace(/dd/g, pad(d.getDate()));
    // Be careful replacing single 'd' not to catch 'dd' remnants if any
    result = result.replace(/\bd\b/g, d.getDate().toString());
    result = result.replace(/d(?![a-z])/g, d.getDate().toString()); // safe fallback

    // HOURS
    let hours = d.getHours();
    if (state.use12Hour) {
        hours = hours % 12 || 12;
    }
    result = result.replace(/hh/g, pad(hours));
    result = result.replace(/h/g, hours.toString());

    // MINUTES
    result = result.replace(/mm/g, pad(d.getMinutes()));
    result = result.replace(/m/g, d.getMinutes().toString());

    // SECONDS
    result = result.replace(/ss/g, pad(d.getSeconds()));
    result = result.replace(/s/g, d.getSeconds().toString());

    // AM/PM
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    if (state.amPmFormat === 'AM/PM') result = result.replace(/AM\/PM/g, ampm);
    if (state.amPmFormat === 'am/pm') result = result.replace(/am\/pm/g, ampm.toLowerCase());
    if (state.amPmFormat === 'A/P') result = result.replace(/A\/P/g, ampm.charAt(0));
    if (state.amPmFormat === 'a/p') result = result.replace(/a\/p/g, ampm.charAt(0).toLowerCase());

    // Restore Month Placeholders
    result = result.replace(/##MONTH_MM##/g, pad(d.getMonth() + 1));
    result = result.replace(/##MONTH_M##/g, (d.getMonth() + 1).toString());

    return result;
};


// --- CONDITIONAL FORMATTING ---

export const generateConditionalString = (state: ConditionalState): string => {
    // Filter out rules without values if they are not default
    const validRules = state.rules.filter(r => r.condition || r.format);
    
    return validRules.map(rule => {
        let part = '';
        
        // 1. Condition
        if (rule.condition) {
            part += `[${rule.condition.operator}${rule.condition.value}]`;
        }

        // 2. Color
        if (rule.color) {
            part += `[${rule.color}]`;
        }

        // 3. Format
        part += rule.format;

        return part;
    }).join(';');
};
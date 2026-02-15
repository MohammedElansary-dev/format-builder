# Excel Format Builder 📊

**The professional, visual tool for generating Excel Custom Number Formats.**

Stop memorizing obscure syntax like `_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)`. The **Format Builder** provides a modern UI to visually construct complex Excel formats for Financials, Dates, Durations, and KPI Dashboards, generating the code instantly.

---

## ✨ Features

### 1. 🔢 Advanced Number Formatting
Excel formats are split into four zones: **Positive**, **Negative**, **Zero**, and **Text**. We give you full control over each.

*   **Global Controls**:
    *   **Precision**: Slider control for decimals (0-10 places).
    *   **Scale**: Instantly convert values to Thousands (**K**) or Millions (**M**).
    *   **Currency**: Custom currency symbols with Prefix/Suffix positioning.
    *   **Separators**: Toggle thousands separators and percentage mode.
*   **Zone Logic**:
    *   **Positive**: Add alignment padding `_)` to ensure numbers line up perfectly.
    *   **Negative**: Choose from standard minus `-`, colored text (Red), parentheses `()`, or a combination.
    *   **Zero**: Display as number, dash `-`, hide completely, or replace with custom text (e.g., "Free").
    *   **Text**: Automatically wrap text inputs with prefixes/suffixes (e.g., "PO: @").

### 2. 📅 Date & Time Engine
A powerful builder for Calendar dates and Elapsed time durations.

*   **Modes**: Switch between **Standard Clock** (Time of Day) and **Elapsed Duration** (Stopwatch).
*   **Smart Durations (Magic Presets)**:
    *   **Auto Scale**: Shows "mins" if under an hour, "hours" if over an hour.
    *   **Timer**: Displays `mm:ss` for short times and `h:mm:ss` for long times.
    *   **Composite**: Formats like `1h 45m 20s`.
*   **Customization**:
    *   **Sequence**: DMY, MDY, YMD ordering.
    *   **Separators**: Custom characters (Slash, Dot, Dash, etc).
    *   **Locales**: built-in support for locale codes (e.g., `[$-en-US]`, `[$-fr-FR]`) to force language regardless of system settings.
    *   **12/24 Hour**: Full AM/PM control.

### 3. 🧠 Conditional Logic Builder
Create "Traffic Light" systems and KPIs without writing complex formulas.

*   **Rules Engine**: visually build up to 3 sections (Condition 1, Condition 2, Else).
*   **Operators**: Support for `>`, `<`, `>=`, `<=`, `=`, `<>`.
*   **Styling**: Apply specific colors (Green, Red, Blue, etc.) based on values.
*   **Data Bars**: Insert visual "bar chart" characters directly into the format string.

### 4. ⚡ Developer Experience
*   **Live Preview**: Real-time rendering of your format with editable sample data.
*   **Validation**: Detects common errors (like trying to use math operations inside a custom format).
*   **One-Click Copy**: Get the syntax-highlighted code instantly.
*   **Cheat Sheet**: A "Examples" tab with common patterns for quick reference.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/format-builder.git
    cd format-builder
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run local server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 📖 How to Use

1.  **Select Mode**: Choose between **Number**, **Date & Time**, or **Advanced Logic** tabs.
2.  **Configure**: Use the visual controls on the left.
    *   *Tip: Use the "Text" tab in Number mode to add units like " kg" or " pcs".*
3.  **Preview**: Check the right-hand panel. You can type in the "Sample Data" inputs to test specific edge cases (like negative numbers or zeros).
4.  **Copy**: Click the "Copy Code" button.
5.  **Apply in Excel**:
    *   Select your cells.
    *   Press `Ctrl+1` (Windows) or `Cmd+1` (Mac).
    *   Select **Custom** in the Category list.
    *   Paste into the **Type** box.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

## 📄 License

This project is open source. Feel free to fork and modify!
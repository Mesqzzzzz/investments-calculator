# Wealthiers — Advanced Compound Interest Engine & Wealth Tracker

A professional, high-fidelity, offline-first compound interest simulator designed with a premium Fintech user interface (inspired by modern applications like Revolut and Stripe) and built using a modern **Vite + Tailwind CSS v4** setup.

👉 **Live Demo (PWA):** [https://wealthiers.netlify.app/](https://wealthiers.netlify.app/)

---

## 🌟 Key Features

- **Advanced Compounding Engine:** Calculate long-term wealth projections with configurable parameters (Initial Lump Sum, Monthly Deposits, Investment Horizon up to 50 years, and Annual Expected Return).
- **Fiscal & Inflation Adjustments:**
  - **Capital Gains Tax Liability (IRS):** Simulates deferred tax liability on realized capital gains (includes a shortcut preset for Portugal's 28% tax rate).
  - **Inflation Adjustment:** Simulates real purchasing power by discounting future nominal value by cumulative inflation.
  - Displays nominal gross value, nominal net value, and real net value simultaneously.
- **Dynamic Scenario Comparison:** Save up to 3 separate configuration scenarios and toggle them as checkboxes to overlay multiple wealth curves on the chart for direct, side-by-side comparison.
- **Milestone & FIRE Tracker:** Define a target wealth milestone (e.g. €250,000) and track:
  - Exact year and month of achievement.
  - Percentage progress visualization.
  - Monthly passive income estimation under the **4% Rule** (Safe Withdrawal Rate).
- **Rich Data Visualizations:** High-definition line charts powered by Chart.js featuring custom color-coded gradients, theme-adaptive grid lines, and localized currency tooltips.
- **Detailed Annual Report & Export:** Comprehensive year-by-year breakdowns showing total invested capital, accumulated balances, and generated net profits. Export reports instantly to **CSV** compatible with Portuguese Excel delimiters (semicolon separated).
- **Progressive Web App (PWA) Support:**
  - Caching via custom Service Worker (`sw.js`).
  - Offline-first capabilities for fast load times.
  - Fully installable on iOS and Android devices with high-quality icons.
- **Theme Engine:** Class-based Light/Dark modes matching system preferences with storage persistence.

---

## 🛠️ Technology Stack

- **Bundler & Build Tool:** [Vite](https://vitejs.dev/)
- **Style System:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, @theme directives)
- **Logic:** Vanilla JavaScript (ES6+, DOM Manipulation, LocalStorage, Custom Event Listeners)
- **Libraries:** Chart.js (installed as a module dependency)
- **PWA Features:** Service Worker API, Web App Manifest (`manifest.json`)

---

## 🚀 Getting Started

To run the project locally, ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Installation

Clone this repository and install the dependencies:
```bash
git clone https://github.com/your-username/investments-calculator.git
cd investments-calculator
npm install
```

### 2. Local Development

Start the Vite dev server locally:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Production Build

Build the optimized standalone assets inside the `/dist` directory:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📈 Mathematical Details

- **Compound Interest:** Compound interest is calculated monthly using geometric rate splits:
  $$\text{Monthly Rate} = (1 + \text{Annual Rate})^{1/12} - 1$$
- **Capital Gains Tax (IRS):**
  $$\text{Tax Liability} = \max(0, (\text{Gross Balance} - \text{Total Invested}) \times \text{Tax Rate})$$
  $$\text{Net Balance} = \text{Gross Balance} - \text{Tax Liability}$$
- **Inflation Adjustment:**
  $$\text{Real Net Value} = \frac{\text{Net Balance}}{(1 + \text{Inflation Rate})^{\text{Year}}}$$
- **4% Rule Passive Income:**
  $$\text{Monthly Passive Income} = \frac{\text{Gross Balance} \times 0.04}{12}$$

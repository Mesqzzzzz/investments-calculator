import Chart from 'chart.js/auto';

// --- 1. PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Wealthiers SW registered!', reg))
      .catch(err => console.error('Wealthiers SW registration failed:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 2. Translation Engine & Dictionary ---
  const TRANSLATIONS = {
    en: {
      app_title: "Compound Interest Engine",
      app_subtitle: "Advanced projection tool factoring inflation, tax liabilities, and targets.",
      mode_header: "Calculator Mode",
      mode_basic: "Basic",
      mode_advanced: "Advanced",
      scenarios_header: "Market Scenarios",
      scenario_conser: "Conser. (5%)",
      scenario_moder: "Moder. (8.5%)",
      scenario_agres: "Agres. (12%)",
      core_params_header: "Core Parameters",
      initial_capital_label: "Initial Capital",
      monthly_deposit_label: "Monthly Deposit",
      horizon_label: "Horizon",
      years_unit: "years",
      annual_return_label: "Expected Annual Return (Nominal)",
      adjustments_header: "Fiscal & Inflation Adjustments",
      inflation_label: "Average Annual Inflation",
      inflation_tooltip: "Subtracts the impact of inflation to estimate real purchasing power.",
      tax_label: "Capital Gains Tax",
      tax_tooltip: "Estimated tax liability deducted from profits at simulated liquidation (e.g. IRS in PT is 28%).",
      set_pt_tax_btn: "PT (28%)",
      milestone_goal_header: "Milestone / FIRE Goal",
      target_milestone_label: "Target Wealth",
      reset_btn: "Reset Parameters",
      final_balance_label: "Estimated Final Balance",
      net_balance_label: "Net Balance (Post-Tax)",
      tax_paid_label: "Taxes withheld:",
      real_balance_label: "Real Purchasing Power",
      inflation_loss_label: "Inflation loss:",
      total_invested_label: "Total Invested Capital",
      gross_interest_label: "Gross Interest Earned",
      monthly_rate_label: "Monthly Return rate",
      chart_title: "Growth Projections & Wealth Curves",
      milestone_tracker_header: "Milestone Progress Tracker",
      milestone_time_label: "Estimated Time",
      milestone_progress_label: "Progress",
      passive_income_label: "Estimated Passive Income",
      passive_income_sub: "(4% Rule on Nominal Balance)",
      comparison_header: "Comparison Manager",
      comparison_sub: "Save scenarios and compare multiple wealth curves on the chart.",
      save_scenario_btn: "Save Scenario",
      table_title: "Capitalization History",
      table_sub: "Detailed year-by-year report adjusted for taxes and cumulative inflation loss.",
      download_csv_btn: "Download CSV (Excel)",
      th_period: "Period",
      th_invested: "Capital Invested",
      th_gross: "Gross Balance (Nominal)",
      th_net: "Net Balance (Post-Tax)",
      th_real: "Real Value (Post-Tax + Inf.)",
      th_passive: "Est. Passive Income",
      th_passive_sub: "/ month",
      th_profit: "Cumulative Gross Profit",
      table_note: "Note: Annual calculations compound monthly deposits at the end of each cycle. Tax is deferred and only applied on absolute gains at realization. Inflation discounts future purchasing power by cumulative timeline.",
      tab_calc: "Simulator Dashboard",
      tab_history: "Annual Report",
      tab_nav_dash: "Dashboard",
      tab_nav_history: "History",
      // Dynamic strings
      toast_scenario_preset: "Scenario {scenario} Activated: {rate}%",
      toast_pt_tax: "Portugal Capital Gains IRS Tax (28%) activated.",
      toast_reset: "Parameters successfully reset!",
      toast_scenario_saved: "Scenario \"{name}\" successfully saved!",
      toast_scenario_removed: "Scenario removed.",
      toast_csv_downloaded: "CSV Report downloaded successfully!",
      milestone_reached_instantly: "Already achieved!",
      milestone_reached_instant_sub: "Goal is less than initial capital",
      milestone_outside_horizon: "Outside horizon",
      milestone_outside_horizon_sub: "Increase return rate or deposits",
      milestone_time_format: "{years} years and {months} months",
      milestone_prediction_sub: "Estimated: mid {year}",
      chart_normal_mode: "Normal Projection Mode",
      chart_comparison_mode: "Comparison Mode ({count} Scenarios)",
      saved_scenario_sub: "{initial} initial + {monthly}/month @ {annual}% ({years}y)",
      no_saved_scenarios: "No saved scenarios. Adjust parameters and click \"Save Scenario\" to compare.",
      table_no_data: "No simulation data available",
      calc_detail_template: "Projection for <b>{years} years</b> ({months} months).<br>Initial <b>{initial}</b> + deposits of <b>{monthly}/month</b> compounded at <b>{annual}%</b> average annual return.",
      btn_theme_escuro: "🌙 Dark",
      btn_theme_claro: "☀️ Light",
      year_label_prefix: "Year",
      period_year_short: "y"
    },
    pt: {
      app_title: "Simulador Composto",
      app_subtitle: "Simulação avançada considerando inflação, impostos sobre mais-valias e metas.",
      mode_header: "Modo de Funcionamento",
      mode_basic: "Básico",
      mode_advanced: "Avançado",
      scenarios_header: "Cenários de Mercado",
      scenario_conser: "Conser. (5%)",
      scenario_moder: "Moder. (8.5%)",
      scenario_agres: "Agres. (12%)",
      core_params_header: "Parâmetros Principais",
      initial_capital_label: "Capital Inicial",
      monthly_deposit_label: "Depósito Mensal",
      horizon_label: "Prazo",
      years_unit: "anos",
      annual_return_label: "Taxa Anual Esperada (Nominal)",
      adjustments_header: "Ajustes Fiscais & Inflação",
      inflation_label: "Inflação Média Anual",
      inflation_tooltip: "Desconta o impacto da inflação para obter o valor real (poder de compra atual).",
      tax_label: "Imposto Mais-Valias",
      tax_tooltip: "Taxa estimada retida sobre os lucros no final do prazo (IRS em Portugal é 28%).",
      set_pt_tax_btn: "PT (28%)",
      milestone_goal_header: "Meta / Objetivo FIRE",
      target_milestone_label: "Património Objetivo",
      reset_btn: "Repor Parâmetros",
      final_balance_label: "Estimativa de Saldo Final",
      net_balance_label: "Saldo Líquido (Pós-IRS)",
      tax_paid_label: "Impostos retidos:",
      real_balance_label: "Poder Compra Equivalente",
      inflation_loss_label: "Perda por inflação:",
      total_invested_label: "Total Auto-Investido",
      gross_interest_label: "Juros Gerados (Brutos)",
      monthly_rate_label: "Equivalente Mensal (Z)",
      chart_title: "Curvas de Crescimento & Riqueza",
      milestone_tracker_header: "Progresso do Objetivo",
      milestone_time_label: "Tempo Estimado",
      milestone_progress_label: "Progresso",
      passive_income_label: "Rendimento Passivo Estimado",
      passive_income_sub: "(Regra dos 4% s/ Balanço Nominal)",
      comparison_header: "Gestor de Comparações",
      comparison_sub: "Grava cenários e compara várias curvas de riqueza no gráfico.",
      save_scenario_btn: "Gravar Cenário",
      table_title: "Histórico de Capitalização",
      table_sub: "Relatório anual detalhado ajustado de impostos e perda de poder de compra.",
      download_csv_btn: "Descarregar CSV (Excel)",
      th_period: "Período",
      th_invested: "Capital Investido",
      th_gross: "Balanço Bruto (Nominal)",
      th_net: "Balanço Líquido (Pós-Taxa)",
      th_real: "Valor Real (Líquido + Inf.)",
      th_passive: "Rend. Passivo Est.",
      th_passive_sub: "/ mês",
      th_profit: "Lucro Bruto Acumulado",
      table_note: "Nota: Os cálculos anuais consideram a capitalização de depósitos efetuados mensalmente no fim de cada ciclo. O imposto é diferido e incide apenas sobre os ganhos. A inflação desconta o poder de compra futuro pelo prazo acumulado correspondente.",
      tab_calc: "Calculadora Geral",
      tab_history: "Histórico Anual",
      tab_nav_dash: "Dashboard",
      tab_nav_history: "Histórico",
      // Dynamic strings
      toast_scenario_preset: "Cenário {scenario} Ativado: {rate}%",
      toast_pt_tax: "Imposto Mais-Valias IRS PT (28%) ativado.",
      toast_reset: "Parâmetros redefinidos com sucesso!",
      toast_scenario_saved: "Cenário \"{name}\" gravado com sucesso!",
      toast_scenario_removed: "Cenário removido.",
      toast_csv_downloaded: "Relatório CSV descarregado com sucesso!",
      milestone_reached_instantly: "Já alcançado!",
      milestone_reached_instant_sub: "Objetivo menor que capital inicial",
      milestone_outside_horizon: "Fora do prazo",
      milestone_outside_horizon_sub: "Aumente as taxas ou depósitos",
      milestone_time_format: "{years} anos e {months} meses",
      milestone_prediction_sub: "Previsão: meados de {year}",
      chart_normal_mode: "Modo de Projeção Normal",
      chart_comparison_mode: "Modo de Comparação ({count} Cenários)",
      saved_scenario_sub: "{initial} inicial + {monthly}/mês @ {annual}% ({years}a)",
      no_saved_scenarios: "Nenhum cenário gravado. Desenhe parâmetros e clique em \"Gravar Cenário\" para comparar.",
      table_no_data: "Sem dados de simulação disponíveis",
      calc_detail_template: "Projeção de <b>{years} anos</b> ({months} meses).<br>Inicial <b>{initial}</b> + depósitos de <b>{monthly}/mês</b> capitalizados a <b>{annual}%</b> médios anuais.",
      btn_theme_escuro: "🌙 Escuro",
      btn_theme_claro: "☀️ Claro",
      year_label_prefix: "Ano",
      period_year_short: "a"
    }
  };

  let currentLang = localStorage.getItem('wealthiers_lang') || 'en';

  function t(key, vars = {}) {
    let str = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ? TRANSLATIONS[currentLang][key] : key;
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
    return str;
  }

  // --- 3. Element Selectors ---
  const tabItems = document.querySelectorAll('.tab-item');
  const tabViews = document.querySelectorAll('.tab-view');
  const themeBtn = document.getElementById('themeToggle');
  const langToggleBtn = document.getElementById('langToggle');

  // Input & Sliders
  const elInitial = document.getElementById('initial');
  const elInitialSlider = document.getElementById('initialSlider');
  const elMonthly = document.getElementById('monthly');
  const elMonthlySlider = document.getElementById('monthlySlider');
  const elYears = document.getElementById('years');
  const elYearsSlider = document.getElementById('yearsSlider');
  const elAnnual = document.getElementById('annualReturn');
  const elAnnualSlider = document.getElementById('annualSlider');
  
  // Advanced Inputs
  const elInflation = document.getElementById('inflationRate');
  const elInflationSlider = document.getElementById('inflationSlider');
  const elTax = document.getElementById('taxRate');
  const elTaxSlider = document.getElementById('taxSlider');
  const btnPtTax = document.getElementById('setPtTax');
  
  // Milestone Inputs
  const elTarget = document.getElementById('targetMilestone');
  const elTargetSlider = document.getElementById('targetSlider');

  // Presets & Controls
  const presetBtns = document.querySelectorAll('.scenario-preset');
  const btnReset = document.getElementById('resetBtn');

  // Mode Selector Elements
  const modeBasicBtn = document.getElementById('modeBasicBtn');
  const modeComplexBtn = document.getElementById('modeComplexBtn');
  
  // Advanced UI Cards & Headers
  const cardFiscalInflation = document.getElementById('fiscalInflationCard');
  const cardMilestoneGoal = document.getElementById('milestoneGoalCard');
  const cardMilestone = document.getElementById('milestoneCard');
  const cardNetFinal = document.getElementById('netFinalCard');
  const cardRealFinal = document.getElementById('realFinalCard');
  const cardFinal = document.getElementById('finalCard');
  
  const thNet = document.getElementById('thNet');
  const thReal = document.getElementById('thReal');

  // Dashboard Output Widgets
  const elFinal = document.getElementById('finalValue');
  const elNetFinal = document.getElementById('netFinalValue');
  const elRealFinal = document.getElementById('realFinalValue');
  const elTaxPaid = document.getElementById('taxPaid');
  const elInflationLoss = document.getElementById('inflationLoss');
  const elInvested = document.getElementById('totalInvested');
  const elProfit = document.getElementById('profit');
  const elMonthlyRate = document.getElementById('monthlyRate');
  const elDetail = document.getElementById('calcDetail');
  
  // Milestone Panel Outputs
  const elMilestoneTime = document.getElementById('milestoneTime');
  const elMilestoneShortDate = document.getElementById('milestoneShortDate');
  const elMilestonePercentage = document.getElementById('milestonePercentage');
  const elMilestoneProgressBar = document.getElementById('milestoneProgressBar');
  const elMilestonePassiveIncome = document.getElementById('milestonePassiveIncome');
  const elMilestoneTargetBadge = document.getElementById('milestoneTargetBadge');

  // Details Table & Export
  const elYearTable = document.getElementById('yearTable');
  const btnDownloadCsv = document.getElementById('downloadCsvBtn');

  // --- 4. State Variables ---
  let chartInstance = null;
  let currentMode = localStorage.getItem('wealthiers_mode') || 'basic';

  const SCENARIOS = {
    conservative: 5.0,
    moderate: 8.5,
    aggressive: 12.0
  };

  // --- 5. Formatters (Dynamically localization-aware) ---
  let eur, eurDec, eurShort;
  
  function updateFormatters() {
    const locale = currentLang === 'en' ? 'en-US' : 'pt-PT';
    eur = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    eurDec = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" });
    eurShort = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      compactDisplay: "short"
    });
  }
  updateFormatters();

  const pct = (v) => (v * 100).toFixed(3) + "%";

  // --- 6. Toast Notifications ---
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-bold shadow-xl backdrop-blur transition-all duration-300 transform translate-y-4 opacity-0 z-50';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2500);
  }

  // --- 7. Theme Engine ---
  function setTheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? t("btn_theme_claro") : t("btn_theme_escuro");
    
    // Refresh calculations and chart configuration colors
    runProjections();
  }

  (function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") return setTheme(false);
    if (saved === "dark") return setTheme(true);

    // Default to Light Mode
    setTheme(false);
  })();

  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(!isDark);
  });

  // --- 8. Language Translation Logic ---
  function updateLanguageUI() {
    updateFormatters();
    
    // Translate static HTML tags with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) {
        el.innerHTML = val;
      }
    });

    const flagCode = currentLang === 'en' ? 'pt' : 'us';
    const labelText = currentLang === 'en' ? 'PT' : 'EN';
    langToggleBtn.innerHTML = `
      <img src="https://flagcdn.com/w20/${flagCode}.png" class="w-4 h-2.5 rounded-2xs object-cover shadow-sm" alt="${labelText}">
      <span>${labelText}</span>
    `;
    
    // Re-trigger mode interface alignment
    updateModeUI();
  }

  langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'pt' : 'en';
    localStorage.setItem('wealthiers_lang', currentLang);
    updateLanguageUI();
    showToast(currentLang === 'en' ? 'Language switched to English' : 'Idioma alterado para Português');
  });

  // --- 9. Mode Switching Logic ---
  function updateModeUI() {
    const isAdvanced = currentMode === 'advanced';
    
    // Toggle active state on buttons
    if (isAdvanced) {
      modeComplexBtn.classList.add('active', 'bg-white', 'dark:bg-[#3a3a3c]', 'text-indigo-650', 'dark:text-indigo-400', 'shadow-sm');
      modeComplexBtn.classList.remove('text-slate-700', 'dark:text-slate-350');
      modeBasicBtn.classList.remove('active', 'bg-white', 'dark:bg-[#3a3a3c]', 'text-indigo-650', 'dark:text-indigo-400', 'shadow-sm');
      modeBasicBtn.classList.add('text-slate-700', 'dark:text-slate-350');
    } else {
      modeBasicBtn.classList.add('active', 'bg-white', 'dark:bg-[#3a3a3c]', 'text-indigo-650', 'dark:text-indigo-400', 'shadow-sm');
      modeBasicBtn.classList.remove('text-slate-700', 'dark:text-slate-350');
      modeComplexBtn.classList.remove('active', 'bg-white', 'dark:bg-[#3a3a3c]', 'text-indigo-650', 'dark:text-indigo-400', 'shadow-sm');
      modeComplexBtn.classList.add('text-slate-700', 'dark:text-slate-350');
    }
    
    // Show/Hide Cards
    cardFiscalInflation.classList.toggle('hidden', !isAdvanced);
    cardMilestoneGoal.classList.toggle('hidden', !isAdvanced);
    cardMilestone.classList.toggle('hidden', !isAdvanced);
    cardNetFinal.classList.toggle('hidden', !isAdvanced);
    cardRealFinal.classList.toggle('hidden', !isAdvanced);
    
    // Table Headers
    thNet.classList.toggle('hidden', !isAdvanced);
    thReal.classList.toggle('hidden', !isAdvanced);
    
    // Stretch Gross Final Value Card
    cardFinal.classList.toggle('lg:col-span-4', !isAdvanced);
    cardFinal.classList.toggle('lg:col-span-2', isAdvanced);
    
    // Redraw graph and table columns
    runProjections();
  }

  modeBasicBtn.addEventListener('click', () => {
    currentMode = 'basic';
    localStorage.setItem('wealthiers_mode', 'basic');
    updateModeUI();
  });
  
  modeComplexBtn.addEventListener('click', () => {
    currentMode = 'advanced';
    localStorage.setItem('wealthiers_mode', 'advanced');
    updateModeUI();
  });

  // --- 10. Tab Switcher SPA ---
  tabItems.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab');
      
      tabItems.forEach(item => {
        if (item.getAttribute('data-tab') === targetId) {
          item.classList.add('active', 'text-indigo-500', 'bg-slate-100', 'dark:bg-slate-800');
          item.classList.remove('text-slate-500', 'dark:text-slate-400');
        } else {
          item.classList.remove('active', 'text-indigo-500', 'bg-slate-100', 'dark:bg-slate-800');
          item.classList.add('text-slate-500', 'dark:text-slate-400');
        }
      });
      
      tabViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.remove('hidden');
          view.classList.add('grid');
        } else {
          view.classList.remove('grid');
          view.classList.add('hidden');
        }
      });
    });
  });

  // --- 11. Compound Interest Engine with Taxes & Inflation ---
  function toMonthlyRate(annualPercent) {
    const r = annualPercent / 100;
    return Math.pow(1 + r, 1/12) - 1;
  }

  function simulate({ years, initialInvestment, monthlyContribution, annualPercent, inflationPercent, taxPercent }) {
    const months = years * 12;
    const mRate = toMonthlyRate(annualPercent);
    const taxRateFraction = taxPercent / 100;
    const inflationRateFraction = inflationPercent / 100;

    let balance = initialInvestment;
    let invested = initialInvestment;
    const yearly = [];

    // Year 0 details
    yearly.push({
      year: 0,
      invested,
      balance,
      netBalance: balance,
      realBalance: balance,
      profit: 0
    });

    for (let m = 1; m <= months; m++) {
      balance *= (1 + mRate);
      balance += monthlyContribution;
      invested += monthlyContribution;

      if (m % 12 === 0) {
        const year = m / 12;
        const profit = Math.max(0, balance - invested);
        const taxPaid = profit * taxRateFraction;
        const netBalance = balance - taxPaid;
        
        // Discounting the net value by annual cumulative inflation
        const realBalance = netBalance / Math.pow(1 + inflationRateFraction, year);

        yearly.push({
          year,
          invested,
          balance,
          netBalance,
          realBalance,
          profit
        });
      }
    }

    const totalProfit = Math.max(0, balance - invested);
    const taxPaid = totalProfit * taxRateFraction;
    const netFinalValue = balance - taxPaid;
    const realFinalValue = netFinalValue / Math.pow(1 + inflationRateFraction, years);

    return {
      months,
      mRate,
      invested,
      balance,
      netFinalValue,
      realFinalValue,
      taxPaid,
      inflationLoss: balance - realFinalValue,
      profit: totalProfit,
      yearly
    };
  }

  // --- 12. Milestone and FIRE Mathematics ---
  function calculateMilestone({ initial, monthly, annual, target }) {
    if (initial >= target) {
      return { reached: true, years: 0, months: 0 };
    }
    
    // Safety check for positive returns/deposits
    if (monthly <= 0 && annual <= 0) {
      return { reached: false };
    }

    const mRate = toMonthlyRate(annual);
    let balance = initial;
    let months = 0;
    const limitMonths = 1200; // 100 years limit
    
    while (balance < target && months < limitMonths) {
      balance *= (1 + mRate);
      balance += monthly;
      months++;
    }

    if (balance >= target) {
      return {
        reached: true,
        years: Math.floor(months / 12),
        months: months % 12
      };
    }
    return { reached: false };
  }

  // --- 13. Chart rendering (Normal vs Comparison Mode) ---
  function renderChart(currentSimData) {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isLight = document.documentElement.classList.contains('light');
    const textColor = isLight ? '#64748b' : '#9ca3af';
    const gridColor = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(249, 250, 251, 0.05)';

    if (chartInstance) {
      chartInstance.destroy();
    }

    const isAdvanced = currentMode === 'advanced';
    const legendText = document.getElementById('chartLegendText');
    legendText.textContent = t("chart_normal_mode");
    legendText.parentElement.classList.remove('bg-indigo-50/80', 'dark:bg-indigo-950/30', 'text-indigo-600', 'dark:text-indigo-400');
    legendText.parentElement.classList.add('bg-slate-50', 'dark:bg-slate-950');

    const labels = currentSimData.yearly.map(d => `${d.year}${t("period_year_short")}`);

    const grossData = currentSimData.yearly.map(d => Math.round(d.balance));
    const netData = currentSimData.yearly.map(d => Math.round(d.netBalance));
    const realData = currentSimData.yearly.map(d => Math.round(d.realBalance));
    const investedData = currentSimData.yearly.map(d => Math.round(d.invested));

    // Gradients
    const fillGradGross = ctx.createLinearGradient(0, 0, 0, 300);
    fillGradGross.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
    fillGradGross.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    let datasets = [
      {
        label: t("th_gross"),
        data: grossData,
        borderColor: '#6366f1', // Indigo
        backgroundColor: fillGradGross,
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: labels.length > 30 ? 0 : 2
      }
    ];

    if (isAdvanced) {
      datasets.push(
        {
          label: t("th_net"),
          data: netData,
          borderColor: '#0ea5e9', // Sky Blue
          fill: false,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: t("th_real"),
          data: realData,
          borderColor: '#f59e0b', // Amber
          fill: false,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0
        }
      );
    }

    datasets.push({
      label: t("th_invested"),
      data: investedData,
      borderColor: isLight ? '#cbd5e1' : '#475569', // Slate
      fill: false,
      tension: 0.35,
      borderWidth: 1.5,
      borderDash: [5, 5],
      pointRadius: 0
    });

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 8,
              usePointStyle: true,
              color: textColor,
              font: { family: 'Montserrat', size: 10, weight: '700' }
            }
          },
          tooltip: {
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
            titleColor: isLight ? '#0f172a' : '#f8fafc',
            bodyColor: isLight ? '#475569' : '#94a3b8',
            borderColor: isLight ? '#e2e8f0' : '#1e293b',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 4,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += eurDec.format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Montserrat', size: 9, weight: '600' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Montserrat', size: 9, weight: '600' },
              callback: (value) => eurShort.format(value)
            }
          }
        }
      }
    });
  }

  // --- 14. Render Annual Table Details ---
  function renderYearTable(yearly) {
    if (!elYearTable) return;
    
    const isAdvanced = currentMode === 'advanced';
    const colspanVal = isAdvanced ? 7 : 5;

    if (yearly.length <= 1) {
      elYearTable.innerHTML = `<tr><td colspan="${colspanVal}" class="px-6 py-10 text-center text-slate-400 dark:text-slate-500 font-normal">${t("table_no_data")}</td></tr>`;
      return;
    }

    // Populate desktop table
    elYearTable.innerHTML = yearly.map(r => {
      const passive = (r.balance * 0.04) / 12;
      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition duration-100 border-b border-slate-100 dark:border-slate-800/40 font-medium">
          <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${t("year_label_prefix")} ${r.year}</td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${eur.format(r.invested)}</td>
          <td class="px-6 py-4 text-indigo-500 font-semibold">${eur.format(r.balance)}</td>
          ${isAdvanced ? `
          <td class="px-6 py-4 text-sky-500 font-semibold">${eur.format(r.netBalance)}</td>
          <td class="px-6 py-4 text-amber-500 font-semibold">${eur.format(r.realBalance)}</td>
          ` : ''}
          <td class="px-6 py-4 text-emerald-500 font-bold">${eurDec.format(passive)}${t("th_passive_sub")}</td>
          <td class="px-6 py-4 text-right text-emerald-500 font-bold">
            +${eur.format(r.profit)}
          </td>
        </tr>
      `;
    }).join("");

    // Populate mobile cards
    const elYearCards = document.getElementById('yearCardsContainer');
    if (elYearCards) {
      if (yearly.length <= 1) {
        elYearCards.innerHTML = `<div class="text-center text-slate-400 dark:text-slate-500 py-6 font-normal">${t("table_no_data")}</div>`;
      } else {
        elYearCards.innerHTML = yearly.map(r => {
          const passive = (r.balance * 0.04) / 12;
          return `
            <div class="bg-white dark:bg-[#1c1c1e] border border-slate-200/60 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-2">
                <span class="font-bold text-sm text-slate-800 dark:text-slate-200">${t("year_label_prefix")} ${r.year}</span>
                <span class="text-xs font-bold text-emerald-500">+${eur.format(r.profit)}</span>
              </div>
              <div class="grid grid-cols-2 gap-3 text-xs font-medium">
                <div>
                  <span class="text-3xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">${t("th_invested")}</span>
                  <span class="text-slate-700 dark:text-slate-350">${eur.format(r.invested)}</span>
                </div>
                <div>
                  <span class="text-3xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">${t("th_gross")}</span>
                  <span class="text-indigo-500 font-semibold">${eur.format(r.balance)}</span>
                </div>
                ${isAdvanced ? `
                <div>
                  <span class="text-3xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">${t("th_net")}</span>
                  <span class="text-sky-500 font-semibold">${eur.format(r.netBalance)}</span>
                </div>
                <div>
                  <span class="text-3xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">${t("th_real")}</span>
                  <span class="text-amber-500 font-semibold">${eur.format(r.realBalance)}</span>
                </div>
                ` : ''}
                <div class="col-span-2 bg-[#f2f2f7] dark:bg-black p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center">
                  <span class="text-3xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">${t("th_passive")}</span>
                  <span class="font-extrabold text-emerald-500 text-sm">${eurDec.format(passive)}${t("th_passive_sub")}</span>
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    }
  }



  // --- 16. UI Projections Integration Trigger ---
  function runProjections() {
    const years = Number(elYears.value);
    const initial = Number(elInitial.value);
    const monthly = Number(elMonthly.value);
    const annual = Number(elAnnual.value);
    const inflation = Number(elInflation.value);
    const tax = Number(elTax.value);
    const target = Number(elTarget.value);

    // Validation checks
    if (isNaN(years) || years <= 0 || isNaN(initial) || initial < 0 || isNaN(monthly) || monthly < 0 || isNaN(annual)) {
      return;
    }

    // Run compounding simulation
    const res = simulate({
      years,
      initialInvestment: initial,
      monthlyContribution: monthly,
      annualPercent: annual,
      inflationPercent: inflation,
      taxPercent: tax
    });

    // Update main dashboard metrics
    elFinal.textContent = eur.format(res.balance);
    elNetFinal.textContent = eur.format(res.netFinalValue);
    elRealFinal.textContent = eur.format(res.realFinalValue);
    elTaxPaid.textContent = eur.format(res.taxPaid);
    elInflationLoss.textContent = eur.format(res.inflationLoss);
    elInvested.textContent = eur.format(res.invested);
    elProfit.textContent = eur.format(res.profit);
    elMonthlyRate.textContent = `${pct(res.mRate)} / ${currentLang === 'en' ? 'month' : 'mês'}`;

    elDetail.innerHTML = t("calc_detail_template", {
      years,
      months: res.months,
      initial: eur.format(initial),
      monthly: eur.format(monthly),
      annual: annual
    });

    // Milestone calculation
    elMilestoneTargetBadge.textContent = `${currentLang === 'en' ? 'Target' : 'Objetivo'}: ${eurShort.format(target)}`;
    const milestoneRes = calculateMilestone({ initial, monthly, annual, target });
    
    if (milestoneRes.reached) {
      if (milestoneRes.years === 0 && milestoneRes.months === 0) {
        elMilestoneTime.textContent = t("milestone_reached_instantly");
        elMilestoneShortDate.textContent = t("milestone_reached_instant_sub");
      } else {
        elMilestoneTime.textContent = t("milestone_time_format", { years: milestoneRes.years, months: milestoneRes.months });
        const currentYear = new Date().getFullYear();
        elMilestoneShortDate.textContent = t("milestone_prediction_sub", { year: currentYear + milestoneRes.years });
      }
    } else {
      elMilestoneTime.textContent = t("milestone_outside_horizon");
      elMilestoneShortDate.textContent = t("milestone_outside_horizon_sub");
    }

    // Progress Bar
    const progressPct = Math.min(100, Math.max(0, (res.balance / target) * 100));
    elMilestonePercentage.textContent = `${progressPct.toFixed(1)}%`;
    elMilestoneProgressBar.style.width = `${progressPct}%`;

    // 4% Rule Passive Income
    const monthlyPassive = (res.balance * 0.04) / 12;
    elMilestonePassiveIncome.textContent = `${eurDec.format(monthlyPassive)} / ${currentLang === 'en' ? 'month' : 'mês'}`;

    // Render Sub views (Chart & table)
    renderChart(res);
    renderYearTable(res.yearly);
  }

  // --- 17. Input Synchronization Helper ---
  function syncInputs(numEl, sliderEl) {
    numEl.addEventListener('input', () => {
      let val = parseFloat(numEl.value);
      if (isNaN(val)) val = 0;
      sliderEl.value = Math.min(sliderEl.max, Math.max(sliderEl.min, val));
      runProjections();
    });

    sliderEl.addEventListener('input', () => {
      numEl.value = sliderEl.value;
      runProjections();
    });
  }

  syncInputs(elInitial, elInitialSlider);
  syncInputs(elMonthly, elMonthlySlider);
  syncInputs(elYears, elYearsSlider);
  syncInputs(elAnnual, elAnnualSlider);
  syncInputs(elInflation, elInflationSlider);
  syncInputs(elTax, elTaxSlider);
  syncInputs(elTarget, elTargetSlider);

  // Scenario Buttons click
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active', 'bg-white', 'dark:bg-slate-900', 'text-indigo-500', 'shadow-sm'));
      presetBtns.forEach(b => b.classList.add('text-slate-600', 'dark:text-slate-400'));
      
      btn.classList.add('active', 'bg-white', 'dark:bg-slate-900', 'text-indigo-500', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');
      
      const scenarioName = btn.getAttribute('data-scenario');
      const targetRate = SCENARIOS[scenarioName];
      if (targetRate !== undefined) {
        elAnnual.value = targetRate;
        elAnnualSlider.value = targetRate;
        runProjections();
        showToast(t("toast_scenario_preset", {
          scenario: scenarioName === 'conservative' ? t("scenario_conser") : (scenarioName === 'moderate' ? t("scenario_moder") : t("scenario_agres")),
          rate: targetRate
        }));
      }
    });
  });

  // PT Tax Button Shortcut (28%)
  btnPtTax.addEventListener('click', () => {
    elTax.value = 28;
    elTaxSlider.value = 28;
    runProjections();
    showToast(t("toast_pt_tax"));
  });

  // Reset parameters
  btnReset.addEventListener('click', () => {
    elInitial.value = 10000;
    elInitialSlider.value = 10000;
    elMonthly.value = 250;
    elMonthlySlider.value = 250;
    elYears.value = 20;
    elYearsSlider.value = 20;
    elAnnual.value = 5.0;
    elAnnualSlider.value = 5.0;
    elInflation.value = 2.0;
    elInflationSlider.value = 2.0;
    elTax.value = 28;
    elTaxSlider.value = 28;
    elTarget.value = 250000;
    elTargetSlider.value = 250000;

    // Reset preset buttons styling to conservative
    presetBtns.forEach(b => b.classList.remove('active', 'bg-white', 'dark:bg-slate-900', 'text-indigo-500', 'shadow-sm'));
    const consPreset = document.querySelector('[data-scenario="conservative"]');
    consPreset.classList.add('active', 'bg-white', 'dark:bg-slate-900', 'text-indigo-500', 'shadow-sm');

    runProjections();
    showToast(t("toast_reset"));
  });

  // --- 18. Export CSV Helper with European delimiter (;) ---
  btnDownloadCsv.addEventListener('click', () => {
    const years = Number(elYears.value);
    const initial = Number(elInitial.value);
    const monthly = Number(elMonthly.value);
    const annual = Number(elAnnual.value);
    const inflation = Number(elInflation.value);
    const tax = Number(elTax.value);

    const res = simulate({
      years,
      initialInvestment: initial,
      monthlyContribution: monthly,
      annualPercent: annual,
      inflationPercent: inflation,
      taxPercent: tax
    });

    let csvLines = [`${t("th_period")};${t("th_invested")} (EUR);${t("th_gross")} (EUR);${t("th_net")} (EUR);${t("th_real")} (EUR)`];
    res.yearly.forEach(r => {
      csvLines.push(`${t("year_label_prefix")} ${r.year};${r.invested.toFixed(2)};${r.balance.toFixed(2)};${r.netBalance.toFixed(2)};${r.realBalance.toFixed(2)}`);
    });

    const csvString = csvLines.join("\n");
    // UTF-8 with BOM prefix to ensure Excel reads characters correctly
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wealthiers_report_${years}_years.csv`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(t("toast_csv_downloaded"));
  });

  // Initial Boot triggers
  updateLanguageUI();

});

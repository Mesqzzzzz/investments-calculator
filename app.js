/* ==========================================================================
   Wealthiers - Application Logic
   ========================================================================== */

// --- 1. PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Wealthiers SW registered!', reg))
      .catch(err => console.error('Wealthiers SW registration failed:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 2. Element Selectors ---
  const tabItems = document.querySelectorAll('.ios-tab-item');
  const views = document.querySelectorAll('.ios-view');
  const themeBtn = document.getElementById('themeToggle');

  // Input Elements
  const elInitial = document.getElementById('initial');
  const elInitialSlider = document.getElementById('initialSlider');
  const elMonthly = document.getElementById('monthly');
  const elMonthlySlider = document.getElementById('monthlySlider');
  const elYears = document.getElementById('years');
  const elYearsSlider = document.getElementById('yearsSlider');
  const elAnnual = document.getElementById('annualReturn');
  const elAnnualSlider = document.getElementById('annualSlider');

  // Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.ios-segment-item');

  // Dashboard Output Widgets
  const elFinal = document.getElementById('finalValue');
  const elInvested = document.getElementById('totalInvested');
  const elProfit = document.getElementById('profit');
  const elMonthlyRate = document.getElementById('monthlyRate');
  const elDetail = document.getElementById('calcDetail');
  


  // Details Screen Table
  const elYearTable = document.getElementById('yearTable');
  const btnReset = document.getElementById('resetBtn');

  // --- 3. Global State & Configs ---
  let growthChart = null;

  const SCENARIOS = {
    conservative: 5.0,
    moderate: 8.5,
    aggressive: 12.0
  };



  // --- 4. Formatters ---
  const eur = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const eurDec = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
  const eurShort = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    compactDisplay: "short"
  });
  const pct = (v) => (v * 100).toFixed(3) + "%";

  // --- 5. Helper: Toast Notifications ---
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'ios-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- 6. Theme Switching ---
  function setTheme(isDark) {
    document.documentElement.classList.toggle("dark", !isDark); // Wait, if isDark is true, let's make sure it toggles the 'light' class instead!
    // Let's implement an explicit 'light' class toggle to override dark default
    document.documentElement.classList.toggle("light", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️ Claro" : "🌙 Escuro";
    
    // Trigger calculation to redraw chart grids
    calculateWealth();
  }

  (function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") return setTheme(false);
    if (saved === "dark") return setTheme(true);

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark);
  })();

  themeBtn.addEventListener("click", () => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight); // if it was light (isLight=true), set to dark (isDark=true)
  });

  // --- 7. Tab Bar SPA View Switcher ---
  const tabMetadata = {
    'tab-simulador': { title: 'Wealthiers', subtitle: 'Simulador' },
    'tab-detalhes': { title: 'Detalhes', subtitle: 'Análise Anual' }
  };

  tabItems.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab');
      
      tabItems.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      
      views.forEach(view => {
        view.classList.toggle('active', view.id === targetId);
      });
      
    });
  });

  // --- 8. Compound Interest Engine ---

  function toMonthlyRate(annualPercent) {
    const r = annualPercent / 100;
    return Math.pow(1 + r, 1/12) - 1;
  }

  function simulate({ years, initialInvestment, monthlyContribution, annualPercent }) {
    const months = years * 12;
    const mRate = toMonthlyRate(annualPercent);

    let balance = initialInvestment;
    let invested = initialInvestment;
    const yearly = [];

    // Year 0 starting points
    yearly.push({ year: 0, invested, balance, profit: 0 });

    for (let m = 1; m <= months; m++) {
      balance *= (1 + mRate);
      balance += monthlyContribution;
      invested += monthlyContribution;

      if (m % 12 === 0) {
        const year = m / 12;
        yearly.push({
          year,
          invested,
          balance,
          profit: Math.max(0, balance - invested)
        });
      }
    }

    return { months, mRate, invested, balance, profit: Math.max(0, balance - invested), yearly };
  }



  // --- 10. Chart.js HD Rendering ---
  function renderChart(yearlyData) {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const labels = yearlyData.map(d => `${d.year}a`);
    const balanceData = yearlyData.map(d => Math.round(d.balance));
    const investedData = yearlyData.map(d => Math.round(d.invested));

    const isLight = document.documentElement.classList.contains('light');
    const textColor = isLight ? '#64748b' : '#9ca3af';
    const gridColor = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(249, 250, 251, 0.05)';

    if (growthChart) {
      growthChart.destroy();
    }

    // High fidelity gradients (Indigo and Slate/Grey)
    const fillGradBalance = ctx.createLinearGradient(0, 0, 0, 240);
    fillGradBalance.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
    fillGradBalance.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const fillGradInvested = ctx.createLinearGradient(0, 0, 0, 240);
    fillGradInvested.addColorStop(0, isLight ? 'rgba(148, 163, 184, 0.08)' : 'rgba(55, 65, 81, 0.1)');
    fillGradInvested.addColorStop(1, 'rgba(148, 163, 184, 0.0)');

    growthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Património Estimado',
            data: balanceData,
            borderColor: '#6366f1', // Indigo Brand Color
            backgroundColor: fillGradBalance,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: yearlyData.length > 30 ? 0 : 2,
            pointHoverRadius: 6,
            hitRadius: 10
          },
          {
            label: 'Capital Investido',
            data: investedData,
            borderColor: isLight ? '#cbd5e1' : '#4b5563', // Slate 300 / Grey 600
            backgroundColor: fillGradInvested,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            hitRadius: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              color: textColor,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: isLight ? '#ffffff' : '#1f2937',
            titleColor: isLight ? '#0f172a' : '#f9fafb',
            bodyColor: isLight ? '#64748b' : '#9ca3af',
            borderColor: isLight ? '#e2e8f0' : '#374151',
            borderWidth: 1,
            cornerRadius: 8,
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
            ticks: { color: textColor, font: { size: 10, weight: '500' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 10, weight: '500' },
              callback: (value) => eurShort.format(value)
            }
          }
        }
      }
    });
  }



  // --- 12. Render Annual Table ---
  function renderYearTable(yearly) {
    if (!elYearTable) return;
    
    if (yearly.length <= 1) {
      elYearTable.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-secondary);">Sem dados de simulação</td></tr>`;
      return;
    }

    elYearTable.innerHTML = yearly.map(r => `
      <tr>
        <td style="font-weight: 600;">Ano ${r.year}</td>
        <td style="color: var(--accent-color); font-weight: 600;">${eur.format(r.invested)}</td>
        <td style="font-weight: 700;">${eur.format(r.balance)}</td>
        <td class="text-right-aligned" style="color: var(--brand-color); font-weight: 700;">
          +${eur.format(r.profit)}
        </td>
      </tr>
    `).join("");
  }

  // --- 13. UI Calculation Trigger ---
  function calculateWealth() {
    const years = Number(elYears.value);
    const initial = Number(elInitial.value);
    const monthly = Number(elMonthly.value);
    const annual = Number(elAnnual.value);

    // Dynamic checks
    if (isNaN(years) || years <= 0 || isNaN(initial) || initial < 0 || isNaN(monthly) || monthly < 0 || isNaN(annual)) {
      return;
    }

    // Run compounding simulation
    const res = simulate({ years, initialInvestment: initial, monthlyContribution: monthly, annualPercent: annual });

    // Update main dashboard metrics
    elFinal.textContent = eur.format(res.balance);
    elInvested.textContent = eur.format(res.invested);
    elProfit.textContent = eur.format(res.profit);
    elMonthlyRate.textContent = `${pct(res.mRate)} / mês`;

    elDetail.innerHTML = `
      Projeção para <b>${years} anos</b> (${res.months} depósitos).<br>
      Montante Inicial de <b>${eur.format(initial)}</b> mais depósitos de <b>${eur.format(monthly)}/mês</b> 
      capitalizados a <b>${annual}%</b> médios anuais.
    `;

    // Update sub views
    renderChart(res.yearly);
    renderYearTable(res.yearly);

    // Check if annual matches any scenario, highlight accordingly
    scenarioBtns.forEach(btn => {
      const scenName = btn.getAttribute('data-scenario');
      const rateVal = SCENARIOS[scenName];
      btn.classList.toggle('active', Math.abs(annual - rateVal) < 0.05);
    });
  }

  // --- 14. Event Binding and Syncing ---

  function syncInputs(numEl, sliderEl) {
    numEl.addEventListener('input', () => {
      let val = parseFloat(numEl.value);
      if (isNaN(val)) val = 0;
      sliderEl.value = Math.min(sliderEl.max, Math.max(sliderEl.min, val));
      calculateWealth();
    });

    sliderEl.addEventListener('input', () => {
      numEl.value = sliderEl.value;
      calculateWealth();
    });
  }

  syncInputs(elInitial, elInitialSlider);
  syncInputs(elMonthly, elMonthlySlider);
  syncInputs(elYears, elYearsSlider);
  syncInputs(elAnnual, elAnnualSlider);

  // Scenarios segmented buttons clicks
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenarioName = btn.getAttribute('data-scenario');
      const targetRate = SCENARIOS[scenarioName];
      if (targetRate !== undefined) {
        elAnnual.value = targetRate;
        elAnnualSlider.value = targetRate;
        calculateWealth();
        showToast(`Cenário ${btn.textContent} Ativado: ${targetRate}%`);
      }
    });
  });

  // Reset parameters button
  btnReset.addEventListener('click', () => {
    elInitial.value = 10000;
    elInitialSlider.value = 10000;
    elMonthly.value = 250;
    elMonthlySlider.value = 250;
    elYears.value = 20;
    elYearsSlider.value = 20;
    elAnnual.value = 8.5;
    elAnnualSlider.value = 8.5;

    calculateWealth();
    showToast("Parâmetros Wealthiers reposto!");
  });

  // Run calculation immediately
  calculateWealth();

});

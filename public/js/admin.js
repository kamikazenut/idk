(function () {
  document.querySelectorAll('[data-confirm]').forEach((item) => {
    item.addEventListener('click', (event) => {
      if (!confirm(item.dataset.confirm)) {
        event.preventDefault();
      }
    });
  });

  document.querySelectorAll('[data-auto-submit]').forEach((item) => {
    item.addEventListener('change', () => {
      item.form?.requestSubmit();
    });
  });

  document.querySelectorAll('[data-datatable]').forEach((table) => {
    if (window.DataTable) {
      new window.DataTable(table, {
        paging: false,
        info: false,
        searching: false,
        lengthChange: false,
        order: [],
        responsive: true
      });
    }
  });

  function chartFromCanvas(id, label, color) {
    const canvas = document.getElementById(id);
    if (!canvas || !window.Chart) return;
    const labels = JSON.parse(canvas.dataset.labels || '[]');
    const values = JSON.parse(canvas.dataset.values || '[]');
    new window.Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          borderColor: color,
          backgroundColor: `${color}22`,
          tension: 0.35,
          fill: true,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  chartFromCanvas('downloadTrend', 'Downloads', '#2563eb');
  chartFromCanvas('registrationTrend', 'Registrations', '#16a34a');
})();

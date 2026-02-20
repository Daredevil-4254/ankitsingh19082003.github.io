document.addEventListener("DOMContentLoaded", async () => {
  const statsContainer = document.getElementById("public-stats-container");
  const _apiBase = (window.portfolioConfig && window.portfolioConfig.API_BASE) ? window.portfolioConfig.API_BASE : '/api';
  const API_URL = `${_apiBase}/public/stats`;

  if (!statsContainer) return;

  try {
    const res = await fetch(API_URL);
    const stats = await res.json();
    const items = Array.isArray(stats) ? stats : [];

    if (items.length > 0) {
      // 1. First, generate and inject the HTML
      statsContainer.innerHTML = items.map(s => {
        const hasNumbers = /\d/.test(s.value);
        const numericValue = hasNumbers ? s.value.replace(/[^0-9]/g, '') : null;
        const suffix = hasNumbers ? s.value.replace(/[0-9]/g, '') : "";


        return `
<div class="col-md-6 col-lg-4 ftco-animate">
    <div class="stat-item d-flex align-items-center mb-5">
        <div class="stat-icon-wrap shadow-sm me-4">
            <i class="fas ${s.icon || 'fa-bar-chart'}" style="font-size:30px;color:#b1b493;"></i>
        </div>
        <div class="stat-text-wrap">
            <strong class="number" 
                data-is-numeric="${hasNumbers}" 
                data-number="${numericValue}" 
                data-suffix="${suffix}">
                ${hasNumbers ? '0' : s.value}
            </strong>
            <span class="text-uppercase small font-weight-bold text-muted" style="letter-spacing: 1px;">
                ${s.label}
            </span>
        </div>
    </div>
</div>`;
      }).join(""); // Use .join("") to combine the array into one string

      // 2. Then, trigger the animation logic after a short delay
      setTimeout(() => {
        if (window.jQuery && window.jQuery.fn.waypoint) {
          const $ = window.jQuery;
          $('.ftco-animate').waypoint(function (direction) {
            if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
              $(this.element).addClass('ftco-animated fadeInUp');
              const numEl = $(this.element).find('.number');

              if (numEl.data('is-numeric') === true && !numEl.hasClass('done')) {
                numEl.addClass('done');
                const target = parseInt(numEl.data('number'));
                const suffix = numEl.data('suffix') || "";

                $({ countNum: 0 }).animate({ countNum: target }, {
                  duration: 2500,
                  easing: 'swing',
                  step: function () {
                    numEl.text(Math.floor(this.countNum).toLocaleString() + suffix);
                  },
                  complete: function () {
                    numEl.text(target.toLocaleString() + suffix);
                  }
                });
              }
            }
          }, { offset: '95%' });
        }
      }, 300);
    }
  } catch (err) {
    console.error("Stats Load Error:", err);
  }
});
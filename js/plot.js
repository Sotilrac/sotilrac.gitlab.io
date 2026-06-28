// <function-plot>: interactive function plotting on uPlot.
// Config comes from a child <script type="application/json">. See the `plot`
// shortcode in eleventy.config.mjs. Themes off the site's CSS variables and
// rebuilds when the OS light/dark preference flips.
(function () {
  if (!window.customElements || customElements.get("function-plot")) return;

  // Resolve a color: "--crimson" reads the CSS variable, anything else is literal.
  function resolveColor(c, fallback) {
    if (!c) return fallback;
    if (c.indexOf("--") === 0) {
      var v = getComputedStyle(document.documentElement)
        .getPropertyValue(c)
        .trim();
      return v || fallback;
    }
    return c;
  }

  function palette() {
    return {
      text: resolveColor("--charcoal", "#212529"),
      curve: resolveColor("--royal-blue", "#007bff"),
      grid: resolveColor("--silver", "#ddd"),
      muted: resolveColor("--pewter", "#6c757d"),
    };
  }

  function decimalsOf(step) {
    var s = String(step);
    var i = s.indexOf(".");
    return i === -1 ? 0 : s.length - i - 1;
  }

  class FunctionPlot extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;

      var src = this.querySelector('script[type="application/json"]');
      if (!src || !window.uPlot) return;
      try {
        this.cfg = JSON.parse(src.textContent);
      } catch (e) {
        return;
      }

      var cfg = this.cfg;
      this.xmin = cfg.x && cfg.x.min != null ? cfg.x.min : -10;
      this.xmax = cfg.x && cfg.x.max != null ? cfg.x.max : 10;
      this.height = cfg.height || 280;
      this.samples = cfg.samples || 240;
      this.markers = cfg.markers || [];

      // Current parameter values, seeded from slider defaults.
      this.params = {};
      (cfg.sliders || []).forEach(function (s) {
        this.params[s.var] = s.value != null ? s.value : 0;
      }, this);

      // Compile fn once; `with(this)` exposes Math + params + x as bare names.
      try {
        this.fn = new Function("with (this) { return (" + cfg.fn + "); }");
      } catch (e) {
        return;
      }
      // Scope object reused across samples: Math members plus mutable params/x.
      this.scope = {};
      Object.getOwnPropertyNames(Math).forEach(function (k) {
        this.scope[k] = Math[k];
      }, this);

      this.buildDOM();
      this.buildChart();

      // Redraw on container resize and on theme flip.
      if (window.ResizeObserver) {
        this.ro = new ResizeObserver(this.resize.bind(this));
        this.ro.observe(this.chartEl);
      }
      this.mq = window.matchMedia("(prefers-color-scheme: dark)");
      this.onTheme = this.rebuild.bind(this);
      this.mq.addEventListener("change", this.onTheme);
    }

    disconnectedCallback() {
      if (this.ro) this.ro.disconnect();
      if (this.mq) this.mq.removeEventListener("change", this.onTheme);
      if (this.chart) this.chart.destroy();
    }

    buildDOM() {
      var wrap = document.createElement("div");
      wrap.className = "plot-widget";
      this.chartEl = document.createElement("div");
      this.chartEl.className = "plot-chart";
      wrap.appendChild(this.chartEl);

      var sliders = this.cfg.sliders || [];
      if (sliders.length) {
        var controls = document.createElement("div");
        controls.className = "plot-controls";
        sliders.forEach(function (s) {
          var dec = decimalsOf(s.step != null ? s.step : 0.1);
          var label = document.createElement("label");
          var name = document.createElement("span");
          name.className = "plot-name";
          name.innerHTML = s.label || s.var;
          var input = document.createElement("input");
          input.type = "range";
          input.min = s.min;
          input.max = s.max;
          input.step = s.step != null ? s.step : 0.1;
          input.value = this.params[s.var];
          var val = document.createElement("span");
          val.className = "plot-val";
          val.textContent = Number(this.params[s.var]).toFixed(dec);
          input.addEventListener(
            "input",
            function () {
              var v = parseFloat(input.value);
              this.params[s.var] = v;
              val.textContent = v.toFixed(dec);
              if (this.chart) this.chart.setData(this.computeData());
            }.bind(this),
          );
          label.appendChild(name);
          label.appendChild(input);
          label.appendChild(val);
          controls.appendChild(label);
        }, this);
        wrap.appendChild(controls);
      }
      this.appendChild(wrap);
    }

    computeData() {
      var xs = [];
      var ys = [];
      var n = this.samples;
      var scope = this.scope;
      var p = this.params;
      for (var k in p) scope[k] = p[k];
      for (var i = 0; i <= n; i++) {
        var x = this.xmin + ((this.xmax - this.xmin) * i) / n;
        scope.x = x;
        var y = this.fn.call(scope);
        xs.push(x);
        ys.push(Number.isFinite(y) ? y : null);
      }
      return [xs, ys];
    }

    chartWidth() {
      return Math.max(120, Math.floor(this.chartEl.clientWidth || 320));
    }

    buildChart() {
      var cfg = this.cfg;
      var pal = palette();
      var pr = window.uPlot.pxRatio || window.devicePixelRatio || 1;
      var font = Math.round(11 * pr) + "px sans-serif";
      var self = this;

      function axis(label) {
        return {
          stroke: pal.text,
          label: label || undefined,
          labelSize: label ? 28 : 14,
          labelGap: 4,
          font: font,
          labelFont: "bold " + font,
          grid: { stroke: pal.grid, width: 1 },
          ticks: { stroke: pal.grid, width: 1, size: 5 },
        };
      }

      var yscale = {};
      if (cfg.y) {
        if (cfg.y.min != null) yscale.min = cfg.y.min;
        if (cfg.y.max != null) yscale.max = cfg.y.max;
      }
      var hasY = yscale.min != null && yscale.max != null;

      var opts = {
        width: this.chartWidth(),
        height: this.height,
        legend: { show: false },
        cursor: { y: false, points: { size: 6 } },
        scales: {
          x: { time: false, range: [this.xmin, this.xmax] },
          y: hasY ? { range: [yscale.min, yscale.max] } : {},
        },
        axes: [axis(cfg.x && cfg.x.label), axis(cfg.y && cfg.y.label)],
        series: [{}, { stroke: pal.curve, width: 3, points: { show: false } }],
        hooks: {
          draw: [
            function (u) {
              self.drawMarkers(u, pal, pr);
            },
          ],
          setCursor: [
            function (u) {
              self.updateTip(u);
            },
          ],
        },
      };

      this.pal = pal;
      this.chart = new window.uPlot(opts, this.computeData(), this.chartEl);

      // Floating (x, y) readout pinned to the hovered point.
      this.tip = document.createElement("div");
      this.tip.className = "plot-tip";
      this.tip.style.display = "none";
      this.chart.over.appendChild(this.tip);
    }

    updateTip(u) {
      var tip = this.tip;
      if (!tip) return;
      var idx = u.cursor.idx;
      if (idx == null) {
        tip.style.display = "none";
        return;
      }
      var xv = u.data[0][idx];
      var yv = u.data[1][idx];
      if (yv == null) {
        tip.style.display = "none";
        return;
      }
      var fmt = function (v) {
        return String(+v.toFixed(2));
      };
      tip.textContent = "(" + fmt(xv) + ", " + fmt(yv) + ")";
      tip.style.left = u.valToPos(xv, "x") + "px";
      tip.style.top = u.valToPos(yv, "y") + "px";
      tip.style.display = "";
    }

    drawMarkers(u, pal, pr) {
      if (!this.markers.length) return;
      var ctx = u.ctx;
      var top = u.bbox.top;
      var bottom = u.bbox.top + u.bbox.height;
      this.markers.forEach(function (m) {
        var xv = typeof m.x === "string" ? this.params[m.x] : m.x;
        if (xv == null || xv < this.xmin || xv > this.xmax) return;
        var cx = Math.round(u.valToPos(xv, "x", true));
        var color = resolveColor(m.color, pal.muted);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        if (m.dash !== false) ctx.setLineDash([5 * pr, 4 * pr]);
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bottom);
        ctx.stroke();
        if (m.label) {
          ctx.setLineDash([]);
          ctx.fillStyle = color;
          ctx.font = Math.round(11 * pr) + "px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(m.label, cx, top + 14 * pr);
        }
        ctx.restore();
      }, this);
    }

    resize() {
      if (!this.chart) return;
      this.chart.setSize({ width: this.chartWidth(), height: this.height });
    }

    rebuild() {
      if (this.chart) this.chart.destroy();
      this.buildChart();
    }
  }

  customElements.define("function-plot", FunctionPlot);
})();

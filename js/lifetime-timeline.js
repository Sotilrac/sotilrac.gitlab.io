// <lifetime-timeline>: the storage-lifetime chart in "How to Make It Last",
// with a log/linear scale toggle. Colours come from the site's CSS variables
// via classes in main.css. Also loadable in node (module.exports) to render
// the SVG string for previews.
(function () {
  var W = 780;
  var X0 = 172; // 1 year (log) or 0 years (linear)
  var X1 = 622; // 1000 years
  var TOP = 46;
  var MAX = 1000;

  // [name, unpowered segments, powered segments]; segment = [from, to, style, label, label position]
  var ROWS = [
    [
      "microSD",
      [[1, 10, "dash", "unrated; same NAND as an SSD, less margin", "end"]],
      [[1, 10, "dash", "set by write volume and power cuts", "end"]],
    ],
    [
      "SSD",
      [
        [1, 1, "solid", "JEDEC floor: 1 yr for a worn drive at 30 °C", "above"],
        [1, 10, "dash", "fresh drive ≈ 10", "end"],
      ],
      [
        [1, 5, "solid", "5 yr warranty", "below"],
        [5, 10, "dash", "fleets lose 0.2 to 1 % a year", "end"],
      ],
    ],
    [
      "Hard drive",
      [
        [1, 2, "solid", "under 2 (NIST), no maker rates it", "above"],
        [
          2,
          30,
          "dash",
          "80 % of 1990s drives still read (Iron Mountain)",
          "end",
        ],
      ],
      [
        [1, 5, "solid", "5 yr rated service life", "below"],
        [5, 10, "dash", "median 6.75, failure peak at 10", "end"],
      ],
    ],
    ["Thermal paper", [[5, 5, "solid", "blank in as little as 5", "end"]], []],
    ["LTO tape", [[20, 30, "solid", "20 (NIST) to 30 (vendor)", "end"]], []],
    [
      "Wood-pulp paper",
      [[50, 100, "solid", "brittle within a lifetime", "end"]],
      [],
    ],
    [
      "Acid-free paper",
      [
        [300, 500, "solid", "“several hundred” (ISO 9706)", "start"],
        [500, 570, "dash", "Gutenberg, 570", "end"],
      ],
      [],
    ],
    ["Microfilm", [[500, 1000, "solid", "LE-500 is a minimum", "start"]], []],
    ["Stone", [[100, 200, "solid", "marble lettering, city air", "start"]], []],
  ];

  function rowHeight(r) {
    return r[2].length ? 66 : 40;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function render(scale) {
    var log = scale !== "linear";
    function x(y) {
      return log
        ? X0 + (Math.log(y) / Math.LN10) * ((X1 - X0) / 3)
        : X0 + (y / MAX) * (X1 - X0);
    }
    var H = TOP + 40;
    ROWS.forEach(function (r) {
      H += rowHeight(r);
    });
    var o = [];
    o.push(
      '<svg viewBox="0 0 ' +
        W +
        " " +
        H +
        '" width="100%" role="img" aria-label="Timeline of storage media lifetimes, ' +
        (log ? "log" : "linear") +
        ' scale">',
    );
    var ticks = log
      ? [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
      : [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    ticks.forEach(function (t) {
      var xx = x(t).toFixed(1);
      o.push(
        '<line class="tl-g" x1="' +
          xx +
          '" y1="' +
          (TOP - 14) +
          '" x2="' +
          xx +
          '" y2="' +
          (H - 34) +
          '"/>',
      );
      o.push(
        '<text class="tl-s" x="' +
          xx +
          '" y="' +
          (H - 20) +
          '" text-anchor="middle">' +
          t.toLocaleString("en") +
          "</text>",
      );
    });
    o.push(
      '<line class="tl-ax" x1="' +
        X0 +
        '" y1="' +
        (H - 34) +
        '" x2="' +
        (X1 + 8) +
        '" y2="' +
        (H - 34) +
        '"/>',
    );
    // Axis break, then stone off the end of it.
    var bx = X1 + 44;
    o.push(
      '<path class="tl-ax" fill="none" d="M' +
        (bx - 6) +
        "," +
        (H - 40) +
        ' l4,6 l-8,8 l4,6"/>',
    );
    o.push(
      '<path class="tl-ax" fill="none" d="M' +
        (bx + 4) +
        "," +
        (H - 40) +
        ' l4,6 l-8,8 l4,6"/>',
    );
    o.push(
      '<line class="tl-ax" x1="' +
        (bx + 12) +
        '" y1="' +
        (H - 34) +
        '" x2="' +
        (W - 10) +
        '" y2="' +
        (H - 34) +
        '"/>',
    );
    o.push(
      '<text class="tl-s" x="' +
        (W - 10) +
        '" y="' +
        (H - 20) +
        '" text-anchor="end">years</text>',
    );
    // Legend
    var ly = 16;
    o.push(
      '<line class="tl-u tl-b" x1="' +
        X0 +
        '" y1="' +
        ly +
        '" x2="' +
        (X0 + 28) +
        '" y2="' +
        ly +
        '"/><text class="tl-s" x="' +
        (X0 + 34) +
        '" y="' +
        (ly + 4) +
        '">unpowered, rated or measured</text>',
    );
    o.push(
      '<line class="tl-u tl-b tl-d" x1="' +
        (X0 + 210) +
        '" y1="' +
        ly +
        '" x2="' +
        (X0 + 238) +
        '" y2="' +
        ly +
        '"/><text class="tl-s" x="' +
        (X0 + 244) +
        '" y="' +
        (ly + 4) +
        '">observed or expected beyond it</text>',
    );
    o.push(
      '<line class="tl-p tl-b" x1="' +
        (X0 + 420) +
        '" y1="' +
        ly +
        '" x2="' +
        (X0 + 448) +
        '" y2="' +
        ly +
        '"/><text class="tl-s" x="' +
        (X0 + 454) +
        '" y="' +
        (ly + 4) +
        '">powered, in service</text>',
    );

    function bars(segs, cls, yy) {
      segs.forEach(function (s) {
        var xa = x(s[0]);
        var xb = x(s[1]);
        var at = s[4];
        if (s[0] === s[1]) {
          o.push(
            '<circle class="tl-pt" cx="' +
              xa.toFixed(1) +
              '" cy="' +
              yy +
              '" r="4"/>',
          );
        } else {
          o.push(
            '<line class="' +
              cls +
              " tl-b" +
              (s[2] === "dash" ? " tl-d" : "") +
              '" x1="' +
              xa.toFixed(1) +
              '" y1="' +
              yy +
              '" x2="' +
              xb.toFixed(1) +
              '" y2="' +
              yy +
              '"/>',
          );
        }
        // A start label needs room on its left; on the linear scale short bars
        // lose that room, so the label moves above the bar instead.
        if (at === "start" && xa - X0 < 180) at = "above";
        var lab = esc(s[3]);
        if (at === "end")
          o.push(
            '<text class="tl-s" x="' +
              (xb + 7).toFixed(1) +
              '" y="' +
              (yy + 4) +
              '">' +
              lab +
              "</text>",
          );
        else if (at === "start")
          o.push(
            '<text class="tl-s" x="' +
              (xa - 7).toFixed(1) +
              '" y="' +
              (yy + 4) +
              '" text-anchor="end">' +
              lab +
              "</text>",
          );
        else if (at === "above")
          o.push(
            '<text class="tl-s" x="' +
              xa.toFixed(1) +
              '" y="' +
              (yy - 9) +
              '">' +
              lab +
              "</text>",
          );
        else if (at === "below")
          o.push(
            '<text class="tl-s" x="' +
              xa.toFixed(1) +
              '" y="' +
              (yy + 16) +
              '">' +
              lab +
              "</text>",
          );
      });
    }

    var ycur = TOP;
    ROWS.forEach(function (r) {
      var name = r[0];
      var pwr = r[2].length > 0;
      var yc = ycur + (pwr ? 26 : 12);
      ycur += rowHeight(r);
      o.push(
        '<text class="tl-t" x="' +
          (X0 - 12) +
          '" y="' +
          (yc + 4) +
          '" text-anchor="end">' +
          esc(name) +
          "</text>",
      );
      if (pwr) {
        bars(r[1], "tl-u", yc - 5);
        bars(r[2], "tl-p", yc + 7);
      } else {
        bars(r[1], "tl-u", yc);
      }
      if (name === "Microfilm") {
        o.push(
          '<path class="tl-pt" d="M' +
            (x(1000) + 1).toFixed(1) +
            "," +
            (yc - 7) +
            ' l10,7 l-10,7 z"/>',
        );
      }
      if (name === "Stone") {
        o.push(
          '<line class="tl-u tl-b" x1="' +
            (bx + 14) +
            '" y1="' +
            yc +
            '" x2="' +
            (W - 10) +
            '" y2="' +
            yc +
            '"/>',
        );
        o.push(
          '<text class="tl-s" x="' +
            (W - 10) +
            '" y="' +
            (yc - 9) +
            '" text-anchor="end">granodiorite: 2,200+ and counting</text>',
        );
      }
    });
    o.push("</svg>");
    return o.join("");
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { render: render };
    return;
  }
  if (!window.customElements || customElements.get("lifetime-timeline")) return;

  class LifetimeTimeline extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      var scale =
        this.getAttribute("data-scale") === "linear" ? "linear" : "log";
      var id = "tl-" + Math.random().toString(36).slice(2, 8);
      this.innerHTML =
        '<div class="tl-controls" role="radiogroup" aria-label="Axis scale">' +
        "<span>scale</span>" +
        '<label><input type="radio" name="' +
        id +
        '" value="log"' +
        (scale === "log" ? " checked" : "") +
        "> log</label>" +
        '<label><input type="radio" name="' +
        id +
        '" value="linear"' +
        (scale === "linear" ? " checked" : "") +
        "> linear</label>" +
        "</div>" +
        '<div class="tl-chart"></div>';
      this.chart = this.querySelector(".tl-chart");
      this.chart.innerHTML = render(scale);
      var self = this;
      this.querySelectorAll("input").forEach(function (el) {
        el.addEventListener("change", function () {
          self.chart.innerHTML = render(el.value);
        });
      });
    }
  }
  customElements.define("lifetime-timeline", LifetimeTimeline);
})();

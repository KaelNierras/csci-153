/* ============================================================
   CSci 153 — Module 1 widgets · UI/UX

   Assembled from the widget sets of the pre-milestone modules
   1, 2, because this deck's slides came from them.

   Every widget is a self-contained IIFE that bails out quietly
   if its mount point is missing, so carrying a few unused ones
   costs bytes and nothing else.
   ============================================================ */

/* ==== from the old module-1.js ==== */
/* ============================================================
   Module 01 — UI/UX Design · interactive demonstrations
   Each widget is independent and fails quietly if its slide
   is not present, so slides can be reordered or removed.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- color helpers (used by contrast + tokens) ---------- */
  function hex2rgb(h) {
    h = String(h).replace('#', '').trim();
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function luminance(rgb) {
    var a = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function ratio(fg, bg) {
    var l1 = luminance(fg), l2 = luminance(bg);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }
  function mix(a, b, t) {
    return '#' + a.map(function (v, i) {
      return Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0');
    }).join('');
  }
  function readableOn(hex) {
    var rgb = hex2rgb(hex) || [0, 0, 0];
    return luminance(rgb) > 0.42 ? '#0B0E13' : '#F2F5FA';
  }

  /* ============================================================
     1 · Visual hierarchy — before / after
     ============================================================ */
  (function hierarchy() {
    var flat = $('#hier-flat'), good = $('#hier-good'), notes = $('#hier-notes');
    if (!flat || !good) return;

    var rows = [
      ['CSCI 153', 'Web Systems and Technologies', '3'],
      ['CSCI 155', 'Software Engineering', '3'],
      ['CSCI 161', 'Automata and Language Theory', '3'],
      ['STAT 121', 'Probability and Statistics', '3']
    ];

    /* flat: one size, one weight, one color, even spacing — nothing wins */
    flat.innerHTML =
      '<div style="background:#11151D;border:1px solid #232E3E;padding:16px;font-size:14px;color:#B6BECD;line-height:1.9">' +
        '<div>Enrollment summary</div>' +
        '<div>First semester 2026–2027</div>' +
        '<div>Reference 2026-08-15-4471</div>' +
        '<div>Status: confirmed</div>' +
        rows.map(function (r) { return '<div>' + r[0] + ' ' + r[1] + ' ' + r[2] + ' units</div>'; }).join('') +
        '<div>Total units 12</div>' +
        '<div>Assessment due 30 August 2026</div>' +
        '<div>Print assessment form</div>' +
      '</div>';

    /* layered: same content, same palette — size, weight, space, one accent */
    good.innerHTML =
      '<div style="background:#11151D;border:1px solid #232E3E;padding:24px;color:#B6BECD;display:flex;flex-direction:column;gap:20px">' +
        '<div style="display:flex;flex-direction:column;gap:6px">' +
          '<div style="font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;color:#D9A441">CONFIRMED · FIRST SEMESTER 2026–2027</div>' +
          '<div style="font-size:26px;font-weight:600;color:#E7EBF2;letter-spacing:-0.02em">Enrollment summary</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          rows.map(function (r) {
            return '<div style="display:flex;gap:12px;align-items:baseline;border-bottom:1px solid #1A2331;padding-bottom:8px">' +
              '<span style="font-family:ui-monospace,monospace;font-size:11px;color:#6E7B8F;width:64px">' + r[0] + '</span>' +
              '<span style="flex:1;font-size:14px;color:#E7EBF2">' + r[1] + '</span>' +
              '<span style="font-family:ui-monospace,monospace;font-size:12px;font-variant-numeric:tabular-nums;color:#A7B2C4">' + r[2] + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div style="display:flex;align-items:baseline;gap:10px">' +
          '<span style="font-family:ui-monospace,monospace;font-size:10px;letter-spacing:0.16em;color:#6E7B8F">TOTAL UNITS</span>' +
          '<span style="font-family:ui-monospace,monospace;font-size:22px;color:#E7EBF2;font-variant-numeric:tabular-nums">12</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
          '<button style="background:#D9A441;color:#1C1608;border:0;padding:10px 16px;font:inherit;font-size:13px;font-weight:600;cursor:pointer">Print assessment form</button>' +
          '<span style="font-size:12px;color:#6E7B8F">Due 30 August 2026 · Ref 2026-08-15-4471</span>' +
        '</div>' +
      '</div>';

    if (notes) {
      notes.innerHTML = [
        ['Size', 'The screen title jumps to 26px. One element is now unambiguously first.'],
        ['Weight', 'Subject names go solid, codes and units stay muted. Two weights, not five.'],
        ['Space', 'Related lines tighten to 8px, unrelated groups separate by 20px. Proximity does the grouping that borders used to.'],
        ['Color', 'The accent appears exactly twice — the status eyebrow and the one action.'],
        ['Alignment', 'Codes, names, and units hold three fixed columns; units use tabular figures so they stack.'],
        ['Rank', 'Reference number drops to the footer. It is needed rarely, so it ranks last.']
      ].map(function (n) {
        return '<li><span><b>' + n[0] + '</b> — ' + n[1] + '</span></li>';
      }).join('');
    }
  })();

  /* ============================================================
     2 · Spacing scale playground
     ============================================================ */
  (function spacing() {
    var root = $('#w-spacing');
    if (!root) return;
    var preview = $('#sp-preview'), values = $('#sp-values');
    var gridSw = $('#sp-grid'), modeBar = $('#sp-mode');
    var dens = $('#sp-density'), densV = $('#sp-density-v');
    var mode = 'vibes', density = 1;
    var DENS = ['compact', 'comfortable', 'roomy'];

    function scale() {
      /* eyeballed values are the near-misses students actually type */
      if (mode === 'vibes') return { unit: 0, pad: 13, gap: 7, sect: 19, inner: 5, label: 'no system' };
      var u = mode === '4pt' ? 4 : 8;
      var m = [0.75, 1, 1.5][density];
      var step = function (n) { return Math.round(u * n * m / u) * u; };
      return { unit: u, pad: step(4), gap: step(2), sect: step(6), inner: step(1), label: u + 'pt base' };
    }

    function render() {
      var s = scale();
      var overlay = gridSw && gridSw.checked && s.unit
        ? 'background-image:repeating-linear-gradient(to bottom, rgba(217,164,65,.16) 0 1px, transparent 1px ' + s.unit + 'px);'
        : '';
      preview.innerHTML =
        '<div style="' + overlay + 'background:#11151D;border:1px solid #232E3E;padding:' + s.pad + 'px;display:flex;flex-direction:column;gap:' + s.sect + 'px">' +
          '<div style="display:flex;flex-direction:column;gap:' + s.inner + 'px">' +
            '<div style="font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.16em;color:#6E7B8F">SECTION A</div>' +
            '<div style="font-size:18px;font-weight:600;color:#E7EBF2">Requirements</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:' + s.gap + 'px">' +
            ['Medical clearance', 'Library clearance', 'Adviser signature'].map(function (t) {
              return '<div style="display:flex;justify-content:space-between;background:#161E2B;border:1px solid #232E3E;padding:' + s.gap + 'px ' + s.pad + 'px;font-size:13px;color:#A7B2C4">' +
                '<span>' + t + '</span><span style="color:#57B98A">cleared</span></div>';
            }).join('') +
          '</div>' +
          '<div style="display:flex;gap:' + s.gap + 'px">' +
            '<button style="background:#D9A441;color:#1C1608;border:0;padding:' + s.inner * 2 + 'px ' + s.pad + 'px;font:inherit;font-size:13px;font-weight:600">Continue</button>' +
            '<button style="background:none;color:#A7B2C4;border:1px solid #33415A;padding:' + s.inner * 2 + 'px ' + s.pad + 'px;font:inherit;font-size:13px">Save draft</button>' +
          '</div>' +
        '</div>';
      values.innerHTML =
        '<div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;color:#6E7B8F">' +
        [['system', s.label], ['card padding', s.pad + 'px'], ['row gap', s.gap + 'px'], ['section gap', s.sect + 'px'], ['label gap', s.inner + 'px']]
          .map(function (r) { return '<span>' + r[0] + '</span><span style="color:#D9A441">' + r[1] + '</span>'; }).join('') +
        '</div>' +
        (mode === 'vibes'
          ? '<p style="margin-top:8px;color:#E0655A">13 / 7 / 19 / 5 — every value invented separately. Nothing lines up with anything.</p>'
          : '<p style="margin-top:8px;color:#57B98A">Every value is a multiple of ' + s.unit + '. Alignment happens for free.</p>');
    }

    $$('button', modeBar).forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.dataset.mode;
        $$('button', modeBar).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        render();
      });
    });
    if (dens) dens.addEventListener('input', function () {
      density = +dens.value; densV.textContent = DENS[density]; render();
    });
    if (gridSw) gridSw.addEventListener('change', render);
    render();
  })();

  /* ============================================================
     3 · Type scale
     ============================================================ */
  (function typescale() {
    var root = $('#w-type');
    if (!root) return;
    var base = $('#ty-base'), baseV = $('#ty-base-v'), sel = $('#ty-ratio');
    var out = $('#ty-preview'), readout = $('#ty-readout');

    function render() {
      var b = +base.value, r = +sel.value;
      baseV.textContent = b + 'px';
      var steps = [3, 2, 1, 0, -1].map(function (n) {
        return { n: n, px: Math.round(b * Math.pow(r, n) * 10) / 10 };
      });
      readout.textContent = b + 'px × ' + r.toFixed(3);
      out.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:14px">' +
        steps.map(function (s) {
          var lh = s.px > 28 ? 1.08 : s.px > 20 ? 1.25 : 1.55;
          var ls = s.px > 28 ? '-0.03em' : s.px > 20 ? '-0.015em' : '0';
          var w  = s.px >= b ? 600 : 400;
          return '<div style="display:flex;align-items:baseline;gap:16px">' +
            '<span style="font-family:ui-monospace,monospace;font-size:10px;color:#6E7B8F;width:74px;flex:none;font-variant-numeric:tabular-nums">' +
              (s.n >= 0 ? '+' : '') + s.n + ' · ' + s.px + 'px</span>' +
            '<span style="font-size:' + s.px + 'px;line-height:' + lh + ';letter-spacing:' + ls + ';font-weight:' + w + ';color:' + (s.px >= b ? '#E7EBF2' : '#8E99AC') + '">' +
              (s.n === 3 ? 'Enrollment' : s.n === 2 ? 'Your subjects this term' : s.n === 1 ? 'Web Systems and Technologies' : s.n === 0 ? 'Four subjects reserved, 12 units total. The registrar validates within two working days.' : 'Reference 2026-08-15-4471') +
            '</span>' +
          '</div>';
        }).join('') + '</div>';
    }
    base.addEventListener('input', render);
    sel.addEventListener('change', render);
    render();
  })();

  /* ============================================================
     4 · Neutral ramp bias
     ============================================================ */
  (function neutrals() {
    var el = $('#neutral-demo');
    if (!el) return;
    function ramp(tint, label) {
      var stops = [0.06, 0.14, 0.24, 0.45, 0.72, 0.92];
      var base = [10, 13, 19], white = [255, 255, 255];
      return '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div style="font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.14em;color:#6E7B8F">' + label + '</div>' +
        '<div style="display:flex;height:34px;border:1px solid #232E3E">' +
        stops.map(function (t) {
          var g = mix(base, white, t);
          var c = hex2rgb(g);
          var tinted = tint ? mix(c, [217, 164, 65], 0.07) : g;
          return '<div style="flex:1;background:' + tinted + '"></div>';
        }).join('') + '</div></div>';
    }
    el.innerHTML = '<div style="display:flex;flex-direction:column;gap:14px">' +
      ramp(false, 'PURE GREY — READS AS UNCHOSEN') +
      ramp(true, 'BIASED 7% TOWARD THE ACCENT — READS AS A SYSTEM') +
      '</div>';
  })();

  /* ============================================================
     5 · Contrast lab
     ============================================================ */
  (function contrast() {
    var root = $('#w-contrast');
    if (!root) return;
    var fg = $('#ct-fg'), bg = $('#ct-bg'), fgH = $('#ct-fg-hex'), bgH = $('#ct-bg-hex');
    var prev = $('#ct-preview'), out = $('#ct-ratio'), badges = $('#ct-badges'), presets = $('#ct-presets');

    var PRESETS = [
      ['Grey on white', '#8A93A3', '#FFFFFF'],
      ['Body on ink', '#A7B2C4', '#0A0D13'],
      ['Accent on ink', '#D9A441', '#0A0D13'],
      ['White on accent', '#FFFFFF', '#D9A441'],
      ['Ink on accent', '#1C1608', '#D9A441']
    ];

    function render() {
      var f = hex2rgb(fg.value), b = hex2rgb(bg.value);
      if (!f || !b) return;
      var r = ratio(f, b);
      out.textContent = r.toFixed(2);
      prev.style.background = bg.value;
      $('#ct-t1').style.color = fg.value;
      $('#ct-t2').style.color = fg.value;
      $('#ct-t3').style.color = fg.value;
      out.style.color = r >= 4.5 ? '#57B98A' : r >= 3 ? '#D9A441' : '#E0655A';

      var tests = [
        ['AA · body text', 4.5], ['AA · large text', 3], ['AA · UI borders', 3], ['AAA · body text', 7]
      ];
      badges.innerHTML = tests.map(function (t) {
        var ok = r >= t[1];
        return '<span class="chip ' + (ok ? 'chip--pass' : 'chip--fail') + '">' + (ok ? '✓' : '✕') + ' ' + t[0] + '</span>';
      }).join('');
    }

    function sync(colorEl, textEl) {
      colorEl.addEventListener('input', function () { textEl.value = colorEl.value.toUpperCase(); render(); });
      textEl.addEventListener('input', function () {
        if (hex2rgb(textEl.value)) { colorEl.value = textEl.value.trim().length === 4 ? colorEl.value : textEl.value.trim(); render(); }
      });
    }
    sync(fg, fgH); sync(bg, bgH);

    presets.innerHTML = PRESETS.map(function (p, i) {
      return '<button class="btn" type="button" data-i="' + i + '">' + p[0] + '</button>';
    }).join('');
    $$('button', presets).forEach(function (b) {
      b.addEventListener('click', function () {
        var p = PRESETS[+b.dataset.i];
        fg.value = p[1]; fgH.value = p[1];
        bg.value = p[2]; bgH.value = p[2];
        render();
      });
    });
    render();
  })();

  /* ============================================================
     6 · The seven states
     ============================================================ */
  (function states() {
    var root = $('#w-states');
    if (!root) return;
    var prev = $('#st-preview'), name = $('#st-name'), note = $('#st-note'), list = $('#st-buttons');

    var A = '#D9A441', INK = '#1C1608';
    var STATES = [
      ['Default', 'The only one most students design. Everything below is where real products live.',
        '<button style="background:' + A + ';color:' + INK + ';border:0;padding:11px 18px;font:inherit;font-size:14px;font-weight:600">Enroll in 4 subjects</button>'],
      ['Hover', 'Signals "this is clickable" before the click. Never the only affordance — it does not exist on touch.',
        '<button style="background:#F0C069;color:' + INK + ';border:0;padding:11px 18px;font:inherit;font-size:14px;font-weight:600;box-shadow:0 0 0 1px #F0C069">Enroll in 4 subjects</button>'],
      ['Focus', 'For keyboard users this replaces hover entirely. Removing it silently breaks the app for them.',
        '<button style="background:' + A + ';color:' + INK + ';border:0;padding:11px 18px;font:inherit;font-size:14px;font-weight:600;outline:2px solid #8FDDE7;outline-offset:3px">Enroll in 4 subjects</button>'],
      ['Active', 'The press itself. A 60ms change is enough — it confirms the tap registered.',
        '<button style="background:#B4832C;color:' + INK + ';border:0;padding:12px 18px 10px;font:inherit;font-size:14px;font-weight:600">Enroll in 4 subjects</button>'],
      ['Disabled', 'Must look unavailable and say why. A disabled button with no explanation is a dead end.',
        '<div style="display:flex;flex-direction:column;gap:8px;align-items:center">' +
        '<button disabled style="background:#2A3140;color:#6E7B8F;border:0;padding:11px 18px;font:inherit;font-size:14px;font-weight:600">Enroll in 4 subjects</button>' +
        '<span style="font-size:12px;color:#6E7B8F">Clear your library account first</span></div>'],
      ['Loading', 'Label changes, button locks, size stays identical so the layout does not jump.',
        '<button style="background:#B4832C;color:' + INK + ';border:0;padding:11px 18px;font:inherit;font-size:14px;font-weight:600;display:inline-flex;gap:9px;align-items:center">' +
        '<span style="width:11px;height:11px;border:2px solid ' + INK + ';border-right-color:transparent;border-radius:50%;display:inline-block;animation:spin .7s linear infinite"></span>Enrolling…</button>'],
      ['Empty / Error', 'Two different situations, two different messages. Neither is "No data".',
        '<div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:26rem">' +
        '<div style="border:1px dashed #33415A;padding:18px;text-align:center;color:#A7B2C4;font-size:13px">' +
        '<b style="display:block;color:#E7EBF2;margin-bottom:4px">No subjects yet</b>Your adviser has not released your load. Check back after 20 August, or message them from here.</div>' +
        '<div style="border:1px solid #6B2E2A;background:#1B1113;padding:14px;color:#E0655A;font-size:13px">' +
        '<b style="display:block;margin-bottom:4px">Enrollment did not go through</b>' +
        '<span style="color:#C79B95">CSCI 155 filled while you were deciding. Pick another elective and try again — the other three are still held for 10 minutes.</span></div></div>']
    ];

    if (!$('#st-spin')) {
      var st = document.createElement('style');
      st.id = 'st-spin';
      st.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }

    list.innerHTML = STATES.map(function (s, i) {
      return '<button class="btn" type="button" data-i="' + i + '" style="text-align:left">' +
        String(i + 1).padStart(2, '0') + ' · ' + s[0] + '</button>';
    }).join('');

    function show(i) {
      var s = STATES[i];
      prev.innerHTML = s[2];
      name.textContent = s[0].toUpperCase();
      note.innerHTML = '<b style="color:var(--text)">' + s[0] + '</b> — ' + s[1];
      $$('button', list).forEach(function (b, bi) {
        b.classList.toggle('btn--primary', bi === i);
      });
    }
    $$('button', list).forEach(function (b) {
      b.addEventListener('click', function () { show(+b.dataset.i); });
    });
    show(0);
  })();

  /* ============================================================
     7 · Forms — before / after
     ============================================================ */
  (function forms() {
    var bad = $('#form-bad'), good = $('#form-good'), notes = $('#form-notes');
    if (!bad || !good) return;

    bad.innerHTML =
      '<div style="background:#11151D;border:1px solid #232E3E;padding:18px;display:flex;flex-direction:column;gap:9px;max-width:30rem">' +
        '<div style="font-size:16px;color:#E7EBF2;text-align:center;margin-bottom:4px">Add Subject</div>' +
        '<div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px;color:#8A93A3;width:80px;text-align:right">Code:</span>' +
        '<input placeholder="Subject Code" style="flex:1;background:#0A0D13;border:1px solid #232E3E;color:#E7EBF2;padding:5px 7px;font-size:12px"></div>' +
        '<div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px;color:#8A93A3;width:80px;text-align:right">Sched:</span>' +
        '<input placeholder="MWF 10:00-11:00 AM" style="flex:1;background:#0A0D13;border:1px solid #232E3E;color:#E7EBF2;padding:5px 7px;font-size:12px"></div>' +
        '<div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px;color:#8A93A3;width:80px;text-align:right">Units:</span>' +
        '<input placeholder="Units" style="flex:1;background:#0A0D13;border:1px solid #E0655A;color:#E7EBF2;padding:5px 7px;font-size:12px"></div>' +
        '<div style="font-size:11px;color:#E0655A">Error: invalid input</div>' +
        '<div style="display:flex;gap:6px;justify-content:center;margin-top:6px">' +
        '<button style="background:#2A3140;color:#E7EBF2;border:0;padding:5px 12px;font:inherit;font-size:12px">Submit</button>' +
        '<button style="background:#2A3140;color:#E7EBF2;border:0;padding:5px 12px;font:inherit;font-size:12px">Delete</button>' +
        '<button style="background:#2A3140;color:#E7EBF2;border:0;padding:5px 12px;font:inherit;font-size:12px">Cancel</button></div>' +
      '</div>';

    good.innerHTML =
      '<div style="background:#11151D;border:1px solid #232E3E;padding:24px;display:flex;flex-direction:column;gap:20px;max-width:30rem">' +
        '<div style="display:flex;flex-direction:column;gap:4px">' +
          '<div style="font-size:19px;font-weight:600;color:#E7EBF2;letter-spacing:-0.015em">Add a subject</div>' +
          '<div style="font-size:13px;color:#8E99AC">You have 3 of 8 slots remaining this term.</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px">' +
          '<label style="font-size:12px;color:#A7B2C4">Subject code</label>' +
          '<input value="CSCI 153" style="background:#0A0D13;border:1px solid #33415A;color:#E7EBF2;padding:10px 12px;font-size:14px;font-family:ui-monospace,monospace">' +
          '<span style="font-size:12px;color:#6E7B8F">Four letters, a space, three digits — as printed in the catalogue.</span>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px">' +
          '<label style="font-size:12px;color:#A7B2C4">Units</label>' +
          '<input value="5" style="background:#0A0D13;border:1px solid #E0655A;color:#E7EBF2;padding:10px 12px;font-size:14px;font-family:ui-monospace,monospace">' +
          '<span style="font-size:12px;color:#E0655A">Units for this subject are between 1 and 3. Enter 3 to match the catalogue.</span>' +
        '</div>' +
        '<div style="display:flex;gap:10px;align-items:center;border-top:1px solid #1A2331;padding-top:16px">' +
          '<button style="background:#D9A441;color:#1C1608;border:0;padding:11px 16px;font:inherit;font-size:13px;font-weight:600">Add to my load</button>' +
          '<button style="background:none;color:#A7B2C4;border:1px solid #33415A;padding:11px 16px;font:inherit;font-size:13px">Cancel</button>' +
          '<span style="flex:1"></span>' +
          '<button style="background:none;color:#E0655A;border:0;padding:11px 4px;font:inherit;font-size:13px;text-decoration:underline;text-underline-offset:3px">Remove subject</button>' +
        '</div>' +
      '</div>';

    if (notes) {
      notes.innerHTML = [
        ['Labels above, always visible', 'Right-aligned labels force the eye to zig-zag, and placeholders vanish the moment typing starts.'],
        ['One column', 'Two columns double the eye-travel and get filled in the wrong order.'],
        ['Hint text before the error', 'Say the format up front. Prevention beats correction.'],
        ['Errors instruct', '"Invalid input" tells you nothing. Name the field, the rule, and the correct value.'],
        ['Validate on blur, not on keystroke', 'Errors that fire on the first character are hostile.'],
        ['Targets ≥ 44px', 'The cramped version is unusable on a phone in a jeepney.'],
        ['Destructive action separated', 'Delete moves away from Submit, changes style, and loses its accidental adjacency.']
      ].map(function (n) { return '<li><span><b>' + n[0] + '</b> — ' + n[1] + '</span></li>'; }).join('');
    }
  })();

  /* ============================================================
     8 · Responsive container
     ============================================================ */
  (function viewport() {
    var root = $('#w-viewport');
    if (!root) return;
    var range = $('#vp-range'), frame = $('#vp-frame'), readout = $('#vp-readout');

    function render() {
      var w = +range.value;
      frame.style.width = w + 'px';
      var band = w < 480 ? 'phone' : w < 768 ? 'large phone' : w < 1024 ? 'tablet' : 'desktop';
      readout.textContent = w + 'px · ' + band;
      readout.style.color = w < 480 ? '#D9A441' : '#A7B2C4';

      var cols = w < 640 ? 1 : w < 980 ? 2 : 3;
      var stack = w < 640;
      frame.innerHTML =
        '<div style="background:#11151D;border:1px solid #232E3E;padding:' + (stack ? 14 : 20) + 'px;display:flex;flex-direction:column;gap:16px">' +
          '<div style="display:flex;' + (stack ? 'flex-direction:column;align-items:flex-start;' : 'align-items:center;') + 'gap:10px">' +
            '<div style="font-size:' + (stack ? 16 : 19) + 'px;font-weight:600;color:#E7EBF2;flex:1">This term</div>' +
            '<div style="display:flex;gap:8px;' + (stack ? 'width:100%;' : '') + '">' +
              '<button style="' + (stack ? 'flex:1;' : '') + 'background:#D9A441;color:#1C1608;border:0;padding:9px 14px;font:inherit;font-size:12px;font-weight:600">Enroll</button>' +
              '<button style="' + (stack ? 'flex:1;' : '') + 'background:none;color:#A7B2C4;border:1px solid #33415A;padding:9px 14px;font:inherit;font-size:12px">Filter</button>' +
            '</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:10px">' +
            ['CSCI 153', 'CSCI 155', 'CSCI 161'].map(function (c, i) {
              return '<div style="background:#161E2B;border:1px solid #232E3E;padding:12px;display:flex;flex-direction:column;gap:4px">' +
                '<span style="font-family:ui-monospace,monospace;font-size:10px;color:#6E7B8F">' + c + '</span>' +
                '<span style="font-size:13px;color:#E7EBF2">' + ['Web Systems', 'Software Engineering', 'Automata Theory'][i] + '</span>' +
                '<span style="font-size:11px;color:#6E7B8F">3 units · MWF</span></div>';
            }).join('') +
          '</div>' +
          (stack
            ? '<div style="font-size:11px;color:#D9A441;font-family:ui-monospace,monospace">↑ ONE COLUMN · ACTIONS FULL-WIDTH · TIGHTER PADDING</div>'
            : '<div style="font-size:11px;color:#6E7B8F;font-family:ui-monospace,monospace">' + cols + ' COLUMNS · INLINE ACTIONS</div>') +
        '</div>';
    }
    range.addEventListener('input', render);
    render();
  })();

  /* ============================================================
     9 · Token playground
     ============================================================ */
  (function tokens() {
    var root = $('#w-tokens');
    if (!root) return;
    var brand = $('#tk-brand'), surface = $('#tk-surface');
    var radius = $('#tk-radius'), radiusV = $('#tk-radius-v');
    var dens = $('#tk-density'), densV = $('#tk-density-v');
    var prev = $('#tk-preview'), code = $('#tk-code');

    function render() {
      var b = brand.value, s = surface.value, r = +radius.value, u = +dens.value;
      radiusV.textContent = r + 'px';
      densV.textContent = (u / 10).toFixed(1) + '×';

      var sRgb = hex2rgb(s) || [20, 26, 36];
      var ground = mix(sRgb, [0, 0, 0], 0.35);
      var line = mix(sRgb, [255, 255, 255], 0.12);
      var text = readableOn(s);
      var muted = luminance(sRgb) > 0.42 ? mix(sRgb, [0, 0, 0], 0.55) : mix(sRgb, [255, 255, 255], 0.55);
      var onBrand = readableOn(b);

      prev.innerHTML =
        '<div style="background:' + ground + ';padding:' + u * 2 + 'px;display:flex;flex-direction:column;gap:' + u * 1.5 + 'px">' +
          '<div style="display:flex;align-items:center;gap:' + u + 'px">' +
            '<div style="width:22px;height:22px;background:' + b + ';border-radius:' + r + 'px"></div>' +
            '<span style="color:' + text + ';font-size:14px;font-weight:600">Registrar</span>' +
            '<span style="flex:1"></span>' +
            '<span style="color:' + muted + ';font-size:12px">2026–2027</span>' +
          '</div>' +
          '<div style="background:' + s + ';border:1px solid ' + line + ';border-radius:' + r + 'px;padding:' + u * 1.6 + 'px;display:flex;flex-direction:column;gap:' + u + 'px">' +
            '<span style="color:' + muted + ';font-size:11px;font-family:ui-monospace,monospace;letter-spacing:.14em">TOTAL UNITS</span>' +
            '<span style="color:' + text + ';font-size:26px;font-weight:600;font-variant-numeric:tabular-nums">12</span>' +
            '<div style="display:flex;gap:' + u * 0.8 + 'px;margin-top:' + u * 0.4 + 'px">' +
              '<button style="background:' + b + ';color:' + onBrand + ';border:0;border-radius:' + r + 'px;padding:' + u * 0.9 + 'px ' + u * 1.4 + 'px;font:inherit;font-size:12px;font-weight:600">Confirm</button>' +
              '<button style="background:none;color:' + text + ';border:1px solid ' + line + ';border-radius:' + r + 'px;padding:' + u * 0.9 + 'px ' + u * 1.4 + 'px;font:inherit;font-size:12px">Review</button>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:' + u * 0.6 + 'px;flex-wrap:wrap">' +
            [['Cleared', '#57B98A'], ['Pending', b], ['Blocked', '#E0655A']].map(function (t) {
              return '<span style="border:1px solid ' + t[1] + ';color:' + t[1] + ';border-radius:' + r + 'px;padding:3px 8px;font-size:10px;font-family:ui-monospace,monospace;letter-spacing:.1em">' + t[0].toUpperCase() + '</span>';
            }).join('') +
          '</div>' +
        '</div>';

      code.innerHTML =
        '<i>/* primitive */</i>\n' +
        '--brand-500: <b>' + b.toUpperCase() + '</b>;\n' +
        '--surface-900: <b>' + s.toUpperCase() + '</b>;\n\n' +
        '<i>/* semantic */</i>\n' +
        '--color-action: var(--brand-500);\n' +
        '--color-surface: var(--surface-900);\n' +
        '--color-text: <b>' + text.toUpperCase() + '</b>;\n' +
        '--color-text-muted: <b>' + muted.toUpperCase() + '</b>;\n' +
        '--radius: <b>' + r + 'px</b>;\n' +
        '--space-unit: <b>' + u + 'px</b>;\n\n' +
        '<i>/* component */</i>\n' +
        '--button-primary-bg: var(--color-action);\n' +
        '--button-primary-fg: <b>' + onBrand.toUpperCase() + '</b>;\n' +
        '--card-padding: calc(var(--space-unit) * 1.6);';
    }
    [brand, surface, radius, dens].forEach(function (el) { el.addEventListener('input', render); });
    render();
  })();

  /* ============================================================
     10 · Design brief builder
     ============================================================ */
  (function promptBuilder() {
    var root = $('#w-prompt');
    if (!root) return;
    var out = $('#pb-out'), box = $('#pb-includes');

    var OPTS = [
      ['states',   'All seven component states',            true],
      ['a11y',     'WCAG AA contrast + keyboard operable',  true],
      ['mobile',   'Works at 320px, mobile-first',          true],
      ['tokens',   'Consume my tokens only — no new values', true],
      ['plan',     'Plan first, wait for my go-ahead',      true],
      ['data',     'Use realistic long strings, not tidy samples', false],
      ['nolib',    'No component or icon library',          false],
      ['copy',     'Write real microcopy, no lorem',        false]
    ];

    box.innerHTML = OPTS.map(function (o) {
      return '<label class="switch" style="justify-content:flex-start;text-transform:none;letter-spacing:0;font-family:var(--sans);font-size:0.82rem;color:var(--text-2)">' +
        '<input type="checkbox" data-k="' + o[0] + '"' + (o[2] ? ' checked' : '') + '><span class="switch__track"></span>' + o[1] + '</label>';
    }).join('');

    function render() {
      var screen = $('#pb-screen').value || '[screen]';
      var user   = $('#pb-user').value || '[user]';
      var job    = $('#pb-job').value || '[job]';
      var stack  = $('#pb-stack').value;
      var on = {};
      $$('input[type=checkbox]', box).forEach(function (c) { on[c.dataset.k] = c.checked; });

      var lines = [];
      lines.push('# Design brief');
      lines.push('');
      lines.push('Screen:  ' + screen);
      lines.push('User:    ' + user);
      lines.push('Job:     the screen must let them ' + job + '.');
      lines.push('Stack:   ' + stack);
      lines.push('');
      lines.push('## Tokens');
      lines.push('[paste your token file here — neutrals, one accent,');
      lines.push(' semantics, type scale + ratio, spacing scale]');
      lines.push('');
      lines.push('## Requirements');
      if (on.tokens) lines.push('- Use ONLY the tokens above. No new hex values, no off-scale sizes.');
      if (on.states) lines.push('- Every interactive component needs default, hover, focus, active,');
      if (on.states) lines.push('  disabled, loading, and empty/error states.');
      if (on.a11y)   lines.push('- WCAG AA: 4.5:1 body text, 3:1 large text and borders. Visible focus');
      if (on.a11y)   lines.push('  rings, labels on every input, full keyboard operation.');
      if (on.mobile) lines.push('- Mobile-first. Must hold together at 320px with no horizontal scroll.');
      if (on.data)   lines.push('- Use realistic data: long names, long codes, empty lists, 40+ rows.');
      if (on.nolib)  lines.push('- No component library, no icon library, no external assets.');
      if (on.copy)   lines.push('- Write real microcopy. Buttons name the outcome; errors name the fix.');
      lines.push('');
      if (on.plan) {
        lines.push('## Before writing any code');
        lines.push('List the components you will build, the states each one needs, and');
        lines.push('the tokens each will consume. Then stop and wait for my go-ahead.');
      } else {
        lines.push('## Output');
        lines.push('A single self-contained file I can open directly.');
      }
      out.textContent = lines.join('\n');
    }

    $$('input, select', root).forEach(function (el) {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });
    render();
  })();

})();


/* ==== from the old module-2.js ==== */
/* ============================================================
   CSci 153 — Module 2 widgets
   Frontend Development: prop drilling, spec explorer,
   schema → type, contract diff, query cache.

   Every widget is self-contained and bails out quietly if its
   mount point is missing, so a slide can be cut without
   breaking the deck.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  /* ============================================================
     1 · Prop-drilling visualiser
     Shows how many components carry `user` without using it.
     ============================================================ */
  (function drill() {
    var root = $('#drill');
    if (!root) return;

    var CHAIN = [
      { name: 'App',              user: false },
      { name: 'DashboardLayout',  user: false },
      { name: 'Sidebar',          user: false },
      { name: 'NavSection',       user: false },
      { name: 'NavItem',          user: false },
      { name: 'UserBadge',        user: true  }
    ];

    var depth = 6;

    root.classList.add('drill');
    root.innerHTML =
      '<div class="ctl">' +
        '<span class="ctl__label">Tree depth <span class="ctl__val"><b class="d">6</b> levels</span></span>' +
        '<input type="range" min="2" max="6" step="1" value="6" class="dr">' +
      '</div>' +
      '<div class="drill__tree"></div>' +
      '<div class="drill__count"></div>' +
      '<div class="seg" style="margin-top:var(--s2)">' +
        '<button type="button" class="m" data-m="props" aria-pressed="true">Passing props</button>' +
        '<button type="button" class="m" data-m="ctx" aria-pressed="false">Using Context</button>' +
      '</div>';

    var tree  = $('.drill__tree', root);
    var count = $('.drill__count', root);
    var range = $('.dr', root);
    var dOut  = $('.d', root);
    var mode  = 'props';

    function render() {
      var chain = CHAIN.slice(0, depth);
      // the deepest node is always the consumer
      chain = chain.map(function (c, i) {
        return { name: c.name, user: i === chain.length - 1 };
      });

      tree.innerHTML = '';
      chain.forEach(function (c, i) {
        var carrier = mode === 'props' && !c.user && i > 0;
        var node = el('div', 'drill__node');
        node.dataset.carrier = carrier ? '1' : '0';
        node.dataset.user = c.user ? '1' : '0';
        node.style.marginLeft = (i * 0.9) + 'rem';

        var label = el('span', '', '');
        label.textContent = (i === 0 ? '' : '└ ') + '<' + c.name + '>';

        var tag = el('span', 'drill__tag');
        if (c.user) tag.textContent = mode === 'props' ? 'uses user' : 'useSession()';
        else if (carrier) tag.textContent = 'carries user';
        else if (mode === 'ctx' && i === 0) tag.textContent = 'provides';
        else tag.textContent = '';

        node.appendChild(label);
        node.appendChild(tag);
        tree.appendChild(node);
      });

      var carriers = mode === 'props' ? Math.max(0, depth - 2) : 0;
      if (mode === 'props') {
        count.innerHTML = '<b>' + carriers + '</b> component' + (carriers === 1 ? '' : 's') +
          ' declare a <code>user</code> prop they never read.';
      } else {
        count.innerHTML = '<b style="color:var(--pass)">0</b> components carry it. ' +
          'The provider is at the top, the consumer calls <code>useSession()</code>, ' +
          'and everything between is unchanged.';
      }
    }

    range.addEventListener('input', function () {
      depth = parseInt(range.value, 10);
      dOut.textContent = depth;
      render();
    });
    $$('.m', root).forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.dataset.m;
        $$('.m', root).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        render();
      });
    });

    render();
  })();

  /* ============================================================
     2 · Spec explorer
     A small, real enrollment API. Selecting an operation shows
     its request and response shapes — a stripped Swagger UI.
     ============================================================ */
  (function spec() {
    var root = $('#spec');
    if (!root) return;

    var OPS = [
      {
        verb: 'GET', path: '/students/{id}/load', id: 'getStudentLoad',
        sum: "A student's enrolled subjects for the current term, with the unit total.",
        req: 'Path parameter\n  id: string          <i>— student ID, e.g. "S-2041"</i>\n\nNo request body.',
        res: [
          { code: '200', kind: 'ok', body: '{\n  studentId:  string\n  totalUnits: integer\n  subjects:   Subject[]\n}' },
          { code: '404', kind: 'err', body: '{\n  code:    "not_found"\n  message: string\n}' }
        ]
      },
      {
        verb: 'GET', path: '/subjects', id: 'listOfferedSubjects',
        sum: 'Subjects offered this term, filterable by program. Paginated.',
        req: 'Query parameters\n  program?: string\n  page?:    integer  <i>— default 1</i>\n  limit?:   integer  <i>— default 20, max 100</i>',
        res: [
          { code: '200', kind: 'ok', body: '{\n  items: Subject[]\n  page:  integer\n  total: integer\n}' }
        ]
      },
      {
        verb: 'POST', path: '/students/{id}/load', id: 'addSubjectToLoad',
        sum: 'Add one subject to a student\'s load. Fails if it would exceed the unit cap.',
        req: 'Path parameter\n  id: string\n\nRequest body\n{\n  subjectId: string   <i>— required</i>\n}',
        res: [
          { code: '201', kind: 'ok', body: '{\n  studentId:  string\n  totalUnits: integer\n  subjects:   Subject[]\n}' },
          { code: '409', kind: 'err', body: '{\n  code:    "unit_cap_exceeded"\n  message: string\n  details: { cap: integer, attempted: integer }\n}' },
          { code: '422', kind: 'err', body: '{\n  code:    "prerequisite_not_met"\n  message: string\n  details: { missing: string[] }\n}' }
        ]
      },
      {
        verb: 'DELETE', path: '/students/{id}/load/{subjectId}', id: 'removeSubjectFromLoad',
        sum: 'Remove a subject from the load. Idempotent — removing twice is not an error.',
        req: 'Path parameters\n  id:        string\n  subjectId: string\n\nNo request body.',
        res: [
          { code: '204', kind: 'ok', body: '<i>No content.</i>' },
          { code: '404', kind: 'err', body: '{\n  code:    "not_found"\n  message: string\n}' }
        ]
      },
      {
        verb: 'POST', path: '/students/{id}/enrollment', id: 'submitEnrollment',
        sum: 'Submit the load for approval. Terminal — the load locks afterwards.',
        req: 'Path parameter\n  id: string\n\nNo request body.',
        res: [
          { code: '202', kind: 'ok', body: '{\n  status:      "pending_approval"\n  submittedAt: string  <i>(date-time)</i>\n}' },
          { code: '409', kind: 'err', body: '{\n  code:    "already_submitted"\n  message: string\n}' }
        ]
      }
    ];

    var list = el('div', 'spec__ops');
    var detail = el('div', 'spec__detail panel');
    root.appendChild(list);
    root.appendChild(detail);

    function show(i) {
      var op = OPS[i];
      $$('.spec__op', list).forEach(function (b, bi) {
        b.setAttribute('aria-selected', String(bi === i));
      });

      detail.innerHTML = '';
      detail.appendChild(el('div', 'panel__head', 'operationId'));
      detail.appendChild(el('div', 'spec__opid', op.id));
      detail.appendChild(el('p', 'spec__sum', op.sum));

      detail.appendChild(el('div', 'panel__head', 'Request'));
      detail.appendChild(el('pre', '', op.req));

      detail.appendChild(el('div', 'panel__head', 'Responses'));
      op.res.forEach(function (r) {
        var head = el('div', 'row', '');
        head.style.gap = 'var(--s3)';
        var chip = el('span', 'chip ' + (r.kind === 'ok' ? 'chip--pass' : 'chip--fail'), r.code);
        head.appendChild(chip);
        detail.appendChild(head);
        detail.appendChild(el('pre', '', r.body));
      });
    }

    OPS.forEach(function (op, i) {
      var b = el('button', 'spec__op');
      b.type = 'button';
      var v = el('span', 'spec__verb', op.verb);
      v.dataset.v = op.verb;
      var p = el('span', '', '');
      p.textContent = op.path;
      b.appendChild(v);
      b.appendChild(p);
      b.addEventListener('click', function () { show(i); });
      list.appendChild(b);
    });

    show(0);
  })();

  /* ============================================================
     3 · Schema → TypeScript
     Toggle required / nullable and watch the generated type.
     ============================================================ */
  (function schemaToType() {
    var root = $('#s2t');
    if (!root) return;

    var FIELDS = [
      { name: 'id',         type: 'string',  required: true,  nullable: false, fixed: true },
      { name: 'code',       type: 'string',  required: true,  nullable: false },
      { name: 'title',      type: 'string',  required: true,  nullable: false },
      { name: 'units',      type: 'integer', required: true,  nullable: false },
      { name: 'instructor', type: 'string',  required: false, nullable: true  }
    ];

    var ctl  = el('div', 'col');
    var out  = el('div', 'col');
    root.appendChild(ctl);
    root.appendChild(out);

    var chips = el('div', 's2t__ctl');
    ctl.appendChild(el('div', 'panel__head', 'components.schemas.Subject'));
    ctl.appendChild(chips);
    var yaml = el('pre', '');
    ctl.appendChild(yaml);

    out.appendChild(el('div', 'panel__head', 'generated schema.d.ts'));
    var ts = el('pre', '');
    out.appendChild(ts);
    var note = el('p', 'small');
    out.appendChild(note);

    function tsType(f) {
      var base = f.type === 'integer' ? 'number' : f.type;
      return f.nullable ? base + ' | null' : base;
    }

    function render() {
      chips.innerHTML = '';
      FIELDS.forEach(function (f, i) {
        var c = el('span', 's2t__f');
        var nm = el('span', '', '');
        nm.textContent = f.name;
        c.appendChild(nm);
        if (f.fixed) {
          var lock = el('span', '', 'req');
          lock.style.cssText = 'font-size:0.6rem;letter-spacing:0.08em;color:var(--text-4);text-transform:uppercase';
          c.appendChild(lock);
        } else {
          var req = el('button', '', 'req');
          req.type = 'button';
          req.setAttribute('aria-pressed', String(f.required));
          req.addEventListener('click', function () { FIELDS[i].required = !f.required; render(); });
          var nul = el('button', '', 'null');
          nul.type = 'button';
          nul.setAttribute('aria-pressed', String(f.nullable));
          nul.addEventListener('click', function () { FIELDS[i].nullable = !f.nullable; render(); });
          c.appendChild(req);
          c.appendChild(nul);
        }
        chips.appendChild(c);
      });

      var reqNames = FIELDS.filter(function (f) { return f.required; }).map(function (f) { return f.name; });
      var y = 'Subject:\n  type: object\n';
      y += '  required: [' + reqNames.join(', ') + ']\n';
      y += '  properties:\n';
      FIELDS.forEach(function (f) {
        y += '    ' + f.name + ':\n      type: ' + f.type;
        if (f.nullable) y += '\n      nullable: true';
        y += '\n';
      });
      yaml.textContent = y;

      var t = 'type Subject = {\n';
      FIELDS.forEach(function (f) {
        t += '  ' + f.name + (f.required ? '' : '?') + ': ' + tsType(f) + '\n';
      });
      t += '}';
      ts.textContent = t;

      var optional = FIELDS.filter(function (f) { return !f.required; }).length;
      var nullable = FIELDS.filter(function (f) { return f.nullable; }).length;
      note.innerHTML = optional || nullable
        ? 'Every <code>?</code> and every <code>| null</code> is a branch your component has to render. ' +
          'Right now that is <b>' + (optional + nullable) + '</b> — each one a place the UI can break if you assume the value is there.'
        : 'Everything required and non-nullable. The simplest type to consume — but be honest about whether the server can really guarantee it.';
    }

    render();
  })();

  /* ============================================================
     4 · Contract diff — additive or breaking?
     ============================================================ */
  (function contractDiff() {
    var root = $('#cdiff');
    if (!root) return;

    var CHANGES = [
      {
        code: '+ properties.instructor: { type: string }',
        kind: 'additive',
        why: 'A new optional field. Clients that do not know about it carry on unaffected — they simply never read it.'
      },
      {
        code: '- required: [id, code, title, units]\n+ required: [id, code, title, units, instructor]',
        kind: 'breaking',
        why: 'Making a field required breaks every client that was not sending it. Requests that worked yesterday now fail validation.'
      },
      {
        code: '- units: { type: integer }\n+ units: { type: string }',
        kind: 'breaking',
        why: 'A type change. Every place that did arithmetic on units now silently concatenates strings instead — the worst kind of break, because nothing throws.'
      },
      {
        code: "+ '429': { $ref: '#/components/responses/RateLimited' }",
        kind: 'additive',
        why: 'A newly documented response. It was probably always possible; now the UI knows to render it. Documenting reality is additive.'
      },
      {
        code: '- /students/{id}/load\n+ /students/{id}/subjects',
        kind: 'breaking',
        why: 'A renamed path. Every existing call 404s. If you must, add the new path and deprecate the old one for a version rather than swapping it.'
      },
      {
        code: '  totalUnits: { type: integer, <b>description</b>: "Sum of enrolled units" }',
        kind: 'additive',
        why: 'Documentation only. No shape changed, so nothing can break — but it makes the generated Redoc page genuinely more useful.'
      }
    ];

    var order = [];
    var wrap = el('div', 'cdiff');
    var verdict = el('div', 'cdiff__verdict');
    root.appendChild(wrap);
    root.appendChild(verdict);

    var revealed = 0;

    CHANGES.forEach(function (c, i) {
      var row = el('div', 'cdiff__row');
      row.dataset.k = 'hidden';
      row.style.cursor = 'pointer';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');

      var mark = el('span', 'cdiff__m', '?');
      var body = el('span', '');
      var code = el('pre', 'cdiff__code');
      code.style.cssText = 'background:none;border:0;padding:0;margin:0';
      code.innerHTML = c.code;
      var why = el('div', 'cdiff__why', '');
      body.appendChild(code);
      body.appendChild(why);
      var label = el('span', 'chip', 'Verdict?');

      row.appendChild(mark);
      row.appendChild(body);
      row.appendChild(label);

      function reveal() {
        if (row.dataset.k !== 'hidden') return;
        row.dataset.k = c.kind;
        mark.textContent = c.kind === 'breaking' ? '✕' : '+';
        why.textContent = c.why;
        label.textContent = c.kind === 'breaking' ? 'Breaking' : 'Additive';
        label.className = 'chip ' + (c.kind === 'breaking' ? 'chip--fail' : 'chip--pass');
        revealed++;
        updateVerdict();
      }
      row.addEventListener('click', reveal);
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
      });
      wrap.appendChild(row);
      order.push(c);
    });

    function updateVerdict() {
      if (revealed < CHANGES.length) {
        verdict.innerHTML = '<span class="dim">' + revealed + ' of ' + CHANGES.length + ' revealed</span>';
        return;
      }
      var breaks = CHANGES.filter(function (c) { return c.kind === 'breaking'; }).length;
      verdict.innerHTML =
        '<span class="chip chip--fail">' + breaks + ' breaking</span>' +
        '<span class="chip chip--pass">' + (CHANGES.length - breaks) + ' additive</span>' +
        '<span style="color:var(--text-2);text-transform:none;letter-spacing:0;font-family:var(--sans);font-size:0.88rem">' +
        'Any breaking change at all means a <b style="color:var(--text)">major version bump</b> and a note in the pull request naming who has to change.' +
        '</span>';
    }

    updateVerdict();
  })();

  /* ============================================================
     5 · Query cache — keys and invalidation
     ============================================================ */
  (function queryCache() {
    var root = $('#qc');
    if (!root) return;

    var KEYS = [
      { key: "['getStudentLoad', 'S-2041']",       state: 'fresh' },
      { key: "['listOfferedSubjects', { page: 1 }]", state: 'fresh' },
      { key: "['listOfferedSubjects', { page: 2 }]", state: 'fresh' },
      { key: "['getStudentLoad', 'S-1180']",       state: 'fresh' }
    ];

    // which keys a mutation invalidates, by prefix match
    var MUTATIONS = [
      {
        label: 'addSubjectToLoad("S-2041")',
        hits: function (k) { return k.indexOf("['getStudentLoad', 'S-2041']") === 0; },
        note: 'Only that student\'s load changed. The other student\'s cached load is still perfectly good — invalidating it would be a wasted request.'
      },
      {
        label: 'submitEnrollment("S-2041")',
        hits: function (k) { return k.indexOf("['getStudentLoad', 'S-2041']") === 0; },
        note: 'Same key. The load is now locked, so the cached copy is wrong and must be refetched before it is shown again.'
      },
      {
        label: 'Admin opens a new offering',
        hits: function (k) { return k.indexOf("['listOfferedSubjects'") === 0; },
        note: 'Every page of the subject list is affected, so the whole prefix is invalidated — that is why the key is an array, not a string.'
      }
    ];

    root.innerHTML =
      '<div class="qc__keys"></div>' +
      '<div class="row" style="gap:var(--s2)"></div>' +
      '<p class="small qc__note" style="min-height:2.6rem"></p>';

    var keysEl = $('.qc__keys', root);
    var btns   = $('.row', root);
    var note   = $('.qc__note', root);
    var timers = [];

    function render() {
      keysEl.innerHTML = '';
      KEYS.forEach(function (k) {
        var row = el('div', 'qc__key');
        row.dataset.s = k.state;
        var name = el('span', '', '');
        name.textContent = k.key;
        var st = el('span', 'qc__state', k.state);
        row.appendChild(name);
        row.appendChild(st);
        keysEl.appendChild(row);
      });
    }

    MUTATIONS.forEach(function (m) {
      var b = el('button', 'btn', m.label);
      b.type = 'button';
      b.addEventListener('click', function () {
        timers.forEach(clearTimeout);
        timers = [];
        var hit = 0;
        KEYS.forEach(function (k) {
          if (m.hits(k.key)) { k.state = 'stale'; hit++; }
        });
        note.innerHTML = '<b>' + hit + '</b> of ' + KEYS.length + ' keys invalidated. ' + m.note;
        render();
        // stale → fetching → fresh, so the lifecycle is visible
        timers.push(setTimeout(function () {
          KEYS.forEach(function (k) { if (k.state === 'stale') k.state = 'fetching'; });
          render();
        }, 700));
        timers.push(setTimeout(function () {
          KEYS.forEach(function (k) { if (k.state === 'fetching') k.state = 'fresh'; });
          render();
        }, 1600));
      });
      btns.appendChild(b);
    });

    var reset = el('button', 'btn btn--ghost', 'Reset');
    reset.type = 'button';
    reset.addEventListener('click', function () {
      timers.forEach(clearTimeout); timers = [];
      KEYS.forEach(function (k) { k.state = 'fresh'; });
      note.textContent = '';
      render();
    });
    btns.appendChild(reset);

    render();
  })();

  /* ============================================================
     6 · Commit graph — one week of a group's history
     Lanes are branches, dots are commits, curves are where a
     branch left or rejoined. Step through and watch it build.
     ============================================================ */
  (function gitGraph() {
    var root = $('#gitgraph');
    if (!root) return;

    var ROW = 34;        // must match the row height set below
    var LANE_W = 26;
    var PAD_X = 20;

    var LANES = [
      { id: 'main', label: 'main',                      color: '#D9A441', from: 0,  until: 99 },
      { id: 'f12',  label: 'feature/12-student-card',   color: '#5FB8C4', from: 1,  until: 6  },
      { id: 'f15',  label: 'feature/15-session-context',color: '#A38BD1', from: 3,  until: 9  }
    ];
    var LANE_X = {};
    LANES.forEach(function (l, i) { LANE_X[l.id] = PAD_X + i * LANE_W; });

    /* chronological; `at` is the step where the commit appears */
    var COMMITS = [
      { id: 'a1', lane: 'main', parents: [],             at: 0, who: 'Ana', msg: 'chore(setup): scaffold Vite + React + Tailwind' },
      { id: 'a2', lane: 'main', parents: ['a1'],         at: 0, who: 'Ben', msg: 'feat(theme): add the group token set as the Tailwind theme' },
      { id: 'b1', lane: 'f12',  parents: ['a2'],         at: 2, who: 'Ana', msg: 'feat(student-card): add loading and empty states' },
      { id: 'c1', lane: 'f15',  parents: ['a2'],         at: 4, who: 'Ben', msg: 'feat(session): add SessionContext and useSession hook' },
      { id: 'b2', lane: 'f12',  parents: ['b1'],         at: 5, who: 'Ana', msg: 'feat(student-card): add the loading skeleton' },
      { id: 'm1', lane: 'main', parents: ['a2', 'b2'],   at: 6, who: 'Ana', msg: "Merge pull request #12 from feature/12-student-card", merge: true },
      { id: 'c2', lane: 'f15',  parents: ['c1'],         at: 7, who: 'Ben', msg: 'feat(session): add the RequireRole route guard' },
      { id: 'c3', lane: 'f15',  parents: ['c2', 'm1'],   at: 8, who: 'Ben', msg: "Merge branch 'main' into feature/15-session-context", merge: true },
      { id: 'm2', lane: 'main', parents: ['m1', 'c3'],   at: 9, who: 'Ben', msg: "Merge pull request #15 from feature/15-session-context", merge: true }
    ];

    var STEPS = [
      { note: '<b>Monday.</b> Your group&rsquo;s <code>main</code>: a scaffold and the shared token theme. One lane, because nobody has branched yet.' },
      { note: '<b>Ana branches.</b> No commit yet &mdash; a branch is only a label pointing at the commit she started from. Nothing has changed on <code>main</code>.', cmd: 'git checkout -b feature/12-student-card' },
      { note: '<b>Ana commits.</b> Now the lane separates: her branch has something <code>main</code> does not.', cmd: 'git commit -m "feat(student-card): add loading and empty states"' },
      { note: '<b>Ben branches</b> &mdash; from <code>main</code>, not from Ana&rsquo;s work. He cannot see her StudentCard, and does not need to.', cmd: 'git checkout main && git checkout -b feature/15-session-context' },
      { note: '<b>Ben commits.</b> Three lanes now. Two people are working at the same moment and neither can break the other&rsquo;s screen.', cmd: 'git commit -m "feat(session): add SessionContext and useSession hook"' },
      { note: '<b>Ana commits again.</b> Her branch is two commits ahead. This is the point of branching: unfinished work is safe to commit.', cmd: 'git commit -m "feat(student-card): add the loading skeleton"' },
      { note: '<b>Ana&rsquo;s pull request is approved and merged.</b> Watch the curve rejoin: the new commit on <code>main</code> has <b>two parents</b> &mdash; the old main, and the tip of her branch. That is a merge commit. Note its message breaks the convention: <b>git writes merge messages, not you</b>, so they are the one exception.', cmd: 'Merge pull request #12' },
      { note: '<b>Ben commits.</b> But look at his lane: he branched before Ana&rsquo;s merge, so <code>main</code> has moved on without him. He is now behind.', cmd: 'git commit -m "feat(session): add the RequireRole route guard"' },
      { note: '<b>Ben catches up</b> by merging <code>main</code> into his branch. Cheap today &mdash; two files. This is the step people skip, and it is exactly why a two-week-old branch becomes a conflict you dread.', cmd: 'git checkout feature/15-session-context && git merge main' },
      { note: '<b>Ben&rsquo;s pull request merges.</b> <code>main</code> now has both features, and the history shows honestly who wrote what and when.', cmd: 'Merge pull request #15' },
      { note: '<b>Branches deleted.</b> The labels are gone; every commit remains. <b>Deleting a merged branch throws nothing away</b> &mdash; which is why you should do it, and keep the graph readable.', cmd: 'git branch -d feature/12-student-card feature/15-session-context' }
    ];

    var step = 0;
    var timer = null;
    var seen = {};

    root.innerHTML =
      '<div class="gg__legend"></div>' +
      '<div class="gg__stage"><div class="gg__inner">' +
        '<svg class="gg__svg" aria-hidden="true"></svg>' +
        '<div class="gg__rows"></div>' +
      '</div></div>' +
      '<div class="gg__note"></div>' +
      '<div class="gg__ctl">' +
        '<button class="btn btn--ghost gg-prev" type="button">&larr; Back</button>' +
        '<button class="btn btn--primary gg-next" type="button">Next &rarr;</button>' +
        '<button class="btn gg-play" type="button">Play</button>' +
        '<button class="btn btn--ghost gg-reset" type="button">Reset</button>' +
        '<span class="gg__step">STEP <b class="gg-n">1</b>/<span class="gg-t"></span></span>' +
      '</div>';

    var legend = $('.gg__legend', root);
    var inner  = $('.gg__inner', root);
    var svg    = $('.gg__svg', root);
    var rowsEl = $('.gg__rows', root);
    var noteEl = $('.gg__note', root);
    var nEl    = $('.gg-n', root);
    $('.gg-t', root).textContent = STEPS.length;

    LANES.forEach(function (l) {
      var s = document.createElement('span');
      s.innerHTML = '<i style="background:' + l.color + '"></i>' + l.label;
      legend.appendChild(s);
    });

    function laneAlive(l) { return step >= l.from && step <= l.until; }

    function visibleCommits() {
      return COMMITS.filter(function (c) { return c.at <= step; });
    }

    /* branch tip = newest visible commit reachable on that lane */
    function tips() {
      var map = {};
      LANES.forEach(function (l) {
        if (!laneAlive(l)) return;
        var own = visibleCommits().filter(function (c) { return c.lane === l.id; });
        if (own.length) map[own[own.length - 1].id] = (map[own[own.length - 1].id] || []).concat(l);
        else {
          /* branch created but no commit of its own yet — it points at its start commit */
          var start = visibleCommits().filter(function (c) { return c.lane === 'main'; });
          if (start.length) {
            var id = start[start.length - 1].id;
            map[id] = (map[id] || []).concat(l);
          }
        }
      });
      return map;
    }

    function render(animate) {
      var vis = visibleCommits();
      var order = vis.slice().reverse();          // newest at top, like GitKraken
      var yOf = {};
      order.forEach(function (c, i) { yOf[c.id] = i * ROW + ROW / 2; });

      var tipMap = tips();
      var graphW = PAD_X * 2 + (LANES.length - 1) * LANE_W;

      /* ---- rows ---- */
      rowsEl.innerHTML = '';
      order.forEach(function (c) {
        var lane = LANES.filter(function (l) { return l.id === c.lane; })[0];
        var row = el('div', 'gg__row' + (c.merge ? ' is-merge' : ''));
        row.style.height = ROW + 'px';
        row.style.gridTemplateColumns = graphW + 'px 1fr auto';
        if (animate && !seen[c.id]) row.classList.add('is-new');
        seen[c.id] = true;

        row.appendChild(el('span', '', ''));       // spacer under the svg

        var msg = el('div', 'gg__msg');
        (tipMap[c.id] || []).forEach(function (l) {
          var pill = el('span', 'gg__pill', l.label);
          pill.style.color = l.color;
          msg.appendChild(pill);
        });
        var txt = el('span', 'gg__txt');
        txt.textContent = c.msg;
        msg.appendChild(txt);
        row.appendChild(msg);

        row.appendChild(el('span', 'gg__who', c.who));
        rowsEl.appendChild(row);
      });

      /* ---- svg ---- */
      var h = order.length * ROW;
      svg.setAttribute('width', graphW);
      svg.setAttribute('height', h);
      svg.setAttribute('viewBox', '0 0 ' + graphW + ' ' + h);
      inner.style.height = h + 'px';

      var parts = [];
      vis.forEach(function (c) {
        var cx = LANE_X[c.lane], cy = yOf[c.id];
        c.parents.forEach(function (pid) {
          if (yOf[pid] === undefined) return;
          var pc = COMMITS.filter(function (x) { return x.id === pid; })[0];
          var px = LANE_X[pc.lane], py = yOf[pid];
          var color = LANE_X[c.lane] === px
            ? laneColor(c.lane)
            : laneColor(px < cx ? c.lane : pc.lane);
          if (px === cx) {
            parts.push('<path d="M' + cx + ' ' + cy + ' L' + px + ' ' + py + '" stroke="' + color +
                       '" stroke-width="2" fill="none" stroke-linecap="round"/>');
          } else {
            var mid = (cy + py) / 2;
            parts.push('<path d="M' + cx + ' ' + cy + ' C' + cx + ' ' + mid + ', ' + px + ' ' + mid +
                       ', ' + px + ' ' + py + '" stroke="' + color +
                       '" stroke-width="2" fill="none" stroke-linecap="round"/>');
          }
        });
      });
      vis.forEach(function (c) {
        var cx = LANE_X[c.lane], cy = yOf[c.id], col = laneColor(c.lane);
        var r = c.merge ? 6 : 5;
        parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
                   '" fill="' + (c.merge ? col : 'var(--sunk)') + '" stroke="' + col + '" stroke-width="2.5"/>');
      });
      svg.innerHTML = parts.join('');

      noteEl.innerHTML = STEPS[step].note +
        (STEPS[step].cmd ? '<code class="gg__cmd">' + STEPS[step].cmd + '</code>' : '');
      nEl.textContent = step + 1;
      $('.gg-prev', root).disabled = step === 0;
      $('.gg-next', root).disabled = step === STEPS.length - 1;
    }

    function laneColor(id) {
      var l = LANES.filter(function (x) { return x.id === id; })[0];
      return l ? l.color : 'var(--text-3)';
    }

    function go(n, animate) {
      step = Math.max(0, Math.min(STEPS.length - 1, n));
      render(animate !== false);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      $('.gg-play', root).textContent = 'Play';
    }

    $('.gg-next', root).addEventListener('click', function () { stop(); go(step + 1); });
    $('.gg-prev', root).addEventListener('click', function () { stop(); go(step - 1); });
    $('.gg-reset', root).addEventListener('click', function () {
      stop(); seen = {}; go(0, false);
    });
    $('.gg-play', root).addEventListener('click', function () {
      var btn = this;
      if (timer) { stop(); return; }
      if (step === STEPS.length - 1) { seen = {}; go(0, false); }
      btn.textContent = 'Pause';
      timer = setInterval(function () {
        if (step >= STEPS.length - 1) { stop(); return; }
        go(step + 1);
      }, 2200);
    });

    /* stop playback when the slide is left */
    document.addEventListener('slidechange', stop);

    go(0, false);
  })();

  /* ---------- copy button for the token block ---------- */
  (function tokenCopy() {
    var src = $('#tok-src');
    if (!src || src.parentNode.querySelector('[data-copy]')) return;
    var b = el('button', 'btn btn--ghost', 'Copy');
    b.type = 'button';
    b.setAttribute('data-copy', '#tok-src');
    b.style.cssText = 'align-self:flex-start;margin-top:var(--s2)';
    b.addEventListener('click', function () {
      var text = src.textContent;
      var old = b.textContent;
      var done = function (ok) {
        b.textContent = ok ? 'Copied' : 'Select + ⌘C';
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
    src.parentNode.appendChild(b);
  })();

})();

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

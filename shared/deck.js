/* ============================================================
   CSci 153 — Deck engine
   Shared by every module. Handles navigation, the slide map,
   keyboard control, and the generic data-driven widgets.

   Slide markup contract:
     <section class="slide" data-sec="1.1" data-label="Contrast">
   data-sec  → colors the progress tick + section accent
   data-label→ name shown in the slide map (press O)
   ============================================================ */
(function () {
  'use strict';

  var deck   = document.getElementById('deck');
  var stage  = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!deck || !slides.length) return;

  var idx = 0;

  /* ---------- progress ticks ---------- */
  var ticks = document.getElementById('ticks');
  slides.forEach(function (s, i) {
    var t = document.createElement('button');
    t.className = 'tick';
    t.type = 'button';
    t.dataset.sec = s.dataset.sec || '0';
    t.title = (i + 1) + '. ' + (s.dataset.label || '');
    t.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ': ' + (s.dataset.label || ''));
    t.addEventListener('click', function () { go(i); });
    if (ticks) ticks.appendChild(t);
  });
  var tickEls = ticks ? Array.prototype.slice.call(ticks.children) : [];

  /* ---------- slide map (overview) ---------- */
  var overview = document.getElementById('overview');
  var mapRoot  = document.getElementById('map');
  var SEC_NAMES = {
    '0':   'Orientation',
    '1.1': 'Lesson 1.1 — UI/UX practice',
    '1.2': 'Lesson 1.2 — Agentic design',
    'lab': 'Laboratory activities',
    'end': 'Close'
  };
  var SEC_COLORS = { '0': 'var(--text-3)', '1.1': 'var(--brass)', '1.2': 'var(--cyan)', 'lab': '#E7EBF2', 'end': 'var(--text-3)' };

  if (mapRoot) {
    var order = [], groups = {};
    slides.forEach(function (s, i) {
      var k = s.dataset.sec || '0';
      if (!groups[k]) { groups[k] = []; order.push(k); }
      groups[k].push(i);
    });
    order.forEach(function (k) {
      var sec = document.createElement('div');
      sec.className = 'map__sec';
      var h = document.createElement('div');
      h.className = 'map__sech';
      h.style.color = SEC_COLORS[k] || 'var(--text-3)';
      h.textContent = SEC_NAMES[k] || k;
      var g = document.createElement('div');
      g.className = 'map__grid';
      groups[k].forEach(function (i) {
        var b = document.createElement('button');
        b.className = 'map__item';
        b.type = 'button';
        b.innerHTML = '<span class="map__n">' + String(i + 1).padStart(2, '0') + '</span>' +
                      '<span class="map__t"></span>';
        b.querySelector('.map__t').textContent = slides[i].dataset.label || 'Slide ' + (i + 1);
        b.addEventListener('click', function () { closeOverlays(); go(i); });
        g.appendChild(b);
      });
      sec.appendChild(h); sec.appendChild(g);
      mapRoot.appendChild(sec);
    });
  }
  var mapItems = mapRoot ? Array.prototype.slice.call(mapRoot.querySelectorAll('.map__item')) : [];

  /* ---------- navigation ---------- */
  var counterNow = document.getElementById('count-now');
  var counterAll = document.getElementById('count-all');
  var lessonLbl  = document.getElementById('rail-lesson');
  var prevBtn    = document.getElementById('prev');
  var nextBtn    = document.getElementById('next');
  if (counterAll) counterAll.textContent = String(slides.length).padStart(2, '0');

  function go(n, skipHash) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    slides[idx].classList.remove('is-active');
    idx = n;
    var s = slides[idx];
    s.classList.add('is-active');
    s.scrollTop = 0;

    var sec = s.dataset.sec || '0';
    deck.dataset.sec = sec;
    if (lessonLbl) lessonLbl.textContent = s.dataset.rail || SEC_NAMES[sec] || '';
    if (counterNow) counterNow.textContent = String(idx + 1).padStart(2, '0');

    tickEls.forEach(function (t, i) {
      t.classList.toggle('is-now', i === idx);
      t.classList.toggle('is-done', i < idx);
    });
    mapItems.forEach(function (m, i) { m.classList.toggle('is-now', i === idx); });

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === slides.length - 1;

    /* slide the ruler marker down the measuring edge */
    var pct = slides.length > 1 ? idx / (slides.length - 1) : 0;
    stage.style.setProperty('--ruler-pos', 'calc((100% - 1.75rem) * ' + pct.toFixed(4) + ')');

    if (!skipHash) history.replaceState(null, '', '#' + (idx + 1));
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: idx, slide: s } }));
  }

  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  /* ---------- overlays ---------- */
  var help = document.getElementById('help');
  function closeOverlays() {
    if (overview) overview.hidden = true;
    if (help) help.hidden = true;
  }
  function toggle(el) {
    if (!el) return;
    var wasOpen = !el.hidden;
    closeOverlays();
    el.hidden = wasOpen;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (b) {
    b.addEventListener('click', closeOverlays);
  });
  var mapBtn = document.getElementById('open-map');
  if (mapBtn) mapBtn.addEventListener('click', function () { toggle(overview); });
  var helpBtn = document.getElementById('open-help');
  if (helpBtn) helpBtn.addEventListener('click', function () { toggle(help); });

  /* ---------- keyboard ---------- */
  var TYPING = { INPUT: 1, TEXTAREA: 1, SELECT: 1 };
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (TYPING[t.tagName] || t.isContentEditable)) return;

    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'n':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': case 'p':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End':  e.preventDefault(); go(slides.length - 1); break;
      case 'o': case 'g': e.preventDefault(); toggle(overview); break;
      case '?': case 'h': e.preventDefault(); toggle(help); break;
      case 'f':
        e.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(function () {});
        break;
      case 'Escape': closeOverlays(); break;
    }
  });

  /* ---------- touch ---------- */
  var x0 = null, y0 = null;
  stage.addEventListener('touchstart', function (e) {
    x0 = e.changedTouches[0].clientX; y0 = e.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    var dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
    x0 = null;
  }, { passive: true });

  /* ============================================================
     Generic widgets — reusable across modules
     ============================================================ */

  /* before/after toggle:
     <div data-widget="ba" data-a="Before" data-b="After">
       <div class="ba__pane" data-pane="a">…</div>
       <div class="ba__pane" data-pane="b">…</div>
     </div>                                                     */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="ba"]'), function (root) {
    var panes = root.querySelectorAll('.ba__pane');
    var bar = document.createElement('div');
    bar.className = 'seg';
    bar.style.marginBottom = 'var(--s4)';
    ['a', 'b'].forEach(function (key, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = root.dataset[key] || (i ? 'After' : 'Before');
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(bar.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        Array.prototype.forEach.call(panes, function (p) { p.classList.toggle('is-on', p.dataset.pane === key); });
      });
      bar.appendChild(b);
    });
    root.insertBefore(bar, root.firstChild);
    Array.prototype.forEach.call(panes, function (p, i) { p.classList.toggle('is-on', i === 0); });
  });

  /* stepper:
     <div data-widget="stepper">
       <button class="stepper__btn" data-step="1">…</button>  (in .stepper__track)
       <div class="stepper__panel" data-step="1">…</div>
     </div>                                                     */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="stepper"]'), function (root) {
    var btns   = Array.prototype.slice.call(root.querySelectorAll('.stepper__btn'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.stepper__panel'));
    function show(k) {
      btns.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.step === k)); });
      panels.forEach(function (p) { p.classList.toggle('is-on', p.dataset.step === k); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.step); }); });
    if (btns.length) show(btns[0].dataset.step);
  });

  /* quiz — data lives in a JSON script tag:
       <div data-widget="quiz" data-src="quiz-heuristics"></div>
       a script[type="application/json"] with that id holds the question array */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="quiz"]'), function (root) {
    var src = document.getElementById(root.dataset.src);
    if (!src) return;
    var items;
    try { items = JSON.parse(src.textContent); } catch (err) { return; }

    var q = 0, score = 0, answered = false;
    root.classList.add('quiz');
    root.innerHTML =
      '<div class="quiz__scenario"></div>' +
      '<div class="quiz__q"></div>' +
      '<div class="quiz__opts"></div>' +
      '<div class="quiz__why"></div>' +
      '<div class="quiz__foot">' +
        '<span class="quiz__score">Q <b class="qn">1</b>/<span class="qt"></span> &nbsp;·&nbsp; score <b class="qs">0</b></span>' +
        '<span style="flex:1"></span>' +
        '<button class="btn qnext" type="button">Next question</button>' +
        '<button class="btn btn--ghost qreset" type="button">Restart</button>' +
      '</div>';

    var elScen = root.querySelector('.quiz__scenario');
    var elQ    = root.querySelector('.quiz__q');
    var elOpts = root.querySelector('.quiz__opts');
    var elWhy  = root.querySelector('.quiz__why');
    var elN    = root.querySelector('.qn');
    var elT    = root.querySelector('.qt');
    var elS    = root.querySelector('.qs');
    var btnNext= root.querySelector('.qnext');
    elT.textContent = items.length;

    function render() {
      var it = items[q];
      answered = false;
      elScen.innerHTML = it.scenario || '';
      elScen.style.display = it.scenario ? '' : 'none';
      elQ.textContent = it.q;
      elWhy.classList.remove('is-on');
      elWhy.innerHTML = '';
      elOpts.innerHTML = '';
      elN.textContent = q + 1;
      btnNext.textContent = q === items.length - 1 ? 'See result' : 'Next question';
      it.options.forEach(function (opt, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz__opt';
        b.innerHTML = '<span>' + 'ABCD'[i] + '</span><span></span>';
        b.lastChild.textContent = opt;
        b.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var right = i === it.answer;
          if (right) score++;
          elS.textContent = score;
          Array.prototype.forEach.call(elOpts.children, function (c, ci) {
            c.disabled = true;
            if (ci === it.answer) c.classList.add('is-right');
            else if (ci === i) c.classList.add('is-wrong');
          });
          elWhy.innerHTML = '<b style="color:var(--text)">' + (right ? 'Correct. ' : 'Not quite. ') + '</b>' + it.why;
          elWhy.classList.add('is-on');
        });
        elOpts.appendChild(b);
      });
    }
    btnNext.addEventListener('click', function () {
      if (q < items.length - 1) { q++; render(); }
      else {
        elScen.style.display = 'none';
        elQ.textContent = 'Score: ' + score + ' of ' + items.length;
        elOpts.innerHTML = '';
        elWhy.innerHTML = score === items.length
          ? 'Clean sweep. You can name the heuristic, which means you can name the fix in a code review.'
          : 'Anything you missed is worth a re-read before the laboratory activity — you will be graded on naming violations precisely.';
        elWhy.classList.add('is-on');
      }
    });
    root.querySelector('.qreset').addEventListener('click', function () {
      q = 0; score = 0; elS.textContent = '0'; render();
    });
    render();
  });

  /* checklist with verdict:
     <div data-widget="check" data-verdicts="Not shippable|Reviewable|Ship it"> … </div> */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="check"]'), function (root) {
    var boxes = Array.prototype.slice.call(root.querySelectorAll('input[type="checkbox"]'));
    var bar   = root.querySelector('.meter__fill');
    var out   = root.querySelector('[data-verdict]');
    var words = (root.dataset.verdicts || 'Not shippable|Reviewable|Ship it').split('|');
    function update() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var pct = boxes.length ? n / boxes.length : 0;
      if (bar) {
        bar.style.width = (pct * 100) + '%';
        bar.style.background = pct === 1 ? 'var(--pass)' : pct >= 0.6 ? 'var(--accent)' : 'var(--fail)';
      }
      if (out) {
        out.textContent = n + '/' + boxes.length + ' · ' + (pct === 1 ? words[2] : pct >= 0.6 ? words[1] : words[0]);
        out.style.color = pct === 1 ? 'var(--pass)' : pct >= 0.6 ? 'var(--accent)' : 'var(--fail)';
      }
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  });

  /* copy-to-clipboard button: <button data-copy="#target-id">  */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var el = document.querySelector(btn.dataset.copy);
      if (!el) return;
      var text = el.value !== undefined ? el.value : el.textContent;
      var done = function (ok) {
        var old = btn.textContent;
        btn.textContent = ok ? 'Copied' : 'Select + ⌘C';
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { select(el); done(false); });
      } else { select(el); done(false); }
    });
    function select(el) {
      var r = document.createRange();
      r.selectNodeContents(el);
      var s = window.getSelection();
      s.removeAllRanges(); s.addRange(r);
    }
  });

  /* ---------- boot ---------- */
  var start = parseInt((location.hash || '').replace('#', ''), 10);
  go(isNaN(start) ? 0 : start - 1, true);
  window.Deck = { go: go, next: next, prev: prev, count: slides.length };
})();

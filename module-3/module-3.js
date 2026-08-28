/* ============================================================
   CSci 153 — Module 3 widgets
   The Stack, End to End: dependency auditor, iteration
   translator, await timeline, DOM-vs-React op counter,
   and a test runner that can be broken on purpose.

   Every widget bails out quietly if its mount point is
   missing, so a slide can be cut without breaking the deck.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  /* ============================================================
     1 · Dependency auditor
     The real package.json, with one sentence per line.
     ============================================================ */
  (function dep() {
    var root = $('#dep');
    if (!root) return;

    var DEPS = [
      { name: 'react', v: '^19.2.8', kind: 'calls-you', role: 'Framework',
        breaks: 'Everything. There are no components without it — every screen is a React function.',
        note: 'It calls your components when it decides they need to render. You never call them yourself.' },
      { name: 'react-dom', v: '^19.2.8', kind: 'calls-you', role: 'Framework',
        breaks: 'React would still describe a tree, but nothing would reach the page. This is the part that talks to the DOM.',
        note: 'React and React DOM are separate packages because React also renders to native mobile, and to strings on a server.' },
      { name: 'vite', v: '^8.2.0', kind: 'tool', role: 'Build tool',
        breaks: 'No dev server and no production bundle. Browsers cannot read TypeScript or JSX; Vite is what turns them into JavaScript.',
        note: 'A build tool, not a runtime dependency — none of it ships to the browser.' },
      { name: 'typescript', v: '~5.9', kind: 'tool', role: 'Language and typechecker',
        breaks: 'The app still runs, because types vanish at build time anyway. Every mistake just becomes a runtime surprise instead of a red squiggle.',
        note: 'Pinned to 5.9 rather than 6, because openapi-typescript declares a peer range of ^5.x. That conflict is the next slide.' },
      { name: 'tailwindcss', v: '^4.3.3', kind: 'tool', role: 'Styling',
        breaks: 'Every className becomes meaningless text. The app works and looks like an unstyled 1996 document.',
        note: 'v4 declares the theme in CSS with @theme, which is why there is no tailwind.config.js in this project.' },
      { name: 'react-router-dom', v: '^7.18.2', kind: 'calls-you', role: 'Routing',
        breaks: 'One screen and no URLs. No /subjects, no /advising, no deep links, and nowhere to put a route guard.',
        note: 'It owns which screen is showing, and calls your component when the URL says to.' },
      { name: '@tanstack/react-query', v: '^5.101.4', kind: 'you-call', role: 'Server state',
        breaks: 'You hand-write loading and error state on every screen, refetch manually after every mutation, and fetch the same data twice on two screens.',
        note: 'You call useQuery; it hands back a cache with isPending, isError, and invalidation already solved.' },
      { name: 'openapi-fetch', v: '^0.17.0', kind: 'you-call', role: 'Typed HTTP client',
        breaks: 'Back to plain fetch, and back to checking response.ok by hand in every call — with no compile-time proof the endpoint exists.',
        note: 'Tiny. Its whole value is the <paths> generic, which wires the contract into the type system.' },
      { name: 'openapi-typescript', v: '^7.13.0', kind: 'tool', role: 'Code generation',
        breaks: 'You hand-write the types that mirror the API, and they drift silently the first time the backend changes.',
        note: 'Runs once per contract change. Its output is committed, and CI fails if what you committed is stale.' },
      { name: '@stoplight/prism-cli', v: 'dev', kind: 'tool', role: 'Mock server',
        breaks: 'The app has nothing to talk to until the backend exists. Frontend development stops for five weeks.',
        note: 'Reads the contract and serves responses that match it. This is the dependency that let the frontend go first.' },
      { name: 'vitest', v: '^4.1.11', kind: 'tool', role: 'Test runner',
        breaks: 'Nothing in the app. You simply have no way to know a rule still works after you change it.',
        note: 'Shares Vite&rsquo;s config, which is why it needed almost no setup of its own.' },
      { name: '@redocly/cli', v: 'dev', kind: 'tool', role: 'Contract linter',
        breaks: 'A malformed contract reaches the generator, and you debug a confusing TypeScript type instead of a clear YAML error.',
        note: 'It caught a real bug in this app: bearer auth was declared, but no 401 was documented anywhere.' }
    ];

    var KIND_LABEL = { 'calls-you': 'calls you', 'you-call': 'you call it', tool: 'tooling' };

    root.innerHTML = '<div class="dep__list"></div><div class="dep__detail"></div>';
    var list = $('.dep__list', root);
    var detail = $('.dep__detail', root);
    var sel = 0;

    DEPS.forEach(function (d, i) {
      var b = el('button', 'dep__item');
      b.type = 'button';
      b.innerHTML = '<span>' + d.name + '</span>' +
        '<span class="dep__kind" data-k="' + d.kind + '">' + KIND_LABEL[d.kind] + '</span>';
      b.addEventListener('click', function () { sel = i; render(); });
      list.appendChild(b);
    });
    var items = Array.prototype.slice.call(list.children);

    function render() {
      items.forEach(function (b, i) { b.setAttribute('aria-selected', String(i === sel)); });
      var d = DEPS[sel];
      detail.innerHTML =
        '<div class="dep__name">' + d.name + '</div>' +
        '<div class="dep__meta"><span>' + d.role + '</span><span>' + d.v + '</span>' +
          '<span class="dep__kind" data-k="' + d.kind + '">' + KIND_LABEL[d.kind] + '</span></div>' +
        '<div class="dep__break"><b style="color:var(--fail)">Remove it and:</b> ' + d.breaks + '</div>' +
        '<p class="body">' + d.note + '</p>';
    }
    render();
  })();

  /* ============================================================
     2 · Iteration translator
     for…of / map / filter / reduce over the same six subjects.
     ============================================================ */
  (function iter() {
    var root = $('#iter');
    if (!root) return;

    var SUBJECTS = [
      { code: 'CSci 153', units: 3, full: false },
      { code: 'CSci 141', units: 3, full: false },
      { code: 'Math 111', units: 5, full: true  },
      { code: 'CSci 170', units: 4, full: false },
      { code: 'PE 4',     units: 2, full: false },
      { code: 'Stat 101', units: 3, full: true  }
    ];

    var FORMS = {
      forof: {
        label: 'for…of',
        code: 'const codes = []\n<b>for (const s of subjects)</b> {\n  codes.push(s.code)\n}',
        note: 'The plain loop. It works for everything and says nothing about intent — a reader has to look inside the body to find out what it is doing.',
        rows: function () { return SUBJECTS.map(function (s) { return { txt: s.code, state: 'in' }; }); },
        out: function () { return 'codes → 6 strings'; }
      },
      map: {
        label: 'map',
        code: 'const codes = subjects.<b>map</b>(\n  (s) =&gt; s.code\n)',
        note: 'Six in, six out. map never changes the length — if your output has a different count, you wanted filter.',
        rows: function () {
          return SUBJECTS.map(function (s) {
            return { txt: s.code + '   →   "' + s.code + '"', state: 'in' };
          });
        },
        out: function () { return '6 subjects in, 6 strings out'; }
      },
      filter: {
        label: 'filter',
        code: 'const open = subjects.<b>filter</b>(\n  (s) =&gt; !s.full\n)',
        note: 'The same items, fewer of them. The two full subjects are dropped; nothing is transformed, only chosen.',
        rows: function () {
          return SUBJECTS.map(function (s) {
            return { txt: s.code + (s.full ? '   ✕ full' : '   ✓ open'), state: s.full ? 'out' : 'in' };
          });
        },
        out: function () { return 'open → 4 of 6 subjects'; }
      },
      reduce: {
        label: 'reduce',
        code: 'const total = subjects.<b>reduce</b>(\n  (sum, s) =&gt; sum + s.units,\n  <b>0</b>\n)',
        note: 'Many to one. The 0 is the starting value — leave it off and an empty array throws instead of giving you 0.',
        rows: function () {
          var run = 0;
          return SUBJECTS.map(function (s) {
            run += s.units;
            return { txt: s.code + '   +' + s.units + '   →   sum ' + run, state: 'in' };
          });
        },
        out: function () {
          return 'total → ' + SUBJECTS.reduce(function (n, s) { return n + s.units; }, 0) + ' units';
        }
      }
    };

    var order = ['forof', 'map', 'filter', 'reduce'];
    var cur = 'forof';

    root.innerHTML =
      '<div class="col">' +
        '<div class="seg"></div>' +
        '<pre class="ic" style="margin-top:var(--s3)"></pre>' +
        '<p class="body inote"></p>' +
      '</div>' +
      '<div class="col">' +
        '<div class="iter__out"></div>' +
        '<div class="iter__sum"></div>' +
      '</div>';

    var seg = $('.seg', root);
    order.forEach(function (k) {
      var b = el('button', null, FORMS[k].label);
      b.type = 'button';
      b.addEventListener('click', function () { cur = k; render(); });
      seg.appendChild(b);
    });

    function render() {
      Array.prototype.forEach.call(seg.children, function (b, i) {
        b.setAttribute('aria-pressed', String(order[i] === cur));
      });
      var f = FORMS[cur];
      $('.ic', root).innerHTML = f.code;
      $('.inote', root).textContent = f.note;
      var out = $('.iter__out', root);
      out.innerHTML = '';
      f.rows().forEach(function (r) {
        out.appendChild(el('div', 'iter__row is-' + r.state, '<span>' + r.txt + '</span>'));
      });
      $('.iter__sum', root).textContent = f.out();
    }
    render();
  })();

  /* ============================================================
     3 · Await timeline
     Sequential awaits in a loop, against Promise.all.
     ============================================================ */
  (function timeline() {
    var root = $('#tl');
    if (!root) return;

    var MS = 300;
    var N = 3;
    var mode = 'seq';

    root.innerHTML =
      '<div class="seg">' +
        '<button type="button" data-m="seq" aria-pressed="true">await inside the loop</button>' +
        '<button type="button" data-m="par" aria-pressed="false">Promise.all</button>' +
      '</div>' +
      '<pre class="tlc" style="margin-top:var(--s3)"></pre>' +
      '<div class="tl__track"></div>' +
      '<div class="tl__track"></div>' +
      '<div class="tl__track"></div>' +
      '<div class="tl__scale"><span>0ms</span><span>300</span><span>600</span><span>900ms</span></div>' +
      '<div class="tl__total"></div>';

    var tracks = Array.prototype.slice.call(root.querySelectorAll('.tl__track'));
    var btns = Array.prototype.slice.call(root.querySelectorAll('.seg button'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () { mode = b.dataset.m; render(); });
    });

    var CODE = {
      seq: 'for (const id of ids) {\n  const load = <b>await</b> getLoad(id)   <i>// waits here, every time</i>\n  loads.push(load)\n}',
      par: 'const loads = <b>await Promise.all</b>(\n  ids.map((id) =&gt; getLoad(id))   <i>// all three start now</i>\n)'
    };

    function render() {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === mode)); });
      $('.tlc', root).innerHTML = CODE[mode];

      tracks.forEach(function (t, i) {
        t.innerHTML = '';
        var bar = el('div', 'tl__bar');
        var startMs = mode === 'seq' ? i * MS : 0;
        bar.style.left = (startMs / (N * MS) * 100) + '%';
        bar.style.width = (MS / (N * MS) * 100) + '%';
        bar.textContent = 'getLoad(' + (i + 1) + ')';
        t.appendChild(bar);
      });

      var span = mode === 'seq' ? N * MS : MS;
      $('.tl__total', root).innerHTML = mode === 'seq'
        ? 'Total: <b style="color:var(--fail)">' + span + 'ms</b> — three waits, one after another.'
        : 'Total: <b style="color:var(--pass)">' + span + 'ms</b> — three requests in flight at once.';
    }
    render();
  })();

  /* ============================================================
     4 · DOM operations counter
     A by-hand clear-and-rebuild, against React's reconciliation.
     ============================================================ */
  (function ops() {
    var root = $('#ops');
    if (!root) return;

    var rows = 5;
    var hand = 0;
    var react = 0;
    var log = [];

    root.innerHTML =
      '<div class="ops__side ops__side--hand">' +
        '<span class="ops__lbl">By hand · DOM operations</span>' +
        '<span class="ops__n h">0</span>' +
        '<span class="small">Every render clears the list and rebuilds every row.</span>' +
      '</div>' +
      '<div class="ops__side ops__side--react">' +
        '<span class="ops__lbl">React · DOM operations</span>' +
        '<span class="ops__n r">0</span>' +
        '<span class="small">Only what actually changed reaches the DOM.</span>' +
      '</div>' +
      '<div style="grid-column:1/-1;display:flex;flex-direction:column;gap:var(--s3)">' +
        '<div class="ctl"><span class="ctl__label">Rows on screen <span class="ctl__val"><b class="rn">5</b></span></span></div>' +
        '<div class="seg">' +
          '<button type="button" class="a-add">Add a row</button>' +
          '<button type="button" class="a-rem">Remove one</button>' +
          '<button type="button" class="a-sort">Re-sort</button>' +
          '<button type="button" class="a-reset">Reset</button>' +
        '</div>' +
        '<div class="ops__log"></div>' +
      '</div>';

    function paint() {
      $('.h', root).textContent = hand;
      $('.r', root).textContent = react;
      $('.rn', root).textContent = rows;
      $('.ops__log', root).innerHTML = log.map(function (l) {
        return '<span>' + l + '</span>';
      }).join('');
    }

    function bump(label, h, r) {
      hand += h;
      react += r;
      log.unshift(label + ' — by hand +' + h + ', React +' + r);
      if (log.length > 8) log.pop();
      paint();
    }

    /* By hand, every action is the same: wipe the list, then create and
       append all of it again. React inserts one node, removes one node,
       or moves the existing ones. */
    $('.a-add', root).addEventListener('click', function () {
      rows++;
      bump('add a row', rows + 1, 1);
    });
    $('.a-rem', root).addEventListener('click', function () {
      if (rows === 0) return;
      rows--;
      bump('remove one', rows + 1, 1);
    });
    $('.a-sort', root).addEventListener('click', function () {
      bump('re-sort', rows + 1, rows);
    });
    $('.a-reset', root).addEventListener('click', function () {
      rows = 5; hand = 0; react = 0; log = [];
      paint();
    });
    paint();
  })();

  /* ============================================================
     5 · Test runner
     The real suite's names, and a rule the class can break.
     ============================================================ */
  (function runner() {
    var root = $('#tr');
    if (!root) return;

    /* Whatever UNIT_CEILING is set to. 21 is correct. */
    var ceiling = 21;

    var TESTS = [
      { name: 'totalUnits · is zero for an empty enrollment' },
      { name: 'totalUnits · sums the units of every subject' },
      { name: 'seatsLeft · is capacity minus enrolled' },
      { name: 'seatsLeft · never goes negative' },
      { name: 'canAddSubject · allows a normal add' },
      { name: 'R3 · rejects a subject already enrolled' },
      { name: 'R4 · rejects a subject with no seats left' },
      { name: 'R2 · rejects an add past the unit ceiling',
        needs21: true,
        msg: 'expected code UNIT_CEILING, got { ok: true } — 24 units is under a ceiling of ' },
      { name: 'R2 · allows an add landing exactly on the ceiling',
        needs21: true,
        msg: 'expected { ok: true } at 21 units, but the ceiling is ' },
      { name: 'R5 · rejects any add once submitted' },
      { name: 'R5 · allows edits after an adviser returns it' }
    ];

    root.innerHTML =
      '<div class="seg">' +
        '<button type="button" class="run">Run the suite</button>' +
        '<button type="button" class="brk" aria-pressed="false">Break it: ceiling = 24</button>' +
      '</div>' +
      '<div class="rows" style="display:flex;flex-direction:column;gap:2px"></div>' +
      '<div class="tr__sum"></div>';

    var rowsEl = $('.rows', root);
    var sumEl = $('.tr__sum', root);
    var runBtn = $('.run', root);
    var brkBtn = $('.brk', root);
    var timer = null;

    function passes(t) { return t.needs21 ? ceiling === 21 : true; }

    function draw(states) {
      rowsEl.innerHTML = '';
      TESTS.forEach(function (t, i) {
        var st = states[i];
        var row = el('div', 'tr__row');
        row.dataset.s = st;
        var mark = st === 'pass' ? '✓' : st === 'fail' ? '✕' : '·';
        row.innerHTML = '<span class="tr__m">' + mark + '</span>' +
          '<span>' + t.name + '</span>' +
          '<span class="dim" style="font-size:0.62rem">' + (st === 'pending' ? '' : st) + '</span>';
        if (st === 'fail' && t.msg) {
          row.appendChild(el('span', 'tr__msg', '→ ' + t.msg + ceiling));
        }
        rowsEl.appendChild(row);
      });
    }

    function run() {
      if (timer) clearInterval(timer);
      var states = TESTS.map(function () { return 'pending'; });
      draw(states);
      sumEl.textContent = 'running…';
      sumEl.style.color = 'var(--text-3)';

      var i = 0;
      timer = setInterval(function () {
        if (i >= TESTS.length) {
          clearInterval(timer);
          timer = null;
          var failed = states.filter(function (s) { return s === 'fail'; }).length;
          sumEl.innerHTML = failed
            ? '<b style="color:var(--fail)">' + failed + ' failed</b> &nbsp;·&nbsp; ' + (TESTS.length - failed) + ' passed'
            : '<b style="color:var(--pass)">' + TESTS.length + ' passed</b> &nbsp;·&nbsp; 0 failed';
          return;
        }
        states[i] = passes(TESTS[i]) ? 'pass' : 'fail';
        i++;
        draw(states);
      }, 90);
    }

    runBtn.addEventListener('click', run);
    brkBtn.addEventListener('click', function () {
      ceiling = ceiling === 21 ? 24 : 21;
      brkBtn.setAttribute('aria-pressed', String(ceiling === 24));
      brkBtn.textContent = ceiling === 21 ? 'Break it: ceiling = 24' : 'Fix it: ceiling = 21';
      run();
    });

    draw(TESTS.map(function () { return 'pending'; }));
    sumEl.textContent = 'not run yet';
  })();
})();

/* ============================================================
   CSci 153 — Module 2 widgets · The Contract

   Assembled from the widget sets of the pre-milestone modules
   2, 3, 4, because this deck's slides came from them.

   Every widget is a self-contained IIFE that bails out quietly
   if its mount point is missing, so carrying a few unused ones
   costs bytes and nothing else.
   ============================================================ */

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


/* ==== from the old module-3.js ==== */
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


/* ==== from the old module-4.js ==== */
/* ============================================================
   CSci 153 — Module 4 widgets
   Backend Development: normalisation stepper, RLS simulator,
   constraint tester, and a contract check runner.

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

  function table(cap, cols, rows) {
    var h = '<div class="norm__cap">' + cap + '</div><div class="norm__grid"><table class="norm__t"><thead><tr>';
    cols.forEach(function (c) { h += '<th>' + c + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (cell) {
        var cls = '';
        var v = cell;
        if (cell && typeof cell === 'object') { cls = ' class="' + cell.cls + '"'; v = cell.v; }
        h += '<td' + cls + '>' + v + '</td>';
      });
      h += '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  /* ============================================================
     1 · Normalisation stepper
     One spreadsheet-shaped table, pulled apart in three steps.
     ============================================================ */
  (function norm() {
    var root = $('#norm');
    if (!root) return;

    var B = function (v) { return { cls: 'bad', v: v }; };
    var K = function (v) { return { cls: 'key', v: v }; };

    var STEPS = [
      {
        label: 'One table',
        why: '<b>Every fact is stored more than once.</b> Maria&rsquo;s name appears three times, and CSci 153&rsquo;s unit count appears twice. Change either and you have to find every copy.',
        tables: [{
          cap: 'enrollments',
          cols: ['student_no', 'name', 'subject', 'units', 'teacher'],
          rows: [
            ['20-1-01234', B('Maria Cruz'), 'CSci 153', B('3'), 'Prof. Reyes'],
            ['20-1-01234', B('Maria Cruz'), 'CSci 141', '3', 'Prof. Lim'],
            ['20-1-01234', B('Maria Cruz'), 'Math 111', '5', 'Prof. Diaz'],
            ['20-1-05678', 'Jose Ramos', 'CSci 153', B('3'), 'Prof. Reyes'],
            ['20-1-05678', 'Jose Ramos', 'PE 4', '2', 'Coach Uy']
          ]
        }]
      },
      {
        label: 'Pull out students',
        why: 'A student&rsquo;s name now lives in exactly one row. <b>Renaming Maria is a one-row update</b>, and it is impossible for the database to hold two different spellings of her name.',
        tables: [
          {
            cap: 'students',
            cols: ['id', 'student_no', 'name'],
            rows: [
              [K('s1'), '20-1-01234', 'Maria Cruz'],
              [K('s2'), '20-1-05678', 'Jose Ramos']
            ]
          },
          {
            cap: 'enrollments · student_id replaces the repeated name',
            cols: ['student_id', 'subject', 'units', 'teacher'],
            rows: [
              [K('s1'), 'CSci 153', B('3'), 'Prof. Reyes'],
              [K('s1'), 'CSci 141', '3', 'Prof. Lim'],
              [K('s1'), 'Math 111', '5', 'Prof. Diaz'],
              [K('s2'), 'CSci 153', B('3'), 'Prof. Reyes'],
              [K('s2'), 'PE 4', '2', 'Coach Uy']
            ]
          }
        ]
      },
      {
        label: 'Pull out subjects',
        why: 'Units and teacher are facts about the <em>subject</em>, not about the enrollment. Now a subject can exist <b>before anyone enrolls in it</b> — which the first version could not represent at all.',
        tables: [
          {
            cap: 'subjects',
            cols: ['id', 'code', 'units', 'teacher'],
            rows: [
              [K('u1'), 'CSci 153', '3', 'Prof. Reyes'],
              [K('u2'), 'CSci 141', '3', 'Prof. Lim'],
              [K('u3'), 'Math 111', '5', 'Prof. Diaz'],
              [K('u4'), 'PE 4', '2', 'Coach Uy'],
              [K('u5'), 'Stat 101', '3', 'Prof. Tan']
            ]
          },
          {
            cap: 'enrollment_items · nothing but the pairing',
            cols: ['student_id', 'subject_id'],
            rows: [
              [K('s1'), K('u1')],
              [K('s1'), K('u2')],
              [K('s1'), K('u3')],
              [K('s2'), K('u1')],
              [K('s2'), K('u4')]
            ]
          }
        ]
      },
      {
        label: 'Add the enrollment',
        why: 'An enrollment is a thing in its own right — it has a status, a term, and a submission time. <b>The items point at it rather than at the student</b>, which is what lets one student enroll again next term.',
        tables: [
          {
            cap: 'enrollments',
            cols: ['id', 'student_id', 'term', 'status', 'total_units'],
            rows: [
              [K('e1'), K('s1'), '2026-1', 'submitted', '11'],
              [K('e2'), K('s2'), '2026-1', 'draft', '5']
            ]
          },
          {
            cap: 'enrollment_items · primary key (enrollment_id, subject_id) makes R3 structural',
            cols: ['enrollment_id', 'subject_id'],
            rows: [
              [K('e1'), K('u1')],
              [K('e1'), K('u2')],
              [K('e1'), K('u3')],
              [K('e2'), K('u1')],
              [K('e2'), K('u4')]
            ]
          }
        ]
      }
    ];

    var i = 0;

    root.innerHTML =
      '<div class="seg"></div>' +
      '<div class="norm__tables"></div>' +
      '<div class="norm__why"></div>';

    var seg = $('.seg', root);
    STEPS.forEach(function (s, n) {
      var b = el('button', null, (n + 1) + ' · ' + s.label);
      b.type = 'button';
      b.addEventListener('click', function () { i = n; render(); });
      seg.appendChild(b);
    });

    function render() {
      Array.prototype.forEach.call(seg.children, function (b, n) {
        b.setAttribute('aria-pressed', String(n === i));
      });
      var step = STEPS[i];
      $('.norm__tables', root).innerHTML = step.tables.map(function (t) {
        return '<div>' + table(t.cap, t.cols, t.rows) + '</div>';
      }).join('');
      $('.norm__why', root).innerHTML = step.why;
    }
    render();
  })();

  /* ============================================================
     2 · RLS simulator
     One query, four identities, policy on or off.
     ============================================================ */
  (function rls() {
    var root = $('#rls');
    if (!root) return;

    var ROWS = [
      { id: 'e1', owner: 'Maria Cruz',  ownerId: 'A', adviser: 'X', status: 'submitted' },
      { id: 'e2', owner: 'Jose Ramos',  ownerId: 'B', adviser: 'X', status: 'draft' },
      { id: 'e3', owner: 'Ana Villar',  ownerId: 'C', adviser: 'Y', status: 'submitted' },
      { id: 'e4', owner: 'Ben Lozada',  ownerId: 'D', adviser: 'Y', status: 'approved' },
      { id: 'e5', owner: 'Cita Mendez', ownerId: 'E', adviser: 'Z', status: 'draft' }
    ];

    var WHO = [
      { key: 'A', label: 'Maria (student)', kind: 'student', id: 'A',
        policy: 'using ( student_id = auth.uid() )',
        note: 'One row. The policy matched exactly one <code>student_id</code>.' },
      { key: 'X', label: 'Adviser X', kind: 'adviser', id: 'X',
        policy: 'using ( exists (select 1 from students s where s.id = enrollments.student_id and s.adviser_id = auth.uid()) )',
        note: 'Two rows — X&rsquo;s own advisees. Not every submitted enrollment in the system.' },
      { key: 'anon', label: 'No token (anon)', kind: 'anon', id: null,
        policy: 'auth.uid() is null, so no policy matches',
        note: 'Nothing. Not an error — <b>an empty list</b>. This is the case people mistake for a bug.' },
      { key: 'svc', label: 'service_role key', kind: 'svc', id: null,
        policy: 'RLS is bypassed entirely for this role',
        note: 'Everything. <b>Every policy you wrote is skipped.</b> This key must never reach a browser.' }
    ];

    var who = 'A';
    var rlsOn = true;

    root.innerHTML =
      '<div class="col">' +
        '<div class="ctl"><span class="ctl__label">Who is asking</span></div>' +
        '<div class="seg who" style="flex-wrap:wrap"></div>' +
        '<div class="ctl" style="margin-top:var(--s3)"><span class="ctl__label">Policy</span></div>' +
        '<div class="seg pol">' +
          '<button type="button" data-on="1" aria-pressed="true">RLS enabled</button>' +
          '<button type="button" data-on="0" aria-pressed="false">RLS disabled</button>' +
        '</div>' +
        '<div class="rls__policy" style="margin-top:var(--s4)"></div>' +
      '</div>' +
      '<div class="col">' +
        '<div class="rls__rows"></div>' +
        '<div class="rls__verdict"></div>' +
      '</div>';

    var segWho = $('.who', root);
    WHO.forEach(function (w) {
      var b = el('button', null, w.label);
      b.type = 'button';
      b.dataset.k = w.key;
      b.addEventListener('click', function () { who = w.key; render(); });
      segWho.appendChild(b);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.pol button'), function (b) {
      b.addEventListener('click', function () { rlsOn = b.dataset.on === '1'; render(); });
    });

    function visible(row, w) {
      if (!rlsOn) return true;
      if (w.kind === 'svc') return true;
      if (w.kind === 'anon') return false;
      if (w.kind === 'student') return row.ownerId === w.id;
      return row.adviser === w.id && row.status !== 'draft';
    }

    function render() {
      var w = WHO.filter(function (x) { return x.key === who; })[0];
      Array.prototype.forEach.call(segWho.children, function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.k === who));
      });
      Array.prototype.forEach.call(root.querySelectorAll('.pol button'), function (b) {
        b.setAttribute('aria-pressed', String((b.dataset.on === '1') === rlsOn));
      });

      $('.rls__policy', root).innerHTML = rlsOn
        ? '<span class="dim">the clause Postgres adds:</span><br>' + w.policy
        : '<span style="color:var(--fail)">No clause is added. Every row is returned to anyone who asks.</span>';

      var out = $('.rls__rows', root);
      out.innerHTML = '';
      var shown = 0;
      ROWS.forEach(function (row) {
        var ok = visible(row, w);
        if (ok) shown++;
        var r = el('div', 'rls__row ' + (ok ? 'is-shown' : 'is-hidden'));
        r.innerHTML =
          '<span>' + row.id + ' · ' + row.owner + ' · ' + row.status + '</span>' +
          '<span class="rls__tag">' + (ok ? 'returned' : 'filtered out') + '</span>';
        out.appendChild(r);
      });

      var v = $('.rls__verdict', root);
      var colour = shown === ROWS.length && (!rlsOn || w.kind === 'svc') ? 'var(--fail)'
        : shown === 0 ? 'var(--text-3)' : 'var(--pass)';
      v.innerHTML = '<b style="color:' + colour + '">' + shown + ' of ' + ROWS.length +
        ' rows</b><br><span class="small">' +
        (rlsOn ? w.note : 'This is what a table with RLS switched off looks like from the outside. It is also the default state of a new table.') +
        '</span>';
    }
    render();
  })();

  /* ============================================================
     3 · Constraint tester
     Bad writes, and which layer refuses them.
     ============================================================ */
  (function con() {
    var root = $('#con');
    if (!root) return;

    var CASES = [
      { label: 'A subject with units = 0',
        sql: "insert into subjects (code, units, capacity) values ('CSci 999', 0, 30);",
        result: 'reject', by: 'check constraint units_sane',
        why: 'The expression <code>units between 1 and 6</code> is false, so the row never lands. No application code was involved.' },
      { label: 'The same subject twice in one enrollment',
        sql: "insert into enrollment_items (enrollment_id, subject_id) values ('e1', 'u1');",
        result: 'reject', by: 'primary key (enrollment_id, subject_id)',
        why: 'R3 is structural. The duplicate is refused whichever endpoint, function or manual query attempts it.' },
      { label: 'An item pointing at a subject that does not exist',
        sql: "insert into enrollment_items (enrollment_id, subject_id) values ('e1', 'nope');",
        result: 'reject', by: 'foreign key references subjects(id)',
        why: 'A pointer that would dangle. The database refuses to hold a reference to a row that is not there.' },
      { label: 'A seventh subject, taking the total to 24 units',
        sql: "insert into enrollment_items (enrollment_id, subject_id) values ('e1', 'u9');",
        result: 'reject', by: 'trigger enforce_ceiling',
        why: 'R2 needs to see every row for the enrollment, which one <code>check</code> cannot. A trigger runs a query and raises.' },
      { label: 'Deleting a subject that people are enrolled in',
        sql: "delete from subjects where id = 'u1';",
        result: 'reject', by: 'on delete restrict',
        why: 'Deliberate. Removing an offered subject that has enrollments would silently change what those students are taking.' },
      { label: 'Deleting an enrollment that has items',
        sql: "delete from enrollments where id = 'e1';",
        result: 'accept', by: 'on delete cascade — the items go too',
        why: 'Also deliberate, and the opposite choice. An item has no meaning without its enrollment, so it should not outlive it.' },
      { label: "A student reading another student's enrollment",
        sql: "select * from enrollments where id = 'e3';",
        result: 'reject', by: 'RLS policy — returns empty, not an error',
        why: 'Not a constraint at all. The row is filtered out of the result, so the client sees an empty list rather than a refusal.' },
      { label: 'A legitimate add, under every rule',
        sql: "insert into enrollment_items (enrollment_id, subject_id) values ('e2', 'u2');",
        result: 'accept', by: 'every constraint, trigger and policy passes',
        why: 'Worth running too. A test suite that only proves things are refused has not shown the app works.' }
    ];

    var sel = 0;

    root.innerHTML =
      '<div class="seg" style="flex-wrap:wrap"></div>' +
      '<pre class="csql" style="margin-top:var(--s3)"></pre>' +
      '<div class="con__row"></div>' +
      '<p class="body cwhy"></p>';

    var seg = $('.seg', root);
    CASES.forEach(function (c, i) {
      var b = el('button', null, String(i + 1));
      b.type = 'button';
      b.title = c.label;
      b.addEventListener('click', function () { sel = i; render(); });
      seg.appendChild(b);
    });

    function render() {
      Array.prototype.forEach.call(seg.children, function (b, i) {
        b.setAttribute('aria-pressed', String(i === sel));
      });
      var c = CASES[sel];
      $('.csql', root).textContent = c.sql;
      var row = $('.con__row', root);
      row.dataset.r = c.result;
      row.innerHTML =
        '<span class="con__m">' + (c.result === 'reject' ? '✕' : '✓') + '</span>' +
        '<span><b>' + c.label + '</b>' +
        '<span class="con__sql">' + (c.result === 'reject' ? 'rejected by ' : 'allowed — ') + c.by + '</span></span>';
      $('.cwhy', root).innerHTML = c.why;
    }
    render();
  })();

  /* ============================================================
     4 · Contract check runner
     Nine operations, checked against the implementation.
     ============================================================ */
  (function cc() {
    var root = $('#cc');
    if (!root) return;

    var OPS = [
      { verb: 'GET',    id: 'getCurrentTerm' },
      { verb: 'GET',    id: 'listSubjects' },
      { verb: 'GET',    id: 'getStudentEnrollment',
        fail: 'response has total_units, contract says totalUnits' },
      { verb: 'POST',   id: 'addEnrollmentItem',
        fail: '422 UNIT_CEILING documented, implementation returns 500' },
      { verb: 'DELETE', id: 'removeEnrollmentItem' },
      { verb: 'POST',   id: 'submitEnrollment',
        fail: '422 EMPTY_ENROLLMENT documented, never returned' },
      { verb: 'GET',    id: 'listPendingEnrollments' },
      { verb: 'POST',   id: 'approveEnrollment' },
      { verb: 'POST',   id: 'returnEnrollment',
        fail: 'reason minLength 10 in the contract, unchecked in the function' }
    ];

    var fixed = false;

    root.innerHTML =
      '<div class="seg">' +
        '<button type="button" class="run">Run contract:check</button>' +
        '<button type="button" class="fix" aria-pressed="false">Apply the fixes</button>' +
      '</div>' +
      '<div class="rows" style="display:flex;flex-direction:column;gap:2px;margin-top:var(--s3)"></div>' +
      '<div class="cc__sum"></div>';

    var rowsEl = $('.rows', root);
    var sumEl = $('.cc__sum', root);
    var timer = null;

    function draw(states) {
      rowsEl.innerHTML = '';
      OPS.forEach(function (o, i) {
        var st = states[i];
        var row = el('div', 'cc__row');
        row.dataset.s = st;
        var mark = st === 'pass' ? '✓' : st === 'fail' ? '✕' : '·';
        row.innerHTML =
          '<span class="cc__m">' + mark + '</span>' +
          '<span class="cc__verb">' + o.verb + '</span>' +
          '<span>' + o.id + '</span>' +
          '<span class="dim" style="font-size:0.6rem">' + (st === 'pending' ? '' : st) + '</span>';
        if (st === 'fail' && o.fail) {
          row.appendChild(el('span', 'cc__msg', '→ ' + o.fail));
        }
        rowsEl.appendChild(row);
      });
    }

    function run() {
      if (timer) clearInterval(timer);
      var states = OPS.map(function () { return 'pending'; });
      draw(states);
      sumEl.textContent = 'checking…';

      var i = 0;
      timer = setInterval(function () {
        if (i >= OPS.length) {
          clearInterval(timer);
          timer = null;
          var failed = states.filter(function (s) { return s === 'fail'; }).length;
          sumEl.innerHTML = failed
            ? '<b style="color:var(--fail)">' + failed + ' of ' + OPS.length + ' operations do not satisfy the contract</b>'
            : '<b style="color:var(--pass)">All ' + OPS.length + ' operations satisfy the contract</b> — the backend half is done.';
          return;
        }
        states[i] = (OPS[i].fail && !fixed) ? 'fail' : 'pass';
        i++;
        draw(states);
      }, 110);
    }

    $('.run', root).addEventListener('click', run);
    $('.fix', root).addEventListener('click', function () {
      fixed = !fixed;
      var b = $('.fix', root);
      b.setAttribute('aria-pressed', String(fixed));
      b.textContent = fixed ? 'Break it again' : 'Apply the fixes';
      run();
    });

    draw(OPS.map(function () { return 'pending'; }));
    sumEl.textContent = 'not run yet';
  })();
})();

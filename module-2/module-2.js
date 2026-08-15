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

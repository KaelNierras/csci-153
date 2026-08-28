/* ============================================================
   CSci 153 — Module 5 widgets
   Web Application Integration: the validation bypass, a CI
   pipeline with a gate, and the deployment map.

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
     1 · Validation bypass
     The same bad write, sent by four different callers.
     ============================================================ */
  (function val() {
    var root = $('#val');
    if (!root) return;

    var PATHS = [
      { key: 'form', label: 'Your form', skips: [],
        note: 'The happy path. Zod rejects it in the field, no request is made, and the user is told before they wait.' },
      { key: 'devtools', label: 'Devtools: delete the check', skips: ['zod'],
        note: 'Two lines in the console removes the client validation. Everything after this point is what actually protects you.' },
      { key: 'rest', label: 'A REST client', skips: ['zod'],
        note: 'No form, no React, no client validation at all — just a request. This is the test that matters.' },
      { key: 'svc', label: 'A REST client + service_role', skips: ['zod', 'rls'],
        note: 'RLS is bypassed by this key. Only the constraints and triggers are left — which is exactly why a service key must never reach a browser.' }
    ];

    var CASES = [
      { key: 'reason', label: 'Return an enrollment with reason: "no"',
        layers: { zod: 'blocked', rls: 'passed', edge: 'blocked', db: 'passed' },
        blockedBy: { zod: 'min(10) — "Say what needs changing"', edge: '422 REASON_REQUIRED, from the function' },
        survives: false },
      { key: 'units', label: 'Add a 7th subject, taking the total to 24 units',
        layers: { zod: 'passed', rls: 'passed', edge: 'passed', db: 'blocked' },
        blockedBy: { db: 'trigger enforce_ceiling raises UNIT_CEILING' },
        survives: false },
      { key: 'other', label: "Write to another student's enrollment",
        layers: { zod: 'passed', rls: 'blocked', edge: 'passed', db: 'passed' },
        blockedBy: { rls: 'policy: no row matches student_id = auth.uid()' },
        survives: false },
      { key: 'zero', label: 'Create a subject with units: 0',
        layers: { zod: 'blocked', rls: 'passed', edge: 'passed', db: 'blocked' },
        blockedBy: { zod: 'z.number().min(1)', db: 'check constraint units_sane' },
        survives: false },
      { key: 'nickname', label: 'Set a display name of 400 characters',
        layers: { zod: 'blocked', rls: 'passed', edge: 'passed', db: 'passed' },
        blockedBy: { zod: 'max(120)' },
        survives: true }
    ];

    var LAYERS = [
      { key: 'zod',  label: 'Zod, in the form',        where: 'browser' },
      { key: 'rls',  label: 'RLS policy',              where: 'database' },
      { key: 'edge', label: 'Edge Function check',     where: 'server' },
      { key: 'db',   label: 'Constraint or trigger',   where: 'database' }
    ];

    var path = 'form';
    var kase = 0;

    root.innerHTML =
      '<div class="col">' +
        '<div class="ctl"><span class="ctl__label">Sent by</span></div>' +
        '<div class="seg paths" style="flex-wrap:wrap"></div>' +
        '<div class="ctl" style="margin-top:var(--s3)"><span class="ctl__label">The bad write</span></div>' +
        '<div class="seg cases" style="flex-wrap:wrap"></div>' +
        '<p class="small pnote" style="margin-top:var(--s3)"></p>' +
      '</div>' +
      '<div class="col">' +
        '<div class="val__layers"></div>' +
        '<div class="val__out"></div>' +
      '</div>';

    var segP = $('.paths', root);
    PATHS.forEach(function (p) {
      var b = el('button', null, p.label);
      b.type = 'button';
      b.dataset.k = p.key;
      b.addEventListener('click', function () { path = p.key; render(); });
      segP.appendChild(b);
    });

    var segC = $('.cases', root);
    CASES.forEach(function (c, i) {
      var b = el('button', null, String(i + 1));
      b.type = 'button';
      b.title = c.label;
      b.addEventListener('click', function () { kase = i; render(); });
      segC.appendChild(b);
    });

    function render() {
      var p = PATHS.filter(function (x) { return x.key === path; })[0];
      var c = CASES[kase];

      Array.prototype.forEach.call(segP.children, function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.k === path));
      });
      Array.prototype.forEach.call(segC.children, function (b, i) {
        b.setAttribute('aria-pressed', String(i === kase));
      });
      $('.pnote', root).innerHTML = '<b>' + c.label + '</b> — ' + p.note;

      var out = $('.val__layers', root);
      out.innerHTML = '';
      var stopped = null;

      LAYERS.forEach(function (L) {
        var result;
        if (p.skips.indexOf(L.key) !== -1) result = 'skipped';
        else if (stopped) result = 'skipped';
        else {
          result = c.layers[L.key];
          if (result === 'blocked') stopped = L;
        }

        var row = el('div', 'val__layer');
        row.dataset.r = result;
        var tag = result === 'blocked' ? 'blocked it'
          : result === 'skipped' ? 'not reached'
          : 'let it through';
        row.innerHTML =
          '<span>' + L.label + ' <span class="dim">· ' + L.where + '</span></span>' +
          '<span class="val__tag">' + tag + '</span>';
        out.appendChild(row);

        if (result === 'blocked' && c.blockedBy[L.key]) {
          out.appendChild(el('div', 'small',
            '<span style="color:var(--pass)">↳ ' + c.blockedBy[L.key] + '</span>'));
        }
      });

      var v = $('.val__out', root);
      if (stopped) {
        v.innerHTML = '<b style="color:var(--pass)">Rejected</b><br>' +
          '<span class="small">Stopped by <b>' + stopped.label + '</b>, in the ' + stopped.where +
          '. The bad row never existed.</span>';
      } else {
        v.innerHTML = '<b style="color:var(--fail)">The bad row landed</b><br>' +
          '<span class="small">Nothing on the server had an opinion about this. ' +
          'The only rule was in the form, and the form was optional.</span>';
      }
    }
    render();
  })();

  /* ============================================================
     2 · CI pipeline
     Four checks, and the gate that makes them matter.
     ============================================================ */
  (function pipe() {
    var root = $('#pipe');
    if (!root) return;

    var BREAKS = [
      { key: 'none',    label: 'Nothing broken' },
      { key: 'lint',    label: 'An unused import', at: 'lint',
        msg: "'useEffect' is defined but never used" },
      { key: 'types',   label: 'A renamed field, used in a component', at: 'typecheck',
        msg: "Property 'total_units' does not exist on type 'Enrollment'" },
      { key: 'test',    label: 'The unit ceiling changed to 24', at: 'test',
        msg: '2 failed · R2 rejects an add past the unit ceiling' },
      { key: 'contract', label: 'Contract edited, types not regenerated', at: 'contract:check',
        msg: 'contract/generated/schema.d.ts is stale — run npm run contract:types' },
      { key: 'protect', label: 'Everything green, but checks not required', at: null,
        msg: null }
    ];

    var STEPS = ['npm ci', 'lint', 'typecheck', 'test', 'contract:check'];
    var sel = 0;
    var timer = null;

    root.innerHTML =
      '<div class="seg" style="flex-wrap:wrap"></div>' +
      '<div class="pipe__steps" style="margin-top:var(--s3)"></div>' +
      '<div class="pipe__gate"></div>';

    var seg = $('.seg', root);
    BREAKS.forEach(function (b, i) {
      var btn = el('button', null, b.label);
      btn.type = 'button';
      btn.addEventListener('click', function () { sel = i; run(); });
      seg.appendChild(btn);
    });

    function draw(states) {
      var b = BREAKS[sel];
      var wrap = $('.pipe__steps', root);
      wrap.innerHTML = '';
      STEPS.forEach(function (s, i) {
        var st = states[i];
        var row = el('div', 'pipe__step');
        row.dataset.s = st;
        var mark = st === 'pass' ? '✓' : st === 'fail' ? '✕' : st === 'run' ? '·' : '–';
        row.innerHTML = '<span class="pipe__m">' + mark + '</span>' +
          '<span>' + s + '</span>' +
          '<span class="dim" style="font-size:0.6rem">' +
          (st === 'skip' ? 'skipped' : st === 'pending' ? '' : st) + '</span>';
        if (st === 'fail' && b.msg) row.appendChild(el('span', 'pipe__msg', '→ ' + b.msg));
        wrap.appendChild(row);
      });
    }

    function gate(failed) {
      var b = BREAKS[sel];
      var g = $('.pipe__gate', root);
      if (b.key === 'protect') {
        g.innerHTML = '<b style="color:var(--warn)">Merge allowed</b> — and it would have been ' +
          'allowed <b>even if this had been red</b>, because status checks are not required. ' +
          '<span class="small">A check nobody is forced to respect is not a check.</span>';
      } else if (failed) {
        g.innerHTML = '<b style="color:var(--fail)">Merge blocked</b> — branch protection ' +
          'requires these checks to pass. <span class="small">The bug never reaches main, and ' +
          'nobody had to notice it in review.</span>';
      } else {
        g.innerHTML = '<b style="color:var(--pass)">Merge allowed</b> — four checks, on a clean ' +
          'machine, whether or not anyone remembered to run them.';
      }
    }

    function run() {
      if (timer) clearInterval(timer);
      Array.prototype.forEach.call(seg.children, function (b, i) {
        b.setAttribute('aria-pressed', String(i === sel));
      });

      var b = BREAKS[sel];
      var states = STEPS.map(function () { return 'pending'; });
      draw(states);
      $('.pipe__gate', root).textContent = 'running…';

      var i = 0;
      var failedAt = -1;
      timer = setInterval(function () {
        if (i >= STEPS.length || failedAt !== -1) {
          clearInterval(timer);
          timer = null;
          if (failedAt !== -1) {
            for (var j = failedAt + 1; j < STEPS.length; j++) states[j] = 'skip';
            draw(states);
          }
          gate(failedAt !== -1);
          return;
        }
        if (b.at && STEPS[i] === b.at) {
          states[i] = 'fail';
          failedAt = i;
        } else {
          states[i] = 'pass';
        }
        i++;
        draw(states);
      }, 130);
    }
    run();
  })();

  /* ============================================================
     3 · Deployment map
     Three hosts, and which secrets may live where.
     ============================================================ */
  (function dep5() {
    var root = $('#dep5');
    if (!root) return;

    var PLACES = [
      {
        key: 'cdn', kind: 'Static host', title: 'Vercel or Netlify',
        body: 'Your built frontend — HTML, CSS and JavaScript files. No server runs your React code; a CDN hands the same bundle to everyone.',
        holds: [
          { ok: 1, t: 'VITE_API_BASE_URL — public by design' },
          { ok: 1, t: 'The Supabase anon key — public by design' },
          { ok: 0, t: 'Any service_role key' },
          { ok: 0, t: 'Any third-party API secret' }
        ],
        note: 'Everything here is readable by anyone who opens devtools. Treat the whole bundle as published, because it is.'
      },
      {
        key: 'db', kind: 'Managed Postgres', title: 'Supabase project',
        body: 'Your migrations applied, your policies enforcing, your seed data present. Reached directly by the browser over PostgREST.',
        holds: [
          { ok: 1, t: 'Every table and policy' },
          { ok: 1, t: 'Database functions' },
          { ok: 0, t: 'Nothing the browser should not query' }
        ],
        note: 'Deployed separately from the frontend, with `supabase db push`. A frontend deploy does not carry migrations with it — forgetting this is the most common broken deploy.'
      },
      {
        key: 'fn', kind: 'Serverless', title: 'Edge Functions',
        body: 'The code that needs a secret, a privileged write, or several statements that must succeed together.',
        holds: [
          { ok: 1, t: 'service_role, from supabase secrets set' },
          { ok: 1, t: 'Third-party API keys' },
          { ok: 1, t: 'Anything read with Deno.env.get()' }
        ],
        note: 'The only one of the three places a secret may exist. Deployed with `supabase functions deploy`, again separately.'
      }
    ];

    var sel = 0;

    function render() {
      root.innerHTML = '';
      PLACES.forEach(function (p, i) {
        var box = el('div', 'dep5__box' + (i === sel ? ' is-hot' : ''));
        box.innerHTML =
          '<span class="dep5__k">' + p.kind + '</span>' +
          '<span class="dep5__t">' + p.title + '</span>' +
          '<span class="dep5__b">' + p.body + '</span>';
        if (i === sel) {
          p.holds.forEach(function (h) {
            box.appendChild(el('span', 'dep5__secret',
              (h.ok ? '✓ ' : '✕ ') + h.t)).dataset.ok = String(h.ok);
          });
          box.appendChild(el('span', 'small', p.note));
        }
        box.addEventListener('click', function () { sel = i; render(); });
        box.style.cursor = 'pointer';
        root.appendChild(box);
      });
    }
    render();
  })();
})();

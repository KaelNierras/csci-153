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

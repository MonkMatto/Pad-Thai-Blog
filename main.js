let allRows = [];
let headers = [];
let sortCol = -1;
let sortDir = 1; // 1 = asc, -1 = desc

async function init() {
  try {
    const response = await fetch('data.csv');
    const text = await response.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      showEmpty('No entries yet.');
      return;
    }

    headers = rows[0];
    allRows = rows.slice(1).filter(r => r.some(c => c.trim() !== ''));

    renderHeaders();
    applyAndRender();

    document.getElementById('search').addEventListener('input', applyAndRender);
  } catch (e) {
    showEmpty('Could not load data.');
    console.error(e);
  }
}

// Robust CSV parser — handles quoted fields, commas inside quotes, newlines inside quotes
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(field.trim());
        field = '';
        if (row.some(f => f !== '')) rows.push(row);
        row = [];
        i++;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field.trim());
        field = '';
        if (row.some(f => f !== '')) rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
  }

  // Flush last field/row
  row.push(field.trim());
  if (row.some(f => f !== '')) rows.push(row);

  return rows;
}

function renderHeaders() {
  const thead = document.querySelector('#main-table thead');
  thead.innerHTML = '';
  const tr = document.createElement('tr');

  headers.forEach((h, i) => {
    const th = document.createElement('th');
    th.textContent = h;
    th.dataset.col = i;
    if (h !== 'Photo') {
      th.classList.add('sortable');
      th.addEventListener('click', () => onSort(i));
    }
    tr.appendChild(th);
  });

  thead.appendChild(tr);
}

function applyAndRender() {
  const query = document.getElementById('search').value.toLowerCase().trim();

  let rows = allRows.filter(row =>
    !query || row.some(cell => cell.toLowerCase().includes(query))
  );

  if (sortCol >= 0) {
    rows = [...rows].sort((a, b) => {
      const av = a[sortCol] || '';
      const bv = b[sortCol] || '';
      return compareValues(av, bv) * sortDir;
    });
  }

  updateCount(rows.length);
  renderRows(rows);
}

function compareValues(a, b) {
  // Numeric
  const an = parseFloat(a);
  const bn = parseFloat(b);
  if (!isNaN(an) && !isNaN(bn)) return an - bn;

  // Date
  const ad = Date.parse(a);
  const bd = Date.parse(b);
  if (!isNaN(ad) && !isNaN(bd)) return ad - bd;

  // String
  return a.localeCompare(b);
}

function onSort(colIdx) {
  if (sortCol === colIdx) {
    sortDir *= -1;
  } else {
    sortCol = colIdx;
    sortDir = 1;
  }

  document.querySelectorAll('th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (parseInt(th.dataset.col) === sortCol) {
      th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
    }
  });

  applyAndRender();
}

function renderRows(rows) {
  const tbody = document.querySelector('#main-table tbody');
  tbody.innerHTML = '';

  const photoIdx = headers.indexOf('Photo');

  if (rows.length === 0) {
    showEmpty('No results match your search.');
    return;
  }

  rows.forEach(row => {
    const tr = document.createElement('tr');

    headers.forEach((h, i) => {
      const td = document.createElement('td');
      const cell = row[i] || '';

      if (i === photoIdx) {
        if (cell) {
          const a = document.createElement('a');
          a.href = `images/${cell}`;
          a.target = '_blank';
          a.rel = 'noopener';
          const img = document.createElement('img');
          img.src = `images/thumbnails/${cell}`;
          img.alt = row[0] || '';
          img.className = 'thumb';
          img.onerror = () => { img.style.display = 'none'; };
          a.appendChild(img);
          td.appendChild(a);
        }
        td.classList.add('photo-cell');
      } else {
        td.textContent = cell;
        if (['Noodles','Sauce','Toppings','Flavor','Protein','Atmosphere','Value','Wow Factor'].includes(h)) {
          td.classList.add('note-cell');
        }
        if (h === 'Name') td.classList.add('name-cell');
        if (h === 'Rating') td.classList.add('rating-cell');
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function updateCount(n) {
  const el = document.getElementById('count');
  el.textContent = n === 1 ? '1 entry' : `${n} entries`;
}

function showEmpty(msg) {
  const tbody = document.querySelector('#main-table tbody');
  tbody.innerHTML = `<tr><td colspan="${headers.length || 13}" class="empty">${msg}</td></tr>`;
  updateCount(0);
}

init();

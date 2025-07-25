// Fibonacci intervals (0 unused)
const fib = [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610];

// DOM references
const scheduleNameInput = document.getElementById("scheduleName");
const titleEl           = document.getElementById("scheduleTitle");
const startDateInput    = document.getElementById("startDate");
const numRevInput       = document.getElementById("numRevisions");
const form              = document.getElementById("settingsForm");
const tableBody         = document.querySelector("#revisionsTable tbody");
const exportBtn         = document.getElementById("exportBtn");
const importBtn         = document.getElementById("importBtn");
const importFile        = document.getElementById("importFile");

// localStorage keys
const LS_NAME   = "fiboScheduleName";
const LS_START  = "fiboStartDate";
const LS_NUM    = "fiboNumRevisions";
const LS_DATES  = "fiboRevisionDates";
const LS_DONE   = "fiboRevisionDone";

// Initialize on load
window.addEventListener("DOMContentLoaded", () => {
  // Prevent future dates
  startDateInput.max = new Date().toISOString().slice(0,10);

  // Load stored values
  const nameVal  = localStorage.getItem(LS_NAME)  || "";
  const startVal = localStorage.getItem(LS_START) || "";
  const numVal   = localStorage.getItem(LS_NUM)   || "";
  const dates    = JSON.parse(localStorage.getItem(LS_DATES) || "[]");
  const doneArr  = JSON.parse(localStorage.getItem(LS_DONE)  || "[]");

  // Populate inputs
  scheduleNameInput.value = nameVal;
  updateTitle(nameVal);
  startDateInput.value    = startVal;
  numRevInput.value       = numVal;

  // Render existing table if data present
  if (dates.length) {
    const cleanDone = adjustDoneArray(doneArr, dates.length);
    renderTable(dates.length, dates, cleanDone);
  }
});

// Update title & persist name
scheduleNameInput.addEventListener("input", () => {
  const val = scheduleNameInput.value.trim();
  updateTitle(val);
  localStorage.setItem(LS_NAME, val);
});

// Form submit: compute dates & reset done flags
form.addEventListener("submit", e => {
  e.preventDefault();

  const nameVal  = scheduleNameInput.value.trim();
  const startVal = startDateInput.value;
  const num      = parseInt(numRevInput.value,10);

  // Validations
  if (!startVal)                     return alert("Pick a start date.");
  if (startVal > startDateInput.max) return alert("Date cannot be future.");
  if (num < 1 || num > 15)           return alert("Revisions must be 1–15.");

  // Compute revision dates
  const base = new Date(startVal);
  const datesArr = Array.from({ length: num }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + fib[i+1]);
    return d.toISOString().slice(0,10);
  });

  const doneFlags = Array(num).fill(false);

  // Persist everything
  localStorage.setItem(LS_NAME,  nameVal);
  localStorage.setItem(LS_START, startVal);
  localStorage.setItem(LS_NUM,   num);
  localStorage.setItem(LS_DATES, JSON.stringify(datesArr));
  localStorage.setItem(LS_DONE,  JSON.stringify(doneFlags));

  renderTable(num, datesArr, doneFlags);
});

// Export JSON
exportBtn.addEventListener("click", () => {
  const payload = {
    scheduleName:   localStorage.getItem(LS_NAME)        || "",
    startDate:      localStorage.getItem(LS_START)       || "",
    numRevisions:   parseInt(localStorage.getItem(LS_NUM),10) || 0,
    revisionDates:  JSON.parse(localStorage.getItem(LS_DATES) || "[]"),
    revisionDone:   JSON.parse(localStorage.getItem(LS_DONE)  || "[]")
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  const namePart = payload.scheduleName
    ? payload.scheduleName.replace(/\s+/g, "_").toLowerCase()
    : "schedule";

  a.href        = url;
  a.download    = `${namePart}_revision_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Trigger file picker
importBtn.addEventListener("click", () => importFile.click());

// Handle JSON import
importFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);

      // Validate structure
      if (
        typeof data.scheduleName !== "string" ||
        typeof data.startDate    !== "string" ||
        typeof data.numRevisions !== "number" ||
        !Array.isArray(data.revisionDates) ||
        !Array.isArray(data.revisionDone)
      ) {
        throw new Error("Invalid JSON format");
      }

      // Persist
      localStorage.setItem(LS_NAME,  data.scheduleName);
      localStorage.setItem(LS_START, data.startDate);
      localStorage.setItem(LS_NUM,   data.numRevisions);
      localStorage.setItem(LS_DATES, JSON.stringify(data.revisionDates));
      localStorage.setItem(LS_DONE,  JSON.stringify(data.revisionDone));

      // Update UI
      scheduleNameInput.value = data.scheduleName;
      updateTitle(data.scheduleName);
      startDateInput.value    = data.startDate;
      numRevInput.value       = data.numRevisions;

      renderTable(
        data.numRevisions,
        data.revisionDates,
        adjustDoneArray(data.revisionDone, data.revisionDates.length)
      );

      alert("Data imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
});

// Ensure done-array matches count
function adjustDoneArray(arr, len) {
  const copy = arr.slice(0, len);
  while (copy.length < len) copy.push(false);
  return copy;
}

// Render table rows
function renderTable(count, dates, doneArr) {
  tableBody.innerHTML = "";
  dates.forEach((date, idx) => {
    const tr = document.createElement("tr");

    // Revision #
    const tdNum = document.createElement("td");
    tdNum.textContent = `Revision ${idx + 1}`;

    // Date cell
    const tdDate = document.createElement("td");
    const inp    = document.createElement("input");
    inp.type     = "date";
    inp.value    = date;
    inp.readOnly = true;
    inp.classList.add("form-control");
    tdDate.append(inp);

    // Done checkbox
    const tdDone = document.createElement("td");
    const wrapper= document.createElement("div");
    wrapper.classList.add("form-check");
    const cb     = document.createElement("input");
    cb.type      = "checkbox";
    cb.classList.add("form-check-input");
    cb.checked   = doneArr[idx];
    cb.id        = `done-${idx}`;
    cb.addEventListener("change", () => {
      doneArr[idx] = cb.checked;
      localStorage.setItem(LS_DONE, JSON.stringify(doneArr));
    });
    const lbl = document.createElement("label");
    lbl.classList.add("form-check-label");
    lbl.setAttribute("for", cb.id);
    wrapper.append(cb, lbl);
    tdDone.append(wrapper);

    tr.append(tdNum, tdDate, tdDone);
    tableBody.append(tr);
  });
}

// Helper to set heading
function updateTitle(name) {
  titleEl.textContent = name
    ? `${name} Revision Scheduler`
    : "Fibonacci Revision Scheduler";
}

document.getElementById("settingsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("scheduleName").value.trim();
  const startDate = new Date(document.getElementById("startDate").value);
  const numRevisions = parseInt(document.getElementById("numRevisions").value);
  const tableBody = document.querySelector("#revisionsTable tbody");

  tableBody.innerHTML = "";

  const fib = [0, 1];
  for (let i = 2; i < numRevisions + 2; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  for (let i = 1; i <= numRevisions; i++) {
    const revisionDate = new Date(startDate);
    revisionDate.setDate(revisionDate.getDate() + fib[i]);

    const dayName = revisionDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const dateStr = revisionDate.toLocaleDateString("en-GB") + ` (${dayName})`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i}</td>
      <td>${dateStr}</td>
      <td><input type="checkbox" /></td>
    `;
    tableBody.appendChild(row);
  }
});

// Dark Mode Toggle
document.getElementById("toggleDarkMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");

  const btn = document.getElementById("toggleDarkMode");
  if (document.body.classList.contains("dark-mode")) {
    btn.textContent = "☀️ Light Mode";
    btn.classList.remove("btn-outline-dark");
    btn.classList.add("btn-outline-light");
  } else {
    btn.textContent = "🌙 Dark Mode";
    btn.classList.remove("btn-outline-light");
    btn.classList.add("btn-outline-dark");
  }
});
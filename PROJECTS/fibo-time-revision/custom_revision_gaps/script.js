// Grab DOM elements
const titleInput = document.getElementById("scheduleTitle");
const dateInput  = document.getElementById("startDateTime");
const addBtn     = document.getElementById("addRevisionBtn");
const exportBtn  = document.getElementById("exportIcsBtn");
const tableBody  = document.querySelector("#customTable tbody");

// Store each revision row’s gap and calculated date
let revisionRows = [];

// Add a new revision row
addBtn.addEventListener("click", () => {
  const index = revisionRows.length + 1;

  // Create table row and cells
  const row      = document.createElement("tr");
  const cellNo   = document.createElement("td");
  const cellGap  = document.createElement("td");
  const cellDate = document.createElement("td");

  // SL. NO.
  cellNo.textContent = index;

  // Gap input field
  const gapInput = document.createElement("input");
  gapInput.type      = "number";
  gapInput.min       = "0";
  gapInput.className = "form-control gap-input";
  gapInput.addEventListener("input", updateDates);

  // Append gap input and date cell
  cellGap.appendChild(gapInput);
  cellDate.className = "revision-date";

  // Assemble row
  row.append(cellNo, cellGap, cellDate);
  tableBody.appendChild(row);

  // Keep track of row elements
  revisionRows.push({ gapInput, cellDate, dateObj: null });
});

// Recalculate all revision dates
function updateDates() {
  const startValue = dateInput.value;
  if (!startValue) return;

  const baseDate = new Date(startValue);
  let totalGap   = 0;

  revisionRows.forEach((row) => {
    // Get gap and accumulate
    const gap = parseInt(row.gapInput.value, 10) || 0;
    totalGap += gap;

    // Compute this revision’s date
    const revDate = new Date(baseDate);
    revDate.setDate(revDate.getDate() + totalGap);

    // Format for display
    const formatted = revDate.toLocaleString("en-GB", {
      weekday: "short",
      day:     "2-digit",
      month:   "short",
      year:    "numeric",
      hour:    "2-digit",
      minute:  "2-digit",
    });

    // Update table cell and save Date object
    row.cellDate.textContent = formatted;
    row.dateObj = revDate;
  });
}

// When start date changes, recalc all dates
dateInput.addEventListener("input", updateDates);

// Export revisions to .ics for Google Calendar
exportBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  if (!title) {
    alert("Please enter a Revision Title at the top.");
    return;
  }
  if (!dateInput.value || revisionRows.length === 0) {
    alert("Set a start date and add at least one revision.");
    return;
  }

  // ICS header and timezone block
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CustomScheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "X-LIC-LOCATION:Asia/Kolkata",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE"
  ];

  // Helper to zero-pad numbers
  const pad = (n) => n.toString().padStart(2, "0");

  // Create one event per revision row
  revisionRows.forEach((row, i) => {
    const date = row.dateObj;
    if (!date) return;

    // Format date/time parts
    const yyyy = date.getFullYear();
    const mm   = pad(date.getMonth() + 1);
    const dd   = pad(date.getDate());
    const hh   = pad(date.getHours());
    const min  = pad(date.getMinutes());

    const dtStart = `${yyyy}${mm}${dd}T${hh}${min}00`;

    // End time = 10 minutes later
    const endDt = new Date(date);
    endDt.setMinutes(endDt.getMinutes() + 10);
    const ehh = pad(endDt.getHours());
    const emin = pad(endDt.getMinutes());
    const dtEnd = `${yyyy}${mm}${dd}T${ehh}${emin}00`;

    // Build VEVENT block
    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`UID:rev-${i + 1}-${yyyy}${mm}${dd}@revision.app`);
    icsLines.push(`DTSTAMP:${dtStart}`);
    icsLines.push(`DTSTART;TZID=Asia/Kolkata:${dtStart}`);
    icsLines.push(`DTEND;TZID=Asia/Kolkata:${dtEnd}`);
    icsLines.push(`SUMMARY:${title} - # ${i + 1}`);
    icsLines.push("END:VEVENT");
  });

  icsLines.push("END:VCALENDAR");

  // Create blob and trigger download
  const blob = new Blob([icsLines.join("\r\n")], {
    type: "text/calendar"
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = `${titleInput.value}.ics`;
  a.click();
  URL.revokeObjectURL(url);
});
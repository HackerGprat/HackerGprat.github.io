document.getElementById("hourForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("scheduleName").value.trim() || "schedule";
  const startDateTime = new Date(document.getElementById("startDateTime").value);
  const numRevisions = parseInt(document.getElementById("numRevisions").value);
  const tableBody = document.querySelector("#hourTable tbody");

  tableBody.innerHTML = "";

  const fib = [0, 1];
  for (let i = 2; i < numRevisions + 2; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  const revisions = [];

  for (let i = 1; i <= numRevisions; i++) {
    const revisionTime = new Date(startDateTime);
    revisionTime.setHours(revisionTime.getHours() + fib[i]);

    const dateStr = revisionTime.toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i}</td>
      <td>${dateStr}</td>
    `;
    tableBody.appendChild(row);

    revisions.push({
      index: i,
      date: revisionTime,
      dateStr,
    });
  }

  // Save for export
  window.fibHourRevisions = { name, revisions };
});

// Export to ICS
document.getElementById("exportIcsBtn").addEventListener("click", () => {
  const { name, revisions } = window.fibHourRevisions || {};
  if (!revisions) return alert("Generate schedule first.");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HourScheduler//EN",
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

  const pad = (num) => num.toString().padStart(2, "0");

  revisions.forEach(({ index, date }) => {
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());

    const ymd = `${yyyy}${mm}${dd}`;
    const startTime = `${hh}${min}00`;

    // 10-minute duration
    let endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + 10);
    const ehh = pad(endDate.getHours());
    const emin = pad(endDate.getMinutes());
    const endTime = `${ehh}${emin}00`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${name}-rev-${index}-${ymd}@hour.app`);
    lines.push(`DTSTAMP:${ymd}T${startTime}`);
    lines.push(`DTSTART;TZID=Asia/Kolkata:${ymd}T${startTime}`);
    lines.push(`DTEND;TZID=Asia/Kolkata:${ymd}T${endTime}`);
    lines.push(`SUMMARY:${name} - Revision #${index}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "_").toLowerCase()}_hour_schedule.ics`;
  a.click();
  URL.revokeObjectURL(url);
});
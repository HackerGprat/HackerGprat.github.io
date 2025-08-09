// script.js

document.addEventListener('DOMContentLoaded', () => {
  // ——————————————————————————————
  // V_VARIABLES: DOM REFERENCES & STATE
  // ——————————————————————————————
  const V_schedule_title_input   = document.getElementById('scheduleTitle')
  const V_start_datetime_input   = document.getElementById('startDateTime')
  const V_add_revision_btn       = document.getElementById('addRevisionBtn')
  const V_export_calendar_btn    = document.getElementById('exportIcsBtn')
  const V_revisions_table_body   = document.querySelector('#customTable tbody')

  const V_STORAGE_KEY_TITLE      = 'revision_scheduler_title'
  const V_STORAGE_KEY_START      = 'revision_scheduler_start'
  const V_STORAGE_KEY_GAPS       = 'revision_scheduler_gaps'

  let   V_revision_rows = []  // holds { row_element, gap_input, cell_date, date_obj }

  // ——————————————————————————————
  // INITIAL LOAD + EVENT HOOKUPS
  // ——————————————————————————————
  F_load_from_storage()
  F_update_revision_dates()

  V_schedule_title_input.addEventListener('input', F_save_to_storage)
  V_start_datetime_input.addEventListener('input', () => {
    F_save_to_storage()
    F_update_revision_dates()
  })
  V_add_revision_btn.addEventListener('click', () => {
    F_add_revision_row()
    F_save_to_storage()
    F_update_revision_dates()
  })
  V_export_calendar_btn.addEventListener('click', F_export_to_calendar)

  // ——————————————————————————————
  // F_load_from_storage: restore state from localStorage
  // ——————————————————————————————
  function F_load_from_storage() {
    V_schedule_title_input.value = localStorage.getItem(V_STORAGE_KEY_TITLE) || ''
    V_start_datetime_input.value = localStorage.getItem(V_STORAGE_KEY_START) || ''

    const gap_values = JSON.parse(localStorage.getItem(V_STORAGE_KEY_GAPS) || '[]')
    gap_values.forEach(g => F_add_revision_row(g))
  }

  // ——————————————————————————————
  // F_save_to_storage: persist state to localStorage
  // ——————————————————————————————
  function F_save_to_storage() {
    const gap_values = V_revision_rows.map(r => r.gap_input.value)
    localStorage.setItem(V_STORAGE_KEY_TITLE, V_schedule_title_input.value)
    localStorage.setItem(V_STORAGE_KEY_START, V_start_datetime_input.value)
    localStorage.setItem(V_STORAGE_KEY_GAPS, JSON.stringify(gap_values))
  }

  // ——————————————————————————————
  // F_add_revision_row: create one table row
  // ——————————————————————————————
  function F_add_revision_row(initial_gap = '') {
    const index       = V_revision_rows.length + 1
    const row_element = document.createElement('tr')
    const cell_no     = document.createElement('td')
    const cell_gap    = document.createElement('td')
    const cell_date   = document.createElement('td')
    const cell_action = document.createElement('td')

    // SL. NO.
    cell_no.textContent = index

    // Gap input
    const gap_input = document.createElement('input')
    gap_input.type      = 'number'
    gap_input.min       = '0'
    gap_input.className = 'form-control'
    gap_input.value     = initial_gap
    gap_input.addEventListener('input', () => {
      F_update_revision_dates()
      F_save_to_storage()
    })
    cell_gap.appendChild(gap_input)

    // Date cell placeholder
    cell_date.className = 'revision-date'

    // Delete button
    const delete_btn = document.createElement('button')
    delete_btn.textContent = '🗑️'
    delete_btn.className   = 'btn btn-sm btn-outline-danger'
    delete_btn.addEventListener('click', () => {
      row_element.remove()
      V_revision_rows = V_revision_rows.filter(r => r.row_element !== row_element)
      F_refresh_row_numbers()
      F_save_to_storage()
      F_update_revision_dates()
    })
    cell_action.appendChild(delete_btn)

    // Assemble and append row
    row_element.append(cell_no, cell_gap, cell_date, cell_action)
    V_revisions_table_body.appendChild(row_element)

    // Track row
    V_revision_rows.push({
      row_element,
      gap_input,
      cell_date,
      date_obj: null
    })

    F_refresh_row_numbers()
  }

  // ——————————————————————————————
  // F_refresh_row_numbers: reassign SL. NO.
  // ——————————————————————————————
  function F_refresh_row_numbers() {
    V_revision_rows.forEach((r, i) => {
      r.row_element.children[0].textContent = i + 1
    })
  }

  // ——————————————————————————————
  // F_update_revision_dates: recalc dates from gaps
  // ——————————————————————————————
  function F_update_revision_dates() {
    if (!V_start_datetime_input.value) return

    const base_dt = new Date(V_start_datetime_input.value)
    let   total_gap = 0

    V_revision_rows.forEach(r => {
      const gap_days = parseInt(r.gap_input.value, 10) || 0
      total_gap += gap_days

      const rev_dt = new Date(base_dt)
      rev_dt.setDate(rev_dt.getDate() + total_gap)

      r.date_obj        = rev_dt
      r.cell_date.textContent = rev_dt.toLocaleString('en-GB', {
        weekday: 'short',
        day:     '2-digit',
        month:   'short',
        year:    'numeric',
        hour:    '2-digit',
        minute:  '2-digit'
      })
    })
  }

  // ——————————————————————————————
  // F_export_to_calendar: build & download .ics file
  // ——————————————————————————————
  function F_export_to_calendar() {
    const title_text = V_schedule_title_input.value.trim()
    if (!title_text) {
      alert('Please enter a Revision Title.')
      return
    }
    if (!V_start_datetime_input.value || V_revision_rows.length === 0) {
      alert('Set a start date/time and add at least one revision.')
      return
    }

    // ICS header + timezone
    const ics_lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RevisionScheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Kolkata',
      'X-LIC-LOCATION:Asia/Kolkata',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0530',
      'TZOFFSETTO:+0530',
      'TZNAME:IST',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE'
    ]

    // Helper to format date to ICS timestamp
    const to_ics_stamp = dt => {
      const pad2 = n => String(n).padStart(2, '0')
      return (
        dt.getFullYear() +
        pad2(dt.getMonth() + 1) +
        pad2(dt.getDate()) +
        'T' +
        pad2(dt.getHours()) +
        pad2(dt.getMinutes()) +
        '00'
      )
    }

    // Build VEVENT for each revision
    V_revision_rows.forEach((r, i) => {
      if (!r.date_obj) return

      const dt_start = to_ics_stamp(r.date_obj)
      const dt_end   = to_ics_stamp(new Date(r.date_obj.getTime() + 10 * 60 * 1000))

      ics_lines.push('BEGIN:VEVENT')
      ics_lines.push(`UID:rev-${i + 1}-${dt_start}@revision.app`)
      ics_lines.push(`DTSTAMP:${dt_start}`)
      ics_lines.push(`DTSTART;TZID=Asia/Kolkata:${dt_start}`)
      ics_lines.push(`DTEND;TZID=Asia/Kolkata:${dt_end}`)
      ics_lines.push(`SUMMARY:${title_text} - Revision ${i + 1}`)
      ics_lines.push('END:VEVENT')
    })

    ics_lines.push('END:VCALENDAR')

    // Download ICS
    const blob = new Blob([ics_lines.join('\r\n')], { type: 'text/calendar' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${title_text}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }
})

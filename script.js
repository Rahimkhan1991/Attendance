const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec"; // Replace with your deployed URL

document.addEventListener('DOMContentLoaded', () => {
  const className = localStorage.getItem('selectedClass');
  if (!className) {
    alert("No class selected.");
    return;
  }

  // Load Students for Attendance
  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.students) {
        const form = document.getElementById('attendanceForm');
        data.students.forEach(s => {
          const div = document.createElement('div');
          div.innerHTML = `
            <label>${s.roll} - ${s.name}</label>
            <select data-roll="${s.roll}" data-name="${s.name}">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <br/>
          `;
          form.appendChild(div);
        });
      } else {
        alert("Failed to load students.\n" + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching students.");
    });
});

function submitAttendance() {
  const className = localStorage.getItem("selectedClass");
  if (!className) {
    alert("Class not selected.");
    return;
  }

  const selects = document.querySelectorAll("select");
  const attendance = [];

  selects.forEach(select => {
    const roll = select.dataset.roll;
    const name = select.dataset.name;
    const status = select.value;
    attendance.push({ roll, name, status });
  });

  const url = `${WEB_APP_URL}?action=markAttendance&className=${className}&data=${encodeURIComponent(JSON.stringify(attendance))}`;

  fetch(url)
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        alert("✅ " + response.message);
      } else {
        alert("❌ Failed: " + response.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error submitting attendance");
    });
}

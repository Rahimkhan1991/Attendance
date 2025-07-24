const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec"; // Replace with your web app URL
const className = localStorage.getItem('selectedClass');

document.addEventListener('DOMContentLoaded', () => {
  if (!className) {
    alert("Class not selected.");
    return;
  }

  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("❌ Failed to load students.");
        return;
      }

      if (location.pathname.includes('mark-attendance')) {
        const form = document.getElementById('attendanceForm');
        data.students.forEach(s => {
          const div = document.createElement('div');
          div.innerHTML = `
            <label>${s.roll} - ${s.name}</label>
            <select data-roll="${s.roll}" data-name="${s.name}">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select><br>
          `;
          form.appendChild(div);
        });
      }
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to fetch students.");
    });
});

function submitAttendance() {
  const selectedClass = localStorage.getItem("selectedClass");
  const selects = document.querySelectorAll("select");
  const attendance = [];

  selects.forEach(select => {
    const roll = select.getAttribute("data-roll");
    const name = select.getAttribute("data-name");
    const status = select.value;
    attendance.push({ roll, name, status });
  });

  fetch(WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "markAttendance",
      className: selectedClass,
      data: attendance
    })
  })
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
      alert("❌ Error submitting attendance.");
    });
}

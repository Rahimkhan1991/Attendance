const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec"; // Replace with your deployed Apps Script URL
const className = localStorage.getItem('selectedClass');

document.addEventListener('DOMContentLoaded', () => {
  if (!className) return;

  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      if (location.pathname.includes('view-students')) {
        const list = document.getElementById('studentList');
        data.students.forEach(s => {
          const li = document.createElement('li');
          li.textContent = `${s.roll} - ${s.name}`;
          list.appendChild(li);
        });
      }

      if (location.pathname.includes('mark-attendance')) {
        const form = document.getElementById('attendanceForm');
        data.students.forEach(s => {
          const div = document.createElement('div');
          div.innerHTML = `
            <label>${s.roll} - ${s.name}</label>
            <select name="${s.roll}">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select><br>
          `;
          form.appendChild(div);
        });
      }
    });
});

function submitAttendance() {
  const selectedClass = localStorage.getItem("selectedClass") || "Class_1A";
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const attendance = [];

  checkboxes.forEach(cb => {
    const roll = cb.dataset.roll;
    const name = cb.dataset.name;
    const present = cb.checked ? "Present" : "Absent";
    attendance.push({ roll, name, present });
  });

  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    body: JSON.stringify({
      action: "submitAttendance",
      className: selectedClass,
      attendance: attendance
    }),
  })
    .then(res => res.text())
    .then(response => {
      alert("Attendance submitted successfully.");
    })
    .catch(error => {
      alert("Error submitting attendance.");
      console.error(error);
    });
}


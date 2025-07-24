const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";
const className = localStorage.getItem("selectedClass");

document.addEventListener('DOMContentLoaded', () => {
  if (!className) {
    alert("No class selected");
    return;
  }

  document.getElementById("classLabel").innerText = "Class: " + className;

  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load class list");

      const form = document.getElementById("attendanceForm");
      data.students.forEach(student => {
        const div = document.createElement("div");
        div.innerHTML = `
          <label>${student.roll} - ${student.name}</label>
          <select data-roll="${student.roll}" data-name="${student.name}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <br>
        `;
        form.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to load class list");
    });
});

function submitAttendance() {
  const selects = document.querySelectorAll("#attendanceForm select");
  const attendance = [];

  selects.forEach(select => {
    const roll = select.dataset.roll;
    const name = select.dataset.name;
    const status = select.value;
    attendance.push({ roll, name, status });
  });

  fetch(`${WEB_APP_URL}?action=markAttendance&className=${className}&data=${encodeURIComponent(JSON.stringify(attendance))}`)
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        alert("✅ Attendance submitted: " + response.message);
      } else {
        alert("❌ " + response.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error submitting attendance.");
    });
}

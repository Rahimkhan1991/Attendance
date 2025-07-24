const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";
const className = localStorage.getItem("selectedClass") || "Class_1A";

document.addEventListener("DOMContentLoaded", () => {
  if (!className) {
    alert("❌ No class selected.");
    return;
  }

  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("❌ Failed to load class list: " + data.message);
        return;
      }

      const form = document.getElementById("attendanceForm");
      data.students.forEach(s => {
        const div = document.createElement("div");
        div.className = "student";
        div.innerHTML = `
          <label>${s.roll} - ${s.name}</label>
          <select data-roll="${s.roll}" data-name="${s.name}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        `;
        form.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error loading students");
    });
});

function submitAttendance() {
  const selects = document.querySelectorAll("select");
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

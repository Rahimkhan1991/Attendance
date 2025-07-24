const WEB_APP_URL = "YOUR_WEB_APP_URL"; // Replace with your deployed Apps Script URL
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
  const selects = document.querySelectorAll('select');
  const attendanceData = Array.from(selects).map(s => ({
    roll: s.name,
    status: s.value
  }));

  fetch(`${WEB_APP_URL}?action=markAttendance&className=${className}&data=${encodeURIComponent(JSON.stringify(attendanceData))}`)
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.href = 'index.html';
    });
}

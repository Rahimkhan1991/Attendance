// Save student to localStorage
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const roll = document.getElementById('roll').value.trim();
      const studentClass = document.getElementById('class').value.trim();

      if (!name || !roll || !studentClass) {
        alert('Please fill in all fields.');
        return;
      }

      const students = JSON.parse(localStorage.getItem('students') || '[]');
      students.push({ name, roll, class: studentClass });
      localStorage.setItem('students', JSON.stringify(students));

      alert('✅ Student saved!');
      form.reset();
      // Show student list on view-students.html
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('studentsList');
  if (list) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    if (students.length === 0) {
      list.innerHTML = "<p>No students added yet.</p>";
      return;
    }

    students.forEach((student, index) => {
      const div = document.createElement('div');
      div.className = "student-card";
      div.innerHTML = `
        <strong>${student.name}</strong><br>
        Roll: ${student.roll}<br>
        Class: ${student.class}<br>
        <button onclick="deleteStudent(${index})">🗑️ Delete</button>
      `;
      list.appendChild(div);
    });
  }
});
// Attendance page logic
document.addEventListener('DOMContentLoaded', () => {
  const studentList = document.getElementById('studentList');
  const attendanceForm = document.getElementById('attendanceForm');
  const attendanceDate = document.getElementById('attendanceDate');

  if (studentList && attendanceForm && attendanceDate) {
    const today = new Date().toISOString().split('T')[0];
    attendanceDate.value = today;

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    if (students.length === 0) {
      studentList.innerHTML = "<p>No students found. Please add students first.</p>";
      attendanceForm.style.display = "none";
      return;
    }

    students.forEach((student, index) => {
      const div = document.createElement('div');
      div.className = "student-checkbox";
      div.innerHTML = `
        <label>
          <input type="checkbox" name="attendance" value="${student.roll}">
          ${student.name} (Roll: ${student.roll}, Class: ${student.class})
        </label>
      `;
      studentList.appendChild(div);
    });

    attendanceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = attendanceDate.value;
      const checkboxes = document.querySelectorAll('input[name="attendance"]:checked');
      const presentRolls = Array.from(checkboxes).map(cb => cb.value);

      const allAttendance = JSON.parse(localStorage.getItem('attendance') || '{}');
      allAttendance[date] = presentRolls;

      localStorage.setItem('attendance', JSON.stringify(allAttendance));
      alert('✅ Attendance saved!');
    });
  }
});

// Delete student
function deleteStudent(index) {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  if (confirm(`Delete ${students[index].name}?`)) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    location.reload(); // Refresh to update list
  }
}

    });
  }
});

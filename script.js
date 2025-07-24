const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";
const className = localStorage.getItem("selectedClass") || "Class_1A";

// Common functions
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
  alert("❌ " + message);
}

// For mark-attendance.html
if (document.getElementById('attendanceForm')) {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('classNameDisplay').textContent = className;
    loadStudentsForAttendance();
  });
}

// For view-student.html
if (document.getElementById('studentList')) {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('classNameDisplay').textContent = className;
    loadStudentList();
  });
}

function loadStudentsForAttendance() {
  showLoading(true);
  const form = document.getElementById("attendanceForm");
  form.innerHTML = '';
  
  fetch(`${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`)
    .then(res => res.json())
    .then(data => {
      showLoading(false);
      if (!data.success) {
        showError("Failed to load class list: " + data.message);
        return;
      }

      data.students.forEach(s => {
        const div = document.createElement("div");
        div.className = "student";
        div.innerHTML = `
          <label>${s.roll} - ${s.name}</label>
          <select data-roll="${s.roll}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Excused">Excused</option>
          </select>
        `;
        form.appendChild(div);
      });
    })
    .catch(err => {
      showLoading(false);
      console.error(err);
      showError("Error loading students");
    });
}

function loadStudentList() {
  showLoading(true);
  const list = document.getElementById("studentList");
  list.innerHTML = '';
  
  fetch(`${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`)
    .then(res => res.json())
    .then(data => {
      showLoading(false);
      if (!data.success) {
        showError("Failed to load student list: " + data.message);
        return;
      }

      if (data.students.length === 0) {
        list.innerHTML = '<li class="student-item">No students found in this class</li>';
        return;
      }

      data.students.forEach(s => {
        const li = document.createElement("li");
        li.className = "student-item";
        li.textContent = `${s.roll} - ${s.name}`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      showLoading(false);
      console.error(err);
      showError("Error loading student list");
    });
}

function submitAttendance() {
  const selects = document.querySelectorAll("select");
  if (selects.length === 0) {
    showError("No students to mark attendance for");
    return;
  }

  const attendance = Array.from(selects).map(select => ({
    roll: select.dataset.roll,
    status: select.value
  }));

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  
  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      action: 'markAttendance',
      className: className,
      data: JSON.stringify(attendance)
    })
  })
  .then(res => res.json())
  .then(response => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Attendance";
    
    if (response.success) {
      alert("✅ " + response.message);
    } else {
      showError(response.message);
    }
  })
  .catch(err => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Attendance";
    console.error(err);
    showError("Error submitting attendance");
  });
}
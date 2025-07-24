const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";
const className = localStorage.getItem("selectedClass");

// Init logic
document.addEventListener("DOMContentLoaded", () => {
  if (!className) {
    showError("No class selected. Please go back and select a class.");
    return;
  }

  // Update class header
  const classHeader = document.getElementById('classHeader');
  if (classHeader) {
    classHeader.textContent += `: ${className}`;
  }

  // Load correct function based on page
  if (document.getElementById('attendanceForm')) {
    loadStudentsForAttendance();
  }

  if (document.getElementById('studentList')) {
    loadStudentListOnly();
  }
});

// Load students for marking attendance
async function loadStudentsForAttendance() {
  showLoading(true);
  const form = document.getElementById("attendanceForm");
  form.innerHTML = '';

  try {
    const response = await fetch(
      `${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`
    );

    const data = await response.json();

    if (!data.success) throw new Error(data.message || "Failed to load students");

    if (data.students.length === 0) {
      form.innerHTML = "<p>No students found.</p>";
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
        </select>
      `;
      form.appendChild(div);
    });
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// Load students for view-student.html
async function loadStudentListOnly() {
  showLoading(true);
  const list = document.getElementById("studentList");
  const empty = document.getElementById("emptyMessage");
  list.innerHTML = '';

  try {
    const response = await fetch(
      `${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`
    );
    const data = await response.json();

    if (!data.success) throw new Error(data.message || "Failed to load students");

    if (data.students.length === 0) {
      empty.style.display = "block";
      return;
    }

    data.students.forEach(s => {
      const li = document.createElement("li");
      li.className = "student-item";
      li.innerHTML = `
        <div class="student-name">${s.name}</div>
        <div class="student-roll">Roll No: ${s.roll}</div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// Submit attendance
async function submitAttendance() {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const selects = document.querySelectorAll("select");
    const attendance = Array.from(selects).map(select => ({
      roll: select.dataset.roll,
      status: select.value
    }));

    const params = new URLSearchParams();
    params.append('action', 'markAttendance');
    params.append('className', className);
    params.append('data', JSON.stringify(attendance));

    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to save attendance");
    }

    alert(`✅ ${result.message}`);
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Attendance";
  }
}

// Helpers
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
  console.error(message);
  alert(`❌ ${message}`);
  showLoading(false);
}

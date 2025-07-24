const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";
const className = localStorage.getItem("selectedClass");

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!className) {
    showError("No class selected. Please go back and select a class.");
    return;
  }

  // Update the class header
  const classHeader = document.getElementById('classHeader');
  if (classHeader) {
    classHeader.textContent += `: ${className}`;
  }

  // Load students for attendance marking
  if (document.getElementById('attendanceForm')) {
    loadStudentsForAttendance();
  }
});

// Load students for attendance form
async function loadStudentsForAttendance() {
  showLoading(true);
  const form = document.getElementById("attendanceForm");
  form.innerHTML = '';
  
  try {
    const response = await fetch(
      `${"https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec"}?action=getStudents&className=${encodeURIComponent(className)}`
    );
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to load students");
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

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

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

// Helper functions
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
  console.error(message);
  alert(`❌ ${message}`);
  showLoading(false);
}
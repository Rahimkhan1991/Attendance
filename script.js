const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec"; // Replace with your deployed URL
const className = localStorage.getItem("selectedClass");

// Common functions
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
  alert("❌ " + message);
}

// Initialize pages
if (document.getElementById('classHeader')) {
  document.getElementById('classHeader').textContent += `: ${className}`;
}

// Mark Attendance Page
if (document.getElementById('attendanceForm')) {
  document.addEventListener("DOMContentLoaded", loadStudentsForAttendance);
}

// View Students Page
if (document.getElementById('studentList')) {
  document.addEventListener("DOMContentLoaded", loadStudentList);
}

function loadStudentsForAttendance() {
  showLoading(true);
  const form = document.getElementById("attendanceForm");
  form.innerHTML = '';
  
  fetch(`${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`)
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      showLoading(false);
      if (!data.success) throw new Error(data.message);
      
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
    })
    .catch(err => {
      showLoading(false);
      showError(err.message);
    });
}

function loadStudentList() {
  showLoading(true);
  const list = document.getElementById("studentList");
  list.innerHTML = '';
  
  fetch(`${WEB_APP_URL}?action=getStudents&className=${encodeURIComponent(className)}`)
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      showLoading(false);
      if (!data.success) throw new Error(data.message);
      
      if (data.students.length === 0) {
        list.innerHTML = '<li class="student-item">No students in this class</li>';
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
      showError(err.message);
    });
}

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
      throw new Error(result.message);
    }
    
    alert(`✅ ${result.message}`);
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Attendance";
  }
}
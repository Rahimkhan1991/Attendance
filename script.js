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

async function safeFetch(url, options = {}) {
  // Add JSONP callback parameter
  if (!url.includes('callback=')) {
    url += (url.includes('?') ? '&' : '?') + 'callback=callback';
  }
  
  return new Promise((resolve, reject) => {
    // Create script tag for JSONP
    const script = document.createElement('script');
    window.callback = (data) => {
      document.body.removeChild(script);
      delete window.callback;
      resolve(data);
    };
    
    script.src = url;
    script.onerror = () => {
      document.body.removeChild(script);
      delete window.callback;
      reject(new Error('JSONP request failed'));
    };
    
    document.body.appendChild(script);
  });
}
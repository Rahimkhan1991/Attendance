const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNWTluHoK_rZD0bJXll7g0vZ3f6yr4bQbrRw5FmIeMDJSQyvO6cTcR6oVZK8e-yj1icA/exec";

document.addEventListener("DOMContentLoaded", () => {
  loadClassList();

  document.getElementById("classDropdown").addEventListener("change", () => {
    const selectedClass = document.getElementById("classDropdown").value;
    localStorage.setItem("selectedClass", selectedClass);
    loadStudents(selectedClass);
  });
});

function loadClassList() {
  fetch(`${WEB_APP_URL}?action=getClassList`)
    .then(res => res.json())
    .then(data => {
      const dropdown = document.getElementById("classDropdown");
      dropdown.innerHTML = '<option value="">-- Select Class --</option>';

      data.classes.forEach(cls => {
        const option = document.createElement("option");
        option.value = cls;
        option.textContent = cls;
        dropdown.appendChild(option);
      });

      const storedClass = localStorage.getItem("selectedClass");
      if (storedClass) {
        dropdown.value = storedClass;
        loadStudents(storedClass);
      }
    })
    .catch(err => {
      alert("❌ Failed to load class list");
      console.error(err);
    });
}

function loadStudents(className) {
  const form = document.getElementById("attendanceForm");
  form.innerHTML = "<p>Loading students...</p>";

  fetch(`${WEB_APP_URL}?action=getStudents&className=${className}`)
    .then(res => res.json())
    .then(data => {
      form.innerHTML = "";
      data.students.forEach(s => {
        const div = document.createElement("div");
        div.className = "student-row";
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
      form.innerHTML = "<p>Failed to load students.</p>";
      console.error(err);
    });
}

function submitAttendance() {
  const selectedClass = localStorage.getItem("selectedClass");
  if (!selectedClass) {
    alert("Please select a class.");
    return;
  }

  const selects = document.querySelectorAll("#attendanceForm select");
  const attendance = [];

  selects.forEach(select => {
    const roll = select.dataset.roll;
    const name = select.dataset.name;
    const status = select.value;
    attendance.push({ roll, name, status });
  });

  const url = `${WEB_APP_URL}?action=markAttendance&className=${selectedClass}&data=${encodeURIComponent(JSON.stringify(attendance))}`;
  fetch(url)
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

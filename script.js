const API_BASE = "https://script.google.com/macros/s/AKfycbwrU396WRIPhEYDtFgCGA3ayag4NE8ibnFl7AxMX1swT-F7twQOgC1crhaJmEZxV7D3eA/exec";

function fetchStudents(className, callback) {
  fetch(`${API_BASE}?class=${className}`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => {
      console.error(err);
      alert("Failed to fetch students.");
    });
}
const WEB_APP_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

function fetchStudents(className, callback) {
  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: "getStudents",
      class: className
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.students) {
      callback(data.students);
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Failed to fetch students.");
  });
}

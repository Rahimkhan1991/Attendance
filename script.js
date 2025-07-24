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

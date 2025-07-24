const API_BASE = "https://script.google.com/macros/s/AKfycbxLzHJjOqBQwq9OO0j_y6G0llyn1mWagBvWbo07nO8DYNtxKAmso2V8TaLS9ii6MWcF3Q/exec";

function fetchStudents(className, callback) {
  fetch(`${API_BASE}?class=${className}`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => {
      console.error(err);
      alert("Failed to fetch students.");
    });
}

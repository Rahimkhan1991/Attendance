const API_BASE = "https://script.google.com/macros/s/AKfycbxZCU7IVN0VTHXtF9nkxK_A_vbe2lp9KqUa5cffzg-Vn-0A9vymO0trxtELam_rbD2muQ/exec";

function fetchStudents(className, callback) {
  fetch(`${API_BASE}?class=${className}`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => {
      console.error(err);
      alert("Failed to fetch students.");
    });
}

// Save student to localStorage
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const roll = document.getElementById('roll').value.trim();
      const studentClass = document.getElementById('class').value.trim();

      if (!name || !roll || !studentClass) {
        alert('Please fill in all fields.');
        return;
      }

      const students = JSON.parse(localStorage.getItem('students') || '[]');
      students.push({ name, roll, class: studentClass });
      localStorage.setItem('students', JSON.stringify(students));

      alert('✅ Student saved!');
      form.reset();
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/students')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var studentList = document.getElementById('student-list');
  
        data.forEach(function(student) {
          var listItem = document.createElement('li');
          listItem.textContent = student.name + ' - ' + student.age + ' years - ' + student.email + ' - ' + student.course;
          studentList.appendChild(listItem);
        });
      })
      .catch(function(error) {
        console.error('Failed to fetch data:', error);
      });
  });
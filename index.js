const express = require('express');
const app = express();
const PORT = 3000;

// JSON body parse karne ke liye middleware
app.use(express.json());

// In-Memory Data Store (Array)
let students = [
  { id: 1, name: "Alice", age: 20, major: "Computer Science" },
  { id: 2, name: "Bob", age: 22, major: "Mathematics" }
];

// 1. GET /students - Sabhi students (Major filter option ke saath)
app.get('/students', (req, res) => {
  const { major } = req.query;
  if (major) {
    const filteredStudents = students.filter(
      s => s.major.toLowerCase() === major.toLowerCase()
    );
    return res.status(200).json(filteredStudents);
  }
  res.status(200).json(students);
});

// 2. GET /students/:id - Specific student by ID
app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.status(200).json(student);
});

// 3. POST /students - Naya student add karein
app.post('/students', (req, res) => {
  const { name, age, major } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: "Name and age are required" });
  }

  const newStudent = {
    id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
    name,
    age,
    major: major || "Unassigned"
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 4. PUT /students/:id - Update student details
app.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, age, major } = req.body;
  if (name) student.name = name;
  if (age) student.age = age;
  if (major) student.major = major;

  res.status(200).json(student);
});

// 5. DELETE /students/:id - Student remove karein
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully" });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
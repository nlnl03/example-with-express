const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const path = require('path'); // Import the 'path' module

const uploadsDirectory = path.join(__dirname, 'uploads');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

// Sample data
const weeks = [
 { id: 1, weekNumber: 1 },
 { id: 2, weekNumber: 2 },
];

const lessons = [
 { id: 1, weekId: 1, title: 'Introduction to Express.js', file: '' },
 { id: 2, weekId: 1, title: 'Routing in Express.js', file: '' },
 { id: 3, weekId: 2, title: 'Middleware in Express.js', file: '' },
];

const practices = [
 { id: 1, lessonId: 1, title: 'Setting up Express Server' },
 { id: 2, lessonId: 2, title: 'Creating Routes' },
 { id: 3, lessonId: 3, title: 'Using Middleware' },
 { id: 4, lessonId: 1, title: 'dfdfdf' }

];

const practicesData = [
 { id: 1, practiceId: 1, data: 'Sample data for practice 1' },
 { id: 2, practiceId: 2, data: 'Sample data for practice 2' },
 { id: 3, practiceId: 3, data: 'Sample data for practice 3' },
];

// Enable CORS for development (you might want to restrict this in production)
app.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');
 next();
});

// API endpoint to get weeks with associated lessons, practices, and practicesData
app.get('/api/weeks', (req, res) => {
 const weeksWithDetails = weeks.map(week => {
  const weekLessons = lessons.filter(lesson => lesson.weekId === week.id);
  const lessonsWithPractices = weekLessons.map(lesson => {
   const lessonPractices = practices.filter(practice => practice.lessonId === lesson.id);
   const practicesWithData = lessonPractices.map(practice => {
    const practiceData = practicesData.find(data => data.practiceId === practice.id);
    return {
     id: practice.id,
     title: practice.title,
     data: practiceData ? practiceData.data : 'No data available',
    };
   });

   return {
    id: lesson.id,
    title: lesson.title,
    practices: practicesWithData,
   };
  });

  return {
   id: week.id,
   weekNumber: week.weekNumber,
   lessons: lessonsWithPractices,
  };
 });

 res.json(weeksWithDetails);
});

app.post('/api/upload', (req, res) => {
 try {
  const { lesson } = req.body;
  const file = req.files && req.files.file;

  // Validate inputs
  if (!lesson || !file) {
   return res.status(400).json({ error: 'Invalid input data' });
  }

  // Create a unique filename based on the current timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;

  // Save the file to the 'uploads' directory
  const filePath = path.join(uploadsDirectory, fileName);
  file.mv(filePath, (err) => {
   if (err) {
    return res.status(500).json({ error: 'Error saving file' });
   }

   // Update the file path in the existing lessons array
   const lessonObj = lessons.find((l) => l.id === parseInt(lesson, 10));
   if (lessonObj) {
    lessonObj.file = filePath;
   }

   // Handle the file and send a response
   const publicFilePath = `/uploads/${fileName}`;
   res.json({ filePath: publicFilePath });

   // Server-side logging
   console.log('Request body:', req.body);
   console.log('Uploaded file:', file);

   // Client-side logging
   console.log('FormData:', formData);

  });
 } catch (error) {
  console.error('Error processing upload:', error);
  res.status(500).json({ error: 'Internal server error' });
 }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});

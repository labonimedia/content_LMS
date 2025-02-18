const httpStatus = require('http-status');
const pick = require('../utils/pick');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { quizeService } = require('../services');

const createQuize = catchAsync(async (req, res) => {
  const quize = await quizeService.createQuize(req.body);
  res.status(httpStatus.CREATED).send(quize);
});

// const bulkUpload = catchAsync(async (req, res) => {
//   const filePath = req.file.path;
//   console.log(filePath);
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   console.log(boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId);
//   const quizzes = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         options: JSON.parse(row.options),
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   const quizzes = [];

//   // Read CSV and process data
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         // options: JSON.parse(row.options),
//         options:row.options,
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }
//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   const quizzes = [];

//   // Read CSV and process data
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const options = [row.option1, row.option2, row.option3, row.option4];
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         options, // Use combined options array
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Excel file is required' });
//   }
//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

//   // Read Excel file
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//   // Transform data to match the new model
//   const quizzes = data.map((row) => {
//     console.log(row);
//    // const options = [row.OptionA, row.OptionB, row.OptionC, row.OptionD];
//    const options = {
//     a: row.OptionA,
//     b: row.OptionB,
//     c: row.OptionC,
//     d: row.OptionD,
//   };
//   const correctOptions = row.CorrectAnswer
//   ? row.CorrectAnswer.split(',').map((answer) => answer.trim()) // Split by comma and trim whitespace
//   : [];
//     return {
//       quizName: row.Question,
//       displayFormat: row.DisplayFormat,
//       questionLevel: row.QuestioLevel,
//       questionType: row.Questiontype,
//       files: row.files || '',
//       options: [options],
//       correctOptions,
//       //correctOptions: JSON.parse(row.CorrectAnswer), // Parse correct options as an array
//       explain: row.Explaination || '',
//       hint: row.Hint || '',
//       types: row.types || 1, // Default to 'easy' if types is not provided
//       // isVerified: row.isVerified === 'true',
//       // marks: parseInt(row.marks || 0, 10), // Default marks to 0 if not provided
//       boardId,
//       mediumId,
//       classId,
//       bookId,
//       subjectId,
//       chapterId,
//       lectureVideoId,
//     };
//   });

//   // Save quizzes in bulk
//   const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//   res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
// });

const bulkUpload = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file is required' });
  }

  const filePath = req.file.path;
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

  // Read Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Transform data to match the model
  const quizzes = data.map((row) => {
    const options = {
      A: row['Option A'],
      B: row['Option B'],
      C: row['Option C'],
      D: row['Option D'],
    };

    const correctOptions = row['Correct Answer']
      ? row['Correct Answer'].split(',').map((answer) => answer.trim())
      : [];

    return {
      quizName: row.Question,
      displayFormat: parseInt(row['Display Format'], 10),
      questionLevel: parseInt(row['Question Level'], 10),
      questionType: parseInt(row['Question type'], 10),
      files: row.files || '',
      options: [options],
      correctOptions,
      explain: row.Explaination || '',
      hint: row.Hint || '',
      types: row.types || 1,
      boardId,
      mediumId,
      classId,
      bookId,
      subjectId,
      chapterId,
      lectureVideoId,
    };
  });

  try {
    const result = await quizeService.uploadBulkQuizzes(quizzes);

    if (result.duplicates) {
      return res.status(409).json({ message: 'Duplicate quizzes found', duplicates: result.duplicates });
    }

    res.status(201).json({ message: 'Quizzes uploaded successfully', data: result.savedQuizzes });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading quizzes', error });
  }
});


const uploadFiles = catchAsync(async (req, res) => {
  const quizData = await quizeService.uploadQuiz(req.body);
  res.status(httpStatus.CREATED).send(quizData);
});

const getAllQuize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizeService.queryQuize(filter, options);
  res.send(result);
});

const getAllNotSelected = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizeService.QuizeNotSelected(filter, options);
  res.send(result);
});

const getQuizeById = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizeById(req.params.quizeId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const getQuizeByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.query;
  // const filter = { boardId, mediumId, classId, bookId, subjectId, chapterId };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const quizes = await quizeService.getQuizeByFilter(boardId, mediumId, classId, bookId, subjectId, chapterId, options, lectureVideoId);

  if (!quizes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quizes not found');
  }

  res.send(quizes);
});

const getQuizeByChapterId = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizeBychapterId(req.params.chapterId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const getQuizeByQuizName = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizeByQestion(req.body.quizName);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const getQuizByClassIdAndDayWise = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizByclassIdAndDayWise(req.params.classId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const QuizeByIdSubmit = catchAsync(async (req, res) => {
  const quiz = await quizeService.CheckoutAnswer(req.params.quizeId, req.body.answer);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  res.send(quiz);
});

const updateQuizeById = catchAsync(async (req, res) => {
  const quize = await quizeService.updateQuizeById(req.params.quizeId, req.body);
  res.send(quize);
});

const deleteQuizeById = catchAsync(async (req, res) => {
  await quizeService.deleteQuizeById(req.params.quizeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuize,
  getAllQuize,
  getQuizeById,
  QuizeByIdSubmit,
  getQuizeByFilter,
  updateQuizeById,
  deleteQuizeById,
  getAllNotSelected,
  uploadFiles,
  getQuizByClassIdAndDayWise,
  getQuizeByQuizName,
  getQuizeByChapterId,
  bulkUpload,
};

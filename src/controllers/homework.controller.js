const httpStatus = require('http-status');
const pick = require('../utils/pick');
const XLSX = require('xlsx');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { HomeworkSerices } = require('../services');

const normalizeQuestion = (question) => {
  if (typeof question !== 'string') return '';
  return question.replace(/\s+/g, ' ').trim().toLowerCase();
};

const bulkUploadHomework = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const filePath = req.file.path;
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

  try {
    // Read CSV file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Uploaded file is empty' });
    }

    // Duplicate check within the uploaded file
    const questionSet = new Set();
    const duplicateInFile = [];
    const formattedHomework = [];

    for (const row of data) {
      if (!row.Question || !row.Answer) continue;
      
      const normalizedQuestion = normalizeQuestion(row.Question);

      if (questionSet.has(normalizedQuestion)) {
        duplicateInFile.push(row.Question);
      } else {
        questionSet.add(normalizedQuestion);
        formattedHomework.push({
          Question: row.Question,
          answer: row.Answer,
          answerType: row['Question Type'] || 'Very Short Answer',
          questionLevel: parseInt(row['Question Level'], 10) || 1,
          boardId,
          mediumId,
          classId,
          bookId,
          subjectId,
          chapterId,
          lessonId,
        });
      }
    }

    if (duplicateInFile.length > 0) {
      return res.status(400).json({
        message: 'Duplicate questions found in the uploaded file.',
        duplicateQuestions: duplicateInFile,
      });
    }

    if (formattedHomework.length === 0) {
      return res.status(400).json({ message: 'No valid data found in the file' });
    }

    // Send data to the service layer for DB validation
    const result = await HomeworkSerices.uploadBulkHomework(formattedHomework);

    return res.status(201).json({
      message: 'Bulk upload processed successfully',
      uploadedCount: result.savedHomework.length || 0,
      duplicatesInDatabaseCount: result.duplicates.length || 0,
      uploadedHomework: result.savedHomework.map((q) => q.Question) || [],
      duplicateHomework: result.duplicates.map((q) => q.Question) || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading homework', error: error.message });
  } finally {
    fs.unlinkSync(filePath); // Delete uploaded file after processing
  }
});

// const bulkUploadHomework = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

//   try {
//     // Read CSV file
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!data || data.length === 0) {
//       return res.status(400).json({ message: 'Uploaded file is empty' });
//     }

//     // Prepare data for insertion
//     const formattedHomework = [];
//     const duplicateInFile = new Set();

//     for (const row of data) {
//       if (!row.Question || !row.answer) {
//         continue;
//       }

//       const normalizedQuestion = row.Question.trim().toLowerCase();

//       if (duplicateInFile.has(normalizedQuestion)) {
//         continue;
//       }
      
//       duplicateInFile.add(normalizedQuestion);

//       formattedHomework.push({
//         Question: row.Question,
//         answer: row.Answer,
//         answerType: row['Question Type'] || 'Very Short Answer',
//         questionLevel: parseInt(row['Question Level'], 10) || 1,
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       });
//     }

//     if (formattedHomework.length === 0) {
//       return res.status(400).json({ message: 'No valid data found in the file' });
//     }

//     // Send data to the service layer for DB validation
//     const result = await HomeworkSerices.uploadBulkHomework(formattedHomework);

//     return res.status(201).json({
//       message: 'Bulk upload processed successfully',
//       uploadedCount: result.savedHomework.length || 0,
//       duplicatesInDatabaseCount: result.duplicates.length || 0,
//       uploadedHomework: result.savedHomework.map((q) => q.Question) || [],
//       duplicateHomework: result.duplicates.map((q) => q.Question) || [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading homework', error: error.message });
//   } finally {
//     fs.unlinkSync(filePath); // Delete uploaded file after processing
//   }
// });

const createHomework = catchAsync(async (req, res) => {
  const Homework = await HomeworkSerices.createHomework(req.body);
  res.status(httpStatus.CREATED).send(Homework);
});

const getAllHomework = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await HomeworkSerices.queryHomework(filter, options);
  res.send(result);
});

const getHomeworkById = catchAsync(async (req, res) => {
  const homework = await HomeworkSerices.getHomeworkById(req.params.homeworkId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  res.send(homework);
});

const getHomeworkByFilterId = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId,  search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'Question', // Sorting by subject name
  };

  const homework = await HomeworkSerices.getHomeworkByFilterId(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    lessonId,
    search,
    options
  );
  if (!homework || homework.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No homework found');
  }

  res.send(homework);
});

const answerTypeWiseByChapterId = catchAsync(async (req, res) => {
  const homework = await HomeworkSerices.answerTypeWiseByChapterId(req.params.chapterId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  res.send(homework);
});

const updateHomework = catchAsync(async (req, res) => {
  const updateHomeworks = await HomeworkSerices.updateHomeworkById(req.params.homeworkId, req.body);
  res.send(updateHomeworks);
});

const deleteHomework = catchAsync(async (req, res) => {
  await HomeworkSerices.deleteHomeworkById(req.params.homeworkId);
  res.status(httpStatus.OK).send();
});

const checkQuestionByName = catchAsync(async (req, res) => {
  const { Question, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

  const question = await HomeworkSerices.checkQuestion(
    Question,
    boardId,
    mediumId,
    classId,
    bookId,
    subjectId,
    chapterId,
    lessonId
  );

  if (question) {
    return res.status(httpStatus.OK).json({ message: 'Question Exists' });
  }

  return res.status(httpStatus.NOT_FOUND).json({ message: 'Question No Exists' });
});
const getHomeworkSummary = async (req, res) => {
  try {
    const summary = await HomeworkSerices.getHomeworkSummaryService(req.body);
    return  res.status(httpStatus.OK).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createHomework,
  getAllHomework,
  getHomeworkByFilterId,
  getHomeworkById,
  answerTypeWiseByChapterId,
  updateHomework,
  deleteHomework,
  bulkUploadHomework,
  checkQuestionByName,
  getHomeworkSummary,
};

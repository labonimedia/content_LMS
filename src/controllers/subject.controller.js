const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subjectService } = require('../services');

const createSubject = catchAsync(async (req, res) => {
  // const { file } = req;
  // req.body.thumbnail = await filterPath(file.location);
  const subject = await subjectService.createSubject(req.body);
  res.status(httpStatus.CREATED).send(subject);
});

const getAllSubject = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await subjectService.querySubject(filter, options);
  res.send(result);
});

const getSubjectById = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});

const getSubjectOfClass = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectOfClass();
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});
const getSubjectByClassId = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectByClassId(req.params.classId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});

// const getUbjectByFilter = catchAsync(async (req, res) => {
//   const { boardId, mediumId, classId } = req.params;
//   // const { page, limit } = req.query;
//   const subject = await subjectService.getSubjectByFilter(boardId, mediumId, classId);
//   if (!subject) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
//   }
//   res.send(subject);
// });
const getUbjectByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId } = req.params;
  const { search } = req.query; // Get search term from query parameters
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

  const options = {
    page,
    limit,
    sortBy: 'order', // Sort by the 'order' field
  };

  // Call the service function to get the filtered and paginated subjects
  const subjects = await subjectService.getSubjectByFilter(boardId, mediumId, classId, search, options);

  if (!subjects || subjects.totalDocs === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subjects not found');
  }

  // Send the paginated response
  res.send({
    totalDocs: subjects.totalDocs,
    totalPages: subjects.totalPages,
    page: subjects.page,
    limit: subjects.limit,
    results: subjects.docs, // The array of subjects
  });
});

const updateSubject = catchAsync(async (req, res) => {
  // const { file } = req;
  // if (file) {
  //   req.body.thumbnail = await filterPath(file.location);
  // }
  const subject = await subjectService.updatSubjectById(req.params.subjectId, req.body);
  res.send(subject);
});

const deleteSubject = catchAsync(async (req, res) => {
  await subjectService.deleteSubjectById(req.params.subjectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectByClassId,
  getSubjectOfClass,
  getUbjectByFilter,
};

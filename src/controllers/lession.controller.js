const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lessionService } = require('../services');

const createLession = catchAsync(async (req, res) => {
  // if (req.files[0] && req.files[0].location) {
  //   req.body.thumbnail = await filterPath(req.files[0].location);
  // }
  // if (req.files[1] && req.files[1].location) {
  //   req.body.poster = await filterPath(req.files[1].location);
  // }
  // req.body.thumbnail = await filterPath(req.files[0].location);
  // req.body.poster = await filterPath(req.files[0].location);

  const lesson = await lessionService.createLession(req.body);

  res.status(httpStatus.CREATED).send(lesson);
});

const queryLessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await lessionService.queryLessions(filter, options);
  res.send(result);
});

const getLession = catchAsync(async (req, res) => {
  const lession = await lessionService.getLessionById(req.params.lessionId);
  if (!lession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lession not found');
  }
  res.send(lession);
});

const getLessionbychapId = catchAsync(async (req, res) => {
  const lession = await lessionService.getLessionbychapterId(req.params.chapterId);
  if (!lession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lession not found by this chapter ID');
  }
  res.send(lession);
});

const getLessionByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId } = req.params;
  const lession = await lessionService.getLessionByFilter(boardId, mediumId, classId, subjectId, bookId, chapterId);
  if (!lession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lession not found');
  }
  res.send(lession);
});

const updateLession = catchAsync(async (req, res) => {
  // if (req.files) {
  //   if (req.files[0] && req.files[0].location) {
  //     req.body.thumbnail = await filterPath(req.files[0].location);
  //   }
  //   if (req.files[1] && req.files[1].location) {
  //     req.body.poster = await filterPath(req.files[1].location);
  //   }
  // }
  const lession = await lessionService.updateLessionById(req.params.lessionId, req.body);
  res.send(lession);
});

const deleteLession = catchAsync(async (req, res) => {
  await lessionService.deleteLessionById(req.params.lessionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLessonListByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'name', // Sorting by subject name
  };

  // Call service function
  const chapters = await lessionService.getLessonListByFilter(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    search,
    options
  );

  if (!chapters || chapters.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Lesson found');
  }

  res.send(chapters);
});
module.exports = {
  createLession,
  queryLessions,
  getLession,
  updateLession,
  deleteLession,
  getLessionbychapId,
  getLessionByFilter,
  getLessonListByFilter
};

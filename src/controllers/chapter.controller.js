const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { chapterService } = require('../services');
// const { filterPath } = require('../utils/s3middleware');

const createChapter = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }
  const newChapter = await chapterService.createChapter(req.body);
  res.status(httpStatus.CREATED).send(newChapter);
});

const getChapter = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['chapterName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const allChapter = await chapterService.getAllChapter(filter, options);
  res.send(allChapter);
});

const getByBookIdChapter = catchAsync(async (req, res) => {
  const result = await chapterService.getByBookIdChapter(req.params.bookId);
  res.send(result);
});

const getSingleChapter = catchAsync(async (req, res) => {
  const singleChapter = await chapterService.getChapterById(req.params.chapterId);
  if (!singleChapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }
  res.send(singleChapter);
});

const getChapterByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId } = req.params;
  // const { page, limit } = req.query;
  const chapter = await chapterService.getChaptersByFilter(boardId, mediumId, classId, subjectId, bookId);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }
  res.send(chapter);
});

const getChaptersByBookId = catchAsync(async (req, res) => {
  const AllChapter = await chapterService.getChaptersByBookId(req.params.bookId);
  if (!AllChapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapters not found');
  }
  res.send(AllChapter);
});

const updateSingleClass = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }
  const updateddClass = await chapterService.updateChapterById(req.params.chapterId, req.body);
  res.send(updateddClass);
});

const deleteSingleChapter = catchAsync(async (req, res) => {
  const deletedChapter = await chapterService.deleteChapterById(req.params.chapterId);
  res.status(httpStatus.NO_CONTENT).send(deletedChapter);
});

const getChapterListByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'chapterName', // Sorting by subject name
  };

  // Call service function
  const chapters = await chapterService.getChapterListByFilter(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    search,
    options
  );

  if (!chapters || chapters.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Chapters found');
  }

  res.send(chapters);
});
module.exports = {
  createChapter,
  getChapter,
  getSingleChapter,
  updateSingleClass,
  deleteSingleChapter,
  getChaptersByBookId,
  getChapterByFilter,
  getByBookIdChapter,
  getChapterListByFilter,
};

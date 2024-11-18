const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lectureVideoService } = require('../services');


const createLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.createLectureVideo(req.body);
  res.status(httpStatus.CREATED).send(lectureVideo);
});

const queryLectureVideos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['board']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await lectureVideoService.queryLectureVideo(filter, options);
  res.send(result);
});

const getLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.getLectureVideoById(req.params.lectureVideoId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LectureVideo not found');
  }
  res.send(lectureVideo);
});

const getLectureVideobychapId = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.getLectureVideobychapterId(req.params.chapterId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LectureVideo not found by this chapter ID');
  }
  res.send(lectureVideo);
});

const getLectureVideoByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId } = req.params;
  const lectureVideo = await lectureVideoService.getLectureVideoByFilter(boardId, mediumId, classId, subjectId, bookId, chapterId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LectureVideo not found');
  }
  res.send(lectureVideo);
});

const updateLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.updateLectureVideoById(req.params.lectureVideoId, req.body);
  res.send(lectureVideo);
});

const deleteLectureVideo = catchAsync(async (req, res) => {
  await lectureVideoService.deleteLectureVideoById(req.params.lectureVideoId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLectureVideo,
  queryLectureVideos,
  getLectureVideo,
  updateLectureVideo,
  deleteLectureVideo,
  getLectureVideobychapId,
  getLectureVideoByFilter,
};
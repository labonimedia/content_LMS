const httpStatus = require('http-status');
const { LectureVideo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a lession
 * @param {Object} lectureVideoBody
 * @returns {Promise<LectureVideo>}
 */

const createLectureVideo = async (lectureVideoBody) => {
  return LectureVideo.create(lectureVideoBody);
};

/**
 * Query for lession
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLectureVideo = async (filter, options) => {
  const lectureVideo = await LectureVideo.paginate(filter, options);
  return lectureVideo;
};

/**
 * Get lession by id
 * @param {ObjectId} id
 * @returns {Promise<LectureVideo>}
 */
const getLectureVideoById = async (id) => {
  return LectureVideo.findById(id);
};

/**
 * Get lession by id
 * @param {ObjectId} lectureVideoId
 * @returns {Promise<LectureVideo>}
 */
const getLectureVideobychapterId = async (lectureVideoId) => {
  return LectureVideo.find({ lectureVideoId });
};

/**
 * Get LectureVideo by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @param {ObjectId} bookId
 * @returns {Promise<lesssion>}
 */

const getLectureVideoByFilter = async (boardId, mediumId, classId, subjectId, bookId, chapterId) => {
  return LectureVideo.find({ boardId, mediumId, classId, subjectId, bookId, chapterId }).sort('order');
};

/**
 * Update lession by id
 * @param {ObjectId} lessionId
 * @param {Object} updateBody
 * @returns {Promise<LectureVideo>}
 */
const updateLectureVideoById = async (lectureVideoId, updateBody) => {
  const lectureVideo = await getLectureVideoById(lectureVideoId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'lecture video not found');
  }
  Object.assign(lectureVideo, updateBody);
  await lectureVideo.save();
  return lectureVideo;
};

/**
 * Delete lession by id
 * @param {ObjectId} lectureVideoId
 * @returns {Promise<LectureVideo>}
 */
const deleteLectureVideoById = async (lectureVideoId) => {
  const lectureVideo = await getLectureVideoById(lectureVideoId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'lecture video not found');
  }
  await lectureVideo.remove();
  return lectureVideo;
};

module.exports = {
  createLectureVideo,
  queryLectureVideo,
  getLectureVideoById,
  updateLectureVideoById,
  deleteLectureVideoById,
  getLectureVideobychapterId,
  getLectureVideoByFilter,
};
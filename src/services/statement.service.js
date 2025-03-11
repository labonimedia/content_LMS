const httpStatus = require('http-status');
const { Statement } = require('../models');
const ApiError = require('../utils/ApiError');

const axios = require("axios");

// const predictCourseCompletion = async (userId, courseId) => {
//   try {
//     const response = await axios.post("http://localhost:5001/predict", {
//       user_id: userId,
//       course_id: courseId,
//     });
//     return response.data.completion_probability;
//   } catch (error) {
//     console.error("AI Prediction Error:", error);
//     return null;
//   }
// };


/**
 * Create a Statement
 * @param {Object} reqBody
 * @returns {Promise<Statement>}
 */
const createStatement = async (reqBody) => {
  return Statement.create(reqBody);
};

/**
 * Query for Statement
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option ••••••••••••in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllStatement = async () => {
  const session = await Statement.find();
  return session;
};

/**
 * Get Statment by id
 * @param {ObjectId} id
 * @returns {Promise<Statement>}
 */
const getStatementById = async (id) => {
  return Statement.findById(id);
};

/**
 * Delete Statement by id
 * @param {ObjectId} sessionId
 * @returns {Promise<Statement>}
 */
const deleteStatementById = async (sessionId) => {
  const session = await getStatementById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Statement not found');
  }
  await session.remove();
  return session;
};

module.exports = {
  createStatement,
  getAllStatement,
  deleteStatementById,
  getStatementById,
//   predictCourseCompletion
};

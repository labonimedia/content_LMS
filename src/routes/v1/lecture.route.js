const express = require('express');
const { lectureVideoController } = require('../../controllers');
// const { upload } = require('../../utils/cdn');

const router = express.Router();

router.route('/').post(lectureVideoController.createLectureVideo).get(lectureVideoController.queryLectureVideos); // validate(lectureVideoValidation.getLectures),

router
  .route('/:lectureId')
  .get(lectureVideoController.getLectureVideo) // validate(lectureVideoValidation.getLecture),
  .patch(lectureVideoController.updateLectureVideo) // validate(lectureVideoValidation.updateLecture),
  .delete(lectureVideoController.deleteLectureVideo); // validate(lectureVideoValidation.deleteLession),

router.route('/get/all-lecture/:chapterId').get(lectureVideoController.getLectureVideobychapId); // validate(lectureVideoValidation.getLectureVideobychapterId),

router
  .route('/filter/:boardId/:mediumId/:classId/:subjectId/:bookId/:chapterId')
  .get(lectureVideoController.getLectureVideoByFilter); // validate(lectureVideoValidation.getLessionByFilter),

module.exports = router;

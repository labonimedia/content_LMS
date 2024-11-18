const express = require('express');
const validate = require('../../middlewares/validate');
const { lectureVideoController } = require('../../controllers');
const { lectureVideoValidation } = require('../../validations');
// const { upload } = require('../../utils/cdn');

const router = express.Router();

router
  .route('/')
  .post(lectureVideoController.createLectureVideo)
  .get(validate(lectureVideoValidation.getLectures), lectureVideoController.queryLectureVideos);

router
  .route('/:lectureId')
  .get(validate(lectureVideoValidation.getLecture), lectureVideoController.getLectureVideo)
  .patch(validate(lectureVideoValidation.updateLecture), lectureVideoController.updateLectureVideo)
  .delete(validate(lectureVideoValidation.deleteLession), lectureVideoController.deleteLectureVideo);

router
  .route('/getallLession/:chapterId')
  .get(validate(lectureVideoValidation.getLectureVideobychapterId), lectureVideoController.getLectureVideobychapId);

router
  .route('/filter/:boardId/:mediumId/:classId/:subjectId/:bookId/:chapterId')
  .get(validate(lectureVideoValidation.getLessionByFilter), lectureVideoController.getLectureVideoByFilter);

module.exports = router;

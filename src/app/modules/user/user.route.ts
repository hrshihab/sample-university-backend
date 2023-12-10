import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import studentValidationSchema from '../student/student.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;

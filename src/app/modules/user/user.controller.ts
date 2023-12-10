import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import httpStatus from 'http-status';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  //console.log(studentData);
  //const zodParsedData = studentValidationSchema.parse(studentData);

  const result = await UserServices.createStudentIntoDB(password, studentData);
  //console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created succesfully',
    data: result,
  });
});
export const UserControllers = {
  createStudent,
};

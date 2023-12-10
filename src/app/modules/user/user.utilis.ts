import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined; //substring kora jabe na
};

// export const generateStudentId = async (payload: TAcademicSemester) => {
//   let currentId = (0).toString();
//   const lastStudentId = await findLastStudentId();
//   const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
//   const lastStudentYear = lastStudentId?.substring(0, 4);
//   const currentStudentSemesterCode = payload.code;
//   const currentStudentYear = payload.year;
//   if (
//     lastStudentId &&
//     lastStudentSemesterCode === currentStudentSemesterCode &&
//     lastStudentYear === currentStudentYear
//   ) {
//     currentId = lastStudentId.substring(6);
//   }
//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
//   incrementId = `${payload.year}${payload.code}${incrementId}`;
//   return incrementId;
// };

export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  //0001  => 1
  let currentId = (0).toString(); // 0000 by deafult

  const lastStudentId = await findLastStudentId();
  // 2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); //01;
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); // 00001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

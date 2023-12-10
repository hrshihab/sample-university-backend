import { Student } from './student.model';
import { TStudent } from './student.interface';
import { Model } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   // const result = await StudentModel.create(student); //built in method
//   //const student = new Student(studentData);
//   // if (await Student.isUserExists(studentData.id)) {
//   //   throw new Error('User already exists');
//   // }
//   // if (await Student.isUserExists(studentData.id)) {
//   //   throw new Error('User already exists!');
//   // }
//   const result = await Student.create(studentData);
//   return result;
// };

const getAllStudentDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find().populate('admissionSemester'),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  //const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id } }]);
  return result;
};
const DeleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudentDB,
  getSingleStudentFromDB,
  DeleteStudentFromDB,
};

export type StudentMethods = {
  isUserExists(): Promise<TStudent>;
};

export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;

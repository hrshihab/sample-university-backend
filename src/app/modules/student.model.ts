import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student/student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    trim: true,
    maxLength: [20, "First Name can't more than 20 character"],
    required: [true, 'First name must be required'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1); //Shihab
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Last name must be required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name must be required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation must be required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number must be required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name must be required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation must be required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number must be required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name must be required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation must be required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number must be required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address must be required'],
  },
});

const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: [true, 'Student ID must be required and unique'],
    unique: true,
  },
  name: {
    type: userNameSchema,
    required: [true, 'Student name must be required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not valid',
    },
    required: [true, 'Gender must be required'],
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email must be required'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not valid email',
    },
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number must be required'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number must be required'],
  },
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  presentAddress: {
    type: String,
    required: [true, 'Present address must be required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address must be required'],
  },
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    required: [true, 'Active status must be required'],
  },
});

export const StudentModel = model<Student>('Student', studentSchema);

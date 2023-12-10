import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import { StudentModel } from './student.service';
import config from '../../config';

//JOI validator

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    maxLength: [20, "First Name can't more than 20 character"],
    required: [true, 'First name must be required'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1); //Shihab
    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize format',
    // },
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

const guardianSchema = new Schema<TGuardian>({
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

const localGuardianSchema = new Schema<TLocalGuardian>({
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

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID must be required and unique'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    password: {
      type: String,
      required: [true, 'Password must be required'],
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
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not valid email',
      // },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// studentSchema.method.isUserExists = async function (id:string) {
//   const existingUser = await Student.findOne({id});
//   return existingUser
// }

//creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// pre save middleware/ hook : will work on create()  save()
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook : we will save  data');
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// virtual
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + this.name.middleName + this.name.lastName;
});

// post save middleware / hook
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Student = model<TStudent, StudentModel>('Student', studentSchema);

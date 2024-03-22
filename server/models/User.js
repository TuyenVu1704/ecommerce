import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// Declare the Schema of the Mongo model\

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpire: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Doan code truoc khi luu se chay doan code sau
// code hash password Cach 2

// userSchema.pre('save', async function (next) {
//   if(!this.isModified('password')){
//     next()
//   }
//   const saltHash = bcrypt.genSaltSync(parseInt(process.env.SALT_HASH));
//   this.password = await bcrypt.hash(this.password, saltHash);
// });

const User = mongoose.model('User', userSchema);
export default User;

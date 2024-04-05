import mongoose from 'mongoose';

// Declare the Schema of the Mongo model\

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // tu dong bo dau cach o hai dau khi luu vao db
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // viet thuong khi luu vao database
    },
    desc: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId, // Kieu dang Object
      ref: 'Category', // ref la lien ket voi bang Category
    },
    quantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: Array,
    },
    color: {
      type: String,
      enum: ['Black', 'Grown', 'Red'],
    },
    ratings: [
      {
        start: {
          type: Number,
          postedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
          },
          comment: {
            type: String,
          },
        },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

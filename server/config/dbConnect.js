import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    //https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection
    //check connection mongoose state
    if (connection.connection.readyState === 1)
      console.log(`DB connection is successfully`);
    else console.log(`DB connectting`);
  } catch (error) {
    console.log(`DB connection is failed`);
    throw new Error(error);
  }
};

export default dbConnect;

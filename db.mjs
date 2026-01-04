import mongoose from "mongoose";
const connetDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://thyaguthyagarajh_db_user:PzdfAaltO5XUurrX@cluster0.39sdapk.mongodb.net/TestDB"
    ); //Replace with your own connection string
    console.log("conneted to Database.....");
  } catch (error) {
    console.log(error);
  }
};
export default connetDB;
//Change the Schema and Model as per the requirements or Qustion
// Here we are creating Item Schema and Model
import mongoose from "mongoose";
const itemSchema = mongoose.Schema({
  name: { type: String  },
  category: { type: String },
  price: { type: Number },
  stockQuantity: {type: Number}, 
  description: { type: String },
  username: { type: String },
  password: { type: String },
  role: { type: String, enum:['admin','user']},
});
const itemModel = mongoose.model("Items", itemSchema);
export default itemModel;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
  fullName: { type: String, required: true, index: true, },
  phone: { type: String, required: true, index: true, unique: true,dropDups: true },
  email: { type: String, required: true, index: true, unique: true,dropDups: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["admin", "psp", "staff", "qa", "coordinator", "terminal"] },
  company: { type: String },
  address: { type: String },
  state: { type: String },
  pspInfo: {
    states:{type:[String]},
    disbursment:{type:Number,default:0},
    paypoint:{type:Number},
    totalBeneficiaries:{type:Number},
    beneficiariesPaid:{type:Number},
  },
  status: { type: String, enum: ["active", "suspended", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
})
module.exports = mongoose.model("User", userSchema);




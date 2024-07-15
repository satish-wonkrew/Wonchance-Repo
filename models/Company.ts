import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyImage: { type: String},
    companyType: { type: String},
    categories: { type: [String]},
    ownerFirstName: { type: String},
    ownerLastName: { type: String},
    ownerPhoneNumber: { type: String},
    ownerEmailId: { type: String},
    selectCompanyUser:{type:[String]},
    selectCompanyUserID:{type:[String]},
    createrId: { type: String},
  
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;

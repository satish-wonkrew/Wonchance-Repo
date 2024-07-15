import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true },
    roleDescription: { type: String},
    projectName: { type: String},
    projectNameId: { type: String},
    ageMin: { type: String},
    ageMax: { type: String},
    roleGender: { type: [String]},
    roleSkinType: { type: [String]},
    roleBodyType: { type: [String]},
    noOfOpenings: { type: Number},
    openingsClosed: { type: Number},   
    roleCreaterId: { type: String},
  },
  { timestamps: true }
);

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

export default Role;

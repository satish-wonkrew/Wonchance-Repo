import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectImage: { type: String},
    companyType:{type:[String]},
    companyTypeId:{type:[String]},
    description: { type: String},
    category:{type: String},
    genre:{type:[String]},
    startDate:{type: Date},
    endDate:{type: Date},
    selectUser:{type:[String]},
    selectUserID:{type:[String]},
    projectCreaterId: { type: String},
  
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;

import mongoose from 'mongoose';

const castingSchema = new mongoose.Schema(
  {
    castingTitle: { type: String, required: true },
    roleTypes: { type: [String] },
    roleTypesId: { type: [String] },
    shootDate: { type: Date },
    lastDate: { type: Date },
    castingCreaterId: { type: String},
    appliedTalentsId: {type:Array},
  },
  { timestamps: true }
);

const Casting = mongoose.models.Casting || mongoose.model('Casting', castingSchema);

export default Casting;

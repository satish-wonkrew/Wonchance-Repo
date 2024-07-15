import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    //Basic Details
    whatsappNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email:{
      type: String,
      unique: true,
      sparse: true,
      default: null,
      },
    statusLevel:{
      type: String,
      default: 'pending',
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    screenName: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "talent",
    },
    gender: {
      type: String,
      default:"",
    },
    profile: { 
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    age: {
      type: Number,
      default: null, // Age will be automatically calculated based on dateOfBirth
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    faceCloseupPicture:{
      type: String,
      default: "",
    },
    faceReactionVideo:{
      type: String,
      default: "",
    },
    gallery: {
      type: Array,
      validate: [arrayLimit, '{PATH} exceeds the limit of 30'],
    },
    facePicGallery: {
      type: Array,
    },
    videoGallery: {
      type: Array,
    },
    sampleVideoUrl: {
      type: String,
      default: "",
    },
    fathersName:{
      type: String,
      default: "",
    },
    mothersName:{
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      default: "",
    },
    maritalStatus: {
      type: String,
      default: "",
    },
    educationalQualification: {
      type: String,
      default: "",
    },
    ReceiveNotificationonWhatsApp:{
      type: String,
      default: "",
    },
    nativeState:{
      type: String,
      default: "",
    },
    nationality:{
      type: String,
      default: "",
    },
    nativePlace: {
      type: String,
      default: "",
    },
    currentCity:{
      type: String,
      default: "",
    },
    address:{
      type: String,
      default: "",
    },
    speakingLanguages:{
      type: [String],
        default: "",
    },
    readingLanguages:{
      type: [String],
        default: "",
    },
    bookMark:{
      type:Array,
      default:"",
    },
    heart:{
      type: String,
      default: 'unfollow',
    },
    profileViewers:{
      type: [String],
    },

    //Physical Details
    height:{
      type: Number,
      default: "",
    },
    weight:{
      type: Number,
      default: "",
    },
    chest:{
      type: Number,
      default: "",
    },
    bust:{
      type: Number,
      default: "",
    },
    waist:{
      type: Number,
      default: "",
    },
    hips:{
      type: Number,
      default: "",
    },
    bodyShape:{
      type: String,
      default: "",
    },
    bodyType:{
      type: String,
      default: "",
    },
    skinTone:{
      type: String,
      default: "",
    },
    eyeColor:{
      type: String,
      default: "",
    },
    hairColor:{
      type: String,
      default: "",
    },
    tattoo:{
      type: String,
      default: "",
    },
    shoeSize:{
      type: Number,
      default: "",
    },

    //Work Details
    movies:{
      type: String,
      default: "",
    },
    internationalMovie:{
      type: String,
      default: "",
    },
    achievement:{
      type: String,
      default: "",
    },
    workLinks:{
      type: String,
      default: "",
    },
    workingUpcomingProjects:{
      type: String,
      default: "",
    },
    experience:{
      type: String,
      default: "",
    },
    shootPricePerDay:{
      type: String,
      default: "",
    },

    //Skill Details
    singing:{
      type: [String],
      default: "",
    },
    danceStyle:{
      type: [String],
      default: "",
    },
    driving:{
      type: [String],
      default: "",
    },
    martialArts:{
      type: [String],
      default: "",
    },
    waterActivities:{
      type: [String],
      default: "",
    },

  //Social Media
    instagramLink:{
      type: String,
      default: "",
    },
    twitterLink:{
      type: String,
      default: "",
    },
    facebookLink:{
      type: String,
      default: "",
    },
    youTubeLink:{
      type: String,
      default: "",
    },


    //Interests
    interestedMedia:{
      type: [String],
      default: "",
    },

    //Men
    comfortableWithMen:{
      type: [String],
      default: "",
    },
    interestedRoleMen:{
      type: [String],
      default: "",
    },
    comfortableClothingMen:{
      type: [String],
      default: "",
    },

    //Women
    comfortableWithWomen:{
      type: [String],
      default: "",
    },
    interestedRoleWomen:{
      type: [String],
      default: "",
    },
    comfortableClothingWomen:{
      type: [String],
      default: "",
    },
    interestedShootWomen:{
      type: [String],
      default: "",
    },
    //Adult Others
    comfortableWithOthers:{
      type: [String],
      default: "",
    },
    interestedRoleOthers:{
      type: [String],
      default: "",
    },
    comfortableClothingOthers:{
      type: [String],
      default: "",
    },

    //Kids
    comfortableWithKids:{
      type: [String],
      default: "",
    },

    //Kids Male
    comfortableClothingKidMale:{
      type: [String],
      default: "",
    },
     //Kids Female
     comfortableClothingKidFemale:{
       type: [String],
       default: "",
     },



  },
  {
    timestamps: true,
  }
);

// Custom Image validator function
function arrayLimit(val: string) {
  return val.length <= 30;
}
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;


export interface UserDetails {
  //Basic Details
  whatsappNumber: string;  // WhatsApp number, presumably unique and required
  _id?:object;
  statusLevel?:string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  screenName?: string;
  email?: string;
  role?: string;
  gender?: string;
  profile?: string;  
  dateOfBirth?: Date;
  age?: number;
  profilePictureUrl?: string; 
  faceCloseupPicture?: string; 
  faceReactionVideo?: string; 
  gallery?:string[];
  facePicGallery?:string[];
  videoGallery?:string[],
  sampleVideoUrl?: string; 
  fathersName?: string;
  mothersName?: string;
  experienceLevel?: string;
  maritalStatus?: string;
  educationalQualification?: string;
  ReceiveNotificationonWhatsApp?: string;
  nativeState?: string;
  nationality?: string;
  nativePlace?: string;
  currentCity?: string;
  address?: string;
  speakingLanguages?: string[];
  readingLanguages?: string[];
  bookMark?: string[];
  heart?: string;
  profileViewers?:number;


  //Physical Details
  height?: number;
  weight?: number;
  chest?: number;
  bust?: number;
  waist?: number;
  hips?: number;
  bodyShape?: string;
  bodyType?: string;
  skinTone?: string;
  eyeColor?: string;
  hairColor?: string;
  tattoo?: string;
  shoeSize?: number;

  //Work Details
  movies?: string;
  internationalMovie?: string;
  achievement?: string;
  workLinks?: string;
  workingUpcomingProjects?: string;
  experience?: string;
  shootPricePerDay?: string;

  //Skill Details
  singing?: string[];
  danceStyle?: string[];
  driving?: string[];
  martialArts?: string[];
  waterActivities?: string[];

  //Social Media
  instagramLink?: string;
  twitterLink?: string;
  facebookLink?: string;
  youTubeLink?: string;

  //Interests
  //Interested In
  interestedMedia?: string[];
  //Men
  comfortableWithMen?: string[];
  interestedRoleMen?: string[];
  comfortableClothingMen?: string[];
  //Women
  comfortableWithWomen?: string[];
  interestedRoleWomen?: string[];
  comfortableClothingWomen?: string[];
  interestedShootWomen?:string[];
  //Others
  comfortableWithOthers?:string[];
  interestedRoleOthers?:string[];
  comfortableClothingOthers?:string[];
  //Kid
  comfortableWithKids?:string[];
  //Kids Male
  comfortableClothingKidMale?:string[];
   //Kids Female
   comfortableClothingKidFemale?:string[];

  }
  
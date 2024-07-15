import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

interface UpdateProfileRequest extends NextApiRequest {
  body: {
    whatsappNumber: string; // WhatsApp number, presumably unique and required
    statusLevel?:string;
    firstName?: string;
    lastName?: string;
    screenName?: string;
    email?: string;
    role?: string;
    gender?: string;
    profile?: string;
    dateOfBirth?: string;
    age?: string;
    profilePictureUrl?: string;
    faceCloseupPicture?: string; 
    faceReactionVideo?: string; 
    gallery?: string[];
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
    bookMark?:  string[];
  
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
    shoeSize?: string;
  
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

    [key: string]: any;
  };
}

const handler = async (req: UpdateProfileRequest, res: NextApiResponse) => {
  const { whatsappNumber, ...updates } = req.body;

  console.log("Connecting to database...");
  await dbConnect();

  console.log("Received update request for:", whatsappNumber);
  console.log("Updates to apply:", updates);

  try {
    console.log("Attempting to update user...");
    const user = await User.findOneAndUpdate({ whatsappNumber }, { $set: updates }, { new: true });
    if (!user) {
      console.log("No user found with WhatsApp Number:", whatsappNumber);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Update successful, updated user:", user);
    res.status(200).json(user);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown server error';
    console.error("Error during database operation:", errorMsg);
    res.status(500).json({ message: 'Failed to update user', error: errorMsg });
  }
};

export default handler;



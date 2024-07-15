import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        whatsappNumber: { label: "WhatsApp Number", type: "text", placeholder: "+1234567890" },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        if (!credentials) return null;

        const user = await User.findOne({
          whatsappNumber: credentials.whatsappNumber,
        });

        if (user) {
          return {
            id: user.id.toString(),
            //Basic Details
            whatsappNumber: user.whatsappNumber,
            _id: user._id,
            statusLevel: user.statusLevel,
            createdAt: user.createdAt,
            updatedAt:user.updatedAt,
            firstName: user.firstName,
            lastName: user.lastName,
            screenName:user.screenName,
            email: user.email,
            role:user.role,
            gender: user.gender,
            profile:user.profile,
            dateOfBirth: user.dateOfBirth,
            age:user.age,
            profilePictureUrl: user.profilePictureUrl,
            faceCloseupPicture:user.faceCloseupPicture,
            faceReactionVideo:user.faceReactionVideo,
            gallery:user.gallery,
            facePicGallery:user.facePicGallery,
            videoGallery:user.videoGallery,
            sampleVideoUrl: user.sampleVideoUrl,
            fathersName:user.fathersName,
            mothersName:user.mothersName,
            experienceLevel:user.experienceLevel,
            maritalStatus:user.maritalStatus,
            educationalQualification:user.educationalQualification,
            ReceiveNotificationonWhatsApp:user.ReceiveNotificationonWhatsApp,
            nativeState:user.nativeState,
            nationality:user.nationality,
            nativePlace:user.nativePlace,
            currentCity:user.currentCity,
            address:user.address,
            speakingLanguages:user.speakingLanguages,
            readingLanguages:user.readingLanguages,
            bookMark:user.bookMark,
            heart: user.heart,
            profileViewers:user.profileViewers,

            //Physical Details
            height:user.height,
            weight:user.weight,
            chest:user.chest,
            bust:user.bust,
            waist:user.waist,
            hips:user.hips,
            bodyShape:user.bodyShape,
            bodyType:user.bodyType,
            skinTone:user.skinTone,
            eyeColor:user.eyeColor,
            hairColor:user.hairColor,
            tattoo:user.tattoo,
            shoeSize:user.shoeSize,

            //Work Details
            movies:user.movies,
            internationalMovie:user.internationalMovie,
            achievement:user.achievement,
            workLinks:user.workLinks,
            workingUpcomingProjects:user.workingUpcomingProjects,
            experience:user.experience,
            shootPricePerDay:user.shootPricePerDay,

            //Skill Details
            singing:user.singing,
            danceStyle:user.danceStyle,
            driving:user.driving,
            martialArts:user.martialArts,
            waterActivities:user.waterActivities,

            //Social Media
            instagramLink:user.instagramLink,
            twitterLink:user.twitterLink,
            facebookLink:user.facebookLink,
            youTubeLink:user.youTubeLink,

            //Interests
            //Interested In
            interestedMedia:user.interestedMedia,
            //Men
            comfortableWithMen: user.comfortableWithMen,
            interestedRoleMen: user.interestedRoleMen,
            comfortableClothingMen: user.comfortableClothingMen,
            //Women
            comfortableWithWomen: user.comfortableWithWomen,
            interestedRoleWomen: user.interestedRoleWomen,
            comfortableClothingWomen: user.comfortableClothingWomen,
            interestedShootWomen: user.interestedShootWomen ,
            //Others
            comfortableWithOthers: user.comfortableWithOthers,
            interestedRoleOthers: user.interestedRoleOthers ,
            comfortableClothingOthers: user.comfortableClothingOthers,
            //Kid
            comfortableWithKids: user.comfortableWithKids ,
            //Kids Male
            comfortableClothingKidMale: user.comfortableClothingKidMale ,
             //Kids Female
            comfortableClothingKidFemale: user.comfortableClothingKidFemale ,

         };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      await dbConnect();
      
      if (token && token.whatsappNumber) {
        const user = await User.findOne({ whatsappNumber: token.whatsappNumber });

        if (user) {
          session.user = {
            id: user.id.toString(),
            whatsappNumber: user.whatsappNumber,
            _id: user._id,
            statusLevel: user.statusLevel,
            createdAt: user.createdAt,
            updatedAt:user.updatedAt,
            firstName: user.firstName,
            lastName: user.lastName,
            screenName:user.screenName,
            email: user.email,
            role:user.role,
            profile:user.profile,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            age:user.age,
            profilePictureUrl: user.profilePictureUrl,
            faceCloseupPicture:user.faceCloseupPicture,
            faceReactionVideo:user.faceReactionVideo,
            gallery:user.gallery,
            facePicGallery:user.facePicGallery,
            videoGallery:user.videoGallery,
            sampleVideoUrl: user.sampleVideoUrl,
            fathersName:user.fathersName,
            mothersName:user.mothersName,
            experienceLevel:user.experienceLevel,
            maritalStatus:user.maritalStatus,
            educationalQualification:user.educationalQualification,
            ReceiveNotificationonWhatsApp:user.ReceiveNotificationonWhatsApp,
            nativeState:user.nativeState,
            nationality:user.nationality,
            nativePlace:user.nativePlace,
            currentCity:user.currentCity,
            address:user.address,
            speakingLanguages:user.speakingLanguages,
            readingLanguages:user.readingLanguages,
            bookMark:user.bookMark,
            heart: user.heart,
            profileViewers:user.profileViewers,

            //Physical Details
            height:user.height,
            weight:user.weight,
            chest:user.chest,
            bust:user.bust,
            waist:user.waist,
            hips:user.hips,
            bodyShape:user.bodyShape,
            bodyType:user.bodyType,
            skinTone:user.skinTone,
            eyeColor:user.eyeColor,
            hairColor:user.hairColor,
            tattoo:user.tattoo,
            shoeSize:user.shoeSize,

            //Work Details
            movies:user.movies,
            internationalMovie:user.internationalMovie,
            achievement:user.achievement,
            workLinks:user.workLinks,
            workingUpcomingProjects:user.workingUpcomingProjects,
            experience:user.experience,
            shootPricePerDay:user.shootPricePerDay,

            //Skill Details
            singing:user.singing,
            danceStyle:user.danceStyle,
            driving:user.driving,
            martialArts:user.martialArts,
            waterActivities:user.waterActivities,

            //Social Media
            instagramLink:user.instagramLink,
            twitterLink:user.twitterLink,
            facebookLink:user.facebookLink,
            youTubeLink:user.youTubeLink,

            //Interests
            //Interested In
            interestedMedia:user.interestedMedia,
            //Men
            comfortableWithMen: user.comfortableWithMen,
            interestedRoleMen: user.interestedRoleMen,
            comfortableClothingMen: user.comfortableClothingMen,
            //Women
            comfortableWithWomen: user.comfortableWithWomen,
            interestedRoleWomen: user.interestedRoleWomen,
            comfortableClothingWomen: user.comfortableClothingWomen,
            interestedShootWomen: user.interestedShootWomen ,
            //Others
            comfortableWithOthers: user.comfortableWithOthers,
            interestedRoleOthers: user.interestedRoleOthers ,
            comfortableClothingOthers: user.comfortableClothingOthers,
            //Kid
            comfortableWithKids: user.comfortableWithKids ,
            //Kids Male
            comfortableClothingKidMale: user.comfortableClothingKidMale ,
             //Kids Female
            comfortableClothingKidFemale: user.comfortableClothingKidFemale ,
          };
        }
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.whatsappNumber = user.whatsappNumber;
      }
      return token;
    },
  }
});

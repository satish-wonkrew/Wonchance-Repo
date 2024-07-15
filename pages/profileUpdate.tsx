import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Select from "react-select";
import { FaTimes } from 'react-icons/fa';
import CloseFacePic from '../components/CloseFacePicEdit';
import FaceReactionVideoEdit from '../components/FaceReactionVideoEdit';
import Image from 'next/image';


type UserDetails = {
  whatsappNumber: string; // WhatsApp number, presumably unique and required
  statusLevel?:string;
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
  gallery: string[];
  facePicGallery: string[];
  videoGallery: string[];
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
};

// Define the props for the InputField component
interface InputFieldProps {
  label: string;
  value: string | number;
  field: keyof UserDetails;
  handleChange: (
    field: keyof UserDetails,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleBlur: (field: keyof UserDetails, value: string | number) => void;
  type?: string | number;
}

// Define the props for the MultiSelectField component
interface MultiSelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  field: keyof UserDetails;
  handleChange: (field: keyof UserDetails, value: string[]) => void;
}

const Profile = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    whatsappNumber: "", // WhatsApp number, presumably unique and required
    statusLevel:"",
    firstName: "",
    lastName: "",
    screenName: "",
    email: "",
    role: "",
    gender: "",
    profile: "",
    dateOfBirth: undefined,
    age: undefined,
    profilePictureUrl: "",
    gallery: [],
    facePicGallery: [],
    videoGallery: [],
    sampleVideoUrl: "",
    fathersName: "",
    mothersName: "",
    experienceLevel: "",
    maritalStatus: "",
    educationalQualification: "",
    ReceiveNotificationonWhatsApp: "",
    nativeState: "",
    nationality: "",
    nativePlace: "",
    currentCity: "",
    address: "",
    speakingLanguages: [],
    readingLanguages: [],

    //Physical Details
    height: Number(""),
    weight: Number(""),
    chest: Number(""),
    bust: Number(""),
    waist: Number(""),
    hips: Number(""),
    bodyShape: "",
    bodyType: "",
    skinTone: "",
    eyeColor: "",
    hairColor: "",
    tattoo: "",
    shoeSize: "",

    //Work Details
    movies: "",
    internationalMovie: "",
    achievement: "",
    workLinks: "",
    workingUpcomingProjects: "",
    experience: "",
    shootPricePerDay: "",

    //Skill Details
    singing: [],
    danceStyle: [],
    driving: [],
    martialArts: [],
    waterActivities: [],

    //Social Media
    instagramLink: "",
    twitterLink: "",
    facebookLink: "",
    youTubeLink: "",

    //Interests
    //Interested In
    interestedMedia: [],
    //Men
    comfortableWithMen: [],
    interestedRoleMen: [],
    comfortableClothingMen: [],
    //Women
    comfortableWithWomen: [],
    interestedRoleWomen: [],
    comfortableClothingWomen: [],
    interestedShootWomen: [],
    //Others
    comfortableWithOthers: [],
    interestedRoleOthers: [],
    comfortableClothingOthers: [],
    //Kid
    comfortableWithKids: [],
    //Kids Male
    comfortableClothingKidMale: [],
    //Kids Female
    comfortableClothingKidFemale: [],
  });
  const [activeTab, setActiveTab] = useState<string>('basic');

  // For profile picture And Gallery
  const [profilePictureError, setProfilePictureError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [facePicGalleryError, setFacePicGalleryError] = useState<string | null>(null);
  const [videoGalleryError, setVideoGalleryError] = useState<string | null>(null);



  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        whatsappNumber: session.user.whatsappNumber || "",
        statusLevel:session.user.statusLevel || "",
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        screenName: session.user.screenName || "",
        email: session.user.email || "",
        gender: session.user.gender || "",
        profile: session.user.profile || "",
        dateOfBirth: session.user.dateOfBirth || undefined,
        age: session.user.age || undefined,
        profilePictureUrl: session.user.profilePictureUrl || "",
        gallery: session.user.gallery || [],
        facePicGallery: session.user.facePicGallery || [],
        videoGallery: session.user.videoGallery || [],
        sampleVideoUrl: session.user.sampleVideoUrl || "",
        fathersName: session.user.fathersName || "",
        mothersName: session.user.mothersName || "",
        experienceLevel: session.user.experienceLevel || "",
        maritalStatus: session.user.maritalStatus || "",
        educationalQualification: session.user.educationalQualification || "",
        ReceiveNotificationonWhatsApp:
        session.user.ReceiveNotificationonWhatsApp || "",
        nativeState: session.user.nativeState || "",
        nationality: session.user.nationality || "",
        nativePlace: session.user.nativePlace || "",
        currentCity: session.user.currentCity || "",
        address: session.user.address || "",
        speakingLanguages: session.user.speakingLanguages || [],
        readingLanguages: session.user.readingLanguages || [],

        //Physical Details
        height: session.user.height || Number(""),
        weight: session.user.weight || Number(""),
        chest: session.user.chest || Number(""),
        bust: session.user.bust || Number(""),
        waist: session.user.waist || Number(""),
        hips: session.user.hips || Number(""),
        bodyShape: session.user.bodyShape || "",
        bodyType: session.user.bodyType || "",
        skinTone: session.user.skinTone || "",
        eyeColor: session.user.eyeColor || "",
        hairColor: session.user.hairColor || "",
        tattoo: session.user.tattoo || "",
        shoeSize: session.user.shoeSize || "",

        //Work Details
        movies: session.user.movies || "",
        internationalMovie: session.user.internationalMovie || "",
        achievement: session.user.achievement || "",
        workLinks: session.user.workLinks || "",
        workingUpcomingProjects: session.user.workingUpcomingProjects || "",
        experience: session.user.experience || "",
        shootPricePerDay: session.user.shootPricePerDay || "",

        //Skill Details
        singing: session.user.singing || [],
        danceStyle: session.user.danceStyle || [],
        driving: session.user.driving || [],
        martialArts: session.user.martialArts || [],
        waterActivities: session.user.waterActivities || [],

        //Social Media
        instagramLink: session.user.instagramLink || "",
        twitterLink: session.user.twitterLink || "",
        facebookLink: session.user.facebookLink || "",
        youTubeLink: session.user.youTubeLink || "",


        //Interests
        //Interested In
        interestedMedia: session.user.interestedMedia || [],
        //Men
        comfortableWithMen: session.user.comfortableWithMen || [],
        interestedRoleMen: session.user.interestedRoleMen || [],
        comfortableClothingMen: session.user.comfortableClothingMen || [],
        //Women
        comfortableWithWomen: session.user.comfortableWithWomen || [],
        interestedRoleWomen: session.user.interestedRoleWomen || [],
        comfortableClothingWomen: session.user.comfortableClothingWomen || [],
        interestedShootWomen: session.user.interestedShootWomen || [],
        //Others
        comfortableWithOthers: session.user.comfortableWithOthers || [],
        interestedRoleOthers: session.user.interestedRoleOthers || [],
        comfortableClothingOthers: session.user.comfortableClothingOthers || [],
        //Kid
        comfortableWithKids: session.user.comfortableWithKids || [],
        //Kids Male
        comfortableClothingKidMale: session.user.comfortableClothingKidMale || [],
         //Kids Female
         comfortableClothingKidFemale: session.user.comfortableClothingKidFemale || [],
        
      });
    }
  }, [session]);

  
  //Date field
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Converts to "yyyy-MM-dd" format
  };

  //Input field changes
  const handleFieldChange = debounce(
    async (field: keyof UserDetails, value: string | number | string[]) => {
      setUserDetails((prev) => ({ ...prev, [field]: value }));
      if (session?.user) {
        await axios.post("/api/updateProfile", {
          whatsappNumber: session.user.whatsappNumber,
          [field]: value,
        });
      }
    },
    500
  );

  //Input field files changes
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (file.size >10 * 1024 * 1024) {
      setProfilePictureError('File size should be below 1MB');
      return;
    } else {
      setProfilePictureError(null);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 && response.data.url) {
        console.log('File uploaded successfully', response.data.url);
        setUserDetails(prev => ({ ...prev, profilePictureUrl: response.data.url }));
        if (session?.user) {
          const updateResponse = await axios.post('/api/updateProfile', {
            whatsappNumber: session.user.whatsappNumber,
            profilePictureUrl: response.data.url,
          });
          if (updateResponse.status === 200) {
            console.log('Profile updated successfully with new image URL');
          } else {
            console.error('Failed to update profile with new image URL');
          }
        }
      } else {
        console.error('Failed to upload file', response.data);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setUserDetails(prev => ({ ...prev, profilePictureUrl: '' }));
    if (session?.user) {
      const updateResponse = await axios.post('/api/updateProfile', {
        whatsappNumber: session.user.whatsappNumber,
        profilePictureUrl: '',
      });
      if (updateResponse.status === 200) {
        console.log('Profile picture removed successfully');
      } else {
        console.error('Failed to remove profile picture');
      }
    }
  };

  //Gallery Change
  const handleGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    const galleryUrls: string[] = [];

    for (const file of files) {
      if (file.size >10 * 1024 * 1024) {
        setGalleryError('Each file size should be below 1MB');
        return;
      } else {
        setGalleryError(null);
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200 && response.data.url) {
          galleryUrls.push(response.data.url);
        } else {
          console.error('Failed to upload file', response.data);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (galleryUrls.length > 0) {
      setUserDetails(prev => ({ ...prev, gallery: [...prev.gallery, ...galleryUrls] }));
      if (session?.user) {
        const updateResponse = await axios.post('/api/updateProfile', {
          whatsappNumber: session.user.whatsappNumber,
          gallery: [...userDetails.gallery, ...galleryUrls],
        });
        if (updateResponse.status === 200) {
          console.log('Gallery updated successfully');
        } else {
          console.error('Failed to update gallery');
        }
      }
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const updatedGallery = [...userDetails.gallery];
    updatedGallery.splice(index, 1);
    setUserDetails(prev => ({ ...prev, gallery: updatedGallery }));
    if (session?.user) {
      const updateResponse = await axios.post('/api/updateProfile', {
        whatsappNumber: session.user.whatsappNumber,
        gallery: updatedGallery,
      });
      if (updateResponse.status === 200) {
        console.log('Gallery image removed successfully');
      } else {
        console.error('Failed to remove gallery image');
      }
    }
  };

   // Handle Face Pic Gallery Change
   const handleFacePicGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    const facePicGalleryUrls: string[] = [];

    for (const file of files) {
      if (file.size >10 * 1024 * 1024) {
        setFacePicGalleryError('Each file size should be below 1MB');
        return;
      } else {
        setFacePicGalleryError(null);
      }

      const formData = new FormData();
      formData.append('file', file);

      
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200 && response.data.url) {
          facePicGalleryUrls.push(response.data.url);
        } else {
          console.error('Failed to upload file', response.data);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (facePicGalleryUrls.length > 0) {
      const updatedGallery = [...userDetails.facePicGallery, ...facePicGalleryUrls];
      setUserDetails(prev => ({ ...prev, facePicGallery: updatedGallery }));

      if (session?.user) {
        try {
          const updateResponsePic = await axios.post('/api/updateProfile', {
            whatsappNumber: session.user.whatsappNumber,
            facePicGallery: updatedGallery,
          });
          if (updateResponsePic.status === 200) {
            console.log('Face Pic Gallery updated successfully');
          } else {
            console.error('Failed to update Face Pic Gallery');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    }
  };

  const handleRemoveFacePicGalleryImage = async (index: number) => {
    const updatedFacePicGallery = [...userDetails.facePicGallery];
    updatedFacePicGallery.splice(index, 1);
    setUserDetails(prev => ({ ...prev, facePicGallery: updatedFacePicGallery }));

    if (session?.user) {
      try {
        const updateResponsePic = await axios.post('/api/updateProfile', {
          whatsappNumber: session.user.whatsappNumber,
          facePicGallery: updatedFacePicGallery,
        });
        if (updateResponsePic.status === 200) {
          console.log('Face Pic Gallery image removed successfully');
        } else {
          console.error('Failed to remove Face Pic Gallery image');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

   // Handle Video Gallery Change
   const handleVideoGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    const videoGalleryUrls: string[] = [];

    for (const file of files) {
      if (file.size >10* 10 * 1024 * 1024) {
        setVideoGalleryError('Each file size should be below 10MB');
        return;
      } else {
        setVideoGalleryError(null);
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200 && response.data.url) {
          videoGalleryUrls.push(response.data.url);
        } else {
          console.error('Failed to upload file', response.data);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (videoGalleryUrls.length > 0) {
      const updatedGallery = [...userDetails.videoGallery, ...videoGalleryUrls];
      setUserDetails(prev => ({ ...prev, videoGallery: updatedGallery }));

      if (session?.user) {
        try {
          const updateResponsePic = await axios.post('/api/updateProfile', {
            whatsappNumber: session.user.whatsappNumber,
            videoGallery: updatedGallery,
          });
          if (updateResponsePic.status === 200) {
            console.log('Video Gallery updated successfully');
          } else {
            console.error('Failed to update Video Gallery');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    }
  };

  const handleRemoveVideoGalleryItem = async (index: number) => {
    const updatedVideoGallery = [...userDetails.videoGallery];
    updatedVideoGallery.splice(index, 1);
    setUserDetails(prev => ({ ...prev, videoGallery: updatedVideoGallery }));

    if (session?.user) {
      try {
        const updateResponsePic = await axios.post('/api/updateProfile', {
          whatsappNumber: session.user.whatsappNumber,
          videoGallery: updatedVideoGallery,
        });
        if (updateResponsePic.status === 200) {
          console.log('Video Gallery item removed successfully');
        } else {
          console.error('Failed to remove Video Gallery item');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };


  //Handle Blur
  const handleBlur = (field: keyof UserDetails, value: string | number) => {
    handleFieldChange(field, value);
  };

  //Multi Select
  const handleMultiSelectChange = (
    field: keyof UserDetails,
    values: string[]
  ) => {
    handleFieldChange(field, values);
  };



  //Handle Change
  const handleChange = (
    field: keyof UserDetails,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  if (!session) return <div><p>You are not signed in.</p></div>;

  return (
    <div>
    <div className='profile-update'>
      <h1>My Profile</h1>
      <h1>whatsappNumber: {userDetails.whatsappNumber}</h1>
      <h1>Profile Status: {userDetails.statusLevel}</h1>
      <div style={{ marginBottom: '20px' }} >
        <button onClick={() => setActiveTab('basic')} className='bg-blue-500 inline p-2 m-1 text-white'>Basic Details</button>
        <button onClick={() => setActiveTab('media')}className='bg-blue-500 inline p-2 m-1 text-white'>Media</button>
        <button onClick={() => setActiveTab('physical')}className='bg-blue-500 inline p-2 m-1 text-white'>Physical Details</button>
        <button onClick={() => setActiveTab('work')}className='bg-blue-500 inline p-2 m-1 text-white'>Work Details</button>
        <button onClick={() => setActiveTab('skills')}className='bg-blue-500 inline p-2 m-1 text-white'>Skill Details</button>
        <button onClick={() => setActiveTab('social')}className='bg-blue-500 inline p-2 m-1 text-white'>Social Media</button>
        <button onClick={() => setActiveTab('interests')}className='bg-blue-500 inline p-2 m-1 text-white'>Interests</button>


      </div>
      {/* Basic Detils *******************************************************************************************************************/}
      {activeTab === 'basic' && (
        <form className="profile-form">
 
          <InputField label="First Name" 
           value={userDetails.firstName as string}
            field="firstName" handleChange={handleChange} handleBlur={handleBlur} />
          <InputField label="Last Name" value={userDetails.lastName as string} field="lastName" handleChange={handleChange} handleBlur={handleBlur} />
          <InputField label="email" value={userDetails.email as string} field="email" handleChange={handleChange} handleBlur={handleBlur} />

          {/* Select Field */}
          <div>
              <label className="update-label" htmlFor="profile">Profile:</label>
              <select
                id="profile"
                className='update-input'
                value={userDetails.profile}
                onChange={(e) => handleChange("profile", e)}
                onBlur={() =>
                  handleBlur(
                    "profile",
                    userDetails.profile as string
                  )
                }
              >
                <option value="">Select Profile</option>
                <option value="adult">Adult</option>
                <option value="kid">Kid</option>
              </select>
            </div>

             {/* Select Field */}
          <div>
              <label className="update-label" htmlFor="gender">Gender:</label>
              <select
               className="update-input"
                id="gender"
                value={userDetails.gender}
                onChange={(e) => handleChange("gender", e)}
                onBlur={() =>
                  handleBlur(
                    "gender",
                    userDetails.gender as string
                  )
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

          {/* Select Field */}
          <div>
              <label className="update-label" htmlFor="experienceLevel">Experience Level:</label>
              <select
                id="experienceLevel"
                 className="update-input"
                value={userDetails.experienceLevel}
                onChange={(e) => handleChange("experienceLevel", e)}
                onBlur={() =>
                  handleBlur(
                    "experienceLevel",
                    userDetails.experienceLevel as string
                  )
                }
              >
                <option value="">Select Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>
            
            <InputField
              label="Screen Name"
              value={userDetails.screenName as string}
              field="screenName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />    

          

            <InputField
              label="Sample Video URL"
              value={userDetails.sampleVideoUrl as string}
              field="sampleVideoUrl"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

           {userDetails.profile === 'kid' ? (
           <>
            <InputField
              label="Fathers Name"
              value={userDetails.fathersName as string}
              field="fathersName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Mothers Name"
              value={userDetails.mothersName as string}
              field="mothersName"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            </>
             ) : (
            <>

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="maritalStatus">Marital Status:</label>
              <select
               className='update-input'
                id="maritalStatus"
                value={userDetails.maritalStatus}
                onChange={(e) => handleChange("maritalStatus", e)}
                onBlur={() =>
                  handleBlur(
                    "maritalStatus",
                    userDetails.maritalStatus as string
                  )
                }
              >
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widow">Widow</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>

            <InputField
              label="Educational Qualification"
              value={userDetails.educationalQualification as string}
              field="educationalQualification"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

             </>
              )}

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="nativeState">Native State:</label>
              <select
               className='update-input'
                id="nativeState"
                value={userDetails.nativeState}
                onChange={(e) => handleChange("nativeState", e)}
                onBlur={() =>
                  handleBlur("nativeState", userDetails.nativeState as string)
                }
              >
                <option value="">Native State</option>
                <option value="andhra_pradesh">Andhra Pradesh</option>
                <option value="arunachal_pradesh">Arunachal Pradesh</option>
                <option value="assam">Assam</option>
                <option value="bihar">Bihar</option>
                <option value="chhattisgarh">Chhattisgarh</option>
                <option value="goa">Goa</option>
                <option value="gujarat">Gujarat</option>
                <option value="haryana">Haryana</option>
                <option value="himachal_pradesh">Himachal Pradesh</option>
                <option value="jharkhand">Jharkhand</option>
                <option value="karnataka">Karnataka</option>
                <option value="kerala">Kerala</option>
                <option value="madhya_pradesh">Madhya Pradesh</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="manipur">Manipur</option>
                <option value="meghalaya">Meghalaya</option>
                <option value="mizoram">Mizoram</option>
                <option value="nagaland">Nagaland</option>
                <option value="odisha">Odisha</option>
                <option value="punjab">Punjab</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="sikkim">Sikkim</option>
                <option value="tamil_nadu">Tamil Nadu</option>
                <option value="telangana">Telangana</option>
                <option value="tripura">Tripura</option>
                <option value="uttar_pradesh">Uttar Pradesh</option>
                <option value="uttarakhand">Uttarakhand</option>
                <option value="west_bengal">West Bengal</option>
              </select>
            </div>

             {/* Select Field */}
             <div>
              <label className="update-label" htmlFor="nationality">Nationality :</label>
              <select
                id="nationality"
                 className='update-input'
                value={userDetails.nationality}
                onChange={(e) => handleChange("nationality", e)}
                onBlur={() =>
                  handleBlur(
                    "nationality",
                    userDetails.nationality as string
                  )
                }
              >
                <option value="">Select Nationality</option>
                <option value="indian">Indian</option>
                <option value="usa">USA</option>
                <option value="uk">UK</option>
                <option value="uae">UAE</option>
              </select>
            </div>

            
            <InputField
              label="Native Place"
              value={userDetails.nativePlace as string}
              field="nativePlace"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Current City"
              value={userDetails.currentCity as string}
              field="currentCity"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Address"
              value={userDetails.address as string}
              field="address"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />


            {/* Multi Select Field */}
            <MultiSelectField
              label="Speaking Languages"
              options={[
                { value: "english", label: "English" },
                { value: "tamil", label: "Tamil" },
                { value: "hindi", label: "Hindi" },
                { value: "kannada", label: "Kannada" },
                { value: "marathi", label: "Marathi" },
                { value: "telugu", label: "Telugu" },
                { value: "malayalam", label: "Malayalam" },
                { value: "punjabi", label: "Punjabi" },
                { value: "bengali", label: "Bengali" },
                { value: "urdu", label: "Urdu" },
                { value: "oriya", label: "Oriya" },
                { value: "spanish", label: "Spanish" },
                { value: "french", label: "French" },
                { value: "mandarin", label: "Mandarin" },
                { value: "japanese", label: "Japanese" },
                { value: "german", label: "German" },
              ]}
              values={userDetails.speakingLanguages as string[]}
              field="speakingLanguages"
              handleChange={handleMultiSelectChange}
            />

            {/* Multi Select Field */}
            <MultiSelectField
              label="Reading Languages"
              options={[
                { value: "english", label: "English" },
                { value: "tamil", label: "Tamil" },
                { value: "hindi", label: "Hindi" },
                { value: "kannada", label: "Kannada" },
                { value: "marathi", label: "Marathi" },
                { value: "telugu", label: "Telugu" },
                { value: "malayalam", label: "Malayalam" },
                { value: "punjabi", label: "Punjabi" },
                { value: "bengali", label: "Bengali" },
                { value: "urdu", label: "Urdu" },
                { value: "oriya", label: "Oriya" },
                { value: "spanish", label: "Spanish" },
                { value: "french", label: "French" },
                { value: "mandarin", label: "Mandarin" },
                { value: "japanese", label: "Japanese" },
                { value: "german", label: "German" },
              ]}
              values={userDetails.readingLanguages as string[]}
              field="readingLanguages"
              handleChange={handleMultiSelectChange}
            />
        </form>
      )}

       {/* Social Detils *******************************************************************************************************************/}
       {activeTab === 'media' && (
        <form className="profile-form">

            {/* Profile Picture */}
            <div>
          <label className="update-label" htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            name="file" // Make sure this matches what multer expects
            onChange={handleFileChange}
          />
          {profilePictureError && <p style={{ color: 'red' }}>{profilePictureError}</p>}
          {userDetails.profilePictureUrl && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px' }}>
              <Image  width={150} height={50} src={userDetails.profilePictureUrl} alt="Profile" 
              className="register-profile-gallery"
               />
              <button
                type="button"
                onClick={handleRemoveProfilePicture}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '1px',
                  cursor: 'pointer',
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

          {/* Face Close Picture */}
          <CloseFacePic/>

          {/* Face Reaction Video Edit */}
          <FaceReactionVideoEdit/>

           {/* Gallery */}
        <div>
          <label className="update-label" htmlFor="gallery">[Traditional, Modern Wear] Images :</label>
          <input
            type="file"
            id="gallery"
            name="gallery"
            multiple
            onChange={handleGalleryChange}
          />
          {galleryError && <p style={{ color: 'red' }}>{galleryError}</p>}
          {userDetails.gallery.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
              {userDetails.gallery.map((url, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                  <Image src={url}
                  width={150}
                  height={50}
                   alt={`Gallery image ${index + 1}`} 
                   className="register-profile-gallery"
                    />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '1px',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Face Pic Gallery */}
          <div>
                <label className="update-label" htmlFor="facePicGallery">[Face CloseUp, Straight Face, Side Pose, Without Makeup] Images :</label>
                <input
                  type="file"
                  id="facePicGallery"
                  name="facePicGallery"
                  multiple
                  onChange={handleFacePicGalleryChange}
                />
                {facePicGalleryError && <p style={{ color: 'red' }}>{facePicGalleryError}</p>}
                {userDetails.facePicGallery.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                    {userDetails.facePicGallery.map((url, index) => (
                      <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                        <Image
                        width={150}
                        height={50}
                          src={url}
                          alt={`Face Pic Gallery image ${index + 1}`}
                          className="register-profile-gallery"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFacePicGalleryImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '1px',
                            cursor: 'pointer',
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

               {/* Video Gallery */}
               <div>
                <label className="update-label" htmlFor="videoGallery">Video Gallery:</label>
                <input
                  type="file"
                  id="videoGallery"
                  name="videoGallery"
                  multiple
                  accept="video/*"
                  onChange={handleVideoGalleryChange}
                />
                {videoGalleryError && <p style={{ color: 'red' }}>{videoGalleryError}</p>}
                {userDetails.videoGallery.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                    {userDetails.videoGallery.map((url, index) => (
                      <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                        <video
                          src={url}
                          controls
                          style={{ width: '150px', height: '100px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoGalleryItem(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '1px',
                            cursor: 'pointer',
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              
        </form>
        )}

      {/* Physical Detils *******************************************************************************************************************/}
      {activeTab === 'physical' && (
        <form className="profile-form">
          <InputField
              label="Height (In Cm)"
              value={userDetails.height as number}
              field="height"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Weight (In Kg)"
              value={userDetails.weight as number}
              field="weight"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

          {/*Condtion Field  */}
          {userDetails.profile === 'kid' ? (
          <>
          </>
           ) : userDetails.profile === 'adult' && userDetails.gender === 'male'  ? (
          <>
      
            <InputField
              label="Chest (In Cm)"
              value={userDetails.chest as number}
              field="chest"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Bust (In Cm)"
              value={userDetails.bust as number}
              field="bust"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </>
          ) : userDetails.profile === 'adult' && (userDetails.gender === 'female' || userDetails.gender === 'others')  ?(
           <>
            <InputField
              label="Waist (In Cm)"
              value={userDetails.waist as number}
              field="waist"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Hips (In Cm)"
              value={userDetails.hips as number}
              field="hips"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            </>
          ): (
            <>
            </>
          )}
           {/* Select Field */}
           <div>
              <label className="update-label" htmlFor="bodyShape">Body Shape:</label>
              <select
               className='update-input'
                id="bodyShape"
                value={userDetails.bodyShape}
                onChange={(e) => handleChange("bodyShape", e)}
                onBlur={() =>
                  handleBlur("bodyShape", userDetails.bodyShape as string)
                }
              >
                <option value="">Select Body Shape</option>
                <option value="rectangle">Rectangle</option>
                <option value="inverted">Inverted</option>
                <option value="triangle">Triangle</option>
                <option value="trapezoid">Trapezoid</option>
                <option value="oval">Oval</option>
              </select>
            </div>

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="bodyType">Body Type:</label>
              <select
               className='update-input'
                id="bodyType"
                value={userDetails.bodyType}
                onChange={(e) => handleChange("bodyType", e)}
                onBlur={() =>
                  handleBlur("bodyType", userDetails.bodyType as string)
                }
              >
                <option value="">Select Body Type</option>
                <option value="slim">Slim</option>
                <option value="medium">Medium</option>
                <option value="chubby">Chubby</option>
              </select>
            </div>

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="skinTone">Skin Tone:</label>
              <select
               className='update-input'
                id="skinTone"
                value={userDetails.skinTone}
                onChange={(e) => handleChange("skinTone", e)}
                onBlur={() =>
                  handleBlur("skinTone", userDetails.skinTone as string)
                }
              >
                <option value="">Select Skin Tone</option>
                <option value="fair">Fair</option>
                <option value="black">Black</option>
                <option value="beige">Beige</option>
                <option value="dark-brown">Dark Brown</option>
                <option value="light-brown">Light Brown</option>
                <option value="moderate-brown">Moderate Brown</option>
                <option value="pale-white">Pale White</option>
                <option value="white-to-light-beige">
                  White to Light Beige
                </option>
                <option value="dusky">Dusky</option>
              </select>
            </div>

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="eyeColor">Eye Color:</label>
              <select
               className='update-input'
                id="eyeColor"
                value={userDetails.eyeColor}
                onChange={(e) => handleChange("eyeColor", e)}
                onBlur={() =>
                  handleBlur("eyeColor", userDetails.eyeColor as string)
                }
              >
                <option value="">Select Eye Color</option>
                <option value="black">Black</option>
                <option value="brown">Brown</option>
                <option value="grey">Grey</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="amber">Amber</option>
                <option value="hazel">Hazel</option>
              </select>
            </div>

            {/* Select Field */}
            <div>
              <label className="update-label" htmlFor="hairColor">Hair Color:</label>
              <select
               className='update-input'
                id="hairColor"
                value={userDetails.hairColor}
                onChange={(e) => handleChange("hairColor", e)}
                onBlur={() =>
                  handleBlur("hairColor", userDetails.hairColor as string)
                }
              >
                <option value="">Select Hair Color</option>
                <option value="black">Black</option>
                <option value="brown">Brown</option>
                <option value="black&brown">Black & Brown</option>
                <option value="blond">Blond</option>
                <option value="copper">Copper</option>
                <option value="burgundy">Burgundy</option>
                <option value="ombre">Ombre</option>
                <option value="pink">Pink</option>
                <option value="grey">Grey</option>
                <option value="mahogany">Mahogany</option>
                <option value="pastel">Pastel</option>
                <option value="salt&pepper">Salt & Pepper</option>
              </select>
            </div>

            {/* Input Field */}
            <InputField
              label="Tattoo"
              value={userDetails.tattoo as string}
              field="tattoo"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Shoe Size (Enter UK Size)"
              value={userDetails.shoeSize as string}
              field="shoeSize"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
        </form>
      )}

      {/* Work Detils *******************************************************************************************************************/}
      {activeTab === 'work' && (
        <form className="profile-form">
          <InputField
              label="Movies"
              value={userDetails.movies as string}
              field="movies"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="International Movie"
              value={userDetails.internationalMovie as string}
              field="internationalMovie"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Achievement"
              value={userDetails.achievement as string}
              field="achievement"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Work Links"
              value={userDetails.workLinks as string}
              field="workLinks"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Working Upcoming Projects"
              value={userDetails.workingUpcomingProjects as string}
              field="workingUpcomingProjects"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Experience"
              value={userDetails.experience as string}
              field="experience"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Shoot Price Per Day"
              value={userDetails.shootPricePerDay as string}
              field="shootPricePerDay"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
        </form>
      )}

       {/* Skiils Detils *******************************************************************************************************************/}
       {activeTab === 'skills' && (
        <form className="profile-form">
           {/* Multi Select Field */}
           <MultiSelectField
              label="Singing"
              options={[
                { value: "rap", label: "Rap" },
                { value: "melody", label: "Melody" },
                { value: "classical-music", label: "Classical Music" },
                { value: "backing-vocalist", label: "Backing Vocalist" },
                { value: "lyricist", label: "Lyricist" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.singing as string[]}
              field="singing"
              handleChange={handleMultiSelectChange}
            />

            {/* Multi Select Field */}
            <MultiSelectField
              label="Dance Style"
              options={[
                { value: "folk", label: "Folk" },
                { value: "fusion", label: "Fusion" },
                { value: "hip-hop", label: "Hip-Hop" },
                { value: "traditional", label: "Traditional" },
                { value: "free-style", label: "Free Style" },
                { value: "contemporary", label: "Contemporary" },
                { value: "choreographer", label: "Choreographer" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.danceStyle as string[]}
              field="danceStyle"
              handleChange={handleMultiSelectChange}
            />
            
            {userDetails.profile === 'adult' ? (
              <>
            {/* Multi Select Field */}
            <MultiSelectField
              label="Driving"
              options={[
                { value: "two-wheeler", label: "Two Wheeler" },
                { value: "four-wheeler", label: "Four Wheeler" },
                { value: "lmv", label: "LMV" },
                { value: "hmv", label: "HMV" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.driving as string[]}
              field="driving"
              handleChange={handleMultiSelectChange}
            />
            </>
            ):(
              <>
              </>
            )}


            {/* Multi Select Field */}
            <MultiSelectField
              label="Martial Arts"
              options={[
                { value: "judo", label: "Judo" },
                { value: "karate", label: "Karate" },
                { value: "kung-fu", label: "Kung Fu" },
                { value: "kick-boxing", label: "Kick Boxing" },
                { value: "kalaripayattu", label: "Kalaripayattu" },
                { value: "silambam", label: "Silambam" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.martialArts as string[]}
              field="martialArts"
              handleChange={handleMultiSelectChange}
            />

            {/* Multi Select Field */}
            <MultiSelectField
              label="Water Activities"
              options={[
                { value: "swimming", label: "Swimming" },
                { value: "surfing", label: "Surfing" },
                { value: "diving", label: "Diving" },
                { value: "rafting", label: "Rafting" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.waterActivities as string[]}
              field="waterActivities"
              handleChange={handleMultiSelectChange}
            />
        </form>
        )}

       {/* Social Detils *******************************************************************************************************************/}
       {activeTab === 'social' && (
        <form className="profile-form">
          <InputField
              label="Instagram Link"
              value={userDetails.instagramLink as string}
              field="instagramLink"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Twitter Link"
              value={userDetails.twitterLink as string}
              field="twitterLink"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="Facebook Link"
              value={userDetails.facebookLink as string}
              field="facebookLink"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <InputField
              label="YouTube Link"
              value={userDetails.youTubeLink as string}
              field="youTubeLink"
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
        </form>
        )}

        {/* Interests Detils *******************************************************************************************************************/}
       {activeTab === 'interests' && (
        <form className="profile-form">
         {/* Multi Select Field */}
         <MultiSelectField
              label="Interested Media"
              options={[
                { value: "movies", label: "Movies" },
                { value: "tv-serials", label: "TV Serials" },
                { value: "web-series", label: "Web Series" },
                { value: "ad-shoots", label: "Ad Shoots" },
                { value: "anchoring", label: "Anchoring" },
                { value: "shortfilms", label: "Short Films" },
                { value: "pilot-films", label: "Pilot Films" },
                { value: "music-albums", label: "Music Albums" },
                { value: "dubbing-artist", label: "Dubbing Artist" },
              ]}
              values={userDetails.interestedMedia as string[]}
              field="interestedMedia"
              handleChange={handleMultiSelectChange}
            />


            {/*Male*/}
             { userDetails.profile === 'adult' &&  userDetails.gender === 'male' ? (
              <>
             {/* Multi Select Field */}
            <MultiSelectField
              label="Comfortable With"
              options={[
                { value: "nude", label: "Nude" },
                { value: "shirtless", label: "Shirtless" },
                { value: "dancing", label: "Dancing" },
                { value: "singing", label: "Singing" },
                { value: "semi-nude", label: "Semi Nude" },
                { value: "fight-scene", label: "Fight Scene" },
                { value: "kissing-scene", label: "Kissing Scene" },
                { value: "bold-scenes", label: "Bold Scenes" },
                { value: "body-painting", label: "Body Painting" },
                { value: "outstation-shoot", label: "Outstation Shoot" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.comfortableWithMen as string[]}
              field="comfortableWithMen"
              handleChange={handleMultiSelectChange}/>

              {/* Multi Select Field */}
              <MultiSelectField
              label="Interested Role"
              options={[
                { value: 'hero', label: 'Hero' },
                { value: 'villain', label: 'Villain' },
                { value: 'recurring-character', label: 'Recurring Character' },
                { value: 'cameo', label: 'Cameo' },
                { value: 'supporting-cast', label: 'Supporting Cast' },
                { value: 'background-artist', label: 'Background Artist' },
              ]}
              values={userDetails.interestedRoleMen as string[]}
              field="interestedRoleMen"
              handleChange={handleMultiSelectChange}
              />


               {/* Multi Select Field */}
               <MultiSelectField
              label="Comfortable Clothing"
              options={[
                { value: 'pants', label: 'Pants' },
                { value: 'shorts', label: 'Shorts' },
                { value: 'jeans', label: 'Jeans' },
                { value: 'shirts', label: 'Shirts' },
                { value: 'suit', label: 'Suit' },
                { value: 't-shirt', label: 'T-Shirt' },
                { value: 'sports-wear', label: 'Sports Wear' },
                { value: 'casual-wear', label: 'Casual Wear' },
                { value: 'sleeveless-shirt', label: 'Sleeveless Shirt' },
                { value: 'lungi', label: 'Lungi' },
                { value: 'kurta', label: 'Kurta' },
                { value: 'veshti', label: 'Veshti' },
                { value: 'sherwani', label: 'Sherwani' },
                { value: 'dhoti', label: 'Dhoti' },
                { value: 'swim-wear', label: 'Swim Wear' },
              ]}
              values={userDetails.comfortableClothingMen as string[]}
              field="comfortableClothingMen"
              handleChange={handleMultiSelectChange}
              />


              </>
              // Women************************************
             ) : userDetails.profile === 'adult' &&  userDetails.gender === 'female' ? (
              <>
             {/* Multi Select Field */}
              <MultiSelectField
              label="Comfortable With"
              options={[
                { value: "nude", label: "Nude" },
                { value: "topless", label: "Topless" },
                { value: "dancing", label: "Dancing" },
                { value: "singing", label: "Singing" },
                { value: "semi-nude", label: "Semi Nude" },
                { value: "fight-scene", label: "Fight Scene" },
                { value: "kissing-scene", label: "Kissing Scene" },
                { value: "bold-scenes", label: "Bold Scenes" },
                { value: "body-painting", label: "Body Painting" },
                { value: "outstation-shoot", label: "Outstation Shoot" },
                { value: "others", label: "Others" },
                { value: "none", label: "None" },
              ]}
              values={userDetails.comfortableWithWomen as string[]}
              field="comfortableWithWomen"
              handleChange={handleMultiSelectChange}
               />

              {/* Multi Select Field */}
              <MultiSelectField
              label="Interested Role"
              options={[
                { value: 'heroine', label: 'Heroine' },
                { value: 'villain', label: 'Villain' },
                { value: 'recurring-character', label: 'Recurring Character' },
                { value: 'cameo', label: 'Cameo' },
                { value: 'supporting-cast', label: 'Supporting Cast' },
                { value: 'background-artist', label: 'Background Artist' },
              ]}
              values={userDetails.interestedRoleWomen as string[]}
              field="interestedRoleWomen"
              handleChange={handleMultiSelectChange}/>

              {/* Multi Select Field */}
              <MultiSelectField
              label="Comfortable Clothing"
              options={[
                { value: "skirt", label: "Skirt" },
                { value: "shorts", label: "Shorts" },
                { value: "swim-suits", label: "Swim Suits" },
                { value: "saree", label: "Saree" },
                { value: "kurti", label: "Kurti" },
                { value: "casual-wear", label: "Casual Wear" },
                { value: "indo-western", label: "Indo-Western" },
                { value: "western", label: "Western" },
                { value: "sleeveless", label: "Sleeveless" },
                { value: "dress", label: "Dress" },
                { value: "gown", label: "Gown" },
              ]}
              values={userDetails.comfortableClothingWomen as string[]}
              field="comfortableClothingWomen"
              handleChange={handleMultiSelectChange}
              />

              {/* Multi Select Field */}
            <MultiSelectField
              label="Interested Shoot"
              options={[
                { value: 'print-shoot', label: 'Print Shoot' },
                { value: 'saree-shoot', label: 'Saree Shoot' },
                { value: 'bikini-shoot', label: 'Bikini Shoot' },
                { value: 'lehenga-shoot', label: 'Lehenga Shoot' },
                { value: 'designer-shoot', label: 'Designer Shoot' },
                { value: 'western-shoot', label: 'Western Shoot' },
                { value: 'lingerie-shoot', label: 'Lingerie Shoot' },
                { value: 'calender-shoot', label: 'Calendar Shoot' },
                { value: 'ramp-shows', label: 'Ramp Shows' },
              ]}
              values={userDetails.interestedShootWomen as string[]}
              field="interestedShootWomen"
              handleChange={handleMultiSelectChange}
              />            
              </>


             // Others*******************************
             ) :userDetails.profile === 'adult' &&  userDetails.gender === 'others' ? (
              <>

              {/* Multi Select Field */}
              <MultiSelectField
              label="Comfortable With"
              options={[
                { value: 'singing', label: 'Singing' },
                { value: 'dancing', label: 'Dancing' },
                { value: 'fight scenes', label: 'Fight Scenes' },
                { value: 'bold scenes', label: 'Bold Scenes' },
                { value: 'out station shoot', label: 'Out Station Shoot' },
                { value: 'others', label: 'Others' },
              ]}
              values={userDetails.comfortableWithOthers as string[]}
              field="comfortableWithOthers"
              handleChange={handleMultiSelectChange}/>

              {/* Multi Select Field */}
              <MultiSelectField
              label="Interested Role"
              options={[
                { value: 'villain', label: 'Villain' },
                { value: 'recurring character', label: 'Recurring Character' },
                { value: 'cameo', label: 'Cameo' },
                { value: 'supporting cast', label: 'Supporting Cast' },
                { value: 'background artist', label: 'Background Artist' },
              ]}
              values={userDetails.interestedRoleOthers as string[]}
              field="interestedRoleOthers"
              handleChange={handleMultiSelectChange}/>

             <MultiSelectField
              label="Comfortable Clothing"
              options={[
                { value: 'skirt', label: 'Skirt' },
                { value: 'shorts', label: 'Shorts' },
                { value: 'swim-suits', label: 'Swim Suits' },
                { value: 'saree', label: 'Saree' },
                { value: 'kurti', label: 'Kurti' },
                { value: 'casual-wear', label: 'Casual Wear' },
                { value: 'indo-western', label: 'Indo-Western' },
                { value: 'western', label: 'Western' },
                { value: 'sleeveless', label: 'Sleeveless' },
                { value: 'dress', label: 'Dress' },
                { value: 'gown', label: 'Gown' },
                { value: 'pants', label: 'Pants' },
                { value: 'jeans', label: 'Jeans' },
                { value: 'shirts', label: 'Shirts' },
                { value: 'suit', label: 'Suit' },
                { value: 't-shirt', label: 'T-Shirt' },
                { value: 'sports-wear', label: 'Sports Wear' },
                { value: 'lungi', label: 'Lungi' },
                { value: 'kurta', label: 'Kurta' },
                { value: 'veshti', label: 'Veshti' },
                { value: 'sherwani', label: 'Sherwani' },
                { value: 'dhoti', label: 'Dhoti' },
              ]}
              values={userDetails.comfortableClothingOthers as string[]}
              field="comfortableClothingOthers"
              handleChange={handleMultiSelectChange}
              />
              </>
            //Kid***************************************************
             ): userDetails.profile === 'kid' ?(
              <>
              {/* Multi Select kids Field */}
              <MultiSelectField
              label="Comfortable With"
              options={[
                { value: 'body painting', label: 'Body Painting' },
                { value: 'singing', label: 'Singing' },
                { value: 'dancing', label: 'dancing' },
                { value: 'outstation shoot', label: 'Outstation Shoot' },
                { value: 'fight scene', label: 'Fight Scene' },
                { value: 'others', label: 'Others' },
                { value: 'none', label: 'None' },
              ]}
              values={userDetails.comfortableWithKids as string[]}
              field="comfortableWithKids"
              handleChange={handleMultiSelectChange}/>

              {userDetails.gender === 'male' ? (
              <>
              {/* Multi Select Kid Male Field */}
              <MultiSelectField
              label="Comfortable Clothing"
              options={[
                { value: 'pants', label: 'Pants' },
                { value: 'shorts', label: 'Shorts' },
                { value: 'jeans', label: 'Jeans' },
                { value: 'shirts', label: 'Shirts' },
                { value: 't-shirt', label: 'T-Shirt' },
                { value: 'sports wear', label: 'Sports Wear' },
                { value: 'casual wear', label: 'Casual Wear' },
                { value: 'sleeveless', label: 'Sleeveless' },
                { value: 'kurta', label: 'Kurta' },
                { value: 'veshti', label: 'Veshti' },
                { value: 'sherwani', label: 'Sherwani' },
                { value: 'dhoti', label: 'Dhoti' },
                { value: 'swim wear', label: 'Swim Wear' }
              ]}
              values={userDetails.comfortableClothingKidMale as string[]}
              field="comfortableClothingKidMale"
              handleChange={handleMultiSelectChange}/>
             </>


            ) : userDetails.gender === 'female' ? (
              <>
             {/* Multi Select Kid Female Field */}
               <MultiSelectField
               label="Comfortable Clothing"
               options={[
                 { value: 'skirt', label: 'Skirt' },
                 { value: 'shorts', label: 'Shorts' },
                 { value: 'jeans', label: 'Jeans' },
                 { value: 'swim suits', label: 'Swim Suits' },
                 { value: 'saree', label: 'Saree' },
                 { value: 'kurti', label: 'Kurti' },
                 { value: 'casual wear', label: 'Casual Wear' },
                 { value: 'indo western', label: 'Indo Western' },
                 { value: 'sleeveless', label: 'Sleeveless' },
                 { value: 'western wear', label: 'Western Wear' },
                 { value: 'dress', label: 'Dress' },
                 { value: 'gown', label: 'Gown' }
               ]}
               values={userDetails.comfortableClothingKidFemale as string[]}
               field="comfortableClothingKidFemale"
               handleChange={handleMultiSelectChange}/>

             </>
            ) : (
              <>
               {/* None Data */}
              </>
             )}
             {/* End Of Session */}
              </>
             ):(
              <></>
             )}         
        </form>
        )}

    </div>
    </div>
  );
};

// InputField component
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  field,
  handleChange,
  handleBlur,
  type = "text",
}) => (
  <div className="mb-4">
    <label className="update-label" htmlFor={field}>
      {label}:
    </label>
    <input
      className="update-input"
      id={field}
      value={value}
      onChange={(e) => handleChange(field, e)}
      onBlur={() => handleBlur(field, value)}
    />
  </div>
);


// MultiSelectField component
const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  values,
  field,
  handleChange,
}) => {
  const handleSelectChange = (selectedOptions: any) => {
    const valueArray = selectedOptions
      ? selectedOptions.map((option: { value: string; label: string }) => option.value)
      : [];
    handleChange(field, valueArray);
  };

  return (
    <div>
      <label className="update-label">{label}:</label>
      <Select
        isMulti
        className="register-multi-select"
        options={options}
        value={options.filter((option) => values.includes(option.value))}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default Profile;

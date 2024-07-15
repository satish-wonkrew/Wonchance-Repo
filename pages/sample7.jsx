import { useSession } from 'next-auth/react';
import React, { useEffect } from "react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import Link from "next/link";
import { useRouter } from 'next/router';
import PageNotFound from '../components/404';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import ProfileGallery from "../components/ProfileGallery";
import Image from 'next/image';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated'
       && session?.user.role !== 'admin'
       && session?.user.role !== 'talent'
      ) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }



  if (!session) {
    return <div><PageNotFound/></div>;
  }


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-GB", options);
  };

  const formatDateOfBirth = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="talent-grid">
       {/* Talent Grid One */}
       <div className="talent-grid-one">
         <Image
         width={150}
         height={50}
         alt='Profile Picture'
         className="talent-profile-image" 
         src={session.user.profilePictureUrl}/>

        <Image 
        width={150}
        height={50}
        alt='Close Face Picture'
         className="talent-profile-image" 
         src={session.user.faceCloseupPicture}/>
         
          {/* Physical Details ##################################################################### */}
          <h3>Profile Viewers: ({session.user.profileViewers && session.user.profileViewers.length})
            {/* <ul>
              {session.user.profileViewers &&
                session.user.profileViewers.map((viewers, index) => (
                  <li key={index}>{viewers}</li>
                ))}
            </ul> */}
          </h3>

        <h2 className="talent-details-heading">Physical Details:</h2>
         
         <div className="talent-physical">
           <div>
           <h3>Height: <span>{session.user.height} Cm</span></h3>
           <h3>Weight: <span>{session.user.weight} Kg</span></h3>
           <h3>Body Shape: <span>{session.user.bodyShape}</span></h3>
           <h3>Body Type: <span>{session.user.bodyType}</span></h3>
           <h3>Skin Tone: <span>{session.user.skinTone}</span></h3>
           <h3>Eye Color: <span>{session.user.eyeColor}</span></h3>
           <h3>Hair Color: <span>{session.user.hairColor}</span></h3>
           </div>

           <div>
               {/*Condtions Physical Details  */}
              {session.user.profile === "kid" ? (
                <></>
              ) : session.user.profile === "adult" && session.user.gender === "male" ? (
                <>
                  <h3>Chest: <span>{session.user.chest} Cm</span></h3>
                  <h3>Bust: <span>{session.user.bust} Cm</span></h3>
                </>
              ) : session.user.profile === "adult" &&
                (session.user.gender === "female" ||session.user.gender === "others") ? (
                <>
                  <h3>Waist: <span>{session.user.waist} Cm</span></h3>
                  <h3>Hips: <span>{session.user.hips} Cm</span></h3>
                </>
              ) : (
                <></>
              )}
               <h3>Tattoo: <span>{session.user.tattoo}</span></h3>
              <h3>Shoe Size(Uk Size): <span>{session.user.shoeSize}</span></h3>
           </div>
          
         </div>
       

         <h2 className="talent-details-heading">Work Details:</h2>
         <div className="talent-work">
          <div>
             <h3>Movies: <span>{session.user.movies}</span></h3>
             <h3>International Movie: <span>{session.user.internationalMovie}</span></h3>
             <h3>Achievement: <span>{session.user.achievement}</span></h3>
             <h3>Work Links: <span>{session.user.workLinks}</span></h3>
          </div>
          <div>
             <h3>Working Upcoming Projects: <span>{session.user.workingUpcomingProjects}</span></h3>
             <h3>Experience: <span>{session.user.experience}</span></h3>
             <h3>Shoot Price Per Day: <span>{session.user.shootPricePerDay}</span></h3>
          </div>
        </div>

      {/* Gallery Start */}
         <ProfileGallery/>
      {/* Gallery End */}
      </div>

        {/* Talent Grid Two */}
        <div className="talent-grid-two">

<div className="screen-name">
  <div>
    <h1>{session.user.screenName}</h1>
    <h3>Status: {(session.user.statusLevel)}</h3>
  </div>
  <div>
    <h3>Created At: {formatDate(session.user.createdAt)}</h3>
     <h3>Updated At: {formatDate(session.user.updatedAt)}</h3>
  </div>
</div>

<div className="talent-id">
<h3>Profile Id: {session.user._id}</h3>
<div className="talent-social">
  <Link href={session.user.instagramLink} className="p-0 text-pink-500" ><FaInstagram /> </Link>
  <Link href={session.user.facebookLink} className="p-0 text-blue-500" ><FaFacebook /> </Link>
  <Link href={session.user.twitterLink} className="p-0 text-blue-700"><FaTwitter /> </Link>
  <Link href={session.user.youTubeLink} className="p-0 text-red-600"><FaYoutube /> </Link>
</div>
</div>

<div className="talent-name">
   <h2>Name: {session.user.firstName} {session.user.lastName} </h2>
   <h2>Email: {session.user.email}</h2>
   <span className='text-white'><Link href='/profileUpdate'><HiMiniPencilSquare /></Link></span>
</div>

 {/* Basic Details ##################################################################### */} 
<h2 className="talent-details-heading">Basic Details:</h2>

<div className="talent-basic" >
  <div>
  <h3>WhatsApp Number: <span>{session.user.whatsappNumber}</span></h3>
  <h3>Experience Level: <span>{session.user.experienceLevel}</span></h3>
  <h3>Profile: <span>{session.user.profile}</span></h3>
  <h3>Gender: <span>{session.user.gender}</span></h3>
  <h3>Date Of Birth: <span>{formatDateOfBirth(session.user.dateOfBirth)}</span></h3>
  <h3>age: <span>{session.user.age}</span></h3>
  <h3>Gender: <span>{session.user.gender}</span></h3>
  <h3>Speaking Languages:</h3>
    <ul>
      {session.user.speakingLanguages &&
        session.user.speakingLanguages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
    </ul>
  </div>

  <div>
  {session.user.profile === "kid" ? (
  <>
    <h3>Fathers Name: <span>{session.user.fathersName}</span></h3>
    <h3>Mothers Name: <span>{session.user.mothersName}</span></h3>
  </>
) : session.user.profile === "adult" ? (
  <>
    <h3>Marital Status: <span>{session.user.maritalStatus}</span></h3>
    <h3>
      Educational Qualification: <span>{session.user.educationalQualification}</span></h3>
  </>
) : (
  <></>
)}

    <h3>Native State: <span>{session.user.nativeState}</span></h3>
    <h3>Nationality: <span>{session.user.nationality}</span></h3>
    <h3>Native Place: <span>{session.user.nativePlace}</span></h3>
    <h3>Current City: <span>{session.user.currentCity}</span></h3>
    <h3>Address: <span>{session.user.address}</span></h3>

    <h3>Reading Languages:</h3>
    <ul>
      {session.user.readingLanguages &&
        session.user.readingLanguages.map((language, index) => (
          <li key={index}>{language}</li>
    ))}
</ul>
  </div>   
</div>


{/* Skill Details ##################################################################### */}
<h2 className="talent-details-heading">Skill Details:</h2>

<div className="talent-skill">
{session.user.singing === "adult" ? (
  <>
    <h3>Driving: {session.user.driving}</h3>
  </>
) : (
  <> </>
)}

<h3>Singing:</h3>
<ul>
  {session.user.singing &&
    session.user.singing.map((singing, index) => (
      <li key={index}>{singing}</li>
    ))}
</ul>

<h3>Dance Style:</h3>
<ul>
  {session.user.danceStyle &&
    session.user.danceStyle.map((dance, index) => (
      <li key={index}>{dance}</li>
    ))}
</ul>

<h3>Martial Arts:</h3>
<ul>
  {session.user.martialArts &&
    session.user.martialArts.map((martial, index) => (
      <li key={index}>{martial}</li>
    ))}
</ul>

<h3>Water Activities:</h3>
<ul>
  {session.user.waterActivities &&
    session.user.waterActivities.map((water, index) => (
      <li key={index}>{water}</li>
    ))}
</ul>
</div>

{/* Interests ##################################################################### */}

<h2 className="talent-details-heading">Interests:</h2>
<div className="talent-interested">
<h3>Interested Media:</h3>
<ul>
  {session.user.interestedMedia &&
    session.user.interestedMedia.map((media, index) => (
      <li key={index}>{media}</li>
    ))}
</ul>

{session.user.profile === "adult" && session.user.gender === "male" ? (
  <>
    <h3>Comfortable With:</h3>
    <ul>
      {session.user.comfortableWithMen &&
        session.user.comfortableWithMen.map((comfortable, index) => (
          <li key={index}>{comfortable}</li>
        ))}
    </ul>

    <h3>Interested Role:</h3>
    <ul>
      {session.user.interestedRoleMen &&
        session.user.interestedRoleMen.map((interested, index) => (
          <li key={index}>{interested}</li>
        ))}
    </ul>

    <h3>Comfortable Clothing:</h3>
    <ul>
      {session.user.comfortableClothingMen &&
        session.user.comfortableClothingMen.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
  </>
) : session.user.profile === "adult" && session.user.gender === "female" ? (
  <>
  <h3>Comfortable With:</h3>
   <ul>
      {session.user.comfortableWithWomen &&
        session.user.comfortableWithWomen.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
    <h3>Interested Role:</h3>
    <ul>
      {session.user.interestedRoleWomen &&
        session.user.interestedRoleWomen.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
    <h3>Comfortable Clothing:</h3>
    <ul>
      {session.user.comfortableClothingWomen &&
        session.user.comfortableClothingWomen.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
    <h3>Interested Shoot:</h3>
    <ul>
      {session.user.interestedShootWomen &&
        session.user.interestedShootWomen.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
  </>

) : session.user.profile === "adult" && session.user.gender === "others" ? (
  <>
  <h3>Comfortable With:</h3>
    <ul>
      {session.user.comfortableWithOthers &&
        session.user.comfortableWithOthers.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
    <h3>Interested Role:</h3>
    <ul>
      {session.user.interestedRoleOthers &&
        session.user.interestedRoleOthers.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
    <h3>Comfortable Clothing:</h3>
    <ul>
      {session.user.comfortableClothingOthers &&
        session.user.comfortableClothingOthers.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
  </>
) : session.user.profile === "kid" ? (
  <>
     <h3>Comfortable With:</h3>
    <ul>
      {session.user.comfortableWithKids &&
        session.user.comfortableWithKids.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>

    {session.user.gender === "male" ? (
      <>
       <h3>Comfortable Clothing:</h3>
       <ul>
      {session.user.comfortableClothingKidMale &&
        session.user.comfortableClothingKidMale.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>

      </>
    ) : session.user.gender === "female" ? (
      <>
       <h3>Comfortable Clothing:</h3>
       <ul>
      {session.user.comfortableClothingKidFemale &&
        session.user.comfortableClothingKidFemale.map((clothing, index) => (
          <li key={index}>{clothing}</li>
        ))}
    </ul>
      </>
    ) : (
      <></>
    )}
  </>
) : (
  <></>
)}
</div>
</div>
    </div>
  );
};

export default Profile;

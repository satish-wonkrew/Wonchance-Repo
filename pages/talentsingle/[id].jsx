// TalentSingle.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react"; 
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import TalentGallery from '../../components/TalentGallery';
import Image from 'next/image';

const TalentSingle = () => {
  
  const router = useRouter();
  const { id } = router.query; // Extract the talent ID from the URL query parameter


  const { data: session } = useSession(); // Get the current session user
  const [talent, setTalent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const response = await fetch(
          `/api/getusers/${id}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error(`Error fetching talent data: ${response.status}`);
        }
        const data = await response.json();
        setTalent(data);
        
        // Update profileViewers if the session user exists
        if (session?.user?.id) {
          await axios.post(`/api/updateProfileViewers`, {
            talentId: id,
            viewerId: session.user.id,
          });
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    if (id) {
      fetchTalent();
    }
  }, [id, session]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!talent) {
    return <div>Loading...</div>;
  }
  //Format Date
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
         alt="Profile Picture"
         className="talent-profile-image" 
         src={talent.profilePictureUrl}/>
         
          {/* Physical Details ##################################################################### */}
        <h2 className="talent-details-heading">Physical Details:</h2>
         
         <div className="talent-physical">
           <div>
           <h3>Height: <span>{talent.height} Cm</span></h3>
           <h3>Weight: <span>{talent.weight} Kg</span></h3>
           <h3>Body Shape: <span>{talent.bodyShape}</span></h3>
           <h3>Body Type: <span>{talent.bodyType}</span></h3>
           <h3>Skin Tone: <span>{talent.skinTone}</span></h3>
           <h3>Eye Color: <span>{talent.eyeColor}</span></h3>
           <h3>Hair Color: <span>{talent.hairColor}</span></h3>
           </div>

           <div>
               {/*Condtions Physical Details  */}
              {talent.profile === "kid" ? (
                <></>
              ) : talent.profile === "adult" && talent.gender === "male" ? (
                <>
                  <h3>Chest: <span>{talent.chest} Cm</span></h3>
                  <h3>Bust: <span>{talent.bust} Cm</span></h3>
                </>
              ) : talent.profile === "adult" &&
                (talent.gender === "female" || talent.gender === "others") ? (
                <>
                  <h3>Waist: <span>{talent.waist} Cm</span></h3>
                  <h3>Hips: <span>{talent.hips} Cm</span></h3>
                </>
              ) : (
                <></>
              )}
               <h3>Tattoo: <span>{talent.tattoo}</span></h3>
              <h3>Shoe Size(Uk Size): <span>{talent.shoeSize}</span></h3>
           </div>
          
         </div>
       

         <h2 className="talent-details-heading">Work Details:</h2>
         <div className="talent-work">
          <div>
             <h3>Movies: <span>{talent.movies}</span></h3>
             <h3>International Movie: <span>{talent.internationalMovie}</span></h3>
             <h3>Achievement: <span>{talent.achievement}</span></h3>
             <h3>Work Links: <span>{talent.workLinks}</span></h3>
          </div>
          <div>
             <h3>Working Upcoming Projects: <span>{talent.workingUpcomingProjects}</span></h3>
             <h3>Experience: <span>{talent.experience}</span></h3>
             <h3>Shoot Price Per Day: <span>{talent.shootPricePerDay}</span></h3>
          </div>
        </div>

      {/* Gallery Start */}
         {/* <TalentGallery/> */}
      {/* Gallery End */}
      </div>

      {/* Talent Grid Two */}
      <div className="talent-grid-two">

        <div className="screen-name">
          <div>
            <h1>{talent.screenName}</h1>
            <h3>Status: {(talent.statusLevel)}</h3>
          </div>
          <div>
            <h3>Created At: {formatDate(talent.createdAt)}</h3>
             <h3>Updated At: {formatDate(talent.updatedAt)}</h3>
          </div>
        </div>

        <div className="talent-id">
        <h3>Profile Id: {talent._id}</h3>
        <div className="talent-social">
          <Link href={talent.instagramLink} className="p-0 text-pink-500" ><FaInstagram /> </Link>
          <Link href={talent.facebookLink} className="p-0 text-blue-500" ><FaFacebook /> </Link>
          <Link href={talent.twitterLink} className="p-0 text-blue-700"><FaTwitter /> </Link>
          <Link href={talent.youTubeLink} className="p-0 text-red-600"><FaYoutube /> </Link>
        </div>
        </div>

        <div className="talent-name">
           <h2>Name: {talent.firstName} {talent.lastName} </h2>
           <h2>Email: {talent.email}</h2>
        </div>

         {/* Basic Details ##################################################################### */} 
        <h2 className="talent-details-heading">Basic Details:</h2>

        <div className="talent-basic" >
          <div>
          <h3>WhatsApp Number: <span>{talent.whatsappNumber}</span></h3>
          <h3>Experience Level: <span>{talent.experienceLevel}</span></h3>
          <h3>Profile: <span>{talent.profile}</span></h3>
          <h3>Gender: <span>{talent.gender}</span></h3>
          <h3>Date Of Birth: <span>{formatDateOfBirth(talent.dateOfBirth)}</span></h3>
          <h3>age: <span>{talent.age}</span></h3>
          <h3>Gender: <span>{talent.gender}</span></h3>
          <h3>Speaking Languages:</h3>
            <ul>
              {talent.speakingLanguages &&
                talent.speakingLanguages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
            </ul>
          </div>

          <div>
          {talent.profile === "kid" ? (
          <>
            <h3>Fathers Name: <span>{talent.fathersName}</span></h3>
            <h3>Mothers Name: <span>{talent.mothersName}</span></h3>
          </>
        ) : talent.profile === "adult" ? (
          <>
            <h3>Marital Status: <span>{talent.maritalStatus}</span></h3>
            <h3>
              Educational Qualification: <span>{talent.educationalQualification}</span></h3>
          </>
        ) : (
          <></>
        )}

            <h3>Native State: <span>{talent.nativeState}</span></h3>
            <h3>Nationality: <span>{talent.nationality}</span></h3>
            <h3>Native Place: <span>{talent.nativePlace}</span></h3>
            <h3>Current City: <span>{talent.currentCity}</span></h3>
            <h3>Address: <span>{talent.address}</span></h3>
    
            <h3>Reading Languages:</h3>
            <ul>
              {talent.readingLanguages &&
                talent.readingLanguages.map((language, index) => (
                  <li key={index}>{language}</li>
            ))}
        </ul>
          </div>   
        </div>
      
        
        {/* Skill Details ##################################################################### */}
        <h2 className="talent-details-heading">Skill Details:</h2>

        <div className="talent-skill">
        {talent.singing === "adult" ? (
          <>
            <h3>Driving: {talent.driving}</h3>
          </>
        ) : (
          <> </>
        )}

        <h3>Singing:</h3>
        <ul>
          {talent.singing &&
            talent.singing.map((singing, index) => (
              <li key={index}>{singing}</li>
            ))}
        </ul>

        <h3>Dance Style:</h3>
        <ul>
          {talent.danceStyle &&
            talent.danceStyle.map((dance, index) => (
              <li key={index}>{dance}</li>
            ))}
        </ul>

        <h3>Martial Arts:</h3>
        <ul>
          {talent.martialArts &&
            talent.martialArts.map((martial, index) => (
              <li key={index}>{martial}</li>
            ))}
        </ul>

        <h3>Water Activities:</h3>
        <ul>
          {talent.waterActivities &&
            talent.waterActivities.map((water, index) => (
              <li key={index}>{water}</li>
            ))}
        </ul>
        </div>
       
        {/* Interests ##################################################################### */}

        <h2 className="talent-details-heading">Interests:</h2>
        <div className="talent-interested">
        <h3>Interested Media:</h3>
        <ul>
          {talent.interestedMedia &&
            talent.interestedMedia.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>

        {talent.profile === "adult" && talent.gender === "male" ? (
          <>
            <h3>Comfortable With:</h3>
            <ul>
              {talent.comfortableWithMen &&
                talent.comfortableWithMen.map((comfortable, index) => (
                  <li key={index}>{comfortable}</li>
                ))}
            </ul>

            <h3>Interested Role:</h3>
            <ul>
              {talent.interestedRoleMen &&
                talent.interestedRoleMen.map((interested, index) => (
                  <li key={index}>{interested}</li>
                ))}
            </ul>

            <h3>Comfortable Clothing:</h3>
            <ul>
              {talent.comfortableClothingMen &&
                talent.comfortableClothingMen.map((clothing, index) => (
                  <li key={index}>{clothing}</li>
                ))}
            </ul>
          </>
        ) : talent.profile === "adult" && talent.gender === "female" ? (
          <>
           <h3>Comfortable With:</h3>
        <ul>
          {talent.comfortableWithWomen &&
            talent.comfortableWithWomen.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
        <h3>Interested Role:</h3>
        <ul>
          {talent.interestedRoleWomen &&
            talent.interestedRoleWomen.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
        <h3>Comfortable Clothing:</h3>
        <ul>
          {talent.comfortableClothingWomen &&
            talent.comfortableClothingWomen.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
        <h3>Interested Shoot:</h3>
        <ul>
          {talent.interestedShootWomen &&
            talent.interestedShootWomen.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
          </>
        ) : talent.profile === "adult" && talent.gender === "others" ? (
          <>
          <h3>Comfortable With:</h3>
        <ul>
          {talent.comfortableWithOthers &&
            talent.comfortableWithOthers.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
        <h3>Interested Role:</h3>
        <ul>
          {talent.interestedRoleOthers &&
            talent.interestedRoleOthers.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
        <h3>Comfortable Clothing:</h3>
        <ul>
          {talent.comfortableClothingOthers &&
            talent.comfortableClothingOthers.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>
          </>
        ) : talent.profile === "kid" ? (
          <>
          <h3>Comfortable With:</h3>
        <ul>
          {talent.comfortableWithKids &&
            talent.comfortableWithKids.map((media, index) => (
              <li key={index}>{media}</li>
            ))}
        </ul>

            {talent.gender === "male" ? (
              <>
               <h3>Comfortable Clothing:</h3>
               <ul>
                  {talent.comfortableClothingKidMale &&
                    talent.comfortableClothingKidMale.map((media, index) => (
                      <li key={index}>{media}</li>
                    ))}
                </ul>
              </>
            ) : talent.gender === "female" ? (
              <>
               <h3>Comfortable Clothing:</h3>
               <ul>
                  {talent.comfortableClothingKidFemale &&
                    talent.comfortableClothingKidFemale.map((media, index) => (
                      <li key={index}>{media}</li>
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

export default TalentSingle;

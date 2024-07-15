import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import ReactPlayer from 'react-player';
import Image from 'next/image';

const TalentGallery = () => {
  
    const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };
  const router = useRouter();
  const { id } = router.query; // Extract the talent ID from the URL query parameter

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
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
    if (id) {
      fetchTalent();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!talent) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
    <div>
    {/*1st Gallery */}
    <h3 className="block">[Traditional, Modern Wear] Images :</h3>
   <ul className="talent-gallery">
      {talent.gallery &&
        talent.gallery.map((imageUrl, index) => (
          <li key={index}>
            <Image
            width={150}
            height={50}
              className="talent-gallery-image"
              src={imageUrl}
              alt={`Gallery Image ${index + 1}`}
              onClick={() => openLightbox(index)}
            />
          </li>
        ))}
    </ul>

    {isOpen && (
      <Lightbox
        mainSrc={talent.gallery[photoIndex]}
        nextSrc={talent.gallery[(photoIndex + 1) % talent.gallery.length]}
        prevSrc={
          talent.gallery[
            (photoIndex + talent.gallery.length - 1) % talent.gallery.length
          ]
        }
        onCloseRequest={() => setIsOpen(false)}
        onMovePrevRequest={() =>
          setPhotoIndex(
            (photoIndex + talent.gallery.length - 1) % talent.gallery.length
          )
        }
        onMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % talent.gallery.length)
        }
      />
    )}
  </div>
  {/* 2nd Gallery */}
  <div>
  <h3 className="block">[Face CloseUp, Straight Face, Side Pose, Without Makeup] Images :</h3>
    <ul className="talent-gallery">
      {talent.facePicGallery &&
        talent.facePicGallery.map((imageUrl, index) => (
          <li key={index}>
            <Image
            width={150}
            height={50}
              className="talent-gallery-image"
              src={imageUrl}
              alt={`Gallery Image ${index + 1}`}
              onClick={() => openLightbox(index)}
            />
          </li>
        ))}
    </ul>

    {isOpen && (
      <Lightbox
        mainSrc={talent.facePicGallery[photoIndex]}
        nextSrc={talent.facePicGallery[(photoIndex + 1) % talent.facePicGallery.length]}
        prevSrc={
          talent.facePicGallery[
            (photoIndex + talent.facePicGallery.length - 1) % talent.facePicGallery.length
          ]
        }
        onCloseRequest={() => setIsOpen(false)}
        onMovePrevRequest={() =>
          setPhotoIndex(
            (photoIndex + talent.facePicGallery.length - 1) % talent.facePicGallery.length
          )
        }
        onMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % talent.facePicGallery.length)
        }
      />
    )}
  </div>
  {/* Video Gallery */}
  <div>
  <h3 className="block">Video Gallery :</h3>
     {talent.videoGallery.length > 0 && (
         <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
           {talent.videoGallery.map((url, index) => (
             <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
               <video
                 src={url}
                 controls
                 style={{ width: '150px', height: '100px' }}
               />
              
             </div>
           ))}
         </div>
       )}
  </div>

  <h3 className="block">Face Reactions Video :</h3>
      <ReactPlayer url={talent.faceReactionVideo} controls={true} height={200} width={400} />

  <h3 className="block">Talent Video :</h3>
      <ReactPlayer url={talent.sampleVideoUrl} controls={true} height={200} width={400} />
  </div>
  );
};

export default TalentGallery;

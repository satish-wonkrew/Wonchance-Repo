// TalentSingle.js
import React, { useState } from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useSession } from 'next-auth/react';
import ReactPlayer from 'react-player';
import Image from 'next/image';


const ProfileGallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const { data: session, status } = useSession();

    const openLightbox = (index) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
        <div>
        <h3 className="block">[Traditional, Modern Wear] Images :</h3>
        <ul className="talent-gallery">
                {session?.user?.gallery && session.user.gallery.map((imageUrl, index) => (
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
                    mainSrc={session.user.gallery[photoIndex]}
                    nextSrc={session.user.gallery[(photoIndex + 1) % session.user.gallery.length]}
                    prevSrc={
                        session.user.gallery[
                            (photoIndex + session.user.gallery.length - 1) % session.user.gallery.length
                        ]
                    }
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex(
                            (photoIndex + session.user.gallery.length - 1) % session.user.gallery.length
                        )
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % session.user.gallery.length)
                    }
                />
            )}
        </div>
        <div>
             <h3 className="block">[Face CloseUp, Straight Face, Side Pose, Without Makeup] Images :</h3>
            <ul className="talent-gallery">
                {session?.user?.facePicGallery && session.user.facePicGallery.map((imageUrl, index) => (
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
                    mainSrc={session.user.facePicGallery[photoIndex]}
                    nextSrc={session.user.facePicGallery[(photoIndex + 1) % session.user.facePicGallery.length]}
                    prevSrc={
                        session.user.facePicGallery[
                            (photoIndex + session.user.facePicGallery.length - 1) % session.user.facePicGallery.length
                        ]
                    }
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex(
                            (photoIndex + session.user.facePicGallery.length - 1) % session.user.facePicGallery.length
                        )
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % session.user.facePicGallery.length)
                    }
                />
            )}
        </div>
        {/* Video Gallery */}
  <div>
  <h3 className="block">Video Gallery :</h3>
     {session.user.videoGallery.length > 0 && (
         <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
           {session.user.videoGallery.map((url, index) => (
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

  <h3 className="block">My Face Reactions Video :</h3>
      <ReactPlayer url={session.user.faceReactionVideo} controls={true} height={200} width={400} />
  
      <h3 className="block">My Youtube Video :</h3>
      <ReactPlayer url={session.user.sampleVideoUrl} controls={true} height={200} width={400} />
        </div>
    );
};

export default ProfileGallery;

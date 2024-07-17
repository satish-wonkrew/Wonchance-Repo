// TalentSingle.js
import React, { useState } from "react";
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
import { useSession } from 'next-auth/react';
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

            {/* {isOpen && (
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
            )} */}
        </div>
        </div>
    );
};

export default ProfileGallery;

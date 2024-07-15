import { useSession } from 'next-auth/react';
import React, { useEffect } from "react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import Link from "next/link";
import { useRouter } from 'next/router';
import PageNotFound from '../components/404';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import ProfileGallery from "../components/ProfileGallery";
import ModernGallery  from "../components/ModernGallery";
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
    <div className='body'>
    <div className='profile'>
      <div className='profile-box-1'>
      <div className='profile-box1-left'>
      <Image
         width={150}
         height={50}
         alt='Profile Picture'
         className="my-profile-picture" 
         src={session.user.profilePictureUrl}/>

         <ModernGallery/>
         </div>
         <div className='profile-box1-right'>
           
         </div>
      </div>

      <div className='profile-box-2'></div>
    </div>
    </div>
  );
};

export default Profile;

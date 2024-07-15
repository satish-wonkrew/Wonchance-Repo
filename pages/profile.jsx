import { useSession } from 'next-auth/react';
import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import PageNotFound from '../components/404';
import BookMark from '../components/AddBookMark';
import Profile from '../components/Profile';


const MyProfile = () => {
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

  return (
    <>
  {session.user.role === "" || session.user.role === "crew" ? (
     <>
     <BookMark/>
     </>
   ):(
     <>
     <Profile />
     </>
   )}
    </>
  
  );
};

export default MyProfile;

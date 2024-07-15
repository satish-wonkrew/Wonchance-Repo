import React from 'react'
import NotFound from '/images/PageNotFound.png';
import Image from 'next/image'; // Import the Image component
import Link from 'next/link'

export const PageNotFound = () => {
  return (
    <div className='home'>
        <Image src={NotFound} width={150} height={50} alt="Description of your image" />
    
        <div  className='not-found'>
        <Link href="/">Back to Homepage</Link>
        </div>   
    </div>
  )
}
export default PageNotFound;

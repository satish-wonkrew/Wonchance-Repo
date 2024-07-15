import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import banner from '/images/banner.png';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Hook to control routing

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <div className='home'>
          <Image src={banner} alt="Description of your image" />
          <Link className='login-button' href="/signup">Go to Signup</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='home'>
        <Image src={banner} alt="Description of your image" />
      </div>
    </div>
  );
};

export default Home;

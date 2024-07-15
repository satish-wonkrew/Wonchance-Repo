// components/Header.tsx
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';


const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Hook to control routing

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Set redirect to false if you handle routing manually
    router.push('/'); // Programmatically navigate to the home page
  };

  return (
    <header className='h-20'>
      <Link href="/"><h1>Wonchance</h1></Link>
      <nav>
        {status === 'authenticated' ? (
          <>
           <Link className='p-5' href="/talents" passHref>Talents</Link>
           <Link className='p-5' href="/addUser" passHref>Add User</Link>
           <Link className='p-5' href="/profile" passHref>My Profile</Link>
            <button onClick={handleLogout} className='logout'>Logout</button>
          </>
        ) : (
          <>
            <Link className='p-5' href="/talents" passHref>Talents</Link>
            <Link href="/signup" className='login-register' passHref>Login/Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
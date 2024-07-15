// pages/_app.tsx
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import {Footer} from '../components/Footer';
import '../styles/globals.css';
import '../styles/talentCard.css';
import '../styles/header.css';
import '../styles/menu.css';
import '../styles/home.css';
import '../styles/signup.css';
import '../styles/talentSingle.css';
import '../styles/registration.css';
import '../styles/profile.css';
import '../styles/profileUpdate.css';
import '../styles/popup.css';



const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Menu />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}

export default MyApp;

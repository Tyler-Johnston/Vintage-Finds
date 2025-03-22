import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import { onAuthStateChanged } from 'firebase/auth';
import UserContext, { User } from '../context/user';
import { auth } from '../lib/firebase';
import { MyHeader } from '../components/Header/MyHeader';
import '../global.css';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [user, setUser] = useState<User | null>(null);

  const backTrack = '';
  let headerLinks = [
      { link: `${backTrack}/signup`, label: 'sign up' },
      { link: `${backTrack}/login`, label: 'login' },
  ];
  if (user) {
    const signup = { link: `${backTrack}/logout`, label: 'log out' };
    headerLinks.push(signup);
    headerLinks = headerLinks.filter(item => item.label !== 'login');
    headerLinks = headerLinks.filter(item => item.label !== 'sign up');
    if (user.uid === process.env.NEXT_PUBLIC_REACT_APP_ADMIN_UID) {
      const admin = { link: `${backTrack}/admin`, label: 'admin' };
      headerLinks.push(admin);
    }
  }

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, (guest) => {
      setUser(guest as User);
    });
    return cleanup;
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Head>
        <title>Vintage Finds</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <MantineProvider
        theme={{ colorScheme: 'light' }}
        withNormalizeCSS
      >
        <MyHeader links={headerLinks} />
        <Component {...pageProps} />
        <Notifications />
      </MantineProvider>
      <Analytics />
    </UserContext.Provider>
  );
}

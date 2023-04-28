import { useState, useEffect } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { onAuthStateChanged } from 'firebase/auth';
import UserContext, { User } from '../context/user';
import LocationContext, { Location } from '../context/location';
import { auth } from '../lib/firebase';
import { MyHeader } from '../components/Header/MyHeader';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [user, setUser] = useState<User | null>(null);
  const [position, setPosition] = useState<Location | null>(null);

  const backTrack = '';
  let headerLinks = [
      { link: `${backTrack}/signup`, label: 'sign up' },
      { link: `${backTrack}/login`, label: 'login' },
  ];
  if (user) {
    const signup = { link: `${backTrack}/logout`, label: 'sign out' };
    headerLinks.push(signup);
    headerLinks = headerLinks.filter(item => item.label !== 'login');
    headerLinks = headerLinks.filter(item => item.label !== 'sign up');
    if (user.uid === process.env.NEXT_PUBLIC_REACT_APP_ADMIN_UID) {
      const admin = { link: `${backTrack}/admin`, label: 'admin' };
      headerLinks.push(admin);
    }
    }

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, (guest) => {
      setUser(guest as User);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <LocationContext.Provider value={position}>
      <UserContext.Provider value={user}>
        <Head>
          <title>Vintage Finds</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <MyHeader links={headerLinks} />
            <Component {...pageProps} />
            <Notifications />
          </MantineProvider>
        </ColorSchemeProvider>
      </UserContext.Provider>
    </LocationContext.Provider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};

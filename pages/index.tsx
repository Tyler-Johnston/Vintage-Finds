// import { ChangeEvent } from 'react';
// import { ref, uploadBytes } from 'firebase/storage';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import UserContext, { User } from '../context/user';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { auth } from '../lib/firebase';

// import { storage } from '../lib/firebase';
// import { GridDashboard } from '../components/Dashboard/GridDashboard';

export default function HomePage() {
  // const [url, setUrl] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook' },
  ];

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, (guest) => {
      console.log('test: ', guest);
      setUser(guest as User);
    });
    return cleanup;
  }, []);

  // async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
  //   const target = event.target as HTMLInputElement;
  //   const file = target.files?.[0];
  //   const fileRef = ref(storage, `/userfiles/${file!.name || ''}`);
  //   const snapshot = await uploadBytes(fileRef, file!);
  //   console.log(snapshot);
  // }

  return (
    <UserContext.Provider value={user}>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      <button type="button" onClick={() => signOut(auth)}>Sign out</button>
      {/* <input type="file" onChange={uploadFile} /> */}
      {/* {url && (
        <img src={url} alt='my image' />
      )} */}
      {/* <GridDashboard /> */}
    </UserContext.Provider>
  );
}

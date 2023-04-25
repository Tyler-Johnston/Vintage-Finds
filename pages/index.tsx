// import { ChangeEvent } from 'react';
// import { ref, uploadBytes } from 'firebase/storage';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import UserContext from '../context/user';
import { HeaderSearch } from '../components/Header/HeaderSearch';
import { auth } from '../lib/firebase';

// import { storage } from '../lib/firebase';
// import { GridDashboard } from '../components/Dashboard/GridDashboard';

export default function HomePage() {
  // const [url, setUrl] = useState('');
  const user = useContext(UserContext);
  const headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook' },
  ];

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      {user ? user.email : 'not logged in'}
      <button type="button" onClick={() => signOut(auth)}>Sign out</button>
      {/* <input type="file" onChange={uploadFile} /> */}
      {/* {url && (
        <img src={url} alt='my image' />
      )} */}
      {/* <GridDashboard /> */}
    </>
  );
}

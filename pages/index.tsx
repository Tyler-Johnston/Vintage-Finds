import { useState, useContext } from 'react';
import { ref, get, child } from 'firebase/database';
import UserContext from '../context/user';
import { HeaderSearch } from '../components/Header/HeaderSearch';
import { db } from '../lib/firebase';

interface Antique {
  id: string;
  name: string;
  description: string;
  condition: string;
  price: number;
  sale: boolean;
}

export default function HomePage() {
  const [antiques, setAntiques] = useState<Antique[]>([]);

  let headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook page' },
    { link: 'http://localhost:3000/signup', label: 'sign up' },
    { link: 'http://localhost:3000/login', label: 'login' },
  ];
  const user = useContext(UserContext);
  if (user) {
    const signup = { link: 'http://localhost:3000/logout', label: 'sign out' };
    headerLinks.push(signup);
    headerLinks = headerLinks.filter(item => item.label !== 'login');
    headerLinks = headerLinks.filter(item => item.label !== 'sign up');
  }

  function getData() {
    const dbRef = ref(db);
    get(child(dbRef, 'antiques/')).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        console.log(typeof snapshot.val());
        const arr = Object.values(snapshot.val()) as Antique[];
        console.log('arr: ', arr);
        setAntiques(arr);
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      {user ? user.email : 'not logged in'}
      <br />
      <button type="button" onClick={getData}>import from db</button>
      {antiques.length > 0 ? antiques.map((antique: Antique) => (
        <div key={antique.id}>
          <p>{antique.name}</p>
          <p>{antique.description}</p>
          <p>Price: {antique.price}</p>
          <p>{antique.sale ? 'on sale' : ''}</p>
        </div>
      )) : 'nothing to show'}
    </>
  );
}

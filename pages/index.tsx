import { useState, useContext, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import Link from 'next/link';
import { Grid, Container } from '@mantine/core';
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
        const data = Object.values(snapshot.val()) as Antique[];
        setAntiques(data);
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  function generateSlug(name: string, id: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `${slug}-${id}`;
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      {user ? user.email : 'not logged in'}
      <br />
      {antiques.length > 0 ? (
      <Grid>
        {antiques.map((antique: Antique) => (
          <Grid.Col key={antique.id} span={4}>
            <Container style={{ backgroundColor: '#252525' }}>
              <Link href={`/${generateSlug(antique.name, antique.id)}`}>{antique.name}</Link>
              <p>{antique.description}</p>
              <p>Price: {antique.price}</p>
              <p>{antique.sale ? 'on sale' : ''}</p>
            </Container>
          </Grid.Col>
        ))}
      </Grid>
        ) : (
          ''
        )}
    </>
  );
}

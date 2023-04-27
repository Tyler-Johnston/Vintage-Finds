import { useState, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { Grid, Container, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { Antique, isAdmin } from '../../dto/antique';
import { db } from '../../lib/firebase';

export default function GridDashboard(props: isAdmin) {
  const [antiques, setAntiques] = useState<Antique[]>([]);
  const theme = useMantineTheme();

  function generateSlug(name: string, id: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `${slug}-${id}`;
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [antiques]);

    return (
        <>
          {antiques.length > 0 ? (
          <Grid>
            {antiques.map((antique: Antique) => (
              <Grid.Col key={antique.id} span={4}>
                <Container style={{ backgroundColor: theme.colorScheme === 'light' ? '#e9ecef' : '#252525' }}>
                  <h3>{antique.name}</h3>
                  {antique.url && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {/* <img src={antique.url} alt="antique" width={400} height={400} /> */}
                      <Link href={`/antiques/${generateSlug(antique.name, antique.id)}`}>
                        <img src={antique.url} alt="antique" width={400} height={400} />
                      </Link>
                    </div>
                  )}
                  <p>{antique.description}</p>
                  <p>Price: {antique.price}</p>
                  <p>{antique.sale ? 'on sale' : ''}</p>
                  <p>{antique.condition}</p>
                  {props.admin ? 'yes admin' : 'not admin'}
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

import { useState, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { Grid, Container, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { Antique } from '../../dto/antique';
import { isAdmin } from '../../dto/isAdmin';
import { db } from '../../lib/firebase';

export default function GridDashboard(props: isAdmin) {
  const [antiques, setAntiques] = useState<Antique[]>([]);
  const theme = useMantineTheme();
  const [isMobile, setIsMobile] = useState(false);

  function generateSlug(name: string, id: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `${slug}.${id}`;
  }

  function getAntiqueData() {
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
    getAntiqueData();
    const { userAgent } = navigator;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent));
  }, []);

    return (
        <>
          {antiques.length > 0 ? (
          <Grid>
            {antiques.map((antique: Antique) => (
              <Grid.Col key={antique.id} span={isMobile ? 6 : 4}>
                <Container style={{ backgroundColor: theme.colorScheme === 'light' ? '#e9ecef' : '#252525' }}>
                  <h3>{antique.name}</h3>
                  {antique.url && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Link href={`/antiques/${generateSlug(antique.name, antique.id)}`}>
                        <img src={antique.url} alt="antique" width={isMobile ? 100 : 300} height={isMobile ? 100 : 300} />
                      </Link>
                    </div>
                  )}
                  <p>Description: {antique.description}</p>
                  <p>Price: {antique.price}</p>
                  <p>{antique.sale ? 'on sale' : ''}</p>
                  <p>Condition: {antique.condition}</p>
                  {props.admin ? 'yes admin' : ''}
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

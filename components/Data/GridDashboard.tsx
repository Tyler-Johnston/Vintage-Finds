import { useState, useEffect } from 'react';
import { ref, get, child, onValue } from 'firebase/database';
import { Grid, Container, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { Antique } from '../../dto/antique';
import { isAdmin } from '../../dto/isAdmin';
import { db } from '../../lib/firebase';
import UpdateAntique from './UpdateAntique';

export default function GridDashboard(props: isAdmin) {
  const [antiques, setAntiques] = useState<Antique[]>([]);
  const theme = useMantineTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isDbUpdated, setIsDbUpdated] = useState(false);

  function generateSlug(name: string, id: string) {
    const noSlashes = name.replace(/\//g, '').toLowerCase();
    const slug = noSlashes.replace(/\s+/g, '-');
    return `${slug}/${id}`;
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
    setIsDbUpdated(false);
  }

  function listenForChanges() {
    const dbRef = ref(db, 'antiques/');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsDbUpdated(true);
      } else {
        console.log('No data available');
      }
    }, (error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    getAntiqueData();
    listenForChanges();
    const { userAgent } = navigator;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent));
  }, []);

  useEffect(() => {
    if (isDbUpdated) {
      console.log('called the isDbUpdated use effect hook, and it is true');
      getAntiqueData();
    }
  }, [isDbUpdated]);

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
                  {props.admin ? (
                    <UpdateAntique
                      id={antique.id}
                      name={antique.name}
                      description={antique.description}
                      condition={antique.condition}
                      price={antique.price}
                      url={antique.url}
                      sale={antique.sale}
                      length={antique.length}
                      width={antique.width}
                      height={antique.height}
                      weight={antique.weight}
                    />
                  ) : (
                    <div>
                      <p>Description: {antique.description}</p>
                      <p>Price: {antique.price}</p>
                      <p>{antique.sale ? 'on sale' : ''}</p>
                      <p>Condition: {antique.condition}</p>
                      <p>length: {antique.length}</p>
                      <p>weight: {antique.weight}</p>
                      <p>width: {antique.width}</p>
                    </div>
                  )}
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

import { useState, useEffect } from 'react';
import { ref, get, child, onValue } from 'firebase/database';
import { Grid } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { Antique } from '../../dto/antique';
import { isAdmin } from '../../dto/isAdmin';
import { db } from '../../lib/firebase';
import AntiqueInputs from './AntiqueInputs';

export default function GridDashboard(props: isAdmin) {
  const [antiques, setAntiques] = useState<Antique[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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
  }

  function listenForChanges() {
    const dbRef = ref(db, 'antiques/');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()) as Antique[];
        setAntiques(data);
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

    return (
        <>
          {antiques.length > 0 ? (
          <Grid>
            {antiques.map((antique: Antique) => (
              <Grid.Col key={antique.id} span={isMobile ? 6 : 2}>
                  {antique.url && (
                    <div>
                      <Link href={`/antiques/${generateSlug(antique.name, antique.id)}`}>
                        <Image src={antique.url} alt="antique" width={isMobile ? 100 : 200} height={isMobile ? 100 : 200} />
                      </Link>
                    </div>
                  )}
                  {props.admin ? (
                    <AntiqueInputs newAntique={false} antique={antique} />
                  ) : (
                    <div>
                      <p>${antique.price}</p>
                    </div>
                  )}
              </Grid.Col>
            ))}
          </Grid>
            ) : (
              'there is nothing listed for sale'
            )}
        </>
    );
}

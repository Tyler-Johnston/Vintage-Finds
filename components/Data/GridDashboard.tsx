import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { Grid, Card, Text } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { Antique } from '../../dto/antique';
import { db } from '../../lib/firebase';
import AntiqueInputs from './AntiqueInputs';

export default function GridDashboard({ isAdmin }: { isAdmin: boolean }) {
  const [antiques, setAntiques] = useState<Antique[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  function generateSlug(name: string, id: string) {
    const noSlashes = name.replace(/\//g, '').toLowerCase();
    const slug = noSlashes.replace(/\s+/g, '-');
    return `${slug}/${id}`;
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
    listenForChanges();
    const { userAgent } = navigator;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent));
  }, []);

    return (
        <>
        <div className="gridColor">
          {antiques.length > 0 ? (
          <Grid>
            {antiques.map((antique: Antique) => (
              <Grid.Col key={antique.id} span={isMobile ? 6 : 2}>
                  {antique.url && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section className="centerContent">
                        <Link href={`/antiques/${generateSlug(antique.name, antique.id)}`} passHref>
                          <Image
                            src={antique.url}
                            alt="antique"
                            width={isMobile ? 100 : 210}
                            height={isMobile ? 100 : 200}
                            className="imageMargin"
                          />
                        </Link>
                      </Card.Section>
                      <Card.Section className="centerContent">
                        <Text className="ellipsisText" fw={500}>{antique.name}</Text>
                      </Card.Section>
                      <Card.Section className={isAdmin ? '' : 'centerContent'}>
                      {isAdmin ? (
                          <AntiqueInputs newAntique={false} antique={antique} />
                          ) : (
                          <div>
                            <p>${antique.price}</p>
                          </div>
                      )}
                      </Card.Section>
                    </Card>
                  )}
              </Grid.Col>
            ))}
          </Grid>
            ) : (
              ''
            )}
        </div>
        </>
    );
}

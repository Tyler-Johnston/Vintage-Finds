import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Text, Box, Group } from '@mantine/core';
import { ref, get, child } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { Antique } from '../../../dto/antique';
import { ErrorTitle } from '../../../components/Error/Error';

export default function AntiqueTest() {
  const router = useRouter();
  const [antique, setAntique] = useState<Antique>();

  async function getAntiqueId() {
    const { id } = await router.query;
    const parameters = id as string;
    const index = parameters.lastIndexOf('/');
    return parameters.substring(index + 1);
  }

  async function getAntiqueData() {
    const dbRef = ref(db);
    const id = await getAntiqueId();
    try {
      const snapshot = await get(child(dbRef, `antiques/${id}`));
      if (snapshot.exists()) {
        const data = snapshot.val() as Antique;
        setAntique(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAntiqueData();
  }, []);

  return (
    <>
      {antique ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <div style={{ marginRight: '20px' }}>
            <Image
              src={antique.url}
              alt="antique"
              width={400}
              height={400}
              style={{ borderRadius: '8px' }}
            />
          </div>

          <Box style={{ maxWidth: '400px', textAlign: 'left' }}>
            <Text size="xl" weight={700} style={{ marginBottom: '10px' }}>
              {antique.name}
            </Text>
            <Text size="md" color="dimmed" style={{ marginBottom: '10px' }}>
              {antique.description}
            </Text>
            <Text size="lg" weight={600} style={{ marginBottom: '5px' }}>
              Price: ${antique.price}
            </Text>
            <Text size="md" color="dimmed" style={{ marginBottom: '20px' }}>
              Condition: {antique.condition || 'Unknown'}
            </Text>

            <Group>
              <Button variant="filled" color="teal" style={{ marginRight: '10px' }}>
                Add to Cart
              </Button>
              <Button variant="outline" color="blue">
                Email Shop Owner
              </Button>
            </Group>
          </Box>
        </div>
      ) : (
        <div>
          <ErrorTitle
            number={404}
            description="You may have mistyped the address, or the page has been moved to another URL."
          />
        </div>
      )}
    </>
  );
}

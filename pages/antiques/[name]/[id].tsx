import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Text, Box, Group } from '@mantine/core';
import { ref, get, child, update } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { Antique } from '../../../dto/antique';
import { ErrorTitle } from '../../../components/Error/Error';
import UserContext from '../../../context/user';

export default function AntiqueTest() {
  const router = useRouter();
  const [antique, setAntique] = useState<Antique>();
  const user = useContext(UserContext);

  // Get Antique ID from URL
  async function getAntiqueId() {
    const { id } = await router.query;
    const parameters = id as string;
    const index = parameters.lastIndexOf('/');
    return parameters.substring(index + 1);
  }

  // Fetch Antique Data from Firebase
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

  // Add item to cart function
  async function addToCart(item: Antique) {
    if (!user) {
      console.log('no user');
      return;
    }

    const cartItemRef = ref(db, `users/${user.uid}/cart/${item.id}`);

    try {
      // check if the item already exists in the cart
      const snapshot = await get(cartItemRef);
      if (snapshot.exists()) {
        const existingItem = snapshot.val();
        const updatedQuantity = existingItem.quantity + 1;
        await update(cartItemRef, { quantity: updatedQuantity });
        console.log('success yas');
      } else {
        await update(cartItemRef, {
          name: item.name,
          price: item.price,
          url: item.url,
          quantity: 1,
        });
        console.log('success again');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
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
              <Button
                variant="filled"
                color="teal"
                style={{ marginRight: '10px' }}
                onClick={() => addToCart(antique)}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                color="blue"
                component="a"
                href={`mailto:shopowner@example.com?subject=Inquiry about ${antique.name}&body=Hello, I am interested in the item ${antique.name}. Could you provide more details?`}
              >
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

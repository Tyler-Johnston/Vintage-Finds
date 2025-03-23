import { useState, useEffect, useContext } from 'react';
import { ref, get, remove } from 'firebase/database';
import { Card, Text, Image, Button, Group, Box } from '@mantine/core';
import { db } from '../lib/firebase';
import UserContext from '../context/user';
import { ErrorTitle } from '../components/Error/Error';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const user = useContext(UserContext);

  // Fetch the user's cart items from Firebase
  async function fetchCartItems() {
    if (!user) return;

    const cartRef = ref(db, `users/${user.uid}/cart`);
    try {
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        const items = Object.keys(cartData).map((key) => ({
          id: key,
          ...cartData[key],
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
        console.log('Cart is empty');
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  }

  // Remove item from cart
  async function removeFromCart(itemId: string) {
    if (!user) return;

    const itemRef = ref(db, `users/${user.uid}/cart/${itemId}`);
    try {
      await remove(itemRef);
      // Update state after removing the item
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  return (
    <>
      {user ? (
        <div>
          <h2>Welcome to the Cart Page</h2>
          {cartItems.length > 0 ? (
            <Box>
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ marginBottom: '20px' }}
                >
                  <Group position="apart" style={{ marginBottom: 5 }}>
                    <Text weight={700}>{item.name}</Text>
                    <Text size="lg">${item.price}</Text>
                  </Group>
                  <Image
                    src={item.url}
                    alt={item.name}
                    width={200}
                    height={200}
                    fit="contain"
                    style={{ marginBottom: '10px' }}
                  />
                  <Text>Quantity: {item.quantity}</Text>
                  <Button
                    color="red"
                    variant="light"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </Card>
              ))}
            </Box>
          ) : (
            <Text>No items in your cart.</Text>
          )}
        </div>
      ) : (
        <div>
          <ErrorTitle
            number={403}
            description="You are not authorized to access this webpage"
          />
        </div>
      )}
    </>
  );
}

import { useState, useContext, useEffect } from 'react';
import { ref, set, push } from 'firebase/database';
import {
    TextInput,
    // FileInput,
    Textarea,
    NumberInput,
    Button,
  } from '@mantine/core';
 import UserContext from '../context/user';
 import { ErrorTitle } from '../components/Error/Error';
 import { db } from '../lib/firebase';

export default function Admin() {
    const user = useContext(UserContext);
    const [authorized, setAuthorized] = useState(false);
    const [name, setName] = useState('');
    // const [picture, setPicture] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('');
    const [price, setPrice] = useState(20);
    const [error, setError] = useState('');

    function authorize() {
        if (user && user.uid === 'lFvS2ds2sNPY9lb1fG1BMMDaMqp1') {
            setAuthorized(true);
        }
    }

    async function writeUserData() {
        const antiquesRef = ref(db, 'antiques/');
        const newAntiqueRef = push(antiquesRef);
        const newAntiqueKey = newAntiqueRef.key;

        await set(newAntiqueRef, {
          id: newAntiqueKey,
          name,
          // picture,
          description,
          condition,
          price,
          sale: false,
        });
      }

      function checkInputs() {
        if (name === '' || condition === '' || description === '' || Number.isNaN(price)) {
            setError('You are missing a required field');
            return false;
        // eslint-disable-next-line no-else-return
        } else {
            setError('');
            return true;
        }
      }

    useEffect(() => {
        authorize();
    }, [user]);

    return (
        <>
            {authorized ? (
                <div>
                    <h1>Hello, {user?.email}</h1>
                    <TextInput
                      placeholder="Vintage Coca-Cola sign"
                      label="Antique Name"
                      withAsterisk
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {/* <FileInput
                        placeholder="Pick file"
                        label="Image"
                        withAsterisk
                    /> */}
                    <Textarea
                      placeholder="Buy this amazing product"
                      label="Description"
                      withAsterisk
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                     <TextInput
                       placeholder="Mint conditon"
                       label="Condition"
                       withAsterisk
                       required
                       value={condition}
                       onChange={(e) => setCondition(e.target.value)}
                     />
                     <NumberInput
                       defaultValue={20}
                       placeholder="20"
                       label="Price"
                       withAsterisk
                       required
                       value={price}
                       onChange={(val: string | number) => {
                        if (typeof val === 'number') {
                            setPrice(val);
                        } else {
                            setPrice(parseFloat(val));
                        }
                        }}
                     />
                     <Button type="button" onClick={() => checkInputs() ? writeUserData() : console.log('invalid')}>
                        Submit
                     </Button>
                     {error}
                </div>
            ) : (
                <div>
                    <ErrorTitle number={403} description="You are not authorized to access this webpage" />
                </div>
            ) }
        </>
    );
}

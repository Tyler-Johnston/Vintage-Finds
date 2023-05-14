import { useState } from 'react';
import { ref as databaseRef, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    TextInput,
    FileInput,
    Textarea,
    NumberInput,
    Button,
  } from '@mantine/core';
import { db, storage } from '../../lib/firebase';

export default function CreateAntique() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('');
    const [price, setPrice] = useState(20);
    const [error, setError] = useState('');
    const [image, setImage] = useState<File | null>(null);

    async function uploadImage(id: string) {
      if (image) {
        const fileRef = storageRef(storage, `antiqueimages/${id}`);
        await uploadBytes(fileRef, image);
        const downloadUrl = await getDownloadURL(storageRef(storage, `antiqueimages/${id}`));
        return downloadUrl;
      }
      return 'no image!';
    }

    function checkInputs() {
      const errors = [];
      name === '' && errors.push('Name');
      condition === '' && errors.push('Condition');
      description === '' && errors.push('Description');
      Number.isNaN(price) && errors.push('Price');

      const errorMessage = `Missing Attribute${errors.length > 1 ? 's' : ''}: ${errors.join(', ')}`;
      setError(errors.length > 0 ? errorMessage : '');
      return !errors.length;
    }
    function clearInputs() {
        setName('');
        setDescription('');
        setCondition('');
        setImage(null);
      }

    async function writeUserData() {
      try {
        const antiquesRef = databaseRef(db, 'antiques/');
        const newAntiqueRef = push(antiquesRef);
        const newAntiqueKey = newAntiqueRef.key;
        const url = await uploadImage(newAntiqueKey!);

        await set(newAntiqueRef, {
          id: newAntiqueKey,
          name,
          url,
          description,
          condition,
          price,
          sale: false,
        });
      } catch (err) {
        console.log('error: ', err);
        setError('You are not authorized to write to the database');
      }
      clearInputs();
    }

    return (
        <>
          <TextInput
            placeholder="Vintage Coca-Cola sign"
            label="Antique Name"
            withAsterisk
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FileInput
            placeholder="Pick file"
            label="Image"
            accept="image/*"
            withAsterisk
            value={image}
            onChange={(file: File | null) => setImage(file)}
          />
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
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </>
    );
}

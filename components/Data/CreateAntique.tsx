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
    const [length, setLength] = useState(5);
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const [weight, setWeight] = useState(5);

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
        if (name === '' || condition === '' || description === '' || Number.isNaN(price) || image === null || Number.isNaN(length) || Number.isNaN(width) || Number.isNaN(height) || Number.isNaN(weight)) {
            setError('You are missing a required field');
            return false;
        }
        setError('');
        return true;
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
          length,
          width,
          height,
          weight,
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
          <NumberInput
            defaultValue={5}
            placeholder="5"
            label="Length (in)"
            withAsterisk
            required
            value={length}
            onChange={(val: string | number) => {
            if (typeof val === 'number') {
                setLength(val);
            } else {
                setLength(parseFloat(val));
            }
            }}
          />
          <NumberInput
            defaultValue={5}
            placeholder="5"
            label="Width (in)"
            withAsterisk
            required
            value={width}
            onChange={(val: string | number) => {
            if (typeof val === 'number') {
                setWidth(val);
            } else {
                setWidth(parseFloat(val));
            }
            }}
          />
          <NumberInput
            defaultValue={5}
            placeholder="5"
            label="Height (in)"
            withAsterisk
            required
            value={height}
            onChange={(val: string | number) => {
            if (typeof val === 'number') {
                setHeight(val);
            } else {
                setHeight(parseFloat(val));
            }
            }}
          />
          <NumberInput
            defaultValue={5}
            placeholder="5"
            label="Weight (lb)"
            withAsterisk
            required
            value={weight}
            onChange={(val: string | number) => {
            if (typeof val === 'number') {
                setWeight(val);
            } else {
                setWeight(parseFloat(val));
            }
            }}
          />
          <Button type="button" onClick={() => checkInputs() ? writeUserData() : console.log('invalid')}>
            Submit
          </Button>
          {error}
        </>
    );
}

import { useState } from 'react';
import { ref as databaseRef, update, set, push, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
    TextInput,
    FileInput,
    Textarea,
    NumberInput,
    Button,
  } from '@mantine/core';
import { db, storage } from '../../lib/firebase';
import { Antique } from '../../dto/antique';

export default function AntiqueInputs({ newAntique, antique }:
    { newAntique: boolean, antique?: Antique }) {
    const [name, setName] = useState<string>(antique ? antique.name : '');
    const [description, setDescription] = useState<string>(antique ? antique.description : '');
    const [condition, setCondition] = useState<string>(antique ? antique.condition : '');
    const [price, setPrice] = useState<number | ''>(antique ? antique.price : '');
    const [error, setError] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    function checkInputs() {
      const errors = [];
      name === '' && errors.push('Name');
      image === null && errors.push('Image');
      condition === '' && errors.push('Condition');
      description === '' && errors.push('Description');
      (price === '' || Number.isNaN(price)) && errors.push('Price');

      const errorMessage = `Missing Attribute${errors.length > 1 ? 's' : ''}: ${errors.join(', ')}`;
      setError(errors.length > 0 ? errorMessage : '');
      return !errors.length;
    }

    function clearInputs() {
        setName('');
        setDescription('');
        setCondition('');
        setPrice('');
        setImage(null);
    }

    async function uploadImage(id: string) {
        if (image) {
          const fileRef = storageRef(storage, `antiqueimages/${id}`);
          await uploadBytes(fileRef, image);
          const downloadUrl = await getDownloadURL(storageRef(storage, `antiqueimages/${id}`));
          return downloadUrl;
        }
        return 'no image!';
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

    async function deleteAntique() {
        if (antique) {
            try {
                const antiquesRef = databaseRef(db, `antiques/${antique.id}`);
                await remove(antiquesRef);

                const imageRef = storageRef(storage, `antiqueimages/${antique.id}`);
                await deleteObject(imageRef);
            } catch (err) {
                setError('You are not authorized to delete from the database');
            }
        }
    }

    async function updateUserData() {
        if (antique) {
            try {
                const antiquesRef = databaseRef(db, `antiques/${antique.id}`);
                // if image = null, don't update the image. else, replace the image the new one the user uploads
                const dataToUpdate = image === null
                ? { name, description, condition, price, sale: false }
                : { name,
                   url: await uploadImage(antique.id),
                  description,
                  condition,
                  price,
                  sale: false };

                await update(antiquesRef, dataToUpdate);
              } catch (err) {
                setError('You are not authorized to write to the database');
            }
        }
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
            placeholder="20"
            label="Price"
            withAsterisk
            required
            value={price}
            onChange={(val: string | number) => {
              if (val === '' || val === null) {
                setPrice('');
              } else if (typeof val === 'number') {
                setPrice(val);
              } else {
                setPrice(parseFloat(val));
              }
            }}
          />
          {newAntique ? (
            <Button type="button" onClick={() => checkInputs() ? writeUserData() : ''}>
                Submit
            </Button>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="button" onClick={() => checkInputs() ? updateUserData() : ''}>
                    Update
                </Button>
                <Button type="button" onClick={deleteAntique}>
                    Delete
                </Button>
            </div>
          )}
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </>
    );
}

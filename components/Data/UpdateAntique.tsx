import { useState } from 'react';
import { ref as databaseRef, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
    TextInput,
    FileInput,
    Textarea,
    NumberInput,
    Button,
  } from '@mantine/core';
import { db, storage } from '../../lib/firebase';
import { AntiqueProp } from '../../dto/antique';

export default function UpdateAntique({ antique } : AntiqueProp) {
    const [name, setName] = useState(antique.name);
    const [description, setDescription] = useState(antique.description);
    const [condition, setCondition] = useState(antique.condition);
    const [price, setPrice] = useState(antique.price);
    const [error, setError] = useState('');
    const [image, setImage] = useState<File | null>(null);

    async function uploadImage() {
      if (image) {
        const fileRef = storageRef(storage, `antiqueimages/${antique.id}`);
        await uploadBytes(fileRef, image);
        const downloadUrl = await getDownloadURL(storageRef(storage, `antiqueimages/${antique.id}`));
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

    async function updateUserData() {
      try {
        const antiquesRef = databaseRef(db, `antiques/${antique.id}`);

        // if image = null, don't update the image. else, replace the image the new one the user uploads
        const dataToUpdate = image === null
        ? { name, description, condition, price, sale: false }
        : { name,
           url: await uploadImage(),
          description,
          condition,
          price,
          sale: false };

        await update(antiquesRef, dataToUpdate);
      } catch (err) {
        setError('You are not authorized to write to the database');
      }
    }

    async function deleteAntique() {
        try {
            const antiquesRef = databaseRef(db, `antiques/${antique.id}`);
            await remove(antiquesRef);

            const imageRef = storageRef(storage, `antiqueimages/${antique.id}`);
            await deleteObject(imageRef);
        } catch (err) {
            setError('You are not authorized to delete from the database');
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="button" onClick={() => checkInputs() ? updateUserData() : console.log('invalid')}>
                Update
            </Button>
            <Button type="button" onClick={deleteAntique}>
                Delete
            </Button>
          </div>
          <div style={{ color: 'red' }}>
            {error}
          </div>
        </>
    );
}

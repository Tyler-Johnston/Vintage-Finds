import { ChangeEvent } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { storage } from '../lib/firebase';
// import { GridDashboard } from '../components/Dashboard/GridDashboard';

export default function HomePage() {
  // const [url, setUrl] = useState('');
  const headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook' },
  ];

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const fileRef = ref(storage, `/userfiles/${file!.name || ''}`);
    const snapshot = await uploadBytes(fileRef, file!);
    console.log(snapshot);
  }

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      <input type="file" onChange={uploadFile} />
      {/* {url && (
        <img src={url} alt='my image' />
      )} */}
      {/* <GridDashboard /> */}
    </>
  );
}

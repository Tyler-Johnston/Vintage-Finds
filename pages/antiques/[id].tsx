import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, get, child } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Antique } from '../../dto/antique';

export default function AntiqueTest() {
    const router = useRouter();
    const [antiqueId, setAntiqueId] = useState('');
    const [antique, setAntique] = useState<Antique>();

    async function getAntiqueId() {
        const { id } = await router.query;
        console.log('in getId pram: ', id);
        const parameters = id as string;
        const parametersArray = parameters.split('.');
        return parametersArray[1];
    }

    async function getAntiqueData() {
        const dbRef = ref(db);
        const id = await getAntiqueId();
        console.log('id in datafun: ', id);
        setAntiqueId(id);
        try {
          const snapshot = await get(child(dbRef, `antiques/${id}`));
          if (snapshot.exists()) {
            const data = snapshot.val() as Antique;
            setAntique(data);
            console.log('data in datfunc: ', data);
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
            {antiqueId}
            {antique ? (
                <div>
                    <p>{antique.name}</p>
                    <p>{antique.description}</p>
                    <p>{antique.price}</p>
                    <img src={antique.url} alt="antique" width={400} height={400} />
                </div>
            )
                 : 'no'}
        </>
    );
}

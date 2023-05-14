import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <p>{antique.name}</p>
                        <Image src={antique.url} alt="antique" width={400} height={400} />
                        <p>{antique.description}</p>
                        <p>${antique.price}</p>
                    </div>
                </div>
            )
            : (
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

import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        signOut(auth);
        router.push('/');
    }, []);

    return (
        <>
            <p>Logging out...</p>
        </>
    );
}

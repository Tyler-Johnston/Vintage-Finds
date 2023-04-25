import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserContext from '../context/user';

export default function Admin() {
    const user = useContext(UserContext);
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    function authorize() {
        if (user && user.uid === 'lFvS2ds2sNPY9lb1fG1BMMDaMqp1') {
            setAuthorized(true);
        }
    }

    useEffect(() => {
        authorize();
    }, [user]);

    return (
        <>
            {authorized ? (
                <div>
                    <p>youre in!</p>
                </div>
            ) : (
                <div>
                    <p>not authorized</p>
                    <button type="button" onClick={() => router.push('/')}>Go back</button>
                </div>
            ) }
        </>
    );
}

import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/user';
import { ErrorTitle } from '../components/Error/Error';
import GridDashboard from '../components/Data/GridDashboard';
import AntiqueInputs from '../components/Data/AntiqueInputs';

export default function Admin() {
    const user = useContext(UserContext);
    const [authorized, setAuthorized] = useState(false);

    function authorize() {
        if (user && user.uid === process.env.NEXT_PUBLIC_REACT_APP_ADMIN_UID) {
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
                     <AntiqueInputs newAntique />
                     <GridDashboard admin />
                </div>
            ) : (
                <div>
                    <ErrorTitle number={403} description="You are not authorized to access this webpage" />
                </div>
            ) }
        </>
    );
}

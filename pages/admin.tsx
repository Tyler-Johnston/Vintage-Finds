import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/user';
import { ErrorTitle } from '../components/Error/Error';
import GridDashboard from '../components/Data/GridDashboard';
import CreateAntique from '../components/Data/CreateAntique';

export default function Admin() {
    const user = useContext(UserContext);
    const [authorized, setAuthorized] = useState(false);

    function authorize() {
        console.log('env var: ', process.env.NEXT_PUBLIC_REACT_APP_ADMIN_UID);
        if (user && user.uid === process.env.NEXT_PUBLIC_REACT_APP_ADMIN_UID) {
            console.log('got past the if statment check for env var');
            setAuthorized(true);
        }
    }

    useEffect(() => {
        console.log('in use effect in admin');
        authorize();
    }, [user]);

    return (
        <>
            {authorized ? (
                <div>
                    <h1>Hello, {user?.email}</h1>
                     <CreateAntique />
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

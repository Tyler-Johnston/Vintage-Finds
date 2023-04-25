import { useContext } from 'react';
import UserContext from '../context/user';
import { ForgotPassword } from '../components/Authentication/ForgotPassword';

export default function Login() {
    const user = useContext(UserContext);
    return (
        <>
            <h1>{user ? user.email : 'not logged in'}</h1>
            <ForgotPassword />
        </>
    );
}

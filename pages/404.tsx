import { ErrorTitle } from '../components/Error/Error';

export default function Login() {
    return (
        <>
            <ErrorTitle
              number={404}
              description="You may have mistyped the address, or the page has been moved to another URL."
            />
        </>
    );
}

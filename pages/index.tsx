import { useContext } from 'react';
import UserContext from '../context/user';
import { HeaderSearch } from '../components/Header/HeaderSearch';
import GridDashboard from '../components/Data/GridDashboard';

export default function HomePage() {
  let headerLinks = [
    { link: 'https://vintage-finds.vercel.app/signup', label: 'sign up' },
    { link: 'https://vintage-finds.vercel.app/login', label: 'login' },
  ];
  const user = useContext(UserContext);
  if (user) {
    const signup = { link: 'https://vintage-finds.vercel.app/logout', label: 'sign out' };
    headerLinks.push(signup);
    headerLinks = headerLinks.filter(item => item.label !== 'login');
    headerLinks = headerLinks.filter(item => item.label !== 'sign up');
  }

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <GridDashboard admin={false} />
    </>
  );
}

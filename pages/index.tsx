import { useContext } from 'react';
import UserContext from '../context/user';
import { HeaderSearch } from '../components/Header/HeaderSearch';
import GridDashboard from '../components/Dashboard/GridDashboard';

export default function HomePage() {
  let headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook page' },
    { link: 'http://localhost:3000/signup', label: 'sign up' },
    { link: 'http://localhost:3000/login', label: 'login' },
  ];
  const user = useContext(UserContext);
  if (user) {
    const signup = { link: 'http://localhost:3000/logout', label: 'sign out' };
    headerLinks.push(signup);
    headerLinks = headerLinks.filter(item => item.label !== 'login');
    headerLinks = headerLinks.filter(item => item.label !== 'sign up');
  }

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <h1>vintage finds</h1>
      {user ? user.email : 'not logged in'}
      <br />
      <GridDashboard admin={false} />
    </>
  );
}

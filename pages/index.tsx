import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { GridAsymmetrical } from '../components/Dashboard/GridAsymmetrical';

export default function HomePage() {
  const headerLinks = [
    { link: 'https://www.facebook.com/people/Vintage-Finds-Utah/100030320875882/', label: 'facebook' },
  ];

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <GridAsymmetrical />
    </>
  );
}

import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';

export default function HomePage() {
  const headerLinks = [
    { link: 'https://www.google.com', label: 'google' },
    { link: 'https://duckduckgo.com', label: 'duckduckgo' },
    { link: 'http://localhost:3000/hello', label: 'hello' },
  ];

  return (
    <>
      <HeaderSearch links={headerLinks} />
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}

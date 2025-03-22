import { Image } from '@mantine/core';
import GridDashboard from '../components/Data/GridDashboard';

export default function HomePage() {
  return (
    <>
      <Image
        radius="xs"
        src="/vintage-finds-logo.jpg"
        alt="Vintage Finds Logo"
        height={250}
        fit="contain"
      />
      <br />
      <GridDashboard isAdmin={false} />
    </>
  );
}

import { Image, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import GridDashboard from '../components/Data/GridDashboard';

export default function HomePage() {
  return (
    <>
      <Carousel slideSize="70%" height={270} slideGap="md" loop>
        <Carousel.Slide className="carBg1">
        <Image
          radius="xs"
          src="/vintage-finds-logo.jpg"
          alt="Vintage Finds Logo"
          height={200}
          fit="contain"
          style={{ marginTop: '10px' }}
        />
        <Text className="centerContent">Welcome to Vintage Finds. Please take a look at our collection!</Text>
        </Carousel.Slide>
        <Carousel.Slide className="carBg2">
          <Image
            radius="xs"
            src="/featured-collection.jpg"
            alt="Featured Collection"
            height={200}
            fit="cover"
            style={{ marginTop: '10px' }}
          />
          <Text className="centerContent">
            Discover our Featured Collection! Unique and rare finds you won’t want to miss.
          </Text>
        </Carousel.Slide>
        <Carousel.Slide className="carBg3">
          <Image
            radius="xs"
            src="/about-us.jpg"
            alt="About Vintage Finds"
            height={200}
            fit="cover"
            style={{ marginTop: '10px' }}
          />
          <Text className="centerContent">
            Established in 1988, Vintage Finds brings you timeless treasures from all eras.
            We value quality, authenticity, and craftsmanship.
          </Text>
        </Carousel.Slide>
      </Carousel>
      <br />
      <GridDashboard isAdmin={false} />
    </>
  );
}

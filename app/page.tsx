import Hero from '@/components/Hero';
import Introduction from '@/components/Introduction';
import Rooms from '@/components/Rooms';
import Gallery from '@/components/Gallery';
import LocationSection from '@/components/LocationSection';
import ExperiencesStrip from '@/components/ExperiencesStrip';
import Booking from '@/components/Booking';

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Rooms />
      <Gallery />
      <LocationSection />
      <ExperiencesStrip />
      <Booking />
    </>
  );
}

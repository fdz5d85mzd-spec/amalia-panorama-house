import Hero from '@/components/Hero';
import Introduction from '@/components/Introduction';
import Rooms from '@/components/Rooms';
import Gallery from '@/components/Gallery';
import ExperiencesStrip from '@/components/ExperiencesStrip';

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Rooms />
      <Gallery />
      <ExperiencesStrip />
    </>
  );
}

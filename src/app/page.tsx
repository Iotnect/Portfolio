import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { NeoVision } from '@/components/sections/NeoVision';
import { Solutions } from '@/components/sections/Solutions';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Expertise />
      <NeoVision />
      <Solutions />
      <Contact />
    </main>
  );
}

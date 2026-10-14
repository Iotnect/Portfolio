import { Hero } from '@/components/sections/Hero';
import { Introduction } from '@/components/sections/Introduction';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { NeoVision } from '@/components/sections/NeoVision';
import { Solutions } from '@/components/sections/Solutions';
import { Contact } from '@/components/sections/Contact';
import { ApplicationBackdrop } from '@/components/effects/ApplicationBackdrop';

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <div className="company-overview">
        <ApplicationBackdrop />
        <Introduction />
        <About />
      </div>
      <Expertise />
      <NeoVision />
      <Solutions />
      <Contact />
    </main>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/lib/content';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    const closeOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const media = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => { if (media.matches) setIsOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOutside);
    media.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('click', closeOutside);
      media.removeEventListener('change', closeOnDesktop);
    };
  }, [isOpen]);

  return (
    <header className="header" ref={headerRef}>
      <div className="container navigation">
        <a className="brand" href="#" aria-label="IOTNECT home" onClick={() => setIsOpen(false)}>
          <img src="/assets/iotnect-logo.jpeg" alt="IOTNECT" width={62} height={62} />
          <span>IOTNECT<span className="brand-caption">INTELLIGENCE. CONNECTED.</span></span>
        </a>
        <button
          className="menu-toggle"
          ref={toggleRef}
          aria-expanded={isOpen}
          aria-controls="navigation"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setIsOpen(open => !open)}
        ><span /><span /></button>
        <nav id="navigation" className={isOpen ? 'open' : undefined} aria-label="Main navigation">
          {navigation.map(item => (
            <a href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</a>
          ))}
          <a className="button button-small" href="#contact" onClick={() => setIsOpen(false)}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

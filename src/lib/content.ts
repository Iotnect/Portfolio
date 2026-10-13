export const navigation = [
  { href: '#about', label: 'About us' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#neo-vision', label: 'Neo Vision' },
  { href: '#solutions', label: 'Solutions' },
] as const;

export type Capability = {
  number: string;
  icon: string;
  title: string;
  description: string;
  tagline: string;
};

export const capabilities: readonly Capability[] = [
  {
    number: '01', icon: '◎', title: 'AI & computer vision',
    description: 'Transform existing CCTV into intelligent monitoring systems with AI-powered video analytics and actionable insights.',
    tagline: 'SEE. UNDERSTAND. ACT.',
  },
  {
    number: '02', icon: '⌘', title: 'Internet of Things',
    description: 'Connect conventional systems through data communication and IoT retrofitting for convenient remote monitoring.',
    tagline: 'CONNECT THE PHYSICAL WORLD.',
  },
  {
    number: '03', icon: '▧', title: 'Hardware & systems',
    description: 'Supply, installation and repair of hardware and equipment, complemented by circuitry design and custom system development.',
    tagline: 'BUILT FOR YOUR OPERATIONS.',
  },
];

export type Solution = {
  category: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
};

export const solutions: readonly Solution[] = [
  {
    category: '01 / SMART CITIES', title: 'AI flood monitoring',
    description: 'Monitor water levels, detect rising water and send alerts to help authorities respond to flood risks.',
    image: '/assets/flood-dashboard.webp', imageAlt: 'Flood monitoring dashboard with camera feed', width: 1440, height: 923,
  },
  {
    category: '02 / SAFETY & SECURITY', title: 'Human behaviour analysis',
    description: 'Identify events such as falls, fighting, running or loitering, with alerts that help security teams respond.',
    image: '/assets/behaviour.webp', imageAlt: 'CCTV view with computer vision detection regions', width: 1204, height: 799,
  },
  {
    category: '03 / SMART OPERATIONS', title: 'Smart factories & buildings',
    description: 'Gain insights into workforce activities, attendance, safety compliance and operational events.',
    image: '/assets/factory-dashboard.webp', imageAlt: 'Smart factory workforce and attendance dashboard', width: 1178, height: 684,
  },
  {
    category: '04 / QUALITY CONTROL', title: 'AI product inspection',
    description: 'Detect defects, identify irregularities and verify product quality to support more efficient production.',
    image: '/assets/inspection.webp', imageAlt: 'Computer vision product inspection detecting product regions and quality status', width: 1201, height: 939,
  },
];

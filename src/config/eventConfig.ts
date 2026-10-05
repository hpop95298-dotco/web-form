// ============================================================================
// IEEE Innovation University Student Branch - Event Configuration
// Central configuration file for Web Development Journey
// ============================================================================

export interface EventConfig {
  eventName: string;
  tagline: string;
  orgName: string;
  universityName: string;
  description: string;
  isFree: boolean;
  laptopMandatory: boolean;
  registrationStartDate: string; // ISO format: YYYY-MM-DD
  registrationEndDate: string;   // ISO format: YYYY-MM-DD
  whatsappGroupUrl: string;
  contactEmail: string;
  logos: {
    iuLogo: string;
    ieeeLogo: string;
  };
  roadmap: Array<{
    number: string;
    stageLabel: string;
    title: string;
    description: string;
    topics: string[];
  }>;
  benefits: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  whoShouldJoin: Array<{
    title: string;
    description: string;
    tag: string;
  }>;
  whatYouWillGain: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const EVENT_CONFIG: EventConfig = {
  eventName: 'Web Development Journey',
  tagline: 'From Front-End to Full-Stack Development',
  orgName: 'IEEE Innovation University Student Branch',
  universityName: 'Innovation University',
  description:
    'Welcome to the Web Development Journey! This journey is designed for students interested in learning Web Development from the fundamentals to more advanced topics. Practical hands-on training built to kickstart your tech career.',
  isFree: true,
  laptopMandatory: true,
  registrationStartDate: '2026-10-01',
  registrationEndDate: '2026-10-25',
  whatsappGroupUrl: 'https://chat.whatsapp.com/H3OKxmqRWavLBWcf39T44J',
  contactEmail: 'webdev.journey@ieee-innovation.edu',
  logos: {
    iuLogo: '/iu-logo-transparent.png',
    ieeeLogo: '/ieee-sb-logo-transparent.png',
  },
  roadmap: [
    {
      number: '01',
      stageLabel: 'Stage 01',
      title: 'Front-End Development',
      description: 'Build the foundation of modern web interfaces and interactive experiences.',
      topics: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      number: '02',
      stageLabel: 'Stage 02',
      title: 'Back-End Development',
      description: 'Understand how applications process data and communicate with the server.',
      topics: ['Server-side Development', 'APIs', 'Web Architecture'],
    },
    {
      number: '03',
      stageLabel: 'Stage 03',
      title: 'Database & SQL',
      description: 'Learn how applications store, query, and manage structured data.',
      topics: ['Databases', 'SQL', 'Data Management'],
    },
    {
      number: '04',
      stageLabel: 'Stage 04',
      title: '.NET Development',
      description: 'Explore web application development using the C# and .NET ecosystem.',
      topics: ['C#', '.NET', 'Web Application Development'],
    },
    {
      number: '05',
      stageLabel: 'Stage 05',
      title: 'Freelancing & Career Development',
      description: 'Learn how to present your skills and prepare for professional opportunities.',
      topics: ['Freelancing', 'Portfolio', 'Career Preparation'],
    },
  ],
  benefits: [
    {
      title: 'Build Strong Foundations',
      description: 'Understand the fundamentals of modern Web Development step by step.',
      icon: 'code',
    },
    {
      title: 'Learn by Doing',
      description: 'Focus on practical hands-on learning during guided sessions instead of theory only.',
      icon: 'laptop',
    },
    {
      title: 'Explore the Full Stack',
      description: 'Understand how Front-End, Back-End, and Databases seamlessly connect together.',
      icon: 'layers',
    },
    {
      title: 'Work with Real Technologies',
      description: 'Build familiarity with tools and industry-standard technologies used in modern web dev.',
      icon: 'rocket',
    },
    {
      title: 'Prepare for Your Career',
      description: 'Learn how to present your technical skills and showcase your work to employers.',
      icon: 'briefcase',
    },
    {
      title: 'Explore Freelancing',
      description: 'Understand the basics of starting as a freelance web developer and managing clients.',
      icon: 'globe',
    },
  ],
  whoShouldJoin: [
    {
      title: 'Beginners',
      description: 'Students starting their Web Development journey with zero or minimal experience.',
      tag: 'No Prior Coding Required',
    },
    {
      title: 'Students with Basic Knowledge',
      description: 'Students who already know basic programming or web concepts and want structure.',
      tag: 'Solidify Basics',
    },
    {
      title: 'Students with Projects',
      description: 'Students who want to level up their existing code and explore backend & databases.',
      tag: 'Practical Skills',
    },
    {
      title: 'Future Full-Stack Developers',
      description: 'Students interested in understanding the complete end-to-end development cycle.',
      tag: 'Full-Stack Path',
    },
  ],
  whatYouWillGain: [
    'Stronger Web Development foundations',
    'Understanding of Front-End and Back-End concepts',
    'Database and SQL awareness',
    'Exposure to .NET development',
    'Practical development mindset',
    'Career and freelancing guidance',
    'Better understanding of the Full-Stack path',
  ],
  faqs: [
    {
      question: 'Who can apply?',
      answer: 'The Web Development Journey is open exclusively to Innovation University students from the listed faculties.',
    },
    {
      question: 'Is the journey free?',
      answer: 'Yes! Participation in the Web Development Journey is 100% free of charge.',
    },
    {
      question: 'Do I need previous Web Development experience?',
      answer: 'No prior advanced experience is required. The journey is designed to start from core fundamentals.',
    },
    {
      question: 'Do I need a laptop?',
      answer: 'Yes. A laptop is mandatory for practical sessions and full participation in the journey.',
    },
    {
      question: 'Do I need to be a Computer Science student?',
      answer: 'Registration is open to Innovation University students from all eligible faculties listed in the form (Computers, Engineering, Business, Dentistry, Pharmacy, etc.).',
    },
  ],
};

/**
 * Checks whether registration is currently open based on configuration dates
 */
export function checkIsRegistrationOpen(): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(EVENT_CONFIG.registrationStartDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(EVENT_CONFIG.registrationEndDate);
  endDate.setHours(23, 59, 59, 999);

  return today >= startDate && today <= endDate;
}

/**
 * Calculates remaining days until registration deadline
 */
export function getDaysRemaining(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(EVENT_CONFIG.registrationEndDate);
  endDate.setHours(23, 59, 59, 999);

  const diffMs = endDate.getTime() - today.getTime();
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

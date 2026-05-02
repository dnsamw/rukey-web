export type SectionVisibilityMap = Record<string, boolean>

export type AboutMilestone = {
  year: string
  event: string
}

export type AboutTeamMember = {
  name: string
  role: string
  initials: string
  color: string
}

export type AboutPageConfig = {
  sections: SectionVisibilityMap
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  story: {
    label: string
    title: string
    paragraph_1: string
    paragraph_2: string
    image_url: string
    years_trusted: string
    badges: string[]
  }
  timeline: {
    label: string
    title: string
    items: AboutMilestone[]
  }
  team: {
    label: string
    title: string
    members: AboutTeamMember[]
  }
}

export type ContactOffice = {
  area: string
  address: string
  is_main: boolean
  is_visible: boolean
}

export type BusinessHour = {
  day: string
  hours: string
}

export type ContactPageConfig = {
  sections: SectionVisibilityMap
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  contact: {
    label: string
    title: string
    subtitle: string
    service_options: string[]
  }
  map: {
    label: string
    title: string
    subtitle: string
  }
  offices: ContactOffice[]
  business_hours: BusinessHour[]
}

export type CareersPerk = {
  icon: string
  label: string
}

export type CareersPageConfig = {
  sections: SectionVisibilityMap
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  perks: {
    label: string
    title: string
    items: CareersPerk[]
  }
  jobs: {
    label: string
    title: string
    show_open_roles: boolean
  }
  fallback: {
    title: string
    message: string
    button_label: string
    email: string
  }
}

export const defaultAboutPageConfig: AboutPageConfig = {
  sections: {
    hero: true,
    story: true,
    timeline: true,
    team: true,
    banner: true,
    get_quote: true,
  },
  hero: {
    eyebrow: 'Our Story',
    title: 'About Rukey',
    description:
      'Over a decade of delivering trusted, professional facility services across Victoria and beyond.',
  },
  story: {
    label: 'Who We Are',
    title: "Victoria's Cleaning Specialists Since 2012",
    paragraph_1:
      'Rukey Facility Services was founded in Melbourne in 2012 with a simple mission - to deliver cleaning services so reliable and thorough that our clients never have to think about it again.',
    paragraph_2:
      "From a small team of five, we've grown into one of Victoria's most trusted facility management companies - serving 500+ clients across offices, schools, hospitals, gyms and government buildings. Every member of our team is trained, vetted and shares our commitment to excellence.",
    image_url:
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=900&q=80',
    years_trusted: '12+',
    badges: [
      'ISO 9001 Certified',
      'Eco-Friendly Products',
      'Fully Insured',
      'Police Checked Staff',
    ],
  },
  timeline: {
    label: 'Our Journey',
    title: 'How We Got Here',
    items: [
      { year: '2012', event: 'Founded in Melbourne with a team of 5' },
      { year: '2015', event: 'Expanded into education and healthcare sectors' },
      { year: '2018', event: 'Opened regional offices across Victoria' },
      { year: '2021', event: 'Achieved ISO 9001 quality certification' },
      { year: '2024', event: '500+ active clients across Australia' },
    ],
  },
  team: {
    label: 'Meet the Team',
    title: 'The People Behind Rukey',
    members: [
      {
        name: 'Michael Chen',
        role: 'Founder & CEO',
        initials: 'MC',
        color: '#1E3A5F',
      },
      {
        name: 'Angela Torres',
        role: 'Operations Manager',
        initials: 'AT',
        color: '#F97316',
      },
      {
        name: 'James Patel',
        role: 'Head of Training',
        initials: 'JP',
        color: '#10B981',
      },
      {
        name: 'Rachel Kim',
        role: 'Client Relations',
        initials: 'RK',
        color: '#A855F7',
      },
    ],
  },
}

export const defaultContactPageConfig: ContactPageConfig = {
  sections: {
    hero: true,
    contact_form: true,
    business_hours: true,
    map: true,
    banner: true,
  },
  hero: {
    eyebrow: "We'd Love to Hear From You",
    title: 'Contact Us',
    description:
      'Have a question, want a quote, or just want to learn more? Our friendly team is here to help.',
  },
  contact: {
    label: 'Contact Us',
    title: 'Get In Touch',
    subtitle:
      'Have a question or ready to get started? Reach out and our friendly team will get back to you within one business day.',
    service_options: [
      'Office Cleaning',
      'School & Education',
      'Medical & Healthcare',
      'Gym & Fitness',
      'Council & Government',
      'Retail & Commercial',
      'Industrial',
      'Window Cleaning',
    ],
  },
  map: {
    label: 'Find Us',
    title: 'Our Main Office',
    subtitle:
      'Visit us or get in touch - our team is ready to help with your facility cleaning needs.',
  },
  offices: [
    {
      area: 'Braeside',
      address: '17 Citrus Street Braeside, VIC 3195',
      is_main: true,
      is_visible: true,
    },
  ],
  business_hours: [
    { day: 'Monday - Friday', hours: '7:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'By Appointment' },
  ],
}

export const defaultCareersPageConfig: CareersPageConfig = {
  sections: {
    hero: true,
    perks: true,
    jobs: true,
    fallback: true,
    banner: true,
    get_quote: true,
  },
  hero: {
    eyebrow: 'Join Our Team',
    title: 'Careers at Rukey',
    description:
      "Build a rewarding career with one of Victoria's most respected facility services companies. We invest in our people.",
  },
  perks: {
    label: 'Why Work With Us',
    title: 'What We Offer Our Team',
    items: [
      { icon: '🕐', label: 'Flexible Hours' },
      { icon: '💼', label: 'Stable Employment' },
      { icon: '📈', label: 'Career Growth' },
      { icon: '🛡️', label: 'Full Insurance Cover' },
      { icon: '🌿', label: 'Eco-Friendly Workplace' },
      { icon: '🤝', label: 'Supportive Team' },
    ],
  },
  jobs: {
    label: 'Open Positions',
    title: 'Current Opportunities',
    show_open_roles: true,
  },
  fallback: {
    title: "Don't see a role that fits?",
    message:
      "If you're enthusiastic about working in our company, feel free to contact us.",
    button_label: 'Send Your Resume',
    email: 'careers@rukey.com.au',
  },
}

export interface Project {
  title: string;
  desc: string;
  tags: string[];
  link: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  skills: string[];
  projects: Project[];
  socials: Record<string, string>;
}

const team: Member[] = [
  {
    id: "aarav",
    name: "Aarav Mehta",
    role: "Creative Director",
    photo: "/team/aarav.jpg",
    bio: "Leads the studio's vision across brand, product and motion. 8 years shaping identities for startups.",
    skills: ["Art Direction", "Branding", "Strategy"],
    projects: [
      {
        title: "Nova Bank Rebrand",
        desc: "Full identity and design system.",
        tags: ["Branding"],
        link: "#",
      },
      {
        title: "Orbit App",
        desc: "Product design for a fintech app.",
        tags: ["Product"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      behance: "#",
      email: "aarav@tarka.studio",
    },
  },

  {
    id: "isha",
    name: "Isha Kulkarni",
    role: "UI/UX Designer",
    photo: "/team/isha.jpg",
    bio: "Designs clean, usable interfaces and prototypes that feel alive.",
    skills: ["Figma", "Prototyping", "Design Systems"],
    projects: [
      {
        title: "Lumen Dashboard",
        desc: "Analytics dashboard redesign.",
        tags: ["UI/UX"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      behance: "#",
      email: "isha@tarka.studio",
    },
  },

  {
    id: "rohan",
    name: "Rohan Patil",
    role: "Frontend Developer",
    photo: "/team/rohan.jpg",
    bio: "Turns designs into fast, animated websites with React.",
    skills: ["React", "TypeScript", "Framer Motion"],
    projects: [
      {
        title: "RIVA Store",
        desc: "Streetwear e-commerce site.",
        tags: ["Web"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      github: "#",
      email: "rohan@tarka.studio",
    },
  },

  {
    id: "sneha",
    name: "Sneha Joshi",
    role: "Motion Designer",
    photo: "/team/sneha.jpg",
    bio: "Brings brands to life with video, 3D and motion graphics.",
    skills: ["After Effects", "Blender", "Video"],
    projects: [
      {
        title: "Pulse Campaign",
        desc: "Launch video series.",
        tags: ["Motion"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      behance: "#",
      email: "sneha@tarka.studio",
    },
  },

  {
    id: "karan",
    name: "Karan Shah",
    role: "Backend Developer",
    photo: "/team/karan.jpg",
    bio: "Builds reliable backend systems and APIs that power digital experiences.",
    skills: ["Node.js", "APIs", "MongoDB"],
    projects: [
      {
        title: "Core Platform",
        desc: "Backend architecture and API development.",
        tags: ["Development"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      github: "#",
      email: "karan@tarka.studio",
    },
  },

  {
    id: "meera",
    name: "Meera Desai",
    role: "Product Designer",
    photo: "/team/meera.jpg",
    bio: "Creates thoughtful product experiences that balance usability and visual design.",
    skills: ["Product Design", "Figma", "Research"],
    projects: [
      {
        title: "Flow Workspace",
        desc: "Product experience and design system.",
        tags: ["Product"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      behance: "#",
      email: "meera@tarka.studio",
    },
  },

  {
    id: "aditya",
    name: "Aditya Rao",
    role: "Full Stack Developer",
    photo: "/team/aditya.jpg",
    bio: "Builds complete web experiences from interactive frontends to scalable backends.",
    skills: ["React", "Node.js", "TypeScript"],
    projects: [
      {
        title: "Nexa Platform",
        desc: "Full-stack web application.",
        tags: ["Web"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      github: "#",
      email: "aditya@tarka.studio",
    },
  },

  {
    id: "riya",
    name: "Riya Kapoor",
    role: "Brand Strategist",
    photo: "/team/riya.jpg",
    bio: "Shapes brand strategies and visual directions that connect businesses with people.",
    skills: ["Brand Strategy", "Research", "Content"],
    projects: [
      {
        title: "Aura Identity",
        desc: "Brand strategy and identity direction.",
        tags: ["Branding"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      behance: "#",
      email: "riya@tarka.studio",
    },
  },

  {
    id: "dev",
    name: "Dev Malhotra",
    role: "Creative Technologist",
    photo: "/team/dev.jpg",
    bio: "Combines design, code and emerging technology to create interactive experiences.",
    skills: ["Creative Coding", "WebGL", "Interaction"],
    projects: [
      {
        title: "Echo Experience",
        desc: "Interactive digital experience.",
        tags: ["Creative Tech"],
        link: "#",
      },
    ],
    socials: {
      linkedin: "#",
      github: "#",
      email: "dev@tarka.studio",
    },
  },
];

export default team;

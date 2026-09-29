export interface Domain {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  imageTeaser: string;
  imageLarge: string;
  alt: string;
}

export const domains: Domain[] = [
  {
    id: "product-design",
    number: "01",
    title: "Product Design",
    category: "PRODUCT",
    description:
      "We turn ideas into tangible products — from first sketch to the object someone holds in their hand.",
    imageTeaser:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&q=80&auto=format&fit=crop",
    alt: "A minimal industrial product prototype resting on a studio table",
  },
  {
    id: "graphic-design",
    number: "02",
    title: "Graphic Design",
    category: "IDENTITY",
    description:
      "We create visual identities that communicate — marks, systems and print that hold their shape everywhere.",
    imageTeaser:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80&auto=format&fit=crop",
    alt: "Printed brand collateral and colour swatches arranged on a desk",
  },
  {
    id: "uiux-web",
    number: "03",
    title: "UI/UX & Web Development",
    category: "DIGITAL",
    description:
      "We design digital experiences people enjoy using — interfaces built with the same care as the code behind them.",
    imageTeaser:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80&auto=format&fit=crop",
    alt: "A UI layout with wireframes and colour palettes displayed on a screen",
  },
  {
    id: "marketing",
    number: "04",
    title: "Marketing",
    category: "REACH",
    description:
      "We make ideas reach the people who matter — campaigns built around a clear, singular message.",
    imageTeaser:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80&auto=format&fit=crop",
    alt: "A campaign storyboard and printed materials spread across a table",
  },
  {
    id: "video-generation",
    number: "05",
    title: "Video Generation",
    category: "MOTION",
    description:
      "We turn ideas into moving stories — from visual concepts and motion systems to AI-generated video experiences.",
    imageTeaser:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&q=80&auto=format&fit=crop",
    alt: "A cinematic production setup with a camera and studio lighting",
  },
];
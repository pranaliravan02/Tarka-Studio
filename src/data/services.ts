
export interface ServiceItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  description: string;
  domainId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  shortName: string;
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "product-design",
    name: "Product Design",
    shortName: "Product",
    services: [
      {
        id: "pd-sprint",
        name: "Product Design Sprint",
        unit: "per sprint",
        price: 150000,
        description:
          "Research, ideation, UX direction, prototyping and design validation.",
        domainId: "product-design",
      },
      {
        id: "pd-audit",
        name: "UX Audit",
        unit: "per audit",
        price: 60000,
        description:
          "A structured review of an existing product to identify usability and experience improvements.",
        domainId: "product-design",
      },
      {
        id: "pd-system",
        name: "Design System Setup",
        unit: "flat",
        price: 120000,
        description:
          "A reusable visual and component system for consistent product experiences.",
        domainId: "product-design",
      },
    ],
  },

  {
    id: "uiux",
    name: "UI / UX",
    shortName: "Digital Experience",
    services: [
      {
        id: "ux-mobile",
        name: "Mobile App UI Design",
        unit: "per screen",
        price: 8000,
        description:
          "Interface design for mobile applications with a clear and usable visual system.",
        domainId: "uiux-web",
      },
      {
        id: "ux-web",
        name: "Web App UI Design",
        unit: "per screen",
        price: 7000,
        description:
          "Modern web application interfaces designed around usability and clarity.",
        domainId: "uiux-web",
      },
      {
        id: "ux-testing",
        name: "Usability Testing",
        unit: "per round",
        price: 40000,
        description:
          "User testing to identify friction points and improve the overall experience.",
        domainId: "uiux-web",
      },
    ],
  },

  {
    id: "branding",
    name: "Branding",
    shortName: "Identity",
    services: [
      {
        id: "br-identity",
        name: "Logo & Identity Design",
        unit: "flat",
        price: 90000,
        description:
          "A distinctive logo and visual identity built around the brand's character.",
        domainId: "graphic-design",
      },
      {
        id: "br-guide",
        name: "Brand Guideline Document",
        unit: "flat",
        price: 50000,
        description:
          "A practical guide covering the rules and applications of the brand identity.",
        domainId: "graphic-design",
      },
      {
        id: "br-pack",
        name: "Packaging Design",
        unit: "per SKU",
        price: 35000,
        description:
          "Packaging concepts and visual design for individual product SKUs.",
        domainId: "graphic-design",
      },
    ],
  },

  {
    id: "digital-web",
    name: "Digital / Web",
    shortName: "Web",
    services: [
      {
        id: "dw-site",
        name: "Marketing Website (up to 6 pages)",
        unit: "flat",
        price: 180000,
        description:
          "A complete marketing website focused on communication, usability and conversion.",
        domainId: "uiux-web",
      },
      {
        id: "dw-ecom",
        name: "E-commerce Website",
        unit: "flat",
        price: 350000,
        description:
          "A complete online store experience designed around products and customer journeys.",
        domainId: "uiux-web",
      },
      {
        id: "dw-cms",
        name: "Webflow / CMS Build",
        unit: "flat",
        price: 120000,
        description:
          "A structured CMS-powered website implementation for easy content management.",
        domainId: "uiux-web",
      },
    ],
  },

  {
    id: "ai-video",
    name: "AI Video Generation",
    shortName: "AI Video",
    services: [
      {
        id: "ai-brand",
        name: "AI Brand Video (30s)",
        unit: "per video",
        price: 45000,
        description:
          "A short AI-generated brand film designed for digital communication.",
        domainId: "marketing",
      },
      {
        id: "ai-pack",
        name: "AI Product Video Pack (5 videos)",
        unit: "pack",
        price: 75000,
        description:
          "A five-video AI content pack for product or campaign communication.",
        domainId: "marketing",
      },
      {
        id: "ai-motion",
        name: "Motion Graphics Add-on",
        unit: "per video",
        price: 25000,
        description:
          "Motion graphics added to an existing video or campaign asset.",
        domainId: "marketing",
      },
    ],
  },
];

export const quoteTerms = [
  "This quotation is valid for 30 days from the date of issue.",
  "50% advance payment is required to commence work; the balance is due on delivery.",
  "Timelines are estimated per project scope and confirmed at kickoff.",
  "Revisions beyond the agreed scope will be quoted separately.",
  "All prices are exclusive of GST unless stated otherwise above.",
];

export const tarkaContact = {
  email: "hello@tarkadesign.com",
  phone: "+91 80 4000 1234",
  address: "Bengaluru, India",
  web: "www.tarkadesign.com",
};

export const QUOTE_CURRENCY = "₹";
export const QUOTE_GST_RATE = 0.18;


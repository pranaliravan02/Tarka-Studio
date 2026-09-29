export interface ProductProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
}

export const productProjects: ProductProject[] = [
  {
    id: "product-01",
    title: "Object 01",
    slug: "object-01",
    category: "PRODUCT DESIGN",
    description:
      "A physical product concept developed from early exploration to refined form.",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=85&auto=format&fit=crop",
  },
  {
    id: "product-02",
    title: "Form 02",
    slug: "form-02",
    category: "PRODUCT DESIGN",
    description:
      "A study in form, material and usability created around a simple user need.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85&auto=format&fit=crop",
  },
  {
    id: "product-03",
    title: "Object 03",
    slug: "object-03",
    category: "PRODUCT DESIGN",
    description:
      "An experimental product direction exploring proportion, interaction and detail.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900&q=85&auto=format&fit=crop",
  },
  {
    id: "product-04",
    title: "Form 04",
    slug: "form-04",
    category: "PRODUCT DESIGN",
    description:
      "A product exploration balancing visual character with practical function.",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=900&q=85&auto=format&fit=crop",
  },
  {
    id: "product-05",
    title: "Object 05",
    slug: "object-05",
    category: "PRODUCT DESIGN",
    description:
      "A material and construction study developed through iterative prototypes.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900&q=85&auto=format&fit=crop",
  },
  {
    id: "product-06",
    title: "Form 06",
    slug: "form-06",
    category: "PRODUCT DESIGN",
    description:
      "A final product concept bringing together form, function and experience.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=85&auto=format&fit=crop",
  },
];
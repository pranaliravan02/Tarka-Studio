
export interface Project {
  id: string;
  domainId: string;
  title: string;
  category: string;
  description: string;
  image: string;
  year?: string;
  services: string[];
}

export const projects: Project[] = [];

export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  birthDate: string;
  supportLevel: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChildData {
  name: string;
  birthDate: string;
  supportLevel: string;
  notes?: string;
  avatarUrl?: string;
}

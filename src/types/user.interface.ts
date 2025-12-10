export interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: Role[];
}

export type Role = "admin" | "user" | "tester";

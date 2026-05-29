export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

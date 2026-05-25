export class User {
  id: number;
  role: string; // UserRole enum (PROVIDER, CLIENT, ADMIN)
  phoneNumber: string;
  email: string;
  passwordHash: string;
  profile?: any; // Associated profile
  services?: any[]; // Associated services
  serviceOrders?: any[]; // Associated service orders
  contracts?: any[]; // Associated contracts
  reviews?: any[]; // Associated reviews
  bookings?: any[]; // Associated bookings
  notifications?: any[]; // Associated notifications
  proposals?: any[]; // Associated proposals
  messages?: any[]; // Associated messages
  servicePackages?: any[]; // Associated service packages
  createdAt: Date;
  lastLogin?: Date;
}

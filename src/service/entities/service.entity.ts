export class Service {
  id!: number; // Unique identifier for the service
  title!: string; // Title of the service
  description!: string; // Description of the service
  categoryId?: number; // ID of the associated category (optional)
  price!: number; // Price of the service
  status!: string; // Status of the service (available, unavailable, archived)
  providerId!: number; // ID of the provider offering the service
  createdAt!: Date; // Timestamp when the service was created

  // Relationships
  category?: any; // Associated category
  provider?: any; // Associated provider
  serviceOrders?: any[]; // Associated service orders
  bookings?: any[]; // Associated bookings
  proposals?: any[]; // Associated proposals
  servicePackages?: any[]; // Associated service packages
  assets?: any[]; // Associated assets (images or areas)
}

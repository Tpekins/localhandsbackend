export class ServicePackage {
  id!: number; // Unique identifier for the service package
  providerId!: number; // ID of the provider offering the package
  title!: string; // Title of the service package
  description?: string; // Optional description of the package
  price!: number; // Price of the service package
  createdAt!: Date; // Timestamp when the package was created

  // Relationships
  provider?: any; // Associated provider
  services?: any[]; // Associated services
}

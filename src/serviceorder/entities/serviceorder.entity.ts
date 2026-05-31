export class ServiceOrder {
  id!: number; // Unique identifier for the service order
  serviceId!: number; // ID of the associated service
  clientId!: number; // ID of the client making the order
  description!: string; // Description of the service order
  budget?: number; // Optional budget for the service order
  status!: string; // Status of the service order (PENDING, ACCEPTED, REJECTED, COMPLETED)
  createdAt!: Date; // Timestamp when the service order was created

  // Relationships
  service?: any; // Associated service
  client?: any; // Associated client
  contract?: any; // Associated contract
}

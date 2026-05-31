export class Booking {
  id!: number; // Unique identifier for the booking
  serviceId!: number; // ID of the associated service
  clientId!: number; // ID of the client who made the booking
  startTime!: Date; // Start time of the booking
  endTime!: Date; // End time of the booking
  location?: string; // Optional location for the booking
  status!: string; // Status of the booking (PENDING, CONFIRMED, CANCELED, COMPLETED)
  createdAt!: Date; // Timestamp when the booking was created
}

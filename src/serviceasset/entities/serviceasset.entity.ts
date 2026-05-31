export class ServiceAsset {
  id!: number; // Unique identifier for the service asset
  serviceId!: number; // ID of the associated service
  type!: string; // Type of the asset (IMAGE or AREA)
  imageUrl?: string; // Optional URL for the image
  caption?: string; // Optional caption for the image
  areaName?: string; // Optional name for the area
  createdAt!: Date; // Timestamp when the asset was created

  // Relationships
  service?: any; // Associated service
}

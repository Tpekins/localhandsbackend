export class Review {
  id!: number;
  contractId!: number;
  reviewerId!: number;
  rating!: number;
  comment?: string;
  createdAt!: Date;
}

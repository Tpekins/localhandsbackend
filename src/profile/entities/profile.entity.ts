export class Profile {
  id!: number;
  userId!: number;
  bio?: string;
  mobileMoneyNumber?: string;
  bankAccountNumber?: string;
  nationalIdUrl?: string;
  verificationStatus?: string;
  location?: string;
  createdAt!: Date;
}

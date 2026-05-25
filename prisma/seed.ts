import {
  PrismaClient,
  UserRole,
  ProposalStatus,
  ServiceOrderStatus,
  ContractStatus,
} from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting the seeding process...');
  const now = Date.now();

  // 1. Create PROVIDER user
  const providerUser = await prisma.user.create({
    data: {
      name: 'Test Provider',
      email: `provider${now}@example.com`,
      phoneNumber: `+1000000${now}`,
      passwordHash: 'hashedpassword',
      role: UserRole.PROVIDER,
      createdAt: new Date(),
    },
  });

  // 2. Create Provider model
  await prisma.provider.create({
    data: {
      userId: providerUser.id,
      createdAt: new Date(),
    },
  });

  // 3. Create CLIENT user
  const clientUser = await prisma.user.create({
    data: {
      name: 'Test Client',
      email: `client${now}@example.com`,
      phoneNumber: `+2000000${now}`,
      passwordHash: 'hashedpassword',
      role: UserRole.CLIENT,
      createdAt: new Date(),
    },
  });

  // 4. Create Service
  const service = await prisma.service.create({
    data: {
      title: 'Test Service',
      description: 'A test service for seeding.',
      price: 100.0,
      providerId: providerUser.id,
      status: 'available',
      createdAt: new Date(),
    },
  });

  // 5. Create Proposal (status: ACCEPTED)
  const proposal = await prisma.proposal.create({
    data: {
      providerId: providerUser.id,
      serviceId: service.id,
      coverLetter: 'I would like to provide this service.',
      bidAmount: 90.0,
      status: ProposalStatus.ACCEPTED,
      createdAt: new Date(),
    },
  });

  // 6. Create ServiceOrder (status: ACCEPTED)
  const serviceOrder = await prisma.serviceOrder.create({
    data: {
      serviceId: service.id,
      clientId: clientUser.id,
      description: 'Order for test service.',
      status: ServiceOrderStatus.ACCEPTED,
      createdAt: new Date(),
    },
  });

  // 7. Create Contract (status: ACTIVE)
  const contract = await prisma.contract.create({
    data: {
      serviceOrderId: serviceOrder.id,
      escrowAmount: 90.0,
      status: ContractStatus.ACTIVE,
      createdAt: new Date(),
      users: {
        connect: [{ id: providerUser.id }, { id: clientUser.id }],
      },
      proposals: {
        connect: { id: proposal.id },
      },
    },
  });

  console.log('✅ Seeding finished successfully!');
  console.log('---------------------------------');
  console.log('Ready for testing!');
  console.log(`Use this Contract ID for the payment API: ${contract.id}`);
  console.log('---------------------------------');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });

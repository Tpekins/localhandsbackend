import 'dotenv/config';
import {
  PrismaClient,
  UserRole,
  ProposalStatus,
  ServiceOrderStatus,
  ContractStatus,
  BookingStatus,
} from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const rawUrl = process.env.DATABASE_URL!;
const connectionString = rawUrl.replace(/&?channel_binding=require/g, '');
const pool = new Pool({ connectionString, ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...\n');

  const passwordHash = await bcrypt.hash('password123', 10);

  /* ─────────  Users  ───────── */
  const admin = await prisma.user.upsert({
    where: { email: 'admin@localhands.com' },
    update: {},
    create: {
      name: 'Ndifor Tabe',
      email: 'admin@localhands.com',
      phoneNumber: '+237600000001',
      passwordHash,
      role: UserRole.ADMIN,
      profile: { create: { bio: 'Platform administrator', location: 'Buea' } },
    },
  });
  console.log(`  Admin:    admin@localhands.com / password123`);

  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@localhands.com' },
    update: {},
    create: {
      name: 'Njoku Mbua',
      email: 'provider@localhands.com',
      phoneNumber: '+237600000002',
      passwordHash,
      role: UserRole.PROVIDER,
      profile: { create: { bio: 'Experienced professional with 5+ years in the field', location: 'Kumba', verificationStatus: 'VERIFIED' } },
    },
  });
  console.log(`  Provider: provider@localhands.com / password123`);

  // Ensure Provider record exists
  await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: { userId: providerUser.id },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@localhands.com' },
    update: {},
    create: {
      name: 'Asongwe Lucy',
      email: 'client@localhands.com',
      phoneNumber: '+237600000003',
      passwordHash,
      role: UserRole.CLIENT,
      profile: { create: { bio: 'Looking for quality local services', location: 'Limbe' } },
    },
  });
  console.log(`  Client:   client@localhands.com / password123`);

  /* ─────────  Categories  ───────── */
  const categoryData = [
    { name: 'Plumbing', description: 'Pipe repairs, installations, and maintenance' },
    { name: 'Electrical', description: 'Wiring, repairs, and electrical installations' },
    { name: 'Cleaning', description: 'Home and office cleaning services' },
    { name: 'Tutoring', description: 'Private lessons and academic support' },
    { name: 'Web Development', description: 'Website and web application development' },
    { name: 'Graphic Design', description: 'Logo, branding, and visual design services' },
  ];

  const categories: Record<string, number> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { id: categoryData.indexOf(cat) + 1 },
      update: {},
      create: cat,
    });
    categories[cat.name] = created.id;
  }
  console.log(`  Categories: ${categoryData.length} created`);

  /* ─────────  Services (Provider)  ───────── */
  const servicesData = [
    { title: 'Pipe Repair & Installation', description: 'Expert pipe repair, leak detection, and new installations for homes and small businesses across Kumba and Buea.', price: 15000, categoryId: categories['Plumbing'] },
    { title: 'Electrical Wiring & Troubleshooting', description: 'Safe electrical wiring, circuit breaker repairs, and power troubleshooting for residential homes and shops in the Southwest.', price: 20000, categoryId: categories['Electrical'] },
    { title: 'Deep House Cleaning', description: 'Thorough home cleaning covering all rooms, kitchen, bathrooms, and windows — perfect for families in Limbe and Tiko.', price: 12000, categoryId: categories['Cleaning'] },
    { title: 'Math & Physics Tutoring', description: 'Private one-on-one lessons for secondary school students preparing for GCE O/L and A/L in Buea and surrounding towns.', price: 5000, categoryId: categories['Tutoring'] },
    { title: 'Business Website Development', description: 'Professional website design with mobile-friendly layout, contact forms, and local SEO to help small businesses in Cameroon grow online.', price: 150000, categoryId: categories['Web Development'], featured: true },
    { title: 'Logo & Brand Identity Design', description: 'Complete brand package including logo, color palette, and typography for startups and shops across the Southwest Region.', price: 50000, categoryId: categories['Graphic Design'], featured: true },
  ];

  for (const svc of servicesData) {
    await prisma.service.create({
      data: {
        title: svc.title,
        description: svc.description,
        price: svc.price,
        categoryId: svc.categoryId,
        providerId: providerUser.id,
        providerModelId: 1,
        status: 'available',
        featured: (svc as any).featured || false,
      },
    });
  }
  console.log(`  Services:  ${servicesData.length} created`);

  /* ─────────  Service Orders (Client)  ───────── */
  const plumbingService = await prisma.service.findFirst({ where: { title: { contains: 'Pipe Repair' } } });
  if (plumbingService) {
    const order = await prisma.serviceOrder.create({
      data: {
        serviceId: plumbingService.id,
        clientId: clientUser.id,
        description: 'Need urgent pipe repair in my kitchen. The sink is leaking and there is water damage under the sink in my Mile 16 home.',
        budget: 20000,
        status: ServiceOrderStatus.PENDING,
      },
    });

    // Proposal on this order
    await prisma.proposal.create({
      data: {
        providerId: providerUser.id,
        serviceId: plumbingService.id,
        coverLetter: 'Hello! I have 5 years of plumbing experience here in Kumba and can fix your kitchen leak quickly. Available this weekend.',
        bidAmount: 18000,
        status: ProposalStatus.PENDING,
      },
    });
  }

  const tutoringService = await prisma.service.findFirst({ where: { title: { contains: 'Tutoring' } } });
  if (tutoringService) {
    const order = await prisma.serviceOrder.create({
      data: {
        serviceId: tutoringService.id,
        clientId: clientUser.id,
        description: 'Looking for a math tutor for my daughter in Form Five. She needs help with calculus and algebra for the upcoming GCE Advanced Level, twice a week in Buea.',
        budget: 10000,
        status: ServiceOrderStatus.PENDING,
      },
    });

    const proposal = await prisma.proposal.create({
      data: {
        providerId: providerUser.id,
        serviceId: tutoringService.id,
        coverLetter: 'I am a certified math teacher with 8 years of experience preparing students for GCE A-Level exams. I can do Tuesday and Thursday evenings around Buea.',
        bidAmount: 8000,
        status: ProposalStatus.ACCEPTED,
      },
    });

    // Contract from accepted proposal
    await prisma.contract.create({
      data: {
        serviceOrderId: order.id,
        escrowAmount: 8000,
        status: ContractStatus.ACTIVE,
        users: { connect: [{ id: providerUser.id }, { id: clientUser.id }] },
        proposals: { connect: { id: proposal.id } },
      },
    });
  }

  console.log(`  Orders:   2 created with proposals & contract`);

  /* ─────────  Bookings  ───────── */
  if (plumbingService) {
    await prisma.booking.create({
      data: {
        serviceId: plumbingService.id,
        clientId: clientUser.id,
        startTime: new Date('2026-06-01T09:00:00'),
        endTime: new Date('2026-06-01T11:00:00'),
        location: 'Client residence, Mile 18, Buea',
        status: BookingStatus.CONFIRMED,
      },
    });
  }
  console.log(`  Bookings:  1 created`);

  /* ─────────  Messages  ───────── */
  await prisma.message.createMany({
    data: [
      { senderId: clientUser.id, receiverId: providerUser.id, content: 'Hello, is the pipe repair service still available?' },
      { senderId: providerUser.id, receiverId: clientUser.id, content: 'Yes! I can come take a look tomorrow morning. What time works?' },
      { senderId: clientUser.id, receiverId: providerUser.id, content: 'Tomorrow at 9 AM would be perfect. The address is Great Soppo, near the Buea Market junction.' },
      { senderId: providerUser.id, receiverId: clientUser.id, content: 'Got it, see you at 9 AM. Please have the water shut off before I arrive.' },
    ],
  });
  console.log(`  Messages:  4 created`);

  /* ─────────  Notifications  ───────── */
  await prisma.notification.createMany({
    data: [
      { userId: clientUser.id, message: 'Njoku Mbua submitted a proposal for your pipe repair job.', type: 'proposal', read: false },
      { userId: providerUser.id, message: 'Your proposal for Math Tutoring was accepted!', type: 'proposal_accepted', read: false },
      { userId: clientUser.id, message: 'Your booking for Pipe Repair has been confirmed.', type: 'booking', read: true },
    ],
  });
  console.log(`  Notifications: 3 created`);

  /* ─────────  SystemSettings  ───────── */
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maintenance_mode: false,
      allow_registration: true,
      review_auto_approve: false,
      payment_gateway: 'fapshi',
      email_notifications: true,
      max_file_size: 5,
      currency: 'XAF',
      currency_symbol: 'FCFA',
      supportEmail: 'support@localhands.com',
    },
  });
  console.log(`  Settings:  created`);

  console.log('\n--- Seeding complete ---');
  console.log('Login credentials (all use password: password123):');
  console.log('  Admin:    admin@localhands.com');
  console.log('  Provider: provider@localhands.com');
  console.log('  Client:   client@localhands.com\n');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

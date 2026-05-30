import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProviderModule } from './provider/provider.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { ServicepackageModule } from './servicepackage/servicepackage.module';
import { ServiceassetModule } from './serviceasset/serviceasset.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { ServiceorderModule } from './serviceorder/serviceorder.module';
import { MessagesModule } from './messages/messages.module';
import { ProposalModule } from './proposal/proposal.module';
import { ContractModule } from './contract/contract.module';
import { ReviewModule } from './review/review.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentModule } from './payment/payment.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { ClientModule } from './client/client.module';
import { SettingsModule } from './settings/settings.module';
import { PaymentConfig } from './config/payment.config';
import { ServerConfig } from './config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      load: [PaymentConfig, ServerConfig],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProviderModule,
    CategoryModule,
    ServiceModule,
    ServicepackageModule,
    ServiceassetModule,
    AvailabilityModule,
    BookingModule,
    ServiceorderModule,
    MessagesModule,
    ProposalModule,
    ContractModule,
    ReviewModule,
    ProfileModule,
    NotificationsModule,
    PaymentModule,
    CommonModule,
    HealthModule,
    ClientModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

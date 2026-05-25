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
import { Proposal1Module } from './proposal1/proposal1.module';
import { Contract1Module } from './contract1/contract1.module';
import { Review1Module } from './review1/review1.module';
import { Profile1Module } from './profile1/profile1.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentModule } from './payment/payment.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { ClientModule } from './client/client.module';
import { PaymentConfig } from './config/payment.config';
import { ServerConfig } from './config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    Proposal1Module,
    Contract1Module,
    Review1Module,
    Profile1Module,
    NotificationsModule,
    PaymentModule,
    CommonModule,
    HealthModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

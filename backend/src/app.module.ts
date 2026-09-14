import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './common/health.controller.js';
import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BillingModule } from './modules/billing/billing.module.js';
import { DiagramsModule } from './modules/diagrams/diagrams.module.js';
import { EvaluationsModule } from './modules/evaluations/evaluations.module.js';
import { InterviewsModule } from './modules/interviews/interviews.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { QuestionsModule } from './modules/questions/questions.module.js';
import { RecommendationsModule } from './modules/recommendations/recommendations.module.js';
import { UsersModule } from './modules/users/users.module.js';

import { AiModule } from './modules/ai/ai.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    JobsModule,
    AiModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    InterviewsModule,
    EvaluationsModule,
    DiagramsModule,
    RecommendationsModule,
    AnalyticsModule,
    NotificationsModule,
    BillingModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

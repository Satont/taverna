import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TeamModule } from './team/team.module'
import { RaidsModule } from './raids/raids.module';

@Module({
  imports: [TeamModule, AuthModule, RaidsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

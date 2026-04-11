import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api/docs', 302)
  redirectToDocs() {
    // No implementation needed because of the @Redirect decorator
  }

  @Get('/health')
  getHello(): string {
    return 'Server is running';
  }
}

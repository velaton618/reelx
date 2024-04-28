import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/search')
  async search(@Query('q') q): Promise<string[]> {
    return await this.appService.saerch(q);
  }

  @Get('/film')
  async getFilm(@Query('url') url): Promise<{ url: string; title: string }> {
    return await this.appService.getFilm(url);
  }
}

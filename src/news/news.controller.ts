import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsEntity } from './news.entity';
import { AuthGuard } from '@app/middlewares/auth.guard';
import { CreateNewsDto } from './dto/createNews.dto';
import { User } from '@app/middlewares/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { UpdateNewsDto } from './dto/updateNews.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  async findAll(): Promise<NewsEntity[]> {
    return await this.newsService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createNews(
    @User() user: UserEntity,
    @Body() updateNewsDto: CreateNewsDto,
  ): Promise<NewsEntity> {
    const news = await this.newsService.createNews(user, updateNewsDto);
    return this.newsService.buildNewsResponse(news);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateNews(
    @User('id') userId: number,
    @Param('id') id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<NewsEntity> {
    const article = await this.newsService.updateNews(
      userId,
      updateNewsDto,
      id,
    );
    return this.newsService.buildNewsResponse(article);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNews(@User('id') userId: number, @Param('id') id: number) {
    return await this.newsService.deleteNews(userId, id);
  }
}

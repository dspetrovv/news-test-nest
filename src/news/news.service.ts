import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NewsEntity } from './news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/createNews.dto';
import { UserEntity } from '@app/user/user.entity';
import { UpdateNewsDto } from './dto/updateNews.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find();
  }

  async createNews(
    currentUser: UserEntity,
    createArticleDto: CreateNewsDto,
  ): Promise<NewsEntity> {
    const news = new NewsEntity();
    Object.assign(news, createArticleDto);

    news.author = currentUser;

    return this.newsRepository.save(news);
  }

  async updateNews(
    userId: number,
    updateNewsDto: UpdateNewsDto,
    id: number,
  ): Promise<NewsEntity> {
    const article = await this.newsRepository.findOne({
      where: {
        id,
      },
    });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateNewsDto);

    return await this.newsRepository.save(article);
  }

  async deleteNews(userId: number, id: number): Promise<DeleteResult> {
    const article = await this.newsRepository.findOne({
      where: {
        id,
      },
    });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.newsRepository.delete({ id });
  }

  buildNewsResponse(news: NewsEntity) {
    return {
      ...news,
    };
  }
}

import { ILike, Raw, Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '../../shared/exceptions/http.exception';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetBlogsQueryDto } from './dto/get-blog-query.dto';
import { skip } from 'node:test';

export class BlogService {
  constructor(private blogRepository: Repository<Blog>) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    const { authorId, title, content, tags } = createBlogDto;

    const newBlogId = uuidv4();
    const newBlog = this.blogRepository.create({
      id: newBlogId,
      authorId,
      title,
      content,
      tags,
    });

    const savedBlog = await this.blogRepository.save(newBlog);
    return savedBlog;
  }

  async getAllBlogs(queryDto: GetBlogsQueryDto) {
    const { search = '', page = 1, limit = 10 } = queryDto

    const [blogs , total] = await this.blogRepository.findAndCount(
      {
        where: [
          { content: ILike('%'+ search +'%')},
          { title: ILike('%'+ search +'%')},
          { tags: Raw((alias) => `:search = ANY(${alias})`, { search }) }
        ],
        skip: (page - 1) * limit,
        take: limit
      },
    )

    const pages = Math.ceil(total / limit)

    return {
      blogs,
      pages,
      total
    }
  }

  async getBlogById(id:string) {
    const blog = await this.blogRepository.findOne({ where: { id }});
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async updateBlogById(id: string, updateBlogDto: UpdateBlogDto) {
    const { title, content, tags } = updateBlogDto;

    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (title) {
      blog.title = title;
    }
    if (content) {
      blog.content = content;
    }
    if (tags) {
      blog.tags = tags;
    }

    const savedBlog = await this.blogRepository.save(blog);
    return savedBlog;
  }

  async deleteBlogById(id:string) {
    const blog = await this.blogRepository.findOne({ where: { id }});
    if (!blog) {
      throw new NotFoundException('There is not blog with such id')
    }

    const deletedBlog = await this.blogRepository.delete(id)
    return deletedBlog;
  }
}

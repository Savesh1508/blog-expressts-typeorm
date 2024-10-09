import { NotFoundException } from './../../shared/exceptions/http.exception';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '../../shared/exceptions/http.exception';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';


export class BlogService {
  constructor(private blogRepository: Repository<Blog>, private userRepository: Repository<User>) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    try {
      const { authorId, title, content, tags } = createBlogDto;

      const author = await this.userRepository.findOne({ where: { id: authorId } });
      if (!author) {
        throw new BadRequestException('Author not found');
      }

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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Creating blog failed');
    }
  }


  async getAllBlogs() {
    try {
      const blogs = await this.blogRepository.find();
      if (!blogs.length) {
        return {message: 'Blogs are empty!'}
      }
      return blogs;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getBlogById(id:string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id }});
      if (!blog) {
        return {message: 'Blog not found'}
      }
      return blog;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateBlogById(id: string, updateBlogDto: UpdateBlogDto) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Updating blog failed');
    }
  }

  async deleteBlogById(id:string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id }});
      if (!blog) {
        throw new NotFoundException('There is not blog with such id')
      }

      await this.blogRepository.delete(id)
      return { message: 'Blog successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Deleting blog failed');
    }
  }
}
import { NotFoundException } from './../../shared/exceptions/http.exception';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '../../shared/exceptions/http.exception';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';
import { Blog } from '../blog/blog.entity';

export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>,
    private userRepository: Repository<User>,
    private blogRepository: Repository<Blog>
  ) {}

  async createComment(blogId:string, createCommentDto: CreateCommentDto) {
    try {
      const { userId, content } = createCommentDto;

      const author = await this.userRepository.findOne({ where: { id: userId } });
      if (!author) {
        throw new BadRequestException('Author not found');
      }
      const blog = await this.blogRepository.findOne({ where: { id: blogId } });
      if (!blog) {
        throw new BadRequestException('Blog not found');
      }

      const newCommentId = uuidv4();
      const newComment = this.commentRepository.create({
        id: newCommentId,
        userId,
        blogId,
        content
      });

      const savedComment = await this.commentRepository.save(newComment);
      return savedComment;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Creating comment failed');
    }
  }

  async getBlogComments(blogId:string) {
    try {
      const comments = await this.commentRepository.find({ where: { blogId } });
      if (!comments.length) {
        return {message: 'No comments'}
      }
      return comments;
    } catch (error) {
      throw new InternalServerErrorException('Getting comments failed');
    }
  }

  async updateCommentById(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const { content } = updateCommentDto;

      const comment = await this.commentRepository.findOne({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      if (content) {
        comment.content = content;
      }

      const savedComment = await this.commentRepository.save(comment);
      return savedComment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Updating comment failed');
    }
  }

  async deleteCommentById(id:string) {
    try {
      const comment = await this.commentRepository.findOne({ where: { id }});
      if (!comment) {
        throw new NotFoundException('There is not comment with such id')
      }

      await this.commentRepository.delete(id)
      return { message: 'Comment successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Deleting comment failed');
    }
  }
}

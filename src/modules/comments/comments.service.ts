import { NotFoundException } from './../../shared/exceptions/http.exception';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { v4 as uuidv4 } from 'uuid';

export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(blogId:string, createCommentDto: CreateCommentDto) {
    const { userId, content } = createCommentDto;
    const newCommentId = uuidv4();
    const newComment = this.commentRepository.create({
      id: newCommentId,
      userId,
      blogId,
      content
    });

    const savedComment = await this.commentRepository.save(newComment);

    return savedComment;
  }

  async getBlogComments(blogId:string) {
    const comments = await this.commentRepository.find({ where: { blogId } });
    if (!comments.length) {
      throw new NotFoundException('No comments');
    }

    return comments;
  }

  async updateCommentById(id: string, updateCommentDto: UpdateCommentDto) {
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
  }

  async deleteCommentById(id:string) {
    const comment = await this.commentRepository.findOne({ where: { id }});
    if (!comment) {
      throw new NotFoundException('There is not comment with such id')
    }

    const deletedComment = await this.commentRepository.delete(id)
    return deletedComment;
  }
}

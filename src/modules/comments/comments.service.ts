import { NotFoundException } from './../../shared/exceptions/http.exception';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { v4 as uuidv4 } from 'uuid';

export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(blogId:string, createCommentDto: CreateCommentDto) {
    const { userId, content, parentCommentId } = createCommentDto;


    const parentComment = parentCommentId
      ? await this.commentRepository.findOne({ where: { id: parentCommentId } })
      : null;

    if (parentCommentId && !parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    const newCommentId = uuidv4();
    const newComment = this.commentRepository.create({
      id: newCommentId,
      userId,
      blogId,
      content,
      parentComment
    });

    const savedComment = await this.commentRepository.save(newComment);

    return savedComment;
  }

  async getBlogComments(blogId:string) {
    const comments = await this.commentRepository.find({
      where: {
        blogId,
        parentCommentId: IsNull()
      },
      order: { createdAt: 'DESC' }
    });

    if (!comments.length) {
      throw new NotFoundException('No comments');
    }

    const commentsWithReplies = await this.loadReplies(comments);

    return commentsWithReplies;
  }

  private async loadReplies(comments: Comment[]) {
    const promises = comments.map(async (comment) => {
      const replies = await this.commentRepository.find({
        where: { parentCommentId: comment.id },
        order: { createdAt: 'ASC' }
      });

      comment.replies = await this.loadReplies(replies);
      return comment;
    });

    return Promise.all(promises);
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

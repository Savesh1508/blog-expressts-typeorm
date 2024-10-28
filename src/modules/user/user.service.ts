import { BadRequestException, NotFoundException } from './../../shared/exceptions/http.exception';
import { Not, Repository } from "typeorm";
import { User } from "./user.entity";
import { ChangePasswordDto } from './dto/change-password.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../shared/constants/roles.constants';


export class UserService{
  constructor(
    private userRepository: Repository<User>
  ){}

  async getUserProfile(id:string){
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['blogs']
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      blogs: user.blogs,
      createdAt: user.createdAt
    }
  }

  async changePassword(id:string, changePasswordDto: ChangePasswordDto){
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto

    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const comparing = await bcrypt.compare(currentPassword, user.password)
    if (!comparing) {
      throw new BadRequestException('Incorrect current password')
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const newHashedPassword = await bcrypt.hash(confirmPassword, 10);
    user.password = newHashedPassword

    const updatedUser = await this.userRepository.save(user)

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt
    }
  }

  async updateUserProfile(id:string, updateUserDto: UpdateUserDto) {
    const { email, username } = updateUserDto

    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const existingUser = await this.userRepository.findOne({ where: [
      { email, id: Not(id) },
      { username, id: Not(id) }
    ]})

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('Email is already taken');
      }
      if (existingUser.username === username) {
        throw new BadRequestException('Username is already taken');
      }
    }

    if (email) {
      user.email = email
    }
    if (username) {
      user.username = username
    }

    const updatedUser = await this.userRepository.save(user);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt
    }
  }

  async updateUserRole(id:string){
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Roles.USER) {
      user.role = Roles.ADMIN
    } else if (user.role === Roles.ADMIN) {
      user.role = Roles.USER
    }

    const updatedUser = await this.userRepository.save(user);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    }
  }
}
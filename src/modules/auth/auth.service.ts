import { SignUpDto } from './dto/auth-signup.dto';
import { LoginDto } from './dto/auth-login.dto';
import { User } from '../user/user.entity';
import { jwtService } from '../../shared/utils/JwtService';
import { Repository } from 'typeorm';
import uuid from "uuid";
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userRepository: Repository<User>){}

  async signup(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      return `This user already exists!`
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = uuid.v4()

    const newUser = this.userRepository.create({
      id: newUserId,
      username,
      email,
      password: hashedPassword,
    });

    const tokens = jwtService.generateTokens({ id: newUser.id, email: newUser.email });
    newUser.refreshToken = tokens.refreshToken;

    await this.userRepository.save(newUser);

    return {
      ...newUser,
      token: tokens.accessToken
    };
  }

  async login(loginDto: LoginDto):Promise<User | string> {
    const { email, password } = loginDto;

    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) {
      return `User not found!`
    }

    const isTruePassword = await bcrypt.compare(password, findUser.password);

    if (isTruePassword) {
      return findUser
    } else {
      return `Incorrect email or password!`
    }
  }
}

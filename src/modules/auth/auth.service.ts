import { SignUpDto } from '../user/dto/auth-signup.dto';
import { LoginDto } from '../user/dto/auth-login.dto';
import { User } from '../user/user.entity';
import { jwtService } from '../../shared/utils/JwtService';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException
} from '../../shared/exceptions/http.exception';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async signup(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('This user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = uuidv4();

    const newUser = this.userRepository.create({
      id: newUserId,
      username,
      email,
      password: hashedPassword,
    });

    const tokens = jwtService.generateTokens({ id: newUser.id, email: newUser.email });
    newUser.refreshToken = tokens.refreshToken;
    await this.userRepository.save(newUser);

    const { password:_, ...newUserWithOutPassword } = newUser;
    return {
      ...newUserWithOutPassword,
      accessToken: tokens.accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) {
      throw new NotFoundException('Incorrect email or password');
    }

    const isTruePassword = await bcrypt.compare(password, findUser.password);
    if (!isTruePassword) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const tokens = jwtService.generateTokens({ id: findUser.id, email: findUser.email });
    findUser.refreshToken = tokens.refreshToken;

    await this.userRepository.save(findUser);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}

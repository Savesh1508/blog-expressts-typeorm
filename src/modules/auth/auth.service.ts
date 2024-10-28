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
import bcrypt from 'bcrypt';
import { Roles } from '../../shared/constants/roles.constants';

export class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async signup(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('This user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: Roles.USER
    });

    const tokens = jwtService.generateTokens({ id: newUser.id, email: newUser.email , role: newUser.role});
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

    const tokens = jwtService.generateTokens({ id: findUser.id, email: findUser.email, role: findUser.role });
    findUser.refreshToken = tokens.refreshToken;

    await this.userRepository.save(findUser);

    const { password:_, role:__, ...userWithOutPasswordAndRole } = findUser

    return {
      ...userWithOutPasswordAndRole,
      accessToken: tokens.accessToken,
    }
  }
}

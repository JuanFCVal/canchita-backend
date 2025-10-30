import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { UserProfile } from '../entities/user-profile.entity';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: any,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, name } = signUpDto;
    const existingUser = await this.userProfileRepository.findOne({
      where: { email },
    });

    if (existingUser && existingUser.is_verified) {
      throw new BadRequestException('User already exists and is verified');
    }

    const displayName = name || email.split('@')[0];

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: displayName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data.user) {
      throw new BadRequestException('Failed to create user');
    }

    let userProfile = existingUser;
    if (!userProfile) {
      // Create new profile
      userProfile = this.userProfileRepository.create({
        email,
        name: displayName,
        is_verified: false,
        is_auto_created: false, // This is a manual signup
      });
    } else {
      // Update existing auto-created profile
      userProfile.name = displayName;
      userProfile.is_auto_created = false; // Now it's a real user signup
    }

    await this.userProfileRepository.save(userProfile);

    if (data.session) {
      await this.userProfileRepository.update({ email }, { is_verified: true });

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: userProfile.name,
        },
      };
    }

    return {
      access_token: '',
      refresh_token: '',
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: userProfile.name,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    // First, check if this is an auto-created user trying to login
    const existingProfile = await this.userProfileRepository.findOne({
      where: { email },
    });

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If login failed and user exists as auto-created, provide helpful message
      if (
        existingProfile &&
        existingProfile.is_auto_created &&
        !existingProfile.is_verified
      ) {
        throw new UnauthorizedException(
          'This email was added to a group but no account exists yet. Please sign up first to create your account.',
        );
      }
      throw new UnauthorizedException(error.message);
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let userProfile = existingProfile;
    if (!userProfile) {
      // Create profile for existing Supabase user
      userProfile = this.userProfileRepository.create({
        email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        is_verified: true,
        is_auto_created: false,
      });
      await this.userProfileRepository.save(userProfile);
    } else {
      // Update existing profile on successful login
      if (!userProfile.is_verified) {
        userProfile.is_verified = true;
      }
      if (userProfile.is_auto_created) {
        userProfile.is_auto_created = false; // Now it's a real verified user
      }
      await this.userProfileRepository.save(userProfile);
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: userProfile.name,
      },
    };
  }

  async refreshSession(refreshToken: string): Promise<AuthResponseDto> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userProfile = await this.userProfileRepository.findOne({
      where: { email: data.user.email! },
    });

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: userProfile?.name || data.user.user_metadata?.name,
      },
    };
  }

  async signOut(refreshToken: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.signOut(refreshToken);

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUser(accessToken: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    const userProfile = await this.userProfileRepository.findOne({
      where: { email: data.user.email! },
    });

    return {
      id: data.user.id,
      email: data.user.email!,
      name: userProfile?.name || data.user.user_metadata?.name,
      profile: userProfile,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const { sub: userId, email } = payload;

    const userProfile = await this.userProfileRepository.findOne({
      where: { email },
    });

    if (!userProfile) {
      return null;
    }

    return {
      userId,
      email,
      profile: userProfile,
    };
  }
}

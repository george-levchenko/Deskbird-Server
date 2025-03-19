import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

// ------------------------------------------- AuthController Tests ----------------------------------------------------

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  // Override the LocalAuthGuard to always allow access in tests.
  const mockLocalAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.login with req.user and return its result', () => {
      // Simulate a user DTO based on the User entity.
      const userDto = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpassword',
        isAdmin: false,
        name: 'John Doe',
        email: 'john@example.com',
      };
      const expectedResult = { access_token: 'sample_token' };
      mockAuthService.login.mockReturnValue(expectedResult);

      const req = { user: userDto };
      const result = authController.login(req);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(userDto);
    });
  });
});

// ------------------------------------------- AuthService Tests -------------------------------------------------------

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: mockUsersService }, { provide: JwtService, useValue: mockJwtService }],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      // User entity using the provided entity properties.
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpassword',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };

      mockUsersService.findByUsername.mockResolvedValue(user);
      // Use mockImplementation to return a Promise<string> for bcrypt.compare.
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await authService.validateUser('john_doe', 'password123');

      expect(result).toEqual(user);
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('john_doe');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await authService.validateUser('john_doe', 'password123');
      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('john_doe');
    });

    it('should return null if password does not match', async () => {
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpassword',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };

      mockUsersService.findByUsername.mockResolvedValue(user);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await authService.validateUser('john_doe', 'wrongpassword');
      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('john_doe');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
    });
  });

  describe('login', () => {
    it('should return an object containing an access token', () => {
      // The user DTO with fields from the User entity.
      const userDto = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpassword',
        isAdmin: false,
        name: 'John Doe',
        email: 'john@example.com',
      };
      const token = 'sample_token';
      mockJwtService.sign.mockReturnValue(token);

      const result = authService.login(userDto);
      expect(result).toEqual({ access_token: token });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: userDto.username,
        sub: userDto.id,
        isAdmin: userDto.isAdmin,
      });
    });
  });
});

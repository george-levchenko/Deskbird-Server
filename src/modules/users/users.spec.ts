import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../utils/guards/jwt/jwt.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

// ------------------------------------------- UsersController Tests ------------------------------------------------------

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Override the JWT guard so tests bypass authentication.
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          username: 'john_doe',
          password: 'hashedpass',
          name: 'John Doe',
          email: 'john@example.com',
          isAdmin: false,
        },
      ];
      mockUsersService.findAll.mockResolvedValue(users);
      expect(await controller.getUsers()).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should call service.create with the correct DTO and return the result', async () => {
      const createUserDto = {
        username: 'john_doe',
        password: 'password123',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };
      const createdUser = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpassword123',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };
      mockUsersService.create.mockResolvedValue(createdUser);
      expect(await controller.createUser(createUserDto)).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should call service.update with the correct parameters and return the result', async () => {
      const updateUserDto = {
        username: 'john_doe_updated',
        password: 'newpassword123',
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      const updatedUser = {
        id: 1,
        username: 'john_doe_updated',
        password: 'hashednewpassword',
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      mockUsersService.update.mockResolvedValue(updatedUser);
      expect(await controller.updateUser(1, updateUserDto)).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should call service.delete with the correct id and return the result', async () => {
      const result = { affected: 1 };
      mockUsersService.delete.mockResolvedValue(result);
      expect(await controller.deleteUser(1)).toEqual(result);
      expect(mockUsersService.delete).toHaveBeenCalledWith(1);
    });
  });
});

// ------------------------------------------- UsersService Tests ------------------------------------------------------

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users ordered by id ASC', async () => {
      const users = [
        {
          id: 1,
          username: 'john_doe',
          password: 'hashedpass',
          name: 'John Doe',
          email: 'john@example.com',
          isAdmin: false,
        },
      ];
      mockRepository.find.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });
  });

  describe('findByUsername', () => {
    it('should return a user matching the given username', async () => {
      const user = {
        id: 1,
        username: 'john_doe',
        password: 'hashedpass',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };
      mockRepository.findOne.mockResolvedValue(user);
      expect(await service.findByUsername('john_doe')).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: 'john_doe' } });
    });
  });

  describe('create', () => {
    it('should hash the password and save the user', async () => {
      // createUserDto from your CreateUserDto
      const createUserDto = {
        username: 'john_doe',
        password: 'password123',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };
      const hashedPassword = 'hashedpassword123';
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      const savedUser = {
        id: 1,
        username: 'john_doe',
        password: hashedPassword,
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
      };
      mockRepository.save.mockResolvedValue(savedUser);
      expect(await service.create(createUserDto)).toEqual(savedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockRepository.save).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
    });
  });

  describe('update', () => {
    it('should hash the password if provided and update the user', async () => {
      // updateUserDto with all fields including password
      const updateUserDto = {
        username: 'john_doe_updated',
        password: 'newpassword123',
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      const hashedPassword = 'hashednewpassword';
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      mockRepository.update.mockResolvedValue({});
      const updatedUser = {
        id: 1,
        username: 'john_doe_updated',
        password: hashedPassword,
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      mockRepository.findOne.mockResolvedValue(updatedUser);
      expect(await service.update(1, updateUserDto)).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { ...updateUserDto, password: hashedPassword });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should remove the password field if not provided and update the user', async () => {
      // updateUserDto without password
      const updateUserDto = {
        username: 'john_doe_updated',
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      mockRepository.update.mockResolvedValue({});
      const updatedUser = {
        id: 1,
        username: 'john_doe_updated',
        password: 'existinghashedpassword',
        name: 'John Updated',
        email: 'john_updated@example.com',
        isAdmin: true,
      };
      mockRepository.findOne.mockResolvedValue(updatedUser);
      expect(await service.update(1, updateUserDto)).toEqual(updatedUser);
      // Expect that update is called without the password field
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('delete', () => {
    it('should call repository.delete with the given id', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      expect(await service.delete(1)).toEqual({ affected: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});

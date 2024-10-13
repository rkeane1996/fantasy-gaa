import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameweekService } from './gameweek.service';
import { GameweekRepository } from '../repository/gameweek.repository';
import { CreateGameweekDto } from '../dto/request/create-gameweek.dto';

import { Gameweek } from '../schema/gameweek.schema';


describe('GameweekService', () => {
  let service: GameweekService;
  let gameweekRepo: GameweekRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameweekService,
        {
          provide: GameweekRepository,
          useValue: {
            getGameWeek: jest.fn(),
            createGameWeek: jest.fn(),
            getGameWeeks: jest.fn(),
            startEndGameweek: jest.fn(),
            addMatchToGameweek: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameweekService>(GameweekService);
    gameweekRepo = module.get<GameweekRepository>(GameweekRepository);
  });

  // Test for creating a new gameweek
  describe('createGameWeek', () => {
    const createGameweekDto: CreateGameweekDto = {
      gameweekNumber: 1,
      matches: [],
      transferDeadline: new Date(),
    };

    it('should create a new gameweek if it does not exist', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);
      jest.spyOn(gameweekRepo, 'createGameWeek').mockResolvedValue({
        _id: '1',
        gameweekNumber: 1,
        transferDeadline: new Date(),
      } as Gameweek);

      const result = await service.createGameWeek(createGameweekDto);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(gameweekRepo.createGameWeek).toHaveBeenCalledWith(
        createGameweekDto,
      );
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should return an existing gameweek if already created', async () => {
      const existingGameweek = { _id: '1', gameweekNumber: 1 } as Gameweek;
      jest
        .spyOn(gameweekRepo, 'getGameWeek')
        .mockResolvedValue(existingGameweek);

      const result = await service.createGameWeek(createGameweekDto);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should throw BadRequestException if gameweek creation fails', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);
      jest.spyOn(gameweekRepo, 'createGameWeek').mockResolvedValue(null);

      await expect(service.createGameWeek(createGameweekDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Test for fetching all gameweeks
  describe('getGameWeeks', () => {
    it('should return all gameweeks', async () => {
      const gameweeks = [
        { _id: '1', gameweekNumber: 1, matches: [] },
        { _id: '2', gameweekNumber: 2, matches: [] },
      ] as Gameweek[];

      jest.spyOn(gameweekRepo, 'getGameWeeks').mockResolvedValue(gameweeks);

      const result = await service.getGameWeeks();
      expect(gameweekRepo.getGameWeeks).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
  });

  // Test for fetching a specific gameweek by its number
  describe('getGameWeek', () => {
    it('should return a gameweek by its number', async () => {
      const gameweek = { _id: '1', gameweekNumber: 1, matches: [] } as Gameweek;
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(gameweek);

      const result = await service.getGameWeek(1);
      expect(gameweekRepo.getGameWeek).toHaveBeenCalledWith(1);
      expect(result.gameweekNumber).toEqual(1);
    });

    it('should throw NotFoundException if gameweek is not found', async () => {
      jest.spyOn(gameweekRepo, 'getGameWeek').mockResolvedValue(null);

      await expect(service.getGameWeek(1)).rejects.toThrow(NotFoundException);
    });
  });

  // Test for activating or deactivating a gameweek
  describe('startEndGameweek', () => {
    it('should start or end a gameweek', async () => {
      const gameweek = { gameweekNumber: 1, isActive: true } as Gameweek;
      jest.spyOn(gameweekRepo, 'startEndGameweek').mockResolvedValue(gameweek);

      const result = await service.startEndGameweek(1, true);
      expect(gameweekRepo.startEndGameweek).toHaveBeenCalledWith(1, true);
      expect(result.Gameweek).toEqual(1);
      expect(result.IsActive).toBe(true);
    });
  });
});

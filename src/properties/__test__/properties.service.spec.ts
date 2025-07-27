import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from '../properties.service';
import { Property } from '../entities/property.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let repository: Repository<Property>;

  beforeEach(async () => {
  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockImplementation((options) =>
      options.where.id === 999 ? Promise.resolve(null) : Promise.resolve({
        id: options.where.id,
        name: 'Test Property',
        description: 'Test Description',
        location: 'Test Location',
        imageUrl: 'http://example.com/image.jpg',
        unitsAvailable: 4,
        hasWifi: true,
        hasLaundry: true,
      })
    ),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((property) => Promise.resolve({ id: Date.now(), ...property })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PropertiesService,
      {
        provide: getRepositoryToken(Property),
        useValue: mockRepository,
      },
    ],
  }).compile();

  service = module.get<PropertiesService>(PropertiesService);
  repository = module.get<Repository<Property>>(getRepositoryToken(Property));
});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single property', async () => {
      const mockProperty = new Property();
      mockProperty.id = 1;
      mockProperty.name = 'Acme Fresh Start Housing';
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProperty);
    });

    it('should throw NotFoundException if property not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully insert a property', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'New Property',
        description: 'New Description',
        location: 'New Location',
        imageUrl: 'http://example.com/image.jpg',
        unitsAvailable: 5,
        hasWifi: true,
        hasLaundry: false,
      };

      const result = await service.create(createPropertyDto);
      expect(result).toBeDefined();
      expect(result.name).toEqual(createPropertyDto.name);
      expect(repository.save).toHaveBeenCalledWith(createPropertyDto);
    });
  });

  describe('update', () => {
  it('should update a property', async () => {
    const updatePropertyDto: UpdatePropertyDto = {
      name: 'Updated Property',
    };

    const mockProperty = new Property();
    mockProperty.id = 1;
    mockProperty.name = 'Acme Fresh Start Housing';

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);
    jest.spyOn(repository, 'save').mockResolvedValue({ ...mockProperty, ...updatePropertyDto });

    const result = await service.update(1, updatePropertyDto);
    expect(result.name).toEqual(updatePropertyDto.name);
  });
});

describe('remove', () => {
  it('should remove a property', async () => {
    const mockProperty = new Property();
    mockProperty.id = 1;

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);
    jest.spyOn(repository, 'remove');

    await service.remove(1);
    expect(repository.remove).toHaveBeenCalledWith(mockProperty);
  });
});
});

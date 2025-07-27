import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from '../properties.controller';
import { PropertiesService } from '../properties.service';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { Property } from '../entities/property.entity';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Property' }]),
      findOne: jest.fn().mockImplementation((id: number) =>
        id === 1 ? Promise.resolve({ id, name: 'Test Property' }) : Promise.resolve(null)
      ),
      create: jest.fn().mockImplementation((createPropertyDto: CreatePropertyDto) =>
        Promise.resolve({ id: Date.now(), ...createPropertyDto })
      ),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, name: 'Test Property' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single property', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Test Property' });
    });
  });

  describe('create', () => {
    it('should create a new property', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'New Property',
        description: 'New Description',
        location: 'New Location',
        imageUrl: 'http://example.com/image.jpg',
        unitsAvailable: 5,
        hasWifi: true,
        hasLaundry: false,
      };

      const result = await controller.create(createPropertyDto);
      expect(result).toBeDefined();
      expect(result.name).toEqual(createPropertyDto.name);
      expect(service.create).toHaveBeenCalledWith(createPropertyDto);
    });
  });

  describe('update', () => {
  it('should update a property', async () => {
    const updatePropertyDto: UpdatePropertyDto = {
      name: 'Updated Property',
    };

    const mockProperty: Property = {
      id: 1,
      name: 'Acme Fresh Start Housing',
      description: 'New Description',
      location: 'Chicago, IL',
      imageUrl: 'http://example.com/image.jpg',
      unitsAvailable: 4,
      hasWifi: true,
      hasLaundry: true,
    };

    jest.spyOn(service, 'update').mockResolvedValue(mockProperty);

    const result = await controller.update(1, updatePropertyDto);
    expect(result).toEqual(mockProperty);
  });
});

  describe('remove', () => {
    it('should remove a property', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

});

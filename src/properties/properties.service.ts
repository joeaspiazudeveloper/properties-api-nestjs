import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
    constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Property[]> {
    return this.propertiesRepository.find();
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertiesRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }
    return property;
  }

  create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const newProperty = this.propertiesRepository.create(createPropertyDto);
    return this.propertiesRepository.save(newProperty);
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, updatePropertyDto);
    return this.propertiesRepository.save(property);
  }

  async remove(id: number): Promise<void> {
    const property = await this.findOne(id);
    await this.propertiesRepository.remove(property);
  }
}

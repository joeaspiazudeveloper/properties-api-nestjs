import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(createPropertyDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.propertiesService.remove(id);
  }
}

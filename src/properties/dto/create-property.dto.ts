import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  imageUrl: string;

  @IsNumber()
  unitsAvailable: number;

  @IsBoolean()
  hasWifi: boolean;

  @IsBoolean()
  hasLaundry: boolean;
}
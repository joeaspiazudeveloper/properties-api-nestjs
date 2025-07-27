import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  imageUrl: string;

  @Column()
  unitsAvailable: number;

  @Column({ default: false })
  hasWifi: boolean;

  @Column({ default: false })
  hasLaundry: boolean;
}

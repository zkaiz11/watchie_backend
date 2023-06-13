import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MovieCatagory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  desc: string;
}

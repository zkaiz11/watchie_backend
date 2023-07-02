import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  videoUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  duration: string;

  @Column()
  genre: string;
}

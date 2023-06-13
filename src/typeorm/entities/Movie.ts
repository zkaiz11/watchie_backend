import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieCatagory } from './MovieCatagory';

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
  genre: string;

  @Column()
  duration: string;

  @ManyToMany(() => MovieCatagory)
  @JoinTable()
  catagories: MovieCatagory[];
}

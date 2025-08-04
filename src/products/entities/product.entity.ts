import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '315c0737-744f-4433-8a17-0159f962f975',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty()
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  //eager: se cargan automáticamente cada vez que se cargan entidades desde la base de datos
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  //Relacion muchos a uno con usuarios
  @ManyToOne(
    () => User,
    (user) => user.product,
    //Cargue automaticamente esta relacion cuando se realice la consulta
    { eager: true },
  )
  user: User;

  //Verificacion antes de la insercion
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}

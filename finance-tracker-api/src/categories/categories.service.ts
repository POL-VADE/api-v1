import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        title: createCategoryDto.title,
        type: createCategoryDto.type,
        defaultCategory: createCategoryDto.defaultCategory || false,
        iconRes: createCategoryDto.iconRes,
        iconColor: createCategoryDto.iconColor,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { title: 'asc' },
    });
  }

  async findByType(type: TransactionType, userId: string) {
    return this.prisma.category.findMany({
      where: { type, userId },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: {
        title: updateCategoryDto.title,
        type: updateCategoryDto.type,
        defaultCategory: updateCategoryDto.defaultCategory,
        iconRes: updateCategoryDto.iconRes,
        iconColor: updateCategoryDto.iconColor,
      },
    });
  }

  async findDefaultCategories(userId: string) {
    return this.prisma.category.findMany({
      where: {
        userId,
        defaultCategory: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async findCustomCategories(userId: string) {
    return this.prisma.category.findMany({
      where: {
        userId,
        defaultCategory: false,
      },
      orderBy: { title: 'asc' },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.category.delete({ where: { id } });
  }
}

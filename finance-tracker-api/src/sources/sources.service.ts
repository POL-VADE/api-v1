import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SourceType } from '@prisma/client';

@Injectable()
export class SourcesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSourceDto: CreateSourceDto) {
    return this.prisma.source.create({
      data: {
        userId,
        type: createSourceDto.type as SourceType,
        initialBalance: createSourceDto.initialBalance,
        bankSourceTitle: createSourceDto.bankSourceTitle,
        bankSourceBankName: createSourceDto.bankSourceBankName,
        bankSourceCardNumber: createSourceDto.bankSourceCardNumber,
        bankSourceSmsSuggestion: createSourceDto.bankSourceSmsSuggestion,
        customSourceTitle: createSourceDto.customSourceTitle,
        iconRes: createSourceDto.iconRes,
        iconColor: createSourceDto.iconColor,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.source.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const source = await this.prisma.source.findFirst({
      where: { id, userId },
    });

    if (!source) {
      throw new NotFoundException(`Source with ID ${id} not found`);
    }

    return source;
  }

  async findByType(type: SourceType, userId: string) {
    return this.prisma.source.findMany({
      where: { type, userId },
    });
  }

  async update(id: string, userId: string, updateSourceDto: UpdateSourceDto) {
    await this.findOne(id, userId);

    return this.prisma.source.update({
      where: { id },
      data: {
        type: updateSourceDto.type as SourceType,
        initialBalance: updateSourceDto.initialBalance,
        bankSourceTitle: updateSourceDto.bankSourceTitle,
        bankSourceBankName: updateSourceDto.bankSourceBankName,
        bankSourceCardNumber: updateSourceDto.bankSourceCardNumber,
        bankSourceSmsSuggestion: updateSourceDto.bankSourceSmsSuggestion,
        customSourceTitle: updateSourceDto.customSourceTitle,
        iconRes: updateSourceDto.iconRes,
        iconColor: updateSourceDto.iconColor,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.source.delete({ where: { id } });
  }

  async findBankSources(userId: string) {
    return this.prisma.source.findMany({
      where: { type: SourceType.Bank, userId },
    });
  }

  async findCustomSources(userId: string) {
    return this.prisma.source.findMany({
      where: { type: SourceType.Custom, userId },
    });
  }

  async findSourcesWithSmsSuggestion(userId: string) {
    return this.prisma.source.findMany({
      where: { bankSourceSmsSuggestion: true, userId },
    });
  }
}

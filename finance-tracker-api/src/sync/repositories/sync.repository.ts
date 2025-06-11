import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Transaction, Category, Source, Budget } from '@prisma/client';
import { Prisma } from '@prisma/client';

type EntityWithDeleted<T> = T & { deleted?: boolean };

@Injectable()
export class SyncRepository {
  constructor(private prisma: PrismaService) {}

  async getLastUpdate<T extends { updatedAt: Date }>(
    model: any,
    userId: string,
  ): Promise<Date | undefined> {
    const lastUpdate = await model.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    return lastUpdate?.updatedAt;
  }

  async getChanges<T extends { id: string; userId: string; updatedAt: Date }>(
    model: any,
    userId: string,
    lastSync: Date,
    include?: Record<string, boolean>,
  ): Promise<EntityWithDeleted<T>[]> {
    return model.findMany({
      where: {
        userId,
        updatedAt: { gt: lastSync },
      },
      include,
    });
  }

  async handleEntitySync<T extends { id: string; userId: string }>(
    model: any,
    userId: string,
    entity: EntityWithDeleted<T>,
    service: {
      create: (userId: string, data: any) => Promise<any>;
      update: (userId: string, id: string, data: any) => Promise<any>;
      remove: (userId: string, id: string) => Promise<any>;
    },
  ): Promise<'created' | 'updated' | 'deleted'> {
    if (entity.deleted) {
      await service.remove(userId, entity.id);
      return 'deleted';
    }

    const exists = await model.findUnique({
      where: { id: entity.id },
    });

    if (exists) {
      await service.update(userId, entity.id, entity);
      return 'updated';
    } else {
      await service.create(userId, entity);
      return 'created';
    }
  }
}

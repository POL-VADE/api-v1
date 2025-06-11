import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SyncChangesDto } from './dto/sync-changes.dto';
import { SyncResponseDto } from './dto/sync-response.dto';
import { SyncStatusDto } from './dto/sync-status.dto';
import { RequestWithUser } from '../common/types/request.types';

@ApiTags('sync')
@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Get sync status',
    description: 'Returns the last sync time and last update times for each entity type',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the sync status',
    type: SyncStatusDto,
  })
  async getSyncStatus(@Request() req: RequestWithUser): Promise<SyncStatusDto> {
    return this.syncService.getSyncStatus(req.user.id);
  }

  @Get('changes')
  @ApiOperation({
    summary: 'Get changes since last sync',
    description: `
      Returns all changes since the last sync time.
      This endpoint is used to get server-side changes that need to be synced to the client.
      
      The response includes:
      - New entities created since last sync
      - Updated entities since last sync
      - Deleted entities since last sync
      
      Each entity type (transactions, categories, sources, budgets) is returned separately.
      Deleted entities are marked with a 'deleted' flag.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the changes since last sync',
    type: SyncChangesDto,
  })
  async getChanges(
    @Request() req: RequestWithUser,
    @Query('lastSync') lastSync: string,
  ): Promise<SyncChangesDto> {
    return this.syncService.getChanges(req.user.id, new Date(lastSync));
  }

  @Post('sync')
  @ApiOperation({
    summary: 'Sync changes with server',
    description: `
      Syncs client-side changes with the server.
      This endpoint handles:
      - Creating new entities
      - Updating existing entities
      - Deleting entities (marked with 'deleted' flag)
      
      The sync process:
      1. Validates all entities
      2. Applies changes in the correct order (categories -> sources -> transactions -> budgets)
      3. Returns detailed results of the sync operation
      
      Conflict resolution:
      - If an entity is modified on both client and server, the server version takes precedence
      - Deleted entities are properly handled and removed from the database
      - Related entities (e.g., transactions with categories) are properly linked
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the sync results',
    type: SyncResponseDto,
  })
  async syncChanges(
    @Request() req: RequestWithUser,
    @Body() changes: SyncChangesDto,
  ): Promise<SyncResponseDto> {
    return this.syncService.syncChanges(req.user.id, changes);
  }
}

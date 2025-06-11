import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { RequestWithUser } from '../common/types/request.types';

@ApiTags('sources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new source' })
  @ApiResponse({
    status: 201,
    description: 'Source created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        type: { type: 'string', enum: ['Bank', 'Custom'] },
        initialBalance: { type: 'number' },
        bankSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            bankName: { type: 'string' },
            cardNumber: { type: 'string' },
            smsSuggestion: { type: 'boolean' },
          },
        },
        customSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            iconRes: { type: 'string' },
            iconColor: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  create(@Request() req: RequestWithUser, @Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(req.user.id, createSourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sources for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all sources',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['Bank', 'Custom'] },
          initialBalance: { type: 'number' },
          bankSource: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              bankName: { type: 'string' },
              cardNumber: { type: 'string' },
              smsSuggestion: { type: 'boolean' },
            },
          },
          customSource: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              iconRes: { type: 'string' },
              iconColor: { type: 'string' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Request() req: RequestWithUser) {
    return this.sourcesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the source',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        type: { type: 'string', enum: ['Bank', 'Custom'] },
        initialBalance: { type: 'number' },
        bankSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            bankName: { type: 'string' },
            cardNumber: { type: 'string' },
            smsSuggestion: { type: 'boolean' },
          },
        },
        customSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            iconRes: { type: 'string' },
            iconColor: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Source not found' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.sourcesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a source' })
  @ApiResponse({
    status: 200,
    description: 'Source updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        type: { type: 'string', enum: ['Bank', 'Custom'] },
        initialBalance: { type: 'number' },
        bankSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            bankName: { type: 'string' },
            cardNumber: { type: 'string' },
            smsSuggestion: { type: 'boolean' },
          },
        },
        customSource: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            iconRes: { type: 'string' },
            iconColor: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Source not found' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.sourcesService.update(id, req.user.id, updateSourceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a source' })
  @ApiResponse({ status: 200, description: 'Source deleted successfully' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.sourcesService.remove(id, req.user.id);
  }
}

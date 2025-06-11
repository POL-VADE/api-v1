import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TransactionType } from '../transactions/entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequestWithUser } from '../common/types/request.types';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['Income', 'Expense'] },
        defaultCategory: { type: 'boolean' },
        iconRes: { type: 'string' },
        iconColor: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  create(@Request() req: RequestWithUser, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.id, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          type: { type: 'string', enum: ['Income', 'Expense'] },
          defaultCategory: { type: 'boolean' },
          iconRes: { type: 'string' },
          iconColor: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll(@Request() req: RequestWithUser) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default categories' })
  @ApiResponse({
    status: 200,
    description: 'Return default categories.',
    type: [CreateCategoryDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findDefault(@Request() req: RequestWithUser) {
    return this.categoriesService.findDefaultCategories(req.user.id);
  }

  @Get('custom')
  @ApiOperation({ summary: 'Get custom categories' })
  @ApiResponse({
    status: 200,
    description: 'Return custom categories.',
    type: [CreateCategoryDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findCustom(@Request() req: RequestWithUser) {
    return this.categoriesService.findCustomCategories(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the category',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['Income', 'Expense'] },
        defaultCategory: { type: 'boolean' },
        iconRes: { type: 'string' },
        iconColor: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['Income', 'Expense'] },
        defaultCategory: { type: 'boolean' },
        iconRes: { type: 'string' },
        iconColor: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, req.user.id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.categoriesService.remove(id, req.user.id);
  }
}

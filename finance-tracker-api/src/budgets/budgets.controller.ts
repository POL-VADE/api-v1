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
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { RequestWithUser } from '../common/types/request.types';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'Budget created successfully' })
  create(@Request() req: RequestWithUser, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.id, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets for the current user' })
  @ApiResponse({ status: 200, description: 'Return all budgets' })
  findAll(@Request() req: RequestWithUser) {
    return this.budgetsService.findAll(req.user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active budgets' })
  @ApiResponse({
    status: 200,
    description: 'Return active budgets.',
    type: [CreateBudgetDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findActive(@Request() req: RequestWithUser) {
    return this.budgetsService.findActive(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget by id' })
  @ApiResponse({ status: 200, description: 'Return the budget' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.budgetsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  @ApiResponse({ status: 200, description: 'Budget updated successfully' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, req.user.id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  @ApiResponse({ status: 200, description: 'Budget deleted successfully' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.budgetsService.remove(id, req.user.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @Get()
  findAll(
    @Query('page_item') page_item: string,
    @Query('page_number') page_number: string,
    @Query('featured') featured?: string,
    @Query('food_name') food_name?: string,
  ) {
    return this.foodService.findAll(
      Number(page_item),
      Number(page_number),
      featured,
      food_name,
    );
  }

  @Get('/foodstore/:foodstore_id')
  findFoodStore(
    @Param('foodstore_id') foodstore_id: number,
    @Query('featured') featured?: string
) {
    return this.foodService.findFoodStore(Number(foodstore_id), featured);
  }

  @Get('/category/:category_id')
  findCategory(
    @Param('category_id') category_id: number,
    @Query('featured') featured?: string
  ) {
    return this.foodService.findCategory(Number(category_id), featured);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(+id);
  }
}

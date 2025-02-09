import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationLibsService } from 'src/pagination_libs/pagination_libs.service';

@Injectable()
export class FoodService {
  constructor(
    private prismaService: PrismaService,
    private readonly paginationService: PaginationLibsService,
  ) {}

  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  async findAll(
    page: number,
    limit: number,
    featured?: string,
    food_name?: string,
  ) {
    try {
      // Convert query data from string to appropriate type
      const currentPage = Number(page) || 1;
      const pageSize = Number(limit) || 10;
      const skip = (currentPage - 1) * pageSize;
  
      // Facilitate queries with Prisma object
      const where: any = {};
  
      if (featured !== undefined) {
        where.featured = featured === 'true'; // convert to boolean datatype
      }
  
      if (food_name) {
        where.food_name = { contains: food_name, mode: 'insensitive' }; // Search is case insensitive
      }
  
      // 
Query the list of dishes, get all fields of the food and address table from the foodstore
      const foods = await this.prismaService.food.findMany({
        where,
        select: {
          food_id: true,
          smallicon: true,
          description: true,
          name_food: true,
          price: true,
          is_stock: true,
          featured: true,
          promotion: true,
          kind: true
          foodstore_id: true,
          category_id: true,
          foodstore: {
            select: {
              address: true, //Get the address from the foodstore table
            },
          },
        },
        orderBy: { food_id: 'desc' },
        skip,
        take: pageSize,
      });
  
      // Output data format
      const formattedFoods = foods.map((food) => ({
        ...food, // Keep all food information intact
        address: food.foodstore.address, // Add addresses to results
        eatery: undefined, 
      }));
  
      // Gọi PaginationService để lấy thông tin phân trang
      const paginationMeta = await this.paginationService.paginate(
        this.prismaService.food, // Model Prisma
        currentPage,
        pageSize,
        where,
      );
  
      return {
        status: 'success',
        filters: {
          featured: featured || null,
          limit: pageSize,
        },
        data: {
          docs: formattedFoods,
          pages: paginationMeta,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
    
  async findFoodStore(foodstore_id: number, featured?: string) {
    const query: any = { foodstore_id };

    // If featured is passed, check it and add it to the query
    if (featured !== undefined) {
        query.featured = featured === 'true'; // Chuyển đổi chuỗi "true" thành boolean
    }

    // Execute queries in Prisma
    const foods = await this.prismaService.food.findMany({
        where: query, // Apply foodstore_id and featured filters (if applicable)
    });

    return {
        status: 'success',
        filters: {
            foodstore_id,
            featured: featured !== undefined ? query.featured : undefined,
        },
        data: {
            docs: foods,
        },
    };
}

async findCategory(category_id: number, featured?: string) {
  const query: any = { category_id };

  
  if (featured !== undefined) {
      query.featured = featured === 'true'; 
  }

  // Thực hiện truy vấn trong Prisma
  const foods = await this.prismaService.food.findMany({
      where: query, 
  });

  return {
      status: 'success',
      filters: {
          category_id,
          featured: featured !== undefined ? query.featured : undefined,
      },
      data: {
          docs: foods,
      },
  };
}

  findOne(id: number) {
    return `This action returns a #${id} food`;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}

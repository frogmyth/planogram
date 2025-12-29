import { Controller, Get, Put, Delete, Param, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { StoresService } from './stores.service';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':storeId/layout')
  async getLayout(@Param('storeId') storeId: string) {
    const layout = await this.storesService.getLayout(storeId);
    if (!layout) {
      throw new NotFoundException(`레이아웃을 찾을 수 없습니다: ${storeId}`);
    }
    return {
      storeId: layout.storeId,
      gridLayout: layout.gridLayout,
      gridConfig: layout.gridConfig,
      updatedAt: layout.updatedAt,
    };
  }

  @Put(':storeId/layout')
  async saveLayout(
    @Param('storeId') storeId: string,
    @Body() dto: UpdateLayoutDto,
  ) {
    const layout = await this.storesService.saveLayout(storeId, dto);
    return {
      storeId: layout.storeId,
      gridLayout: layout.gridLayout,
      gridConfig: layout.gridConfig,
      updatedAt: layout.updatedAt,
    };
  }

  @Delete(':storeId/layout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLayout(@Param('storeId') storeId: string) {
    await this.storesService.deleteLayout(storeId);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreLayout } from './store-layout.entity';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreLayout)
    private storeLayoutRepository: Repository<StoreLayout>,
  ) {}

  async getLayout(storeId: string): Promise<StoreLayout | null> {
    return this.storeLayoutRepository.findOne({ where: { storeId } });
  }

  async saveLayout(storeId: string, dto: UpdateLayoutDto): Promise<StoreLayout> {
    let layout = await this.storeLayoutRepository.findOne({ where: { storeId } });

    if (layout) {
      layout.gridLayout = dto.gridLayout;
      if (dto.gridConfig) {
        layout.gridConfig = dto.gridConfig;
      }
    } else {
      layout = this.storeLayoutRepository.create({
        storeId,
        gridLayout: dto.gridLayout,
        gridConfig: dto.gridConfig,
      });
    }

    return this.storeLayoutRepository.save(layout);
  }

  async deleteLayout(storeId: string): Promise<void> {
    await this.storeLayoutRepository.delete({ storeId });
  }
}

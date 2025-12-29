import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('store_layouts')
export class StoreLayout {
  @PrimaryColumn({ length: 100 })
  storeId: string;

  @Column('json', { nullable: true })
  gridLayout: (string | null)[][];

  @Column('json', { nullable: true })
  gridConfig: {
    cellSize: number;
    cols: number;
    rows: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

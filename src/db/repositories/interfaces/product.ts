import { FindManyOptions } from 'typeorm';

import ProductEntity from '../../entities/product';

export interface IProductRepository {
  create(product: ProductEntity, actor: string): Promise<ProductEntity>;
  selectAll(options: FindManyOptions<ProductEntity>): Promise<ProductEntity[]>;
  deleteById(id: string): Promise<void>;
}
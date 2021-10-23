import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class User1612286550803 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }, {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'profileType',
            type: 'int4',
            isNullable: true,
          }, {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'profilePic',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'pushToken',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'deviceType',
            type: 'int4',
            isNullable: true,
          }, {
            name: 'deviceModel',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'deviceSO',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'deviceSOVersion',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'battery',
            type: 'int4',
            isNullable: true,
          }, {
            name: 'appVersion',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'latitude',
            type: 'float4',
            isNullable: true,
          }, {
            name: 'longitude',
            type: 'float4',
            isNullable: true,
          }, {
            name: 'createdBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          }, {
            name: 'updatedBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          }, {
            name: 'deletedBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
        indices: [
          new TableIndex({
            name: 'IDX_USER',
            columnNames: ['email'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}

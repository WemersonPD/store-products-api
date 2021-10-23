import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateProduct1634313095923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'product',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'price',
                    type: 'real',
                    isNullable: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'ownerId',
                    type: 'uuid',
                    isNullable: true
                },
                {
                    name: 'quantity',
                    type: 'int4',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'int4',
                    isNullable: true,
                },
                {
                    name: 'discount',
                    type: 'int4',
                    isNullable: true,
                },
                {
                    name: 'code',
                    type: 'varchar',
                    isNullable: true,
                },
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['ownerId'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user'
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('product')
    }

}

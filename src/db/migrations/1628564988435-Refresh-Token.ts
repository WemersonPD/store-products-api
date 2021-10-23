import {
    TableForeignKey,
    MigrationInterface,
    QueryRunner,
    Table,
} from 'typeorm';

export class RefreshToken1628564988435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'refresh_token',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    }, {
                        name: 'userId',
                        type: 'uuid',
                        isNullable: true,
                    }, {
                        name: 'expiresAt',
                        type: 'timestamptz',
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
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['userId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'user',
                    }),
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('refresh_token');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        await queryRunner.dropForeignKey('refresh_token', foreignKey);

        await queryRunner.dropTable('refresh_token');
    }
}

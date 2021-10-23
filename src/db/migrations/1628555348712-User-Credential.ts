import {
    TableForeignKey,
    MigrationInterface,
    QueryRunner,
    Table,
} from 'typeorm';

export class UserCredential1628555348712 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_credential',
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
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'pin',
                        type: 'varchar',
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
        const table = await queryRunner.getTable('user_credential');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1); 
        await queryRunner.dropForeignKey('user_credential', foreignKey);

        await queryRunner.dropTable('user_credential');
    }
}

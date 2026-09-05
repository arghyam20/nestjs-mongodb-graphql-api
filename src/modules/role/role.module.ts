import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema }
        ])
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class RoleModule { }
import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
// @ts-ignore
import { GraphQLUpload } from "graphql-upload";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { FallbackController } from "./fallback.controller";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>("MONGO_URI"),
        dbName: configService.getOrThrow<string>("DB_DATABASE"),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault() as any],
      resolvers: { Upload: GraphQLUpload },
      formatError: (error) => {
        const originalError: any = error.extensions?.originalError || {};
        return {
          success: false,
          message: originalError?.message || error.message || "Internal error",
          statusCode: originalError?.statusCode || 500,
        };
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [FallbackController],
  providers: [Logger],
})
export class ApiConfigModule {}

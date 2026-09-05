import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { ApiValidationPipe } from "./common/pipes/validation.pipe";
import { CustomExceptionFilter } from "./common/filters/exception.filter";
import { join } from "path";
// @ts-ignore
import { graphqlUploadExpress } from "graphql-upload";
// import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  app.enableCors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  app.use(
    graphqlUploadExpress({ maxFileSize: 10_000_000_000_000, maxFiles: 25 })
  );

  app.useGlobalPipes(new ApiValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(configService.getOrThrow("PORT"), () => {
    logger.debug(
      `Server is running on http://127.0.0.1:${configService.get("PORT")}/graphql`
    );
  });
}

bootstrap();

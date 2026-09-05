// src/common/interceptors/transform.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType() as "graphql";

    return next.handle().pipe(
      map((data) => {
        if (ctxType === "graphql") {
          if (data?.statusCode !== undefined) {
            return {
              status: data.statusCode,
              message: data.message || "Success",
              success: data.statusCode === 200,
              data: data.data ?? null,
            };
          }

          return {
            status: 200,
            message: "Success",
            success: true,
            data,
          };
        }

        return data;
      })
    );
  }
}

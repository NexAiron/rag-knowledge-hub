import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { success: true; data: T; timestamp: string }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ success: true; data: T; timestamp: string }> {
    if (context.getType() !== "http") {
      return next.handle() as Observable<{
        success: true;
        data: T;
        timestamp: string;
      }>;
    }

    const request = context.switchToHttp().getRequest<{
      headers?: Record<string, string | undefined>;
    }>();
    const accept = request.headers?.accept ?? "";

    // SSE responses should keep raw event payloads.
    if (accept.includes("text/event-stream")) {
      return next.handle() as Observable<{
        success: true;
        data: T;
        timestamp: string;
      }>;
    }

    return next.handle().pipe(
      map((data) => {
        if (
          data !== null &&
          typeof data === "object" &&
          "success" in (data as Record<string, unknown>)
        ) {
          return data as unknown as {
            success: true;
            data: T;
            timestamp: string;
          };
        }

        return {
          success: true as const,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

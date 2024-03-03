import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifySchema,
  FastifyTypeProvider,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

type FastifyZodPluginCallback<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
  TypeProvider extends FastifyTypeProvider = ZodTypeProvider,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyPluginCallback<Options, Server, TypeProvider, Logger>

type FastifyZodPluginAsync<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
  TypeProvider extends FastifyTypeProvider = ZodTypeProvider,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyPluginAsync<Options, Server, TypeProvider, Logger>

type ApiRouteHandlerMethod<SchemaCompiler extends FastifySchema = FastifySchema> =
  RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGenericInterface,
    ContextConfigDefault,
    SchemaCompiler,
    ZodTypeProvider
  >

export type { ApiRouteHandlerMethod, FastifyZodPluginAsync, FastifyZodPluginCallback }

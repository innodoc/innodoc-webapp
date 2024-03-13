import camelcaseKeys from 'camelcase-keys'
import { ResponseValidationError } from 'fastify-type-provider-zod'
import type { FastifySerializerCompiler } from 'fastify/types/schema'
import type { ZodAny } from 'zod'

function isSchema(maybeSchema: ZodAny | { properties: ZodAny }): maybeSchema is ZodAny {
  return Object.prototype.hasOwnProperty.call(maybeSchema, 'safeParse')
}

function isWrappedSchema(maybeSchema: unknown): maybeSchema is { properties: ZodAny } {
  return Object.prototype.hasOwnProperty.call(maybeSchema, 'properties')
}

/**
 * Customized serializer compiler that camelcases keys after validation.
 *
 * Based on {@link https://github.com/turkerdev/fastify-type-provider-zod/blob/62dc659a6eeff353387b19473eec3fe2aacd622e/src/index.ts#L136 serializerCompiler}.
 *
 * @param routeSchema Zod schema for the route
 * @returns Serialization function
 */
const camelcaseSerializerCompiler: FastifySerializerCompiler<ZodAny | { properties: ZodAny }> = function ({
  schema: maybeSchema,
}) {
  let schema: ZodAny
  if (isSchema(maybeSchema)) {
    schema = maybeSchema
  } else if (isWrappedSchema(maybeSchema)) {
    schema = maybeSchema.properties
  } else {
    throw new Error(`Invalid schema passed: ${JSON.stringify(maybeSchema)}`)
  }

  return (data) => {
    const result = schema.safeParse(data)
    if (result.success) {
      return JSON.stringify(camelcaseKeys(result.data))
    }

    throw new ResponseValidationError(result)
  }
}

export default camelcaseSerializerCompiler

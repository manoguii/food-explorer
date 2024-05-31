import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { formatISO, parseISO, subMonths } from 'date-fns'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetDashboardMetricsUseCase } from '@/domain/restaurant/application/use-cases/get-dashboard-metrics'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const today = new Date()
const oneMonthAgo = subMonths(today, 1)

const searchParamsSchema = z
  .object({
    startDate: z.string().optional().default(formatISO(oneMonthAgo)),
    endDate: z.string().optional().default(formatISO(today)),
  })
  .refine(
    (data) => {
      const startDate = Date.parse(data.startDate)
      const endDate = Date.parse(data.endDate)
      return !isNaN(startDate) && !isNaN(endDate) && startDate <= endDate
    },
    {
      message:
        'startDate and endDate must be valid dates and startDate should be less than or equal to endDate',
      path: ['startDate', 'endDate'],
    },
  )
  .transform((data) => {
    return {
      startDate: parseISO(data.startDate),
      endDate: parseISO(data.endDate),
    }
  })

const searchParamsValidationPipe = new ZodValidationPipe(searchParamsSchema)

type SearchParamsSchema = z.infer<typeof searchParamsSchema>

@ApiTags('Dashboard Metrics')
@Controller('/dashboard-metrics')
export class GetDashboardMetricsController {
  constructor(private getDashboardMetrics: GetDashboardMetricsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(searchParamsValidationPipe)
    searchParams: SearchParamsSchema,
  ) {
    const { startDate, endDate } = searchParams

    const result = await this.getDashboardMetrics.execute({
      clientId: user.sub,
      startDate,
      endDate,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const metrics = result.value

    return { metrics }
  }
}

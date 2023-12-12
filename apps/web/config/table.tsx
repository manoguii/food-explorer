import { ForwardRefExoticComponent, RefAttributes } from 'react'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'
import { IconProps } from '@radix-ui/react-icons/dist/types'

import { OrderStatus } from '@/lib/types/definitions'

export const labels = [
  {
    value: 'TABLE',
    label: 'Mesa',
  },
  {
    value: 'DELIVERY',
    label: 'Entrega',
  },
  {
    value: 'TAKEOUT',
    label: 'Retirada',
  },
]

export const statuses: {
  value: OrderStatus
  label: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}[] = [
  {
    value: 'PENDING',
    label: 'Pendente',
    icon: CircleIcon,
  },
  {
    value: 'PREPARING',
    label: 'Preparando',
    icon: StopwatchIcon,
  },
  {
    value: 'DELIVERED',
    label: 'Entregue',
    icon: CheckCircledIcon,
  },
  {
    value: 'CANCELED',
    label: 'Cancelado',
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: 'Baixa',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Media',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'Alta',
    value: 'high',
    icon: ArrowUpIcon,
  },
]

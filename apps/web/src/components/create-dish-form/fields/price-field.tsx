import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '../../../lib/schema'
import { Input } from '@/components/ui/input'

export function PriceField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem className="flex basis-2/6 flex-col gap-1">
          <FormLabel>Preço</FormLabel>
          <FormControl>
            <Input placeholder="R$ 12,00" {...field} />
          </FormControl>
          <FormDescription>Digite o preço do prato.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

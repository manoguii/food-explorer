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

export function AttachField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field }) => (
        <FormItem className="flex basis-2/6 flex-col gap-1">
          <FormLabel>Arquivo</FormLabel>
          <FormControl>
            <Input type="file" {...field} />
          </FormControl>
          <FormDescription>Selecione um arquivo</FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

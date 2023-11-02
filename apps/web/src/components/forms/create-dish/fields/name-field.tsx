import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '@/lib/schemas'
import { Input } from '@/components/ui/input'

export function NameField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex basis-3/6 flex-col gap-1">
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input placeholder="Salada Ceasar" {...field} />
          </FormControl>
          <FormDescription>Digite o nome do prato.</FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

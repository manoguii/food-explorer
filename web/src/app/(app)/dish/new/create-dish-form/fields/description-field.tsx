import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { CreateDishFormValues } from '../schema'
import { Textarea } from '@/components/ui/textarea'

export function DescriptionField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Adicione uma descrição para o seu prato."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Crie uma descrição para o seu prato.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

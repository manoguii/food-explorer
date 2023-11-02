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

export function AttachField() {
  const form = useFormContext<CreateDishFormValues>()

  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field: { onChange } }) => {
        return (
          <FormItem className="flex basis-2/6 flex-col gap-1">
            <FormLabel>Arquivo</FormLabel>
            <FormControl>
              <Input
                multiple
                type="file"
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    onChange(event.target.files)
                  }
                }}
              />
            </FormControl>
            <FormDescription>Selecione um arquivo</FormDescription>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

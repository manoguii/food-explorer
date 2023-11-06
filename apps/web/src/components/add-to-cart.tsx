import { MinusIcon, Plus } from 'lucide-react'
import { Button } from './ui/button'

export function AddToCart() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost">
          <MinusIcon />
        </Button>
        <span>01</span>
        <Button size="icon" variant="ghost">
          <Plus />
        </Button>
      </div>

      <Button variant="destructive">Adicionar</Button>
    </div>
  )
}

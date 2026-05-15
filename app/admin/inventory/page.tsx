// PATH: app/(admin)/inventory/page.tsx
import { InventoryUploader } from './InventoryUploader'

export default function InventoryPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-text-main">Inventory Upload</h1>
      <InventoryUploader />
    </div>
  )
}

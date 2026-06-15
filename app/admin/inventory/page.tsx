// PATH: app/(admin)/inventory/page.tsx
import { InventoryUploader } from './InventoryUploader'
import { KglOrderExporter } from './KglOrderExporter'

export default function InventoryPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-text-main">Inventory Upload</h1>
      <InventoryUploader />
      <div>
        <h2 className="mb-4 text-2xl font-bold text-text-main">KGL 출고 오더 변환</h2>
        <KglOrderExporter />
      </div>
    </div>
  )
}

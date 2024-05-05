import { DataTable } from '@/components/data-table.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { Filament, filamentData } from '@/lib/api';

const columns: ColumnDef<Filament>[] = [
  { accessorKey: 'id', header: 'ID', cell: info => info.getValue() },
  { accessorKey: 'supplier', header: 'Supplier', cell: info => info.getValue() },
  { accessorKey: 'material', header: 'Material', cell: info => info.getValue() },
  { accessorKey: 'colour', header: 'Colour', cell: info => info.getValue() },
  { accessorKey: 'netMaterial', header: 'Net Material (g)', cell: info => info.getValue() },
  { accessorKey: 'barcode', header: 'Barcode', cell: info => info.getValue() },
  { accessorKey: 'allocatedTo', header: 'Allocated to', cell: info => info.getValue() },
  { accessorKey: 'openedBy', header: 'Opened by', cell: info => info.getValue() },
  { accessorKey: 'openedOn', header: 'Opened on (timestamp)', cell: info => info.getValue() },
  { accessorKey: 'weight', header: 'Weight (g) (inc spool)', cell: info => info.getValue() },
  { accessorKey: 'product', header: 'Product (g)', cell: info => info.getValue() },
  { accessorKey: 'waste', header: 'Waste (g)', cell: info => info.getValue() },
  { accessorKey: 'total', header: 'Total (g)', cell: info => info.getValue() },
];

export default function FilamentTable() {
  return (
    <div>
      <h2 className="py-8 text-3xl">Filament Management</h2>
      <DataTable columns={columns} data={filamentData} />
    </div>
  );
}

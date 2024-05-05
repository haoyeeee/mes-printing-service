import { createLazyFileRoute } from '@tanstack/react-router';
import FilamentTable from '@/components/FilamentTable';


export const Route = createLazyFileRoute('/filament')({
  component: Filaments,
});

function Filaments() {
  return (
    <div>
      <FilamentTable />
    </div>
  );
}

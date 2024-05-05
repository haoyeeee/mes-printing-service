import { createLazyFileRoute } from '@tanstack/react-router';
import UploadForm from '@/components/UploadForm';

export const Route = createLazyFileRoute('/job')({
  component: Jobs,
});

function Jobs() {
  return (
    <div>
      <UploadForm />
    </div>
  );
}

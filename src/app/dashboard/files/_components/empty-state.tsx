import { FileIcon, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  readonly onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <FileIcon className="size-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No files yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Upload files to get started</p>
      <Button className="mt-4" onClick={onUpload}>
        <Upload className="mr-2 size-4" />
        Upload Files
      </Button>
    </div>
  );
}

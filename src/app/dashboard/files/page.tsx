'use client';

import { 
  Upload, 
  FileIcon, 
  FileImage, 
  FileText, 
  FileVideo, 
  FileAudio,
  Trash2,
  Download,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useFilesByOrganization,
  useGenerateUploadUrl,
  useSaveFile,
  useDeleteFile,
  uploadFile,
} from '@/hooks/use-files';
import { useUsersByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import type { Id } from '@convex/_generated/dataModel';

type FileWithUrl = {
  _id: Id<'files'>;
  name: string;
  mimeType: string;
  size: number;
  url: string | null;
  createdAt: number;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string): React.ReactNode {
  if (mimeType.startsWith('image/')) return <FileImage className="size-8 text-blue-500" />;
  if (mimeType.startsWith('video/')) return <FileVideo className="size-8 text-purple-500" />;
  if (mimeType.startsWith('audio/')) return <FileAudio className="size-8 text-green-500" />;
  if (mimeType === 'application/pdf') return <FileText className="size-8 text-red-500" />;
  return <FileIcon className="size-8 text-muted-foreground" />;
}

function isPreviewable(mimeType: string): boolean {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf';
}

function FileCard({ 
  file, 
  onDelete 
}: { 
  file: FileWithUrl; 
  onDelete: (id: Id<'files'>) => void;
}): React.ReactElement {
  const showPreview = isPreviewable(file.mimeType) && file.url;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Preview area */}
      <div className="relative aspect-[4/3] bg-muted">
        {showPreview && file.mimeType.startsWith('image/') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.url!}
            alt={file.name}
            className="size-full object-cover"
          />
        ) : showPreview && file.mimeType === 'application/pdf' ? (
          <iframe
            src={`${file.url}#toolbar=0&navpanes=0`}
            title={file.name}
            className="size-full"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            {getFileIcon(file.mimeType)}
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={file.url ?? '#'} download={file.name} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 size-4" />
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(file._id)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* File info */}
      <CardContent className="p-3">
        <p className="truncate text-sm font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

function FileCardSkeleton(): React.ReactElement {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}

export default function FilesPage(): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { organizationId } = useOrganization();
  const files = useFilesByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const generateUploadUrl = useGenerateUploadUrl();
  const saveFile = useSaveFile();
  const deleteFile = useDeleteFile();

  const isLoading = files === undefined || organizationId === null;
  const currentUser = users?.[0];

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFiles = event.target.files;
    if (!selectedFiles?.length || !currentUser?._id || !organizationId) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(selectedFiles).map((file) =>
        uploadFile({
          file,
          organizationId,
          uploadedBy: currentUser._id,
          generateUploadUrl,
          saveFile,
        })
      );

      await Promise.all(uploadPromises);
      toast.success(`Uploaded ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: Id<'files'>): void => {
    const file = files?.find((f: FileWithUrl) => f._id === id);
    toast.error(`Delete "${file?.name}"?`, {
      action: {
        label: 'Confirm',
        onClick: () => {
          void deleteFile({ id }).then(() => {
            toast.success('File deleted');
          });
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Files</h1>
          <p className="text-sm text-muted-foreground">
            Upload and manage your files
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
          <Button onClick={handleUploadClick} disabled={isUploading || !currentUser}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      ) : files?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <FileIcon className="size-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No files yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload files to get started
          </p>
          <Button className="mt-4" onClick={handleUploadClick}>
            <Upload className="mr-2 size-4" />
            Upload Files
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files?.map((file: FileWithUrl) => (
            <FileCard key={file._id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

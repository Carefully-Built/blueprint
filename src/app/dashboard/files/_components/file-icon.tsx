import { FileIcon, FileImage, FileText, FileVideo, FileAudio } from 'lucide-react';

interface FileTypeIconProps {
  readonly mimeType: string;
  readonly className?: string;
}

export function FileTypeIcon({ mimeType, className = 'size-8' }: FileTypeIconProps): React.ReactElement {
  if (mimeType.startsWith('image/')) {
    return <FileImage className={`${className} text-blue-500`} />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo className={`${className} text-purple-500`} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio className={`${className} text-green-500`} />;
  }
  if (mimeType === 'application/pdf') {
    return <FileText className={`${className} text-red-500`} />;
  }
  return <FileIcon className={`${className} text-muted-foreground`} />;
}

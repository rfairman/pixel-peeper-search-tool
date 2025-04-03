
import React, { useState, useRef } from 'react';
import { Upload, Image, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  onImageUploaded: (file: File, previewUrl: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processFile(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file || !file.type.match('image.*')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageUploaded(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center transition-all",
        isDragging ? "border-primary bg-primary/5 upload-area" : "border-muted",
        preview ? "border-solid border-primary/50" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="space-y-4">
          <div className="relative max-h-[300px] overflow-hidden rounded-md mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="object-contain max-h-[300px] mx-auto"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Image ready for search</p>
            <Button variant="outline" onClick={handleButtonClick}>
              <FileUp className="mr-2 h-4 w-4" />
              Choose a different image
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Upload an image</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Drag and drop an image, or click to browse and select an image to search for higher resolution versions
            </p>
          </div>
          <Button onClick={handleButtonClick}>
            <Image className="mr-2 h-4 w-4" />
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadArea;

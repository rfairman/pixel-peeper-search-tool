
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { ImageResult } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface ImageCardProps {
  image: ImageResult;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      // Fetch the image
      const response = await fetch(image.url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Extract filename from URL or use a default name
      const fileName = image.url.split('/').pop() || `image-${image.id}.jpg`;
      link.download = fileName;
      
      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the blob URL to free memory
      window.URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading the image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={image.thumbnailUrl}
          alt={`Image from ${image.source}`}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
          {image.width} × {image.height}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{image.source}</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {image.url}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {image.fileSize}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleDownload}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="px-2" 
          asChild
        >
          <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;

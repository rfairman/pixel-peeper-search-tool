
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { ImageResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface ImageCardProps {
  image: ImageResult;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { toast } = useToast();
  const [showDownloadError, setShowDownloadError] = React.useState(false);

  const handleOpenImage = () => {
    try {
      console.log("Opening image in new tab:", image.url);
      
      // Open the image in a new tab with the correct URL
      window.open(image.url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Image opened in new tab",
        description: "Right-click on the image and select 'Save image as...' to download",
      });
    } catch (error) {
      console.error('Failed to open image:', error);
      setShowDownloadError(true);
      toast({
        title: "Failed to open image",
        description: "There was a problem opening the image in a new tab",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
            onClick={handleOpenImage}
          >
            <Download className="h-3 w-3 mr-1" />
            Open Image
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

      <AlertDialog open={showDownloadError} onOpenChange={setShowDownloadError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Failed</AlertDialogTitle>
            <AlertDialogDescription>
              The image couldn't be downloaded directly due to cross-origin restrictions.
              You can try these alternatives:
              <ul className="list-disc pl-5 mt-2">
                <li>Click "Open Image" to open it in a new tab, then right-click and select "Save image as..."</li>
                <li>Click the external link button to visit the source website</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => window.open(image.url, '_blank', 'noopener,noreferrer')}>
              Open Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageCard;

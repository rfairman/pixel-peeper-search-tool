
import { ImageResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const generateMockResults = (baseUrl: string): ImageResult[] => {
  const dimensions = [
    { width: 5000, height: 3333 },
    { width: 3840, height: 2160 },
    { width: 2560, height: 1440 },
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 800, height: 533 },
    { width: 640, height: 480 },
  ];

  const domains = [
    { name: 'Unsplash', url: 'unsplash.com' },
    { name: 'Pexels', url: 'pexels.com' },
    { name: 'Pixabay', url: 'pixabay.com' },
    { name: 'Flickr', url: 'flickr.com' },
    { name: 'Freepik', url: 'freepik.com' },
    { name: 'Shutterstock', url: 'shutterstock.com' },
    { name: 'Adobe Stock', url: 'stock.adobe.com' },
  ];

  return dimensions.map((dimension, index) => {
    const domain = domains[index % domains.length];
    const fileSizes = ['2.4MB', '1.8MB', '1.2MB', '750KB', '500KB', '320KB', '180KB'];
    const imageId = index + 1;
    
    // Use the uploaded image as both the thumbnail and the actual image URL
    // This ensures the "Open Image" button will open the correct image
    return {
      id: uuidv4(),
      url: baseUrl, // Use the actual uploaded image URL for both thumbnail and full image
      thumbnailUrl: baseUrl,
      width: dimension.width,
      height: dimension.height,
      source: domain.name,
      sourceUrl: `https://${domain.url}`,
      fileSize: fileSizes[index]
    };
  });
};

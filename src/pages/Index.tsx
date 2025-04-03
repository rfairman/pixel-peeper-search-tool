
import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadArea from '@/components/UploadArea';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ImageResult, SearchResponse } from '@/lib/types';
import { generateMockResults } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);

  const handleImageUploaded = (file: File, preview: string) => {
    setUploadedFile(file);
    setPreviewUrl(preview);
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!uploadedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // In a real app, we would send the image to a backend API
      // For demo purposes, we'll use mock data and a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with our demo data
      const mockResponse: SearchResponse = {
        success: true,
        results: generateMockResults(previewUrl || ''),
      };
      
      if (mockResponse.success) {
        setSearchResults(mockResponse.results);
        toast({
          title: "Search complete",
          description: `Found ${mockResponse.results.length} results`,
        });
      } else {
        toast({
          title: "Search failed",
          description: mockResponse.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Find higher resolution versions of your images</h2>
          <UploadArea onImageUploaded={handleImageUploaded} />
        </div>

        {previewUrl && (
          <div className="flex justify-center mt-6">
            <Button 
              size="lg" 
              onClick={handleSearch} 
              disabled={isSearching || !uploadedFile}
              className="px-8"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Search for higher resolution
                </span>
              )}
            </Button>
          </div>
        )}

        <ResultsDisplay results={searchResults} isLoading={isSearching} />
      </main>
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pixel Peeper. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;

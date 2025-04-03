
import React, { useState } from 'react';
import { ImageResult } from '@/lib/types';
import ImageCard from './ImageCard';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Filter } from 'lucide-react';

interface ResultsDisplayProps {
  results: ImageResult[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const sortedResults = [...results].sort((a, b) => {
    const aResolution = a.width * a.height;
    const bResolution = b.width * b.height;
    return sortOrder === 'desc' ? bResolution - aResolution : aResolution - bResolution;
  });

  if (isLoading) {
    return (
      <div className="my-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-muted-foreground">Searching for high resolution images...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Results</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleSortOrder}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4 mr-1" />
          {sortOrder === 'desc' ? (
            <>
              Largest <ArrowDown className="h-3 w-3" />
            </>
          ) : (
            <>
              Smallest <ArrowUp className="h-3 w-3" />
            </>
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedResults.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;

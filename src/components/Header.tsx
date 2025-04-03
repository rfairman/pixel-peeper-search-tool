
import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="text-primary h-6 w-6" />
          <h1 className="text-xl font-bold">Pixel Peeper</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Find high resolution images
        </div>
      </div>
    </header>
  );
};

export default Header;

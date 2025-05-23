
import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Search className="text-primary h-6 w-6" />
            <h1 className="text-xl font-bold">PeepMyPixel.com</h1>
          </Link>
          
          {/* Banner Ad Section - Hidden visually but kept in DOM */}
          <div className="w-full md:w-auto min-h-[90px] hidden">
            <div className="text-sm text-muted-foreground p-2">
              Banner Ad Space (728×90)
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground hidden md:block">
            Find highest resolution images
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

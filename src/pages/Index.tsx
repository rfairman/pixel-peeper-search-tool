
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UploadArea from '@/components/UploadArea';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ImageResult, SearchResponse } from '@/lib/types';
import { generateMockResults } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import SignupForm from '@/components/SignupForm';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { useUser } from '@/lib/AuthProvider';

const MAX_FREE_CREDITS = 3;
const CREDITS_STORAGE_KEY = 'search_credits_remaining';

const Index = () => {
  const { toast } = useToast();
  const user = useUser();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(MAX_FREE_CREDITS);
  const [showCreateAccountDialog, setShowCreateAccountDialog] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Load credits from localStorage on component mount
  useEffect(() => {
    if (!user) {
      const storedCredits = localStorage.getItem(CREDITS_STORAGE_KEY);
      if (storedCredits !== null) {
        setCreditsRemaining(parseInt(storedCredits, 10));
      } else {
        // Initialize with max credits if not set yet
        localStorage.setItem(CREDITS_STORAGE_KEY, MAX_FREE_CREDITS.toString());
      }
    }
  }, [user]);

  const handleImageUploaded = (file: File, preview: string) => {
    setUploadedFile(file);
    setPreviewUrl(preview);
    setSearchResults([]);
  };

  const decrementCredits = () => {
    if (user) return creditsRemaining; // Don't decrement for subscribed users
    
    const newCreditsValue = creditsRemaining - 1;
    setCreditsRemaining(newCreditsValue);
    localStorage.setItem(CREDITS_STORAGE_KEY, newCreditsValue.toString());
    return newCreditsValue;
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

    // Check credits before searching for non-subscribers
    if (!user && creditsRemaining <= 0) {
      setShowCreateAccountDialog(true);
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
        // Decrement credits after successful search for non-subscribers
        const remainingCredits = decrementCredits();
        
        setSearchResults(mockResponse.results);
        
        if (!user) {
          toast({
            title: "Search complete",
            description: `Found ${mockResponse.results.length} results. You have ${remainingCredits} credit${remainingCredits !== 1 ? 's' : ''} left.`,
          });
          
          // Show create account dialog if this was the last credit
          if (remainingCredits <= 0) {
            setTimeout(() => {
              setShowCreateAccountDialog(true);
            }, 1500);
          }
        } else {
          toast({
            title: "Search complete",
            description: `Found ${mockResponse.results.length} results.`,
          });
        }
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

  const handleSignup = async (formData: { name: string, email: string, password: string }) => {
    setIsSigningUp(true);
    
    try {
      // In a real app, this would send the data to a backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful signup
      toast({
        title: "Account created!",
        description: `Welcome to PeepMyPixel, ${formData.name}!`,
      });
      
      // Restore credits after signup
      handleRestoreCredits();
      setShowCreateAccountDialog(false);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred during account creation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleRestoreCredits = () => {
    // For demo purposes only - this lets users reset their credits
    setCreditsRemaining(MAX_FREE_CREDITS);
    localStorage.setItem(CREDITS_STORAGE_KEY, MAX_FREE_CREDITS.toString());
    toast({
      title: "Credits Restored",
      description: `Your ${MAX_FREE_CREDITS} free credits have been restored for demo purposes.`,
    });
    setShowCreateAccountDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Find the highest resolution version of your images</h2>
          
          {/* Credits display for non-subscribers */}
          {!user && (
            <div className="flex items-center justify-center mb-4">
              <div className="bg-muted px-4 py-2 rounded-full text-sm">
                <span className="font-semibold">{creditsRemaining}</span> credit{creditsRemaining !== 1 ? 's' : ''} remaining
              </div>
            </div>
          )}
          
          {/* Subscription Manager for logged-in users */}
          {user && (
            <div className="mb-6">
              <SubscriptionManager />
            </div>
          )}
          
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
                  Search for higher resolution {!user && creditsRemaining > 0 ? `(1 credit)` : ''}
                </span>
              )}
            </Button>
          </div>
        )}

        <ResultsDisplay results={searchResults} isLoading={isSearching} />
      </main>
      
      {/* Create Account Dialog */}
      <Dialog open={showCreateAccountDialog} onOpenChange={setShowCreateAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create your account</DialogTitle>
            <DialogDescription>
              Sign up to get more credits and unlock all features!
            </DialogDescription>
          </DialogHeader>
          
          <SignupForm onSubmit={handleSignup} isLoading={isSigningUp} />
          
          <DialogFooter className="flex-col space-y-2 mt-4">
            {/* For demo purposes only, allow restoring credits */}
            <Button variant="outline" onClick={handleRestoreCredits} className="w-full">
              Restore Demo Credits
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This is a demo feature. In a real application, account creation would enable more searches.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PeepMyPixel.com. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;

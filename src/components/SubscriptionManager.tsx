
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export function SubscriptionManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const user = useUser();

  // Check subscription status on component mount and whenever user changes
  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        throw new Error(error.message || 'Error checking subscription');
      }
      
      setSubscriptionStatus(data);
      return data;
    } catch (err) {
      console.error('Failed to check subscription status:', err);
      toast({
        title: 'Error checking subscription',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleCreateCheckout = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Start polling for subscription status changes
        const checkInterval = setInterval(async () => {
          const status = await checkSubscriptionStatus();
          if (status?.subscribed) {
            clearInterval(checkInterval);
            toast({
              title: 'Subscription Active!',
              description: 'Thank you for subscribing to PeepMyPixel Premium!',
            });
          }
        }, 3000);
        
        // Clear interval after 2 minutes to avoid infinite polling
        setTimeout(() => clearInterval(checkInterval), 120000);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        title: 'Checkout Error',
        description: err instanceof Error ? err.message : 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw new Error(error.message || 'Failed to create customer portal session');
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast({
        title: 'Management Error',
        description: err instanceof Error ? err.message : 'Failed to open subscription management',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Subscription Status</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkSubscriptionStatus} 
          disabled={isCheckingStatus}
          title="Refresh subscription status"
        >
          <RefreshCw className={`h-4 w-4 ${isCheckingStatus ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {subscriptionStatus ? (
        <div className="space-y-2">
          <div className="text-sm grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Status:</span>
            <span className={subscriptionStatus.subscribed ? 'text-green-500 font-medium' : 'text-yellow-500'}>
              {subscriptionStatus.subscribed ? 'Active' : 'Inactive'}
            </span>
            
            {subscriptionStatus.subscription_tier && (
              <>
                <span className="text-muted-foreground">Plan:</span>
                <span>{subscriptionStatus.subscription_tier}</span>
              </>
            )}
            
            {subscriptionStatus.subscription_end && (
              <>
                <span className="text-muted-foreground">Renews on:</span>
                <span>{new Date(subscriptionStatus.subscription_end).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          {isCheckingStatus ? 'Checking status...' : 'Subscription status unavailable'}
        </div>
      )}
      
      <div className="pt-2">
        {subscriptionStatus?.subscribed ? (
          <Button 
            variant="outline" 
            onClick={handleManageSubscription} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        ) : (
          <Button 
            onClick={handleCreateCheckout} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe ($2.99/month for 5 credits)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

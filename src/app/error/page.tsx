'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className='p-4'>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Sorry, something went wrong</AlertDescription>
      </Alert>
    </div>
  );
}

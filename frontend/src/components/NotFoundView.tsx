import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';
import { Button, Card, Badge } from './ui';

export const NotFoundView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#faf9fe]">
      <Card padding="lg" className="max-w-md w-full text-center">
        <Badge variant="primary" icon={<Terminal size={12} />} className="mb-4">
          HTTP 404 // UNRESOLVED ROUTE
        </Badge>
        <h1 className="font-display font-extrabold text-4xl text-[#0a0a0f] mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#5e5e6e] mb-6 leading-relaxed">
          The requested system node does not exist or has been partitioned. Please check the URL or return to your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<ArrowLeft size={14} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="dark"
            size="sm"
            iconLeft={<Home size={14} />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

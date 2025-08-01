import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import urlService from '../services/urlService';
import logger from '../utils/logger.ts';

const UrlRedirect = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        logger.logUrlAccess(shortCode);
        
        const originalUrl = urlService.getOriginalUrl(shortCode);
        
        if (originalUrl) {
          // Track the click
          urlService.trackClick(shortCode);
          
          logger.logRedirectSuccess(shortCode, originalUrl);
          
          // Redirect to the original URL
          window.location.href = originalUrl;
        } else {
          setError('Short URL not found or expired');
          logger.logRedirectError(shortCode, 'URL not found or expired');
        }
      } catch (err) {
        setError('An error occurred while redirecting');
        logger.logRedirectError(shortCode, err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Link Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default UrlRedirect;

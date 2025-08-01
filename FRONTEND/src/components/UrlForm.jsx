import React, { useState } from "react";
import urlService from "../services/urlService.js";
import logger from "../utils/logger.ts";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState();
  const [customUrl, setCustomUrl] = useState("");
  const [validityMinutes, setValidityMinutes] = useState(30);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (e) => {
    const { name, value } = e.target;
    if (name === "url") setUrl(value);
    else if (name === "customurl") setCustomUrl(value);
    else if (name === "validity") setValidityMinutes(parseInt(value) || 30);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    logger.info('Form submitted', 'component', { url, customUrl, validityMinutes });

    try {
      const result = urlService.createShortUrl(url, customUrl || null, validityMinutes);
      setShortUrl(result.shortUrl);
      logger.info('URL creation successful', 'component', result);
    } catch (error) {
      setError(error.message);
      logger.error('URL creation failed', 'component', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    logger.info('URL copied to clipboard', 'component', { shortUrl });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        URL Shortener
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter URL to shorten:
          </label>
          <input
            type="url"
            name="url"
            value={url}
            onChange={updateValue}
            placeholder="https://example.com/very-long-url"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom shortcode (optional):
          </label>
          <input
            type="text"
            name="customurl"
            value={customUrl}
            onChange={updateValue}
            placeholder="my-custom-url"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validity period (minutes):
          </label>
          <input
            type="number"
            name="validity"
            value={validityMinutes}
            onChange={updateValue}
            min="1"
            max="10080"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating..." : "Shorten URL"}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Success! Your short URL:
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 p-2 border border-green-300 rounded-md bg-white"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;

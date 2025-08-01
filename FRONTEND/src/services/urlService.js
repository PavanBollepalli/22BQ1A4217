import logger from '../utils/logger.ts';

class URLShortenerService {
  constructor() {
    this.urls = JSON.parse(localStorage.getItem('shortUrls') || '[]');
    this.analytics = JSON.parse(localStorage.getItem('urlAnalytics') || '{}');
    logger.info('URL Shortener Service initialized', 'service');
  }

  generateShortCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validateUrl(url) {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  createShortUrl(originalUrl, customCode = null, validityMinutes = 30) {
    logger.info('Creating short URL', 'service', { originalUrl, customCode, validityMinutes });

    // Validate URL
    if (!this.validateUrl(originalUrl)) {
      logger.error('Invalid URL format', 'service', { originalUrl });
      throw new Error('Invalid URL format');
    }

    // Check if custom code already exists
    if (customCode && this.urls.find(u => u.shortCode === customCode)) {
      logger.error('Custom shortcode already exists', 'service', { customCode });
      throw new Error('Custom shortcode already exists');
    }

    // Generate or use custom short code
    const shortCode = customCode || this.generateShortCode();
    
    // Check for duplicates (auto-generated)
    while (!customCode && this.urls.find(u => u.shortCode === shortCode)) {
      shortCode = this.generateShortCode();
    }

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);

    const urlEntry = {
      id: Date.now(),
      originalUrl,
      shortCode,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      validityMinutes,
      clicks: 0
    };

    this.urls.push(urlEntry);
    this.analytics[shortCode] = {
      clicks: [],
      totalClicks: 0
    };

    this.saveToStorage();
    logger.logUrlCreation(originalUrl, shortCode);

    return {
      shortUrl: `${window.location.origin}/${shortCode}`,
      shortCode,
      originalUrl,
      expiryDate: urlEntry.expiryDate
    };
  }

  getUrlByShortCode(shortCode) {
    const url = this.urls.find(u => u.shortCode === shortCode);
    
    if (!url) {
      logger.error('Short URL not found', 'service', { shortCode });
      return null;
    }

    // Check if expired
    if (new Date() > new Date(url.expiryDate)) {
      logger.warn('Short URL expired', 'service', { shortCode, expiryDate: url.expiryDate });
      return null;
    }

    // Track click
    url.clicks++;
    this.analytics[shortCode].totalClicks++;
    this.analytics[shortCode].clicks.push({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });

    this.saveToStorage();
    logger.logUrlAccess(shortCode);

    return url;
  }

  getAllUrls() {
    return this.urls.map(url => ({
      ...url,
      shortUrl: `${window.location.origin}/${url.shortCode}`,
      isExpired: new Date() > new Date(url.expiryDate)
    }));
  }

  getAnalytics(shortCode) {
    const url = this.urls.find(u => u.shortCode === shortCode);
    if (!url) return null;

    return {
      ...url,
      analytics: this.analytics[shortCode] || { clicks: [], totalClicks: 0 }
    };
  }

  saveToStorage() {
    localStorage.setItem('shortUrls', JSON.stringify(this.urls));
    localStorage.setItem('urlAnalytics', JSON.stringify(this.analytics));
  }
}

const urlService = new URLShortenerService();
export default urlService;

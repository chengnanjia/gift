// GitHub Pages 部署时，请改为你自己的后端 HTTPS 地址。
const GITHUB_PAGES_API_BASE_URL = 'https://web-production-aebaa.up.railway.app';
const FILE_PROTOCOL_API_BASE_URL = 'http://localhost:3000';

const isGitHubPages = window.location.hostname === 'github.io' ||
                      window.location.hostname.endsWith('.github.io');
const API_BASE_URL = isGitHubPages
  ? GITHUB_PAGES_API_BASE_URL
  : window.location.protocol === 'file:'
    ? FILE_PROTOCOL_API_BASE_URL
    : window.location.origin;

window.appConfig = {
  API_BASE_URL,
  API_URL: `${API_BASE_URL}/api/gifts`
};
window.ENV = isGitHubPages ? 'production' : 'development';

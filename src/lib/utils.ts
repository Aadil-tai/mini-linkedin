export const stripHtml = (html?: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

// Cookie utilities for profile completion tracking
const PROFILE_COMPLETE_COOKIE = 'profile_complete';

export const getProfileCompleteCookieClient = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some(cookie => cookie.trim().startsWith(`${PROFILE_COMPLETE_COOKIE}=true`));
};

export const setProfileCompleteCookieClient = (): void => {
  if (typeof document === 'undefined') return;
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  document.cookie = `${PROFILE_COMPLETE_COOKIE}=true; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const clearProfileCompleteCookieClient = (): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${PROFILE_COMPLETE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};
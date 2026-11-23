export const THEME_STORAGE_KEY = 'cf_theme';

/**
 * Inline script for <head>: applies the saved (or system) theme before first paint,
 * so dark-mode users never see a white flash. Kept out of the 'use client' module so
 * the server layout can import the plain string.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`;

/** CatalogFix logo. Swaps to the white-wordmark version in dark mode (no JS needed). */
export function Logo({ className = 'h-8' }: { className?: string }) {
  return (
    <>
      <img src="/logo-light.png" alt="CatalogFix" className={`${className} w-auto object-contain dark:hidden`} />
      <img src="/logo-dark.png" alt="CatalogFix" className={`${className} hidden w-auto object-contain dark:block`} />
    </>
  );
}

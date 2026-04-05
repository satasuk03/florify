// Twitter uses the same art as the Open Graph image. Re-exporting keeps the
// two in lock-step so a design tweak to `opengraph-image.tsx` flows through
// automatically.
export { default, alt, size, contentType } from './opengraph-image';

export const dynamic = 'force-static';

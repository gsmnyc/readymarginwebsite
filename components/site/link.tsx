import type { ComponentProps } from 'react';
/** Document navigation also works without hydration and across the Sites proxy. */
export default function SiteLink(props: ComponentProps<'a'>) {
  return <a {...props} />;
}

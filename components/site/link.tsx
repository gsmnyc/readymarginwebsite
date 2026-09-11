import NextLink from "next/link";
import { forwardRef, type ComponentProps } from "react";

type SiteLinkProps = ComponentProps<typeof NextLink>;

/** Internal navigation keeps native link semantics and uses Next's route handling. */
const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(function SiteLink(
  props,
  ref,
) {
  return <NextLink ref={ref} {...props} />;
});

SiteLink.displayName = "SiteLink";

export default SiteLink;

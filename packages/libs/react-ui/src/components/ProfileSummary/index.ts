import type { FC } from 'react';
import type { IProfileSummaryLinkProps } from './ProfileSummaryLink';
import { ProfileSummaryLink } from './ProfileSummaryLink';
import type { IProfileSummaryRootProps } from './ProfileSummaryRoot';
import { ProfileSummaryRoot } from './ProfileSummaryRoot';

export { IProfileSummaryLinkProps, IProfileSummaryRootProps };

interface IProfileSummaryProps {
  Root: FC<IProfileSummaryRootProps>;
  Link: FC<IProfileSummaryLinkProps>;
}

export const ProfileSummary: IProfileSummaryProps = {
  Root: ProfileSummaryRoot,
  Link: ProfileSummaryLink,
};

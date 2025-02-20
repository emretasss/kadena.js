import type { FC } from 'react';
import type { INavFooterRootProps } from './NavFooter';
import { NavFooterContainer } from './NavFooter';
import type { INavFooterIconButtonProps } from './NavFooterIconButton';
import { NavFooterIconButton } from './NavFooterIconButton';
import type { INavFooterLinkProps } from './NavFooterLink';
import { NavFooterLink } from './NavFooterLink';
import type { INavFooterPanelProps } from './NavFooterPanel';
import { NavFooterPanel } from './NavFooterPanel';

export {
  INavFooterIconButtonProps,
  INavFooterLinkProps,
  INavFooterPanelProps,
  INavFooterRootProps,
};

export interface INavFooterProps {
  Root: FC<INavFooterRootProps>;
  Panel: FC<INavFooterPanelProps>;
  Link: FC<INavFooterLinkProps>;
  IconButton: FC<INavFooterIconButtonProps>;
}

export const NavFooter: INavFooterProps = {
  Root: NavFooterContainer,
  Panel: NavFooterPanel,
  Link: NavFooterLink,
  IconButton: NavFooterIconButton,
};

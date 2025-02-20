import { SystemIcon } from '@components/Icon';
import { Label } from '@components/Typography';
import type { FC } from 'react';
import React from 'react';
import { headerClass, infoClass, tagClass } from './InputHeader.css';

export interface IInputHeaderProps {
  label: string;
  htmlFor: string;
  tag?: string;
  info?: string;
}

export const InputHeader: FC<IInputHeaderProps> = ({
  label,
  htmlFor,
  tag,
  info,
}) => {
  return (
    <div className={headerClass}>
      {Boolean(label) && <Label htmlFor={htmlFor}>{label}</Label>}
      {Boolean(tag) && <span className={tagClass}>{tag}</span>}
      {Boolean(info) && (
        <span className={infoClass}>
          {info}
          <SystemIcon.AlertCircleOutline size="sm" />
        </span>
      )}
    </div>
  );
};

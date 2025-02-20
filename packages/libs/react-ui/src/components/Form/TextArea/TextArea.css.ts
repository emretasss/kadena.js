import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { fallbackVar, style } from '@vanilla-extract/css';
import { statusColor } from '../InputWrapper/InputWrapper.css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    borderRadius: '$sm',
    display: 'flex',
    color: '$foreground',
    overflow: 'hidden',
    lineHeight: '$lg',
    bg: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
  }),
  {
    position: 'relative',
    borderBottom: `1px solid ${fallbackVar(statusColor, vars.colors.$gray30)}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid ${fallbackVar(
          statusColor,
          vars.colors.$gray60,
        )}`,
      },
      '.inputGroup &': {
        borderRadius: 0,
      },
      '.inputGroup &:first-child': {
        borderTopRightRadius: vars.radii.$sm,
        borderTopLeftRadius: vars.radii.$sm,
      },
      '.inputGroup &:last-child': {
        borderBottomRightRadius: vars.radii.$sm,
        borderBottomLeftRadius: vars.radii.$sm,
      },
    },
  },
]);

export const disabledClass = style([
  sprinkles({
    pointerEvents: 'none',
    bg: {
      darkMode: '$gray60',
      lightMode: '$gray20',
    },
  }),
  {
    opacity: 0.4,
    selectors: {
      '.inputGroup &': {
        opacity: 1,
      },
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$gray60,
      },
    },
  },
]);

export const textAreaContainerClass = style([
  sprinkles({
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    paddingX: '$4',
  }),
]);

export const textAreaClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    flexGrow: 1,
    paddingY: '$2',
    minHeight: '$20',
  }),
  {
    resize: 'none',
    '::placeholder': {
      color: vars.colors.$gray40,
    },
    [`${darkThemeClass} &::placeholder`]: {
      color: vars.colors.$gray50,
    },
  },
]);

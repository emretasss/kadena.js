import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const homeWrapperClass = style([
  sprinkles({
    paddingRight: '$16',
  }),
]);

export const helpCenterButtonClass = style([
  sprinkles({
    color: '$infoContrast',
    cursor: 'pointer',
  }),
]);

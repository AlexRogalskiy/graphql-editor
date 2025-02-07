import React from 'react';
import { style } from 'typestyle';
import { X } from '@/Graf/icons';
import { useTheme } from '@/state/containers';
import { themed } from '@/Theming/utils';

interface NodeInterfaceProps {
  onDelete: () => void;
  isLocked?: boolean;
}

const NodeInterfaceBlock = themed(({ backgrounds, text, error }) =>
  style({
    padding: `3px 6px`,
    background: backgrounds.interface,
    color: text,
    fontSize: 10,
    borderRadius: 4,
    position: 'relative',
    cursor: 'pointer',
    margin: 5,
    $nest: {
      '.DeleteInterface': {
        opacity: 0.0,
        position: 'absolute',
        pointerEvents: 'none',
        cursor: 'pointer',
        top: -17,
        right: 0,
        fontSize: 8,
        width: 200,
        textAlign: 'right',
        $nest: {
          svg: {
            fill: 'red',
          },
          '&:hover': {
            opacity: 1.0,
          },
        },
      },
      svg: {
        display: 'none',
        marginLeft: 5,
        fill: error,
      },
      '&:hover': {
        $nest: {
          '.DeleteInterface': {
            opacity: 1.0,
          },
          svg: {
            display: 'inline',
          },
        },
      },
    },
  }),
);

export const NodeInterface: React.FC<NodeInterfaceProps> = ({
  onDelete,
  children,
  isLocked,
}) => {
  const { theme } = useTheme();
  return (
    <div
      className={NodeInterfaceBlock(theme)}
      onClick={(e) => {
        if (isLocked) {
          return;
        }
        e.stopPropagation();
        onDelete();
      }}
    >
      {!isLocked && <div className={'DeleteInterface'}>Click to delete</div>}
      <span>
        {children}
        {!isLocked && <X fill={theme.error} />}
      </span>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ParserField } from 'graphql-zeus';
import { ActiveField } from './Field/ActiveField';
import { style } from 'typestyle';
import { Colors, mix } from '@Colors';
import { FIELD_HEIGHT } from '@Graf/constants';
import { GraphQLBackgrounds } from '@editor/theme';
import { NestedCSSProperties } from 'typestyle/lib/types';
import { DOM } from '@Graf/DOM';
import { ActiveFieldType } from './Field/FieldType/ActiveFieldType';
import { More } from '@Graf/icons/More';
import { Plus } from '@Graf/icons/Plus';
import { NodeFields, NodeTitle } from './SharedNode';
import { ResolveCreateField } from '@Graf/Resolve/Resolve';
export interface NodeProps {
  node: ParserField;
  nodes: ParserField[];
  onTreeChanged: () => void;
  isSelected?: boolean;
}
const LowerButton: NestedCSSProperties = {
  background: '#11303D',
  borderRadius: 4,
  color: Colors.grey[0],
  padding: `5px 10px`,
  transition: `background .25s ease-in-out`,
  $nest: {
    '&:hover': {
      background: Colors.blue[3],
    },
  },
};
const ActionsMenu: NestedCSSProperties = {
  marginTop: 4,
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  fontSize: 10,
  gridGap: 4,
  opacity: 0,
  transition: `opacity .25s ease-in-out`,
  pointerEvents: 'none',
  $nest: {
    '.LowerButton': LowerButton,
  },
};
const LeftNodeArea: NestedCSSProperties = {
  position: 'absolute',
  left: -300,
  width: 300,
  zIndex: 4,
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
};
const LeftNodeAreaNode: NestedCSSProperties = { position: 'relative' };
const RightNodeArea: NestedCSSProperties = { position: 'absolute', right: -300, width: 300, zIndex: 4 };
const RightNodeAreaNode: NestedCSSProperties = { position: 'absolute' };

const NodeMenuItem: NestedCSSProperties = {
  background: Colors.grey[10],
  color: Colors.grey[0],
  fontSize: 10,
  padding: `5px 10px`,
};
const NodeMenu: NestedCSSProperties = {
  background: Colors.grey[10],
  color: Colors.grey[0],
  position: 'absolute',
  right: 0,
  maxHeight: 200,
  overflowY: 'auto',
  width: 150,
  zIndex: 2,
  $nest: {
    '.NodeMenuItem': NodeMenuItem,
  },
};

const MainNodeArea: NestedCSSProperties = {
  position: 'relative',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 4,
  transition: `border-color .25s ease-in-out`,
  borderColor: Colors.green[0],
  $nest: {
    '.NodeTitle': NodeTitle,
    '.NodeFields': NodeFields,
    '.NodeMenu': NodeMenu,
  },
};
const NodeContainer = style({
  position: 'relative',
  breakInside: 'avoid',
  maxWidth: '100%',
  margin: 10,
  $nest: {
    '.LeftNodeArea': LeftNodeArea,
    '.RightNodeArea': RightNodeArea,
    '.MainNodeArea': MainNodeArea,
    '.RightNodeAreaNode': RightNodeAreaNode,
    '.LeftNodeAreaNode': LeftNodeAreaNode,
    '.ActionsMenu': ActionsMenu,
    '&:hover': {
      $nest: {
        '> .ActionsMenu': {
          opacity: 1.0,
          pointerEvents: 'auto',
        },
      },
    },
    ...Object.keys(GraphQLBackgrounds).reduce((a, b) => {
      a[`.NodeBackground-${b}`] = {
        background: GraphQLBackgrounds[b],
      };
      return a;
    }, {} as Record<string, NestedCSSProperties>),
    ...Object.keys(GraphQLBackgrounds).reduce((a, b) => {
      a[`.NodeType-${b}`] = {
        background: GraphQLBackgrounds[b],
        $nest: {
          '&:hover, &.Active': {
            background: mix(GraphQLBackgrounds[b], Colors.grey[0], 80),
          },
        },
      };
      return a;
    }, {} as Record<string, NestedCSSProperties>),
  },
});

export const ActiveNode: React.FC<NodeProps> = ({ node, nodes, onTreeChanged, isSelected }) => {
  const [openedInputs, setOpenedInputs] = useState<number[]>([]);
  const [openedOutputs, setOpenedOutputs] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const thisNode = useRef<HTMLDivElement>(null);
  console.log(node);
  useEffect(() => {
    return () => {
      setOpenedInputs([]);
      setOpenedOutputs([]);
    };
  }, [node]);
  return (
    <div
      className={`${NodeContainer} ${DOM.classes.node} ${isSelected ? DOM.classes.nodeSelected : ''}`}
      ref={thisNode}
    >
      <div className={`LeftNodeArea`}>
        {openedInputs.sort().map((o) => (
          <div key={o} className={`LeftNodeAreaNode`} style={{ top: FIELD_HEIGHT * (o + 1) }}>
            <ActiveNode isSelected={true} onTreeChanged={onTreeChanged} nodes={nodes} node={node.args![o]} />
          </div>
        ))}
      </div>
      <div className={`RightNodeArea`}>
        {openedOutputs.sort().map((o) => (
          <div key={o} className={`RightNodeAreaNode`} style={{ top: FIELD_HEIGHT * (o + 1) }}>
            <ActiveNode
              isSelected={true}
              onTreeChanged={onTreeChanged}
              nodes={nodes}
              node={nodes.find((n) => n.name === node.args![o].type.name)!}
            />
          </div>
        ))}
      </div>
      <div
        className={`MainNodeArea`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={`NodeTitle`}>
          <div className={`NodeName`}>{node.name}</div>
          <div className={`NodeType`}>
            <ActiveFieldType type={node.type} />
            {node.interfaces && node.interfaces.length ? <span> implements {node.interfaces.join(' & ')}</span> : ''}
          </div>
          <div className={`NodeIconArea`} onClick={() => setMenuOpen(!menuOpen)}>
            <Plus />
          </div>
          <div className={`NodeIconArea`} onClick={() => setEditMenuOpen(!editMenuOpen)}>
            <More />
          </div>
        </div>
        {menuOpen && (
          <div className={`NodeMenu NodeBackground-${node.type.name}`} onScroll={(e) => e.stopPropagation()}>
            {ResolveCreateField(node, nodes)
              ?.sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((f) => (
                <div className={`NodeMenuItem`} key={f.name}>
                  {f.name}
                </div>
              ))}
          </div>
        )}
        {editMenuOpen && (
          <div className={`NodeMenu  NodeBackground-${node.type.name}`}>
            <div className={'NodeMenuItem'}>Delete node</div>
            <div className={'NodeMenuItem'}>implement interface</div>
            <div className={'NodeMenuItem'}>add directive</div>
          </div>
        )}
        <div className={`NodeFields NodeBackground-${node.type.name}`}>
          {node.args?.map((a, i) => (
            <ActiveField
              onTreeChanged={onTreeChanged}
              parentNodeTypeName={node.type.name}
              last={i === node.args!.length - 1}
              key={a.name}
              onInputClick={() => {
                setOpenedInputs((oI) => (oI.includes(i) ? oI.filter((o) => o !== i) : [...oI, i]));
              }}
              onOutputClick={() => {
                setOpenedOutputs((oO) => (oO.includes(i) ? oO.filter((o) => o !== i) : [...oO, i]));
              }}
              node={a}
              inputOpen={openedInputs.includes(i)}
              outputDisabled={!nodes.find((n) => n.name === a.type.name)}
              outputOpen={openedOutputs.includes(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

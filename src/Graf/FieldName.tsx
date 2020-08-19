import React from 'react';
import { ParserField } from 'graphql-zeus';
import { FieldType } from './FieldType';
import { style } from 'typestyle';
import { EditableText } from './EditableText';
const Main = style({
  display: 'flex',
  flexFlow: 'row no-wrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
const Indent = style({
  marginLeft: 2,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
export const FieldName: React.FC<
  Pick<ParserField, 'name' | 'args' | 'data'> & { afterChange: (newName: string) => void }
> = ({ args, data, name, afterChange }) => {
  if (args && args.length > 0) {
    return (
      <div className={Main}>
        <EditableText value={name} onChange={afterChange} />(
        {args.map((a, i) => (
          <div className={Indent} key={a.name}>
            <FieldName
              afterChange={(newName) => {
                args[i].name = newName;
                afterChange(name);
              }}
              data={a.data}
              name={a.name}
              args={a.args}
            />
            :
            <FieldType type={a.type} />,
          </div>
        ))}
        )
      </div>
    );
  }
  return <EditableText value={name} onChange={(e) => {}} />;
};

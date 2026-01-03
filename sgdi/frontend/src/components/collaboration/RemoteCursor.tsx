import React from 'react';
import { RemoteCursor as RemoteCursorType } from '../../types/collaboration';

interface RemoteCursorProps {
  cursor: RemoteCursorType;
  containerRef?: React.RefObject<HTMLElement>;
}

export const RemoteCursor: React.FC<RemoteCursorProps> = ({ cursor }) => {
  return (
    <div
      className="cursor-flag pointer-events-none absolute z-10"
      style={{
        left: cursor.position.x,
        top: cursor.position.y,
        color: cursor.userColor,
      }}
    >
      {/* Cursor line */}
      <div
        className="absolute top-0 left-0 w-0.5 h-6"
        style={{ backgroundColor: cursor.userColor }}
      />
      {/* User label */}
      <div
        className="absolute -top-6 -left-0.5 px-1.5 py-0.5 rounded-t rounded-br text-white text-[10px] font-bold whitespace-nowrap"
        style={{ backgroundColor: cursor.userColor }}
      >
        {cursor.userName}
      </div>
    </div>
  );
};

interface RemoteCursorsContainerProps {
  cursors: RemoteCursorType[];
  containerRef?: React.RefObject<HTMLElement>;
}

export const RemoteCursorsContainer: React.FC<RemoteCursorsContainerProps> = ({
  cursors,
}) => {
  return (
    <>
      {cursors.map((cursor) => (
        <RemoteCursor key={cursor.id} cursor={cursor} />
      ))}
    </>
  );
};

export default RemoteCursor;

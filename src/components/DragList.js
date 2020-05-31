import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

export const DragList = ({ items, ...props }) => (
  <Droppable {...props}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        style={{
          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
          padding: 8,
          width: 250,
        }}
      >
        <Items items={items} />
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)

const Items = React.memo(({ items }) =>
  items.map((item, index) => (
    <Draggable key={item.id} draggableId={item.label} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: 16,
            margin: `0 0 8px 0`,
            background: snapshot.isDragging ? 'lightgreen' : 'grey',
            ...provided.draggableProps.style,
          }}
        >
          <Item item={item} index={index} />
        </div>
      )}
    </Draggable>
  )),
)

const Item = React.memo((props) => <span>{props.item.label}</span>)

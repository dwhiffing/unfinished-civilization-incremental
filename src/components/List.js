import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

export const List = ({ items, ...props }) => (
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
        {items.map((item, index) => (
          <Item key={item.id} item={item} index={index} />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)

const Item = (props) => (
  <Draggable draggableId={props.item.label} index={props.index}>
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
        {props.item.label}
      </div>
    )}
  </Draggable>
)

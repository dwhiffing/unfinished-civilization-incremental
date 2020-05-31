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
          width: 60,
          minHeight: 55,
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
    <Draggable key={item.id + index} draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: 8,
            marginTop: index > 0 ? 8 : 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 40,
            textAlign: 'center',
            position: 'relative',
            zIndex: snapshot.isDragging ? 20 : 1,
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

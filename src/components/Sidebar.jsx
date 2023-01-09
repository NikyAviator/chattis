import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  const rooms = ['first room', 'second room', 'third room'];

  return (
    <>
      <h3>Available rooms:</h3>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item action variant='light' key={index}>
            {room}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h3>Members:</h3>
    </>
  );
};

export default Sidebar;

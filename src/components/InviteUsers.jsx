// import React, { useEffect, useState } from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import Form from 'react-bootstrap/Form';
// import ListGroup from 'react-bootstrap/ListGroup';
// import axios from 'axios';

// const InviteUsers = () => {
//   const [userList, setUserList] = useState([]);
//   const [searchedUsername, setSearchedUsername] = useState('');
//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   useEffect(() => {
//     const getUserList = async () => {
//       await axios
//         .get('/api/get-all-users')
//         .then((response) => {
//           setUserList(response.data.result);
//           console.log(response.data);
//         })

//         .catch((err) => console.log(err.message));
//     };
//     getUserList();
//   }, []);

//   return (
//     <>
//       <Button variant='primary' onClick={handleShow}>
//         Launch demo modal
//       </Button>

//       <Modal onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant='primary' onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default InviteUsers;

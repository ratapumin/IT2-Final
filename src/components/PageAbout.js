// import React from 'react';
// import axios from "axios";
// import { useState, useEffect, useCallback } from "react";

export const PageAbout = () => {

  // const [ownerIds, setOwnerIds] = useState([]);
  // const [newOwnerId, setNewOwnerId] = useState();

  // const [owner, setOwner] = useState({
  //   user_id: '',
  //   user_password: '',
  //   user_fname: '',
  //   user_lname: '',
  //   user_tel: '',
  //   user_id_card: '',
  //   role_type: '',
  //   user_status: ''
  // });

  // const fetchOwnersId = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/users");
  //     const filteredOwners = res.data.filter(owner => owner.user_id);
  //     setOwnerIds(filteredOwners.map(owner => owner.user_id));
  //   } catch (error) {
  //     console.log("Cannot fetch products", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchOwnersId();
  // }, []);

  // function generateRandomNumber() {
  //   return Math.floor(Math.random() * 90000) + 10000;
  // }

  // function generateUniqueId() {
  //   let newId;
  //   do {
  //     newId = generateRandomNumber();
  //   } while (ownerIds.includes(newId));
  //   setNewOwnerId(newId);
  // }

  // useEffect(() => {
  //   if (ownerIds.length > 0) {
  //     generateUniqueId();
  //   }
  // }, [ownerIds, generateUniqueId]);

  return (
    <div>
      {/* <h1>new id: {newOwnerId}</h1> */}
    </div>
  );
};

export default PageAbout;

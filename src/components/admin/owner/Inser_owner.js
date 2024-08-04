import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

function Insert_owner({ insertOwner }) {
    const [onwerIdList, setOwnerIDList] = useState([]);
    const [newOwnerId, setNewOwnerId] = useState("");
    const [owner, setOwner] = useState({
        user_id: "",
        user_password: "",
        user_fname: "",
        user_lname: "",
        user_tel: "",
        user_id_card: "",
        role_type: "",
        user_status: "",
    });

    useEffect(() => {
        const fetchOwnersId = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users");
                const filteredOwners = res.data.filter((owner) => owner.user_id);
                setOwnerIDList(filteredOwners);
                console.log(onwerIdList);
            } catch (error) {
                console.log("Cannot fetch products", error);
            }
        };

        fetchOwnersId();
    }, [onwerIdList]);

    function generateRandomNumber() {
        return Math.floor(Math.random() * 90000) + 10000;
    }

    const generateUniqueId = useCallback(() => {
        let newId;
        do {
            newId = generateRandomNumber();
        } while (onwerIdList.includes(newId));
        setNewOwnerId(newId);
    }, [onwerIdList]);

    useEffect(() => {
        if (onwerIdList) {
            generateUniqueId();
        }
    }, [generateUniqueId, onwerIdList]);


    const addProduct = useCallback(async () => {
        const role_type = {
            O: "Owner",
            E: "Employee",
        };

        const status = {
            Active: "Active",
            Unactive: "Unactive",
        };


        const { value: formValues } = await Swal.fire({
            title: "Insert Owner",
            width: "auto",
            html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 800px; margin: 0 auto;">
      <!-- Row 1: User ID and Password -->
      <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="user_id" style="width: 30%; text-align: right; padding-right: 10px;">User ID</label>
              <input id="user_id" class="swal2-input" style="width: 70%;" readonly value="${newOwnerId}">
          </div>
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="user_password" style="width: 30%; text-align: right; padding-right: 10px;">Password</label>
              <input id="user_password" class="swal2-input" style="width: 70%;" value="${owner.user_password}">
          </div>
      </div>
  
      <!-- Row 2: First Name and Last Name -->
      <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="first_name" style="width: 30%; text-align: right; ">First Name</label>
              <input id="first_name" class="swal2-input" style="width: 70%;" value="${owner.user_fname}">
          </div>
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="last_name" style="width: 30%; text-align: right; ">Last Name</label>
              <input id="last_name" class="swal2-input" style="width: 70%;" value="${owner.user_lname}">
          </div>
      </div>
  
      <!-- Row 3: Tel and ID Card -->
         <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; width: 48%;">
                <label for="tel" style="width: 30%; text-align: right; padding-right: 10px;">Tel</label>
                <input id="tel" class="swal2-input" style="width: 70%;" value="${owner.user_tel}" 
                oninput="this.value = this.value.replace(/[^0-9]/g, '');" maxlength="10">
            </div>
            <div style="display: flex; align-items: center; width: 48%;">
                <label for="id_card" style="width: 30%; text-align: right; padding-right: 10px;">ID Card</label>
                <input id="id_card" class="swal2-input" style="width: 70%;" value="${owner.user_id_card}"
                oninput="this.value = this.value.replace(/[^0-9]/g, '');" maxlength="13">
            </div>
        </div>
  
      <!-- Row 4: Role and Status -->
      <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="role" style="width: 30%; text-align: right; padding-right: 30px; margin:7px">Role</label>
              <select id="role" class="swal2-input" style="width: 50%;">
                  ${Object.entries(role_type)
                    .map(
                        ([key, value]) =>
                            `<option value="${key}" ${owner.role_type === key ? "selected" : ""
                            }>${value}</option>`
                    )
                    .join("")}
              </select>
          </div>
          <div style="display: flex; align-items: center; width: 48%;">
              <label for="status" style="width: 30%; text-align: right; padding-right: 35px;">Status</label>
              <select id="status" class="swal2-input" style="width: 50%; padding-right: 15px;margin:15px;">
                  ${Object.entries(status)
                    .map(
                        ([key, value]) =>
                            `<option value="${key}" ${owner.user_status === key ? "selected" : ""
                            }>${value}</option>`
                    )
                    .join("")}
              </select>
          </div>
      </div>
  </div>
  `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const user_id = document.getElementById("user_id")?.value;
                const user_password = document.getElementById("user_password")?.value;
                const user_fname = document.getElementById("first_name")?.value;
                const user_lname = document.getElementById("last_name")?.value;
                const user_tel = document.getElementById("tel")?.value;
                const user_id_card = document.getElementById("id_card")?.value;
                const role_type = document.getElementById("role")?.value;
                const user_status = document.getElementById("status")?.value;
                
                // const inputNum = document.getElementById('tel'); // Remove the '#' character here

                // inputNum.onkeydown = function (event) {
                //     // Check if the key is not a number and not a special key like Backspace
                //     if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                //         event.preventDefault(); // Prevent the default action of the key
                //     }
                // };
        

                console.log(user_tel)

                let validationMessage = "";

                if (!user_id) validationMessage = "Please User ID";

                else if (!user_password) validationMessage = "Please enter a Password";
                else if (user_password.length < 5 || user_password.length > 15) validationMessage = "Please Password 5-15 character";                

                else if (!user_fname) validationMessage = "Please First Name";
                else if (user_fname.length > 30) validationMessage = " First Name is Maximum 30 character";

                else if (!user_lname) validationMessage = "Please Last Name";
                else if (user_lname.length > 30) validationMessage = " Last Name is Maximum 30 character";

                else if (!user_tel) validationMessage = "Please enter a Telephone number";
                else if (user_tel.toString().length !== 10) validationMessage = " Telephone is Equal to 10 character";

                else if (!user_id_card) validationMessage = "Please ID Card";
                else if (user_id_card.length !== 13) validationMessage = " ID Card is Equal to 13 character";

                else if (!role_type) validationMessage = "Select Role";
                else if (!user_status) validationMessage = "Select Status";

                if (validationMessage) {
                    Swal.showValidationMessage(validationMessage);
                    return false;
                }

                return {
                    user_id,
                    user_password,
                    user_fname,
                    user_lname,
                    user_tel,
                    user_id_card,
                    role_type,
                    user_status,
                };
            },
        });

        if (formValues) {
            try {
                // ส่งข้อมูลที่แก้ไขไปยัง API
                await axios.post(`http://localhost:5000/api/users`, formValues);
                setOwner({
                    user_id: "",
                    user_password: "",
                    user_fname: "",
                    user_lname: "",
                    user_tel: "",
                    user_id_card: "",
                    role_type: "",
                    user_status: "",
                });
                Swal.fire({
                    title: "Saved!",
                    text: "Your Owner has been Insert.",
                    icon: "success",
                    timer: 1000, // ระยะเวลาแสดงผลเป็นมิลลิวินาที
                    showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
                });
                insertOwner(false);
            } catch (error) {
                console.log("Cannot insert owner", error);
                await Swal.fire({
                    title: "Error!",
                    text: "There was a problem inserting the owner.",
                    icon: "error",
                });
            }
        } else {
            insertOwner(false);
        }
    }, [owner, insertOwner, newOwnerId]);

    useEffect(() => {
        if (owner) {
            addProduct();
        }
    }, [owner, addProduct]);

    // can not generate password
    return null;
}

export default Insert_owner;


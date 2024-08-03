import axios from "axios"
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";



function Insert_owner({ insertOwner }) {

    const [owner, setOwner] = useState({
        user_id: '',
        user_password: '',
        user_fname: '',
        user_lname: '',
        user_tel: '',
        user_id_card: '',
        role_type: '',
        user_status: ''
    })


    const addProduct = useCallback(async () => {
        const role_type = {
            O: "Owner",
            E: "Employee",
        };
    
        const status = {
            A: "Active",
            U: "Unactive",
        };
    
        const { value: formValues } = await Swal.fire({
            title: "Insert Owner",
            width: 'auto',
            html:`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 800px; margin: 0 auto;">
            <!-- Row 1: User ID and Password -->
            <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; width: 48%;">
                    <label for="user_id" style="width: 30%; text-align: right; padding-right: 10px;">User ID</label>
                    <input id="user_id" class="swal2-input" style="width: 70%;" value="${owner.user_id}">
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
                    <input id="tel" class="swal2-input" style="width: 70%;" value="${owner.user_tel}">
                </div>
                <div style="display: flex; align-items: center; width: 48%;">
                    <label for="id_card" style="width: 30%; text-align: right; padding-right: 10px;">ID Card</label>
                    <input id="id_card" class="swal2-input" style="width: 70%;" value="${owner.user_id_card}">
                </div>
            </div>
        
            <!-- Row 4: Role and Status -->
            <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; width: 48%;">
                    <label for="role" style="width: 30%; text-align: right; padding-right: 30px; margin:7px">Role</label>
                    <select id="role" class="swal2-input" style="width: 50%;">
                        ${Object.entries(role_type)
                            .map(([key, value]) =>
                                `<option value="${key}" ${owner.role_type === key ? "selected" : ""}>${value}</option>`
                            )
                            .join("")}
                    </select>
                </div>
                <div style="display: flex; align-items: center; width: 48%;">
                    <label for="status" style="width: 30%; text-align: right; padding-right: 35px;">Status</label>
                    <select id="status" class="swal2-input" style="width: 50%; padding-right: 15px;margin:15px;">
                        ${Object.entries(status)
                            .map(([key, value]) =>
                                `<option value="${key}" ${owner.user_status === key ? "selected" : ""}>${value}</option>`
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
                return {
                    user_id: document.getElementById("user_id")?.value || "",
                    user_password: document.getElementById("user_password")?.value || "",
                    user_fname: document.getElementById("first_name")?.value || "",
                    user_lname: document.getElementById("last_name")?.value || "",
                    user_tel: document.getElementById("tel")?.value || "",
                    user_id_card: document.getElementById("id_card")?.value || "",
                    role_type: document.getElementById("role")?.value || "",
                    user_status: document.getElementById("status")?.value || "",
                };
            },
        });
    
        if (formValues) {
            try {
                // ส่งข้อมูลที่แก้ไขไปยัง API
                await axios.post(
                    `http://localhost:5000/api/users`,
                    formValues
                );
                setOwner({
                    user_id: '',
                    user_password: '',
                    user_fname: '',
                    user_lname: '',
                    user_tel: '',
                    user_id_card: '',
                    role_type: '',
                    user_status: ''
                })
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
    }, [owner, insertOwner]);
    


    useEffect(() => {
        if (owner) {

            addProduct()
        }
    }, [owner, addProduct])





    // can not generate password 
    return null
}


export default Insert_owner
import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";



function Edit_owner({ owner, saveEdit }) {
    const [currentowner, setCurrentOwner] = useState(owner)


    useEffect(() => {
        setCurrentOwner(owner)
    }, [owner])


    const changeData = useCallback(async () => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Owner",
            width: 'auto',
            html: `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <!-- Row 1: User ID and Password -->
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="user_id" style="width: 35%; text-align: right; padding-right: 5px;">User ID</label>
                            <input id="user_id" class="swal2-input" style="width: 60%;" value="${currentowner.user_id}" readonly>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="user_password" style="width: 35%; text-align: right; padding-right: 5px;">Password</label>
                            <input id="user_password" class="swal2-input" style="width: 60%;" value="${currentowner.user_password}">
                        </div>
                    </div>
                    <!-- Row 2: First Name and Last Name -->
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="first_name" style="width: 35%; text-align: right; padding-right: 5px;">First Name</label>
                            <input id="first_name" class="swal2-input" style="width: 60%;" value="${currentowner.user_fname}">
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="last_name" style="width: 35%; text-align: right; padding-right: 5px;">Last Name</label>
                            <input id="last_name" class="swal2-input" style="width: 60%;" value="${currentowner.user_lname}">
                        </div>
                    </div>
                    <!-- Row 3: Tel and ID Card -->
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="tel" style="width: 35%; text-align: right; padding-right: 5px;">Tel</label>
                            <input id="tel" class="swal2-input" style="width: 60%;" value="${currentowner.user_tel}">
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="id_card" style="width: 35%; text-align: right; padding-right: 5px;">ID Card</label>
                            <input id="id_card" class="swal2-input" style="width: 60%;" value="${currentowner.user_id_card}">
                        </div>
                    </div>
                    <!-- Row 4: Role and Status -->
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="role" style="width: 35%; text-align: right; padding-right: 5px;">Role</label>
                            <input id="role" class="swal2-input" style="width: 60%;" value="${currentowner.role_type}">
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 48%;">
                            <label for="status" style="width: 35%; text-align: right; padding-right: 5px;">Status</label>
                            <input id="status" class="swal2-input" style="width: 60%;" value="${currentowner.user_status}">
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
            }
        });
    
        if (formValues) {
            try {
                await axios.put(
                    `http://localhost:5000/api/users/${formValues.user_id}`,
                    formValues
                );
                Swal.fire({
                    title: "Saved!",
                    text: "Your Owner has been updated.",
                    icon: "success",
                    timer: 1000, // ระยะเวลาแสดงผลเป็นมิลลิวินาที
                    showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
                });
                
                saveEdit();
            } catch (error) {
                console.log("Cannot edit product", error);
                await Swal.fire({
                    title: "Error!",
                    text: "There was a problem updating the product.",
                    icon: "error",
                });
            }
        } else {
            saveEdit();
        }
    }, [currentowner, saveEdit]);
    

    useEffect(() => {
        if (currentowner) {
            changeData()

        }
    }, [changeData, currentowner])
    return null
}


export default Edit_owner
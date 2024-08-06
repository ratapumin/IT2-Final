import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

function EditProducts({ product, saveEdit }) {
    const [currentProduct, setCurrentProduct] = useState(product);

    useEffect(() => {
        setCurrentProduct(product);
    }, [product]);

    // Memoize the changeData function using useCallback
    const changeData = useCallback(async () => {
        const productTypes = {
            Coffee: "Coffee",
            Tea: "Tea",
            Chocolate: "Chocolate",
            Another: "Another",
        };

        const categories = {
            ICE: "ICE",
            HOT: "HOT",
        };

        const { value: formValues } = await Swal.fire({
            title: "Edit Product",
            html: `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_id" style="width: 30%;">Product ID</label>
                <input id="p_id" class="swal2-input" style="width: 65%;" value="${currentProduct.p_id}" readonly>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_name" style="width: 30%;">Product Name</label>
                <input id="p_name" class="swal2-input" style="width: 65%;" value="${currentProduct.p_name}">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_price" style="width: 30%;">Price</label>
                <input id="p_price" class="swal2-input" style="width: 65%;" value="${currentProduct.p_price}">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_type" style="width: 30%;">Product Type</label>
                <select id="p_type" class="swal2-input" style="width: 65%;">
                    ${Object.entries(productTypes)
                    .map(([key, value]) =>
                        `<option value="${key}" ${currentProduct.p_type === key ? "selected" : ""}>${value}</option>`
                    )
                    .join("")}
                </select>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="category" style="width: 30%;">Category</label>
                <select id="category" class="swal2-input" style="width: 65%;">
                    ${Object.entries(categories)
                    .map(([key, value]) =>
                        `<option value="${key}" ${currentProduct.category === key ? "selected" : ""}>${value}</option>`
                    )
                    .join("")}
                </select>
            </div>
        `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    p_id: document.getElementById("p_id").value,
                    p_name: document.getElementById("p_name").value,
                    p_price: document.getElementById("p_price").value,
                    p_type: document.getElementById("p_type").value,
                    category: document.getElementById("category").value,
                };
            },
        });

        if (formValues) {
            try {
                // ส่งข้อมูลที่แก้ไขไปยัง API
                await axios.put(
                    `http://localhost:5000/api/products/${formValues.p_id}`,
                    formValues
                );
                Swal.fire({
                    title: "Saved!",
                    text: "Your Product has been updated.",
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
    }, [currentProduct, saveEdit]); // Include necessary dependencies here

    // Add changeData as a dependency in useEffect
    useEffect(() => {
        if (currentProduct) {
            changeData();
        }
    }, [changeData,currentProduct]);

    return null;
}

export default EditProducts;

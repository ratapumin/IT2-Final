import axios from "axios";
import { useState, useEffect } from "react";
// import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";

function EditProducts({ product, saveEdit }) {
    const [currentProduct, setCurrentProduct] = useState(product);

    useEffect(() => {
        setCurrentProduct(product);
    }, [product]);

    const changeData = async () => {
        const productTypes = {
            Coffee: "Coffee",
            Tea: "Tea",
            Chocolate: "Chocolate",
            Another: "Another",
        };

        const categories = {
            1: "ICE",
            2: "HOT",
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
                <label for="category_id" style="width: 30%;">Category</label>
                <select id="category_id" class="swal2-input" style="width: 65%;">
                    ${Object.entries(categories)
                    .map(([key, value]) =>
                        `<option value="${key}" ${currentProduct.category_id === key ? "selected" : ""}>${value}</option>`
                    )
                    .join("")}
                </select>
            </div>
        `,
            focusConfirm: false,
            showCancelButton: true,
            timer:1000,
            preConfirm: () => {
                return {
                    p_id: document.getElementById("p_id").value,
                    p_name: document.getElementById("p_name").value,
                    p_price: document.getElementById("p_price").value,
                    p_type: document.getElementById("p_type").value,
                    category_id: document.getElementById("category_id").value,
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
                Swal.fire("Saved!", "Your product has been updated.", "success");
                saveEdit();
            } catch (error) {
                console.log("Cannot edit product", error);
                Swal.fire(
                    "Error!",
                    "There was a problem updating the product.",
                    "error"
                );
            }
        } else {
            saveEdit();
        }
    };


    useEffect(() => {

        changeData();
    }, []);

    return null
}

export default EditProducts;

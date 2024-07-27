import axios from "axios"
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Insert_products({ insertProduct }) {
    //state products
    const [product, setProduct] = useState({
        p_id: '',
        p_name: '',
        p_price: '',
        p_type: '',
        category_id: ''
    })


    //add_products
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct((insert_product) => ({
            ...insert_product,
            [name]: value
        }))
    }

    //add to api
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/products',
                product
            )
            console.log('page insert', res)
            setProduct({
                p_id: "",
                p_name: "",
                p_price: "",
                p_type: "",
                category_id: "",

            });
            insertProduct()
        } catch (error) {
            console.log('page insert error ', error)

        }
        console.log('api: ', product)


    }

    const addProduct = async () => {
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
            title: "Insert Product",
            html: `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_id" style="width: 30%;">Product ID</label>
                <input id="p_id" class="swal2-input" style="width: 65%;" value="${product.p_id}" >
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_name" style="width: 30%;">Product Name</label>
                <input id="p_name" class="swal2-input" style="width: 65%;" value="${product.p_name}">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_price" style="width: 30%;">Price</label>
                <input id="p_price" class="swal2-input" style="width: 65%;" value="${product.p_price}">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="p_type" style="width: 30%;">Product Type</label>
                <select id="p_type" class="swal2-input" style="width: 65%;">
                    ${Object.entries(productTypes)
                    .map(([key, value]) =>
                        `<option value="${key}" ${product.p_type === key ? "selected" : ""}>${value}</option>`
                    )
                    .join("")}
                </select>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <label for="category_id" style="width: 30%;">Category</label>
                <select id="category_id" class="swal2-input" style="width: 65%;">
                    ${Object.entries(categories)
                    .map(([key, value]) =>
                        `<option value="${key}" ${product.category_id === key ? "selected" : ""}>${value}</option>`
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
                    category_id: document.getElementById("category_id").value,
                };
            },
        });

        if (formValues) {
            try {
                // ส่งข้อมูลที่แก้ไขไปยัง API
                await axios.post(
                    `http://localhost:5000/api/products`,
                    formValues
                );
                Swal.fire("Saved!", "Your product has been updated.", "success");
                setProduct({
                    p_id: "",
                    p_name: "",
                    p_price: "",
                    p_type: "",
                    category_id: "",

                });
                insertProduct(false);
            } catch (error) {
                console.log("Cannot edit product", error);
                Swal.fire(
                    "Error!",
                    "There was a problem updating the product.",
                    "error"
                );
            }
        } else {
            insertProduct(false);
        }
    };


    useEffect(() => {
        addProduct()
    }, [])

    return null

}
export default Insert_products
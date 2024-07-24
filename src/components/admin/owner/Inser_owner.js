import axios from "axios"
import { useState } from "react"

function Insert_owner() {

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


    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         await 
    //     }
    // })

    const handleChange = (e) => {
        const { name, value } = e.target
        setOwner((insert_owner) => ({
            ...insert_owner,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/users'
                , owner)
            console.log('owner', res)
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
        } catch (error) {
            console.log('page insert error ', error)

        }
        console.log('api: ', owner)
    }

    // can not generate password 
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Owner Id
                    <input type="text" name="user_id" onChange={handleChange} />
                </label>
                <label>
                    Owner Id
                    <input type="text" name="user_password  " onChange={handleChange} />
                </label>
                <label>
                    First Name
                    <input type="text" name="user_fname" onChange={handleChange} />
                </label>
                <label>
                    Last Name
                    <input type="text" name="user_lname" onChange={handleChange} />
                </label>
                <label>
                    Phone Number
                    <input type="text" name="user_tel" onChange={handleChange} />
                </label>
                <label>
                    ID Card
                    <input type="text" name="user_id_card" onChange={handleChange} />
                </label>     <label>
                    Role
                    <input type="text" name="role_type" onChange={handleChange} />
                </label>
                <label>
                    Status
                    <input type="text" name="user_status" onChange={handleChange} />
                </label>

                <button type="submit">Add Owner</button>

            </form>
        </>
    )

}


export default Insert_owner
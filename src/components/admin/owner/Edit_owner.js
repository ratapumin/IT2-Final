import axios from "axios"
import { useEffect, useState } from "react"




function Edit_owner() {
    const [owners, setOwners] = useState([])
    const [currentowner, setCurrentOwner] = useState({
        user_id: '',
        user_password: '',
        user_fname: '',
        user_lname: '',
        user_tel: '',
        user_id_card: '',
        role_type: '',
        user_status: ''
    })
    const [modalEdit, setModelEdit] = useState(false)


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users')
                setOwners(res.data)
            } catch (error) {
                console.log('can fetch owner', error)

            }

        }
        fetchUsers()

    }, [])


    //select product id
    const handleFindID = (id) => {
        const findower = owners.find(owner => owner.user_id === id)
        console.log(findower)
        setCurrentOwner(findower)
        setModelEdit(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCurrentOwner((edit_owner) => ({
            ...edit_owner,
            [name]: value
        }))
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        console.log('current', currentowner)
        try {
            await axios.put(`http://localhost:5000/api/users/${currentowner.user_id}`, currentowner)
            const res = await axios.get('http://localhost:5000/api/users')
            console.log(res.data)
            setOwners(res.data)
            setCurrentOwner({
                user_id: '',
                user_password: '',
                user_fname: '',
                user_lname: '',
                user_tel: '',
                user_id_card: '',
                role_type: '',
                user_status: ''
            })
            setModelEdit(false)

        } catch (error) {
            console.log('Cannot edit owner', error);

        }
    }

    return (<>
        {owners.length > 0 && owners.map(owner => (
            <ul key={owner.user_id}>
                <li>Owner First Name : {owner.user_fname}</li>
                <li>Onwner Last name : {owner.user_lname}</li>
                <li>Onwner Tel : {owner.user_tel}</li>
                <li>Onwner ID Card : {owner.user_id_card}</li>
                <li>Role : {owner.role_type}</li>
                <li>Onwner Status : {owner.user_status}</li>
                <button onClick={() => handleFindID(owner.user_id)}>Edit</button>
            </ul>
        ))}
        {modalEdit && (
            <form onSubmit={handleEdit}>
                <label>
                    Id
                    <input
                        type="text"
                        name="user_id"
                        value={currentowner.user_id}
                        readOnly
                        onChange={handleChange} />
                </label>
                <label>
                    Password
                    <input
                        type="text"
                        name="user_id"
                        value={currentowner.user_password}
                        readOnly
                        onChange={handleChange} />
                </label>
                <label>
                    First Name
                    <input
                        type="text"
                        name="user_fname"
                        value={currentowner.user_fname}
                        onChange={handleChange} />
                </label>
                <label>
                    Last Name
                    <input
                        type="text"
                        name="user_lname"
                        value={currentowner.user_lname}
                        onChange={handleChange} />
                </label>
                <label>
                    Phone Number
                    <input
                        type="text"
                        name="user_tel"
                        value={currentowner.user_tel}
                        onChange={handleChange} />
                </label>
                <label>
                    ID Card
                    <input type="text"
                        name="user_id_card"
                        value={currentowner.user_id_card}
                        onChange={handleChange} />
                </label>
                <label>
                    Role
                    <input
                        type="text"
                        name="role_type"
                        value={currentowner.role_type}
                        onChange={handleChange} />
                </label>
                <label>
                    Status
                    <input
                        type="text"
                        name="user_status"
                        value={currentowner.user_status}
                        onChange={handleChange} />
                </label>

                <button type="submit">Edit</button>

            </form>
        )}

    </>)
}


export default Edit_owner
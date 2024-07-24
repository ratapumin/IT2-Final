import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from 'react-bootstrap';

function Delete_owner() {

    const [owners, setOwners] = useState([])
    const [item, setItem] = useState({})
    const [modalDelete, setModalDelete] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users')
                console.log(res.data)
                setOwners(res.data)
            } catch (error) {
                console.log('can fetch owner', error)

            }
        }
        fetchUsers()
    }, [])


    const handleFindID = (id) => {
        const findowner = owners.find(owner => owner.user_id === id)
        console.log('find', findowner)
        setItem(findowner)
        setModalDelete(true)
    }


    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:5000/api/users/${item.user_id}`)
            const res = await axios.get('http://localhost:5000/api/users')
            console.log(res.data)
            setOwners(res.data)
            setItem({
                user_id: '',
                user_password: '',
                user_fname: '',
                user_lname: '',
                user_tel: '',
                user_id_card: '',
                role_type: '',
                user_status: ''
            })
            setModalDelete(false)
        } catch (error) {
            console.log('Cannot delete product', error);

        }
    }

    const handleCancel = () => {
        setModalDelete(false)
    }

    return (
        <>
            {owners.length > 0 && owners.map(owner => (
                <ul key={owner.user_id}>
                    <li>Owner First Name : {owner.user_fname}</li>
                    <li>Onwner Last name : {owner.user_lname}</li>
                    <li>Onwner Tel : {owner.user_tel}</li>
                    <li>Onwner ID Card : {owner.user_id_card}</li>
                    <li>Role : {owner.role_type}</li>
                    <li>Onwner Status : {owner.user_status}</li>
                    <Button variant="danger" onClick={() => handleFindID(owner.user_id)}>Delete</Button>


                </ul>
            ))}


            {modalDelete && (
                <form onSubmit={handleDelete}>
                    <label>
                        Id
                        <input
                            type="text"
                            name="user_id"
                            value={item.user_id}
                            readOnly
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="text"
                            name="user_id"
                            value={item.user_password}
                            readOnly
                        />
                    </label>
                    <label>
                        First Name
                        <input
                            type="text"
                            name="user_fname"
                            value={item.user_fname}
                            readOnly
                        />
                    </label>
                    <label>
                        Last Name
                        <input
                            type="text"
                            name="user_lname"
                            value={item.user_lname}
                            readOnly
                        />
                    </label>
                    <label>
                        Phone Number
                        <input
                            type="text"
                            name="user_tel"
                            value={item.user_tel}
                            readOnly
                        />
                    </label>
                    <label>
                        ID Card
                        <input type="text"
                            name="user_id_card"
                            value={item.user_id_card}
                            readOnly
                        />
                    </label>
                    <label>
                        Role
                        <input
                            type="text"
                            name="role_type"
                            value={item.role_type}
                            readOnly
                        />
                    </label>
                    <label>
                        Status
                        <input
                            type="text"
                            name="user_status"
                            value={item.user_status}
                            readOnly
                        />
                    </label>

                    {/* <button type="submit">Delete</button> */}
                    <Button type="submit" variant="warning">Delete</Button>
                    <Button variant="link" onClick={handleCancel}>Link</Button>
                </form>
            )}
        </>
    )
}

export default Delete_owner
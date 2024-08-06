import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../user/UserContext";
import './owner.css'
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import EditOwner from './Edit_owner'
import DeleteOwner from './Delete_owner'
import InsertOwner from './Inser_owner'

function Owner() {

    const [owners, setOwners] = useState([])
    const [editOwnerId, setEditOwnerId] = useState(null);
    const [deleteOwnerId, setDeleteOwnerId] = useState(null);
    const [insertOwner, setInsertOwner] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser()

    useEffect(() => {
        if (!user || user.role === 'A') {
            navigate('/protected');
        }
    }, [user, navigate]);

    const fetchOwners = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            const filteredOwners = res.data.filter(owner => owner.role_type === "O");
            setOwners(filteredOwners);
        } catch (error) {
            console.log("Cannot fetch products", error);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);


    const handleSaveEdit = async () => {
        await fetchOwners();
        setEditOwnerId(null);
        console.log(editOwnerId)

    };


    const handleonDelete = async () => {
        await fetchOwners();
        setDeleteOwnerId(null);
        console.log(deleteOwnerId)

    };

    const handleInsertOwner = async () => {
        await fetchOwners()
        setInsertOwner(!insertOwner);

    }

    return (
        <>
            <div className="box-table">
                <div className="btn-add " >
                    <Button variant="primary"
                        className="btn-item"
                        onClick={handleInsertOwner}
                    >
                        Add Owners
                    </Button>
                </div>
                <div className="table">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Password</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Tel</th>
                                <th>ID Card</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map((owner, index) => (
                                <tr key={owner.user_id}>
                                    <td>{index + 1}</td>
                                    <td>{owner.user_id}</td>
                                    <td>{owner.user_password}</td>
                                    <td>{owner.user_fname}</td>
                                    <td>{owner.user_lname}</td>
                                    <td>{owner.user_tel}</td>
                                    <td>{owner.user_id_card}</td>
                                    <td>{owner.role_type}</td>
                                    <td>{owner.user_status}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            className="btn-item"
                                            onClick={() => setEditOwnerId(owner.user_id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="btn-item"
                                            onClick={() => setDeleteOwnerId(owner.user_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            {editOwnerId && (
                <EditOwner
                    owner={owners.find((o) => o.user_id === editOwnerId)}
                    saveEdit={handleSaveEdit}
                />
            )}

            {deleteOwnerId && (
                <DeleteOwner
                    owner={owners.find((o) => o.user_id === deleteOwnerId)}
                    onDelete={handleonDelete}
                />
            )}

            {insertOwner && (
                <InsertOwner insertOwner={handleInsertOwner} />
            )}

        </>
    )
}

export default Owner
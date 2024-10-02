import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../user/UserContext";
import { Table, Button } from "antd";
import axios from "axios";
import EditOwner from './Edit_owner'
import DeleteOwner from './Delete_owner'
import InsertOwner from './Inser_owner'
import './owner.css';
import React from 'react';


function Owner() {
    const [ownerList, setOwners] = useState([]);
    const [editOwnerId, setEditOwnerId] = useState(null);
    const [deleteOwnerId, setDeleteOwnerId] = useState(null);
    const [insertOwner, setInsertOwner] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();
    const [user_acc, setUser_acc] = useState();

    useEffect(() => {
        if (!user || user.role === 'A') {
            navigate('/protected');
        }
    }, [user, navigate]);

    const fetchOwners = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUser_acc(res.data)
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
    };

    const handleonDelete = async () => {
        await fetchOwners();
        setDeleteOwnerId(null);
    };

    const handleInsertOwner = async () => {
        await fetchOwners();
        setInsertOwner(!insertOwner);
    };

    // กำหนดคอลัมน์สำหรับตาราง
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'ID',
            dataIndex: 'user_id',
            key: 'user_id',
            width: 100,
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Password',
            dataIndex: 'user_password',
            key: 'user_password',
            width: '5%',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'First Name',
            dataIndex: 'user_fname',
            key: 'user_fname',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Last Name',
            dataIndex: 'user_lname',
            key: 'user_lname',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Tel',
            dataIndex: 'user_tel',
            key: 'user_tel',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'ID Card',
            dataIndex: 'user_id_card',
            key: 'user_id_card',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            key: 'role_type',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Status',
            dataIndex: 'user_status',
            key: 'user_status',
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Actions',
            key: 'actions',
            width: "15%",
            align: 'center',  // จัดข้อความกลาง
            render: (text, record) => (
                <>
                    <Button
                        className="bntEdit "
                        type="primary"
                        onClick={() => setEditOwnerId(record.user_id)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => setDeleteOwnerId(record.user_id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div className="box-table">
                <div className="btn-add">
                    <Button type="primary" className="btn-item" onClick={handleInsertOwner}>
                        Add Owners
                    </Button>
                </div>
                <div className="tableOwner">
                    <Table
                        columns={columns}
                        dataSource={ownerList}
                        rowKey="user_id"
                        bordered
                    />
                </div>
            </div>
            {editOwnerId && (
                <EditOwner
                    owner={ownerList.find((o) => o.user_id === editOwnerId)}
                    saveEdit={handleSaveEdit}
                    ownerList={user_acc}
                />
            )}

            {deleteOwnerId && (
                <DeleteOwner
                    owner={ownerList.find((o) => o.user_id === deleteOwnerId)}
                    onDelete={handleonDelete}
                />
            )}

            {insertOwner && (
                <InsertOwner insertOwner={handleInsertOwner}
                    ownerList={user_acc}
                />
            )}
        </>
    );
}

export default Owner;

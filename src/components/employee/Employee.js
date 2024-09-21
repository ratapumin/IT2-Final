import { useEffect, useState } from 'react';
import './employee.css';
import { Space, Table, Modal } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
// import InsertMember from './InsertMember';
// import EditMember from './EditMember';
import { ExclamationCircleFilled } from '@ant-design/icons';
import InsertEmployee from './InsertEmployee';

function Employee() {
    const [member, setMember] = useState();
    const [updateMember, setUpdateMember] = useState()
    const [employeeList, setEmployeeList] = useState()

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            const filteredEmployee = res.data.filter(employee => employee.role_type === "E");
            setEmployeeList(filteredEmployee);
        } catch (error) {
            console.log("Cannot fetch fetchEmployees", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // const showDeleteConfirm = (value) => {
    //     Modal.confirm({
    //         title: `Are you sure delete Member?`,
    //         icon: <ExclamationCircleFilled />,
    //         content: `Member : ${value.c_fname} ${value.c_lname}`,
    //         okText: 'Yes',
    //         okType: 'danger',
    //         cancelText: 'No',
    //         async onOk() {
    //             try {
    //                 await axios.delete(`http://localhost:5000/api/members/${value.c_id}`);
    //                 console.log('OK');
    //                 // Update member list after deletion
    //                 fecthMembers();
    //             } catch (error) {
    //                 console.error('Error deleting member:', error);
    //             }
    //         },
    //         onCancel() {
    //             console.log('Cancel');
    //         },
    //     });
    // };

    // const handleFindmember = (values) => {
    //     const findmember = memberList.find((member) => member.c_tel === values);
    //     if (findmember) {
    //         showDeleteConfirm(findmember);
    //     }
    // };

    // const handleUpdateMember = async () => {
    //     // console.log(values)
    //     await fecthMembers()
    //     setUpdateMember(null)
    // }

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Password',
            dataIndex: 'user_password',
            key: 'user_password',
        },
        {
            title: 'First Name',
            dataIndex: 'user_fname',
            key: 'user_fname',
        },
        {
            title: 'Last Name',
            dataIndex: 'user_lname',
            key: 'user_lname',
        },
        {
            title: 'Tel',
            dataIndex: 'user_tel',
            key: 'user_tel',
        },
        {
            title: 'ID Card',
            dataIndex: 'user_id_card',
            key: 'user_id_card',
        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            key: 'role_type',
        },
        {
            title: 'Status',
            dataIndex: 'user_status',
            key: 'user_status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button
                        className="bntEdit "
                        type="primary"
                        // onClick={() => setEditOwnerId(record.user_id)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        type="primary"
                    // onClick={() => setDeleteOwnerId(record.user_id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    return (
        <div className="content-box">
            <section className='members'>
                EMPLOYEE
            </section>

            <section className='memberlist'>
                EMPLOYEE LIST
            </section>

            {/* <InsertMember refreshMembers={fecthMembers} /> */}
            <InsertEmployee
                refreshEmployee={fetchEmployees()}
            />

            <button className='btnSearch'>SEARCH</button>

            <section className='tableContent'>
                <Table
                    columns={columns}
                    dataSource={employeeList}
                    rowKey="user_id"
                    bordered
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 390 }}
                />
            </section>

            {updateMember && (
                <>
                </>
                // <EditMember
                //     member={memberList.find((member) => member.c_tel === updateMember)}
                //     update={handleUpdateMember}
                // />
            )}
        </div>


    );
}

export default Employee;

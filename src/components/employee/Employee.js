import { useEffect, useState } from 'react';
import './employee.css';
import { Space, Table, Modal } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import InsertEmployee from './InsertEmployee';
import './employee.css'
import UpdateEmployee from './UpdateEmployee';

function Employee() {

    const [employeeList, setEmployeeList] = useState()
    const [userList, setUserList] = useState()
    const [employeeId, setEmployeeId] = useState()

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            const filteredEmployee = res.data.filter(employee => employee.role_type === "E");
            setEmployeeList(filteredEmployee);
            setUserList(res.data)
        } catch (error) {
            console.log("Cannot fetch fetchEmployees", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showDeleteConfirm = (value) => {

        const findemployee = employeeList.find((employee) => employee.user_id === value);
        if (findemployee) {
            Modal.confirm({
                title: `Are you sure delete Member?`,
                centered: true,
                icon: <ExclamationCircleFilled />,
                content: `Employee : ${findemployee.user_fname} ${findemployee.user_lname}`,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                async onOk() {
                    try {
                        await axios.delete(`http://localhost:5000/api/users/${findemployee.user_id}`);
                        console.log('OK');
                        fetchEmployees();
                    } catch (error) {
                        console.error('Error deleting employee:', error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        else {
            console.log('no employee')
        }
    };


    const handleUpdateEmployee = async () => {
        // console.log(values)
        await fetchEmployees()
        setEmployeeId(null)
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 50,
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'ID',
            dataIndex: 'user_id',
            key: 'user_id',
            width: 80,
            align: 'center',  // จัดข้อความกลาง
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
            align: 'center',  // จัดข้อความกลางwidth: 120,

        },
        {
            title: 'ID Card',
            dataIndex: 'user_id_card',
            key: 'user_id_card',
            align: 'center',  // จัดข้อความกลางwidth: 140,


        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            key: 'role_type',
            width: 70,
            align: 'center',  // จัดข้อความกลาง
        },
        {
            title: 'Status',
            dataIndex: 'user_status',
            key: 'user_status',
            width: 80,
            align: 'center',  // จัดข้อความกลาง

        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',  // จัดข้อความกลางwidth: 200,

            render: (text, record) => (
                <>
                    <Button
                        className="bntEdit "
                        type="primary"
                        onClick={() => setEmployeeId(record.user_id)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => showDeleteConfirm(record.user_id)}

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

            <InsertEmployee
                refreshEmployee={fetchEmployees}
                userList={userList}
            />

            <button className='btnSearch'>SEARCH</button>

            <section className='tableContent'>
                <Table
                    columns={columns}
                    dataSource={employeeList}
                    rowKey="user_id"
                    bordered
                    pagination={{ pageSize: 50 }}
                // scroll={{ y: 390 }}
                />
            </section>

            {employeeId && (
                <UpdateEmployee
                    employee={employeeList.find((employee) => employee.user_id === employeeId)}
                    update={handleUpdateEmployee}
                />
            )}

        </div>



    );
}

export default Employee;

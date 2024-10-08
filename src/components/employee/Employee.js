import { useEffect, useState } from 'react';
import './employee.css';
import { Space, Table, Modal, Input } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import InsertEmployee from './InsertEmployee';
import './employee.css'
import UpdateEmployee from './UpdateEmployee';
import { useUser } from '../user/UserContext'
import { useNavigate } from 'react-router-dom';


function Employee() {
    const [employeeList, setEmployeeList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [employeeId, setEmployeeId] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const [token, setToken] = useState();


    useEffect(() => {
        if (!user) {
            navigate('/protected');
        } else {
            if (user.role_type === 'O' || user.role_type === 'o') {
                navigate('/employee');
            } else {
                navigate('/protected');
            }
        }
    }, [user, navigate]);
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setToken(token);
        } else {
            navigate("/");
        }
    }, [token, navigate]);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            const filteredEmployee = res.data.filter(employee => employee.role_type === "E");
            setEmployeeList(filteredEmployee);
            setUserList(res.data);
        } catch (error) {
            console.log("Cannot fetch employees", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showDeleteConfirm = (value) => {
        const findemployee = employeeList.find((employee) => employee.user_id === value);
        if (findemployee) {
            Modal.confirm({
                title: `Are you sure you want to delete this employee?`,
                centered: true,
                icon: <ExclamationCircleFilled />,
                content: `Employee: ${findemployee.user_fname} ${findemployee.user_lname}`,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                async onOk() {
                    try {
                        await axios.delete(`http://localhost:5000/api/users/${findemployee.user_id}`);
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
    };

    const handleUpdateEmployee = async () => {
        await fetchEmployees();
        setEmployeeId(null);
    };

    const handleSearchToggle = () => {
        setShowSearchInput(!showSearchInput);
    };

    // Filter employees based on search term (checks both name and phone number)
    const filteredEmployees = employeeList.filter((employee) =>
        `${employee.user_fname} ${employee.user_lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user_tel.includes(searchTerm)
    );

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 50,
            align: 'center',
        },
        {
            title: 'ID',
            dataIndex: 'user_id',
            key: 'user_id',
            width: 80,
            align: 'center',
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
            align: 'center',
            width: 120,
        },
        {
            title: 'ID Card',
            dataIndex: 'user_id_card',
            key: 'user_id_card',
            align: 'center',
            width: 140,
        },
        {
            title: 'Role',
            dataIndex: 'role_type',
            key: 'role_type',
            width: 70,
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'user_status',
            key: 'user_status',
            width: 80,
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 200,
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
            <section className='employee'>EMPLOYEE</section>
            <section className='employeelist'>EMPLOYEE LIST</section>

            <InsertEmployee refreshEmployee={fetchEmployees} userList={userList} />

            <Button className='btnSearchemp' onClick={handleSearchToggle}>
                {showSearchInput ? 'CLOSE SEARCH' : 'SEARCH'}
            </Button>

            {showSearchInput && (
                <Input
                    className='inputSearchemp'
                    placeholder="Search by name or phone number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 0' }}
                />
            )}

            <section className='tableContent'>
                <Table
                    columns={columns}
                    dataSource={filteredEmployees}
                    rowKey="user_id"
                    bordered
                    pagination={{ pageSize: 50 }}
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

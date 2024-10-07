import { useEffect, useState } from 'react';
import './Members.css';
import { Space, Table, Modal, Input } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import InsertMember from './InsertMember';
import EditMember from './EditMember';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

function Members() {
    const [memberList, setMemberList] = useState([]);
    const [member, setMember] = useState();
    const { user } = useUser();
    const [updateMember, setUpdateMember] = useState();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    const handleSearch = () => {
        // Toggle visibility of search input
        setShowSearchInput(!showSearchInput);
    };

    // Filter members by name and phone number
    const filteredMembers = memberList.filter(member => 
        member.c_tel.includes(searchTerm) ||
        member.c_fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.c_lname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(user);
    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members');
            setMemberList(res.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const showDeleteConfirm = (value) => {
        Modal.confirm({
            title: `Are you sure delete Member?`,
            icon: <ExclamationCircleFilled />,
            centered: true,
            content: `Member : ${value.c_fname} ${value.c_lname}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await axios.delete(`http://localhost:5000/api/members/${value.c_id}`);
                    console.log('OK');
                    // Update member list after deletion
                    fetchMembers();
                } catch (error) {
                    console.error('Error deleting member:', error);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleFindMember = (values) => {
        const findMember = memberList.find((member) => member.c_tel === values);
        if (findMember) {
            showDeleteConfirm(findMember);
        }
    };

    const handleUpdateMember = async () => {
        await fetchMembers();
        setUpdateMember(null);
    };

    const columns = [
        {
            title: 'NO',
            dataIndex: 'no',
            width: 80,
        },
        {
            title: 'NAME',
            dataIndex: 'name',
        },
        {
            title: 'TEL',
            dataIndex: 'tel',
        },
        {
            title: 'POINT',
            dataIndex: 'point',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        className='btnAction'
                        type="primary" ghost
                        onClick={() => {
                            setUpdateMember(record.tel);
                        }}
                    >
                        EDIT
                    </Button>
                    <Button
                        className='btnAction'
                        danger
                        onClick={() => {
                            handleFindMember(record.tel);
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const data = filteredMembers.map((member, index) => ({
        key: index,
        no: index + 1,
        name: `${member.c_fname} ${member.c_lname}`,
        tel: member.c_tel,
        point: member.c_points,
        status: member.c_status,
        id: member.c_id,
    }));

    return (
        <div className="content-box">
            <section className='membersPage'>
                MEMBERS
            </section>

            <section className='memberlist'>
                MEMBER LIST
            </section>

            <InsertMember refreshMembers={fetchMembers} />

            <Button className='btnSearchCus' onClick={handleSearch}>
                {showSearchInput ? 'CLOSE SEARCH' : 'SEARCH'}
            </Button>

            {showSearchInput && (
                <Input
                className='inputSearch'
                    placeholder="Enter phone number or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 0' }}
                />
            )}

            <section className='tableContent'>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 390 }}
                />
            </section>

            {updateMember && (
                <EditMember
                    member={memberList.find((member) => member.c_tel === updateMember)}
                    update={handleUpdateMember}
                />
            )}
            <Button
                className="backPage"
                onClick={() => {
                    navigate('/orders');
                }}
                icon={<ArrowLeftOutlined />}
                type="primary"
            >
                Back
            </Button>
        </div>
    );
}

export default Members;

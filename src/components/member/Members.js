import { useEffect, useState } from 'react';
import './Members.css';
import { Space, Table, Modal } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import InsertMember from './InsertMember';
import EditMember from './EditMember';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useUser } from '../user/UserContext';
function Members() {
    const [memberList, setMemberList] = useState([]);
    const [member, setMember] = useState();
    const { user } = useUser();
    const [updateMember, setUpdateMember] = useState()


    console.log(user)
    const fecthMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members');
            setMemberList(res.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useEffect(() => {
        fecthMembers();
        // console.log(memberList)
    }, []);

    const showDeleteConfirm = (value) => {
        Modal.confirm({
            title: `Are you sure delete Member?`,
            icon: <ExclamationCircleFilled />,
            content: `Member : ${value.c_fname} ${value.c_lname}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await axios.delete(`http://localhost:5000/api/members/${value.c_id}`);
                    console.log('OK');
                    // Update member list after deletion
                    fecthMembers();
                } catch (error) {
                    console.error('Error deleting member:', error);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleFindmember = (values) => {
        const findmember = memberList.find((member) => member.c_tel === values);
        if (findmember) {
            showDeleteConfirm(findmember);
        }
    };

    const handleUpdateMember = async () => {
        // console.log(values)
        await fecthMembers()
        setUpdateMember(null)
    }

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
                            handleFindmember(record.tel);
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const data = memberList.map((member, index) => ({
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
            <section className='members'>
                MEMBERS
            </section>

            <section className='memberlist'>
                MEMBER LIST
            </section>

            <InsertMember refreshMembers={fecthMembers} />

            <button className='btnSearch'>SEARCH</button>

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
        </div>


    );
}

export default Members;

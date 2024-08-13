import { useEffect, useState } from 'react';
import './Members.css'
import { Space, Table } from 'antd';
import axios from 'axios';
import { Button } from 'antd';


function Members() {
    const [memberList, setMemberList] = useState([])

    const fecthMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members')
            setMemberList(res.data)
            // console.log(res.data[0].c_id)
        } catch (error) {
            console.error('Error fetching members:', error)
        }
    }

    useEffect(() => {
        fecthMembers()
    }, [])



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
                    <Button className='btnAction' type="primary" ghost>
                        EDIT
                    </Button>
                    <Button className='btnAction' type="primary" danger ghost>
                        DELETE
                    </Button>

                </Space >
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



    // const data = [];
    // for (let i = 0; i < 100; i++) {
    //   data.push({
    //     key: i,
    //     name: `Edward King ${i}`,
    //     age: 32,
    //     address: `London, Park Lane no. ${i}`,
    //   });
    // }

    return (
        <div className="content-box">
            <section className='members'>
                MEMBERS
            </section>

            <section className='memberlist'>
                MEMBER LIST
            </section>

            <button className='btnAdd'>
                ADD MEMBER
            </button>

            <button className='btnSearch'>
                SEARCH
            </button>

            <section className='tableContent'>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        pageSize: 50,
                    }}
                    scroll={{
                        y: 390,
                    }}
                />

            </section>
        </div>
    )
}

export default Members

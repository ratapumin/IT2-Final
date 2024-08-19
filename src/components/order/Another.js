import { Link } from 'react-router-dom'

function Another() {



    return (
        <>

            <button className="btn-member">
                <Link to='/members' className='memberLink'>
                    MEMBER
                </Link>

            </button>
        </>
    )

}

export default Another;
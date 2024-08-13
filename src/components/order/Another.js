import { Link } from 'react-router-dom'
import Cash from './cash/Cash';

function Another() {



    return (
        <>
                {/* <Cash /> */}

            <button className="btn-member">
                <Link to='/members' className='memberLink'>
                    MEMBER
                </Link>

            </button>
        </>
    )

}

export default Another;
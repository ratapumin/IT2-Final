import './Cashmoney.css';

function Cashmoney() {
    const countNum = () => {
        const number = [];
        for (let i = 1; i <= 9; i++) {
            number.push(i);
        }
        return number;
    };

    return (
        <div>


            <section className='flexinput'>
                <label className='labelCash'>CASH</label>
                <input type="text" />
            </section>

            <section >
                <div className="flexNum">
                    {countNum().map(num => (
                        <button className="butN" key={num}>
                            {num}
                        </button>
                    ))}
                    <button className="butN">Delete</button>
                    <button className="butN">0</button>
                    <button className="butN">Enter</button>
                </div>




            </section>

        </div>
    );
}

export default Cashmoney;

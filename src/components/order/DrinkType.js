
function DrinkType({ selectedType, onTypeClick }) {

    const types = ['Coffee', 'Tea', 'Chocolate', 'Member','Close Daily'];



    return (
        <div className="menu-drink">
            {types.map(type => (
                <h2
                    key={type}
                    className="drink-type"
                    style={{
                        backgroundColor: selectedType === type ? '#FFE8A3' : 'initial',
                        border: `solid ${selectedType === type ? '#FFCD2B' : 'transparent'}`
                    }}
                    onClick={() => onTypeClick(type)}
                >
                    {type}
                </h2>
            ))}
        </div>
    );

}
export default DrinkType
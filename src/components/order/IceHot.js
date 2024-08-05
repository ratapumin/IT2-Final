


const IceHot = ({ selectedType, onTypeClick }) => {

    const categories = ['ICE', 'HOT']

    return (

        <section className="ice-hot">
            {categories && categories.map(category => (
                <h2
                    key={category}
                    className="icehot-box"
                    style={{
                        backgroundColor: selectedType === category ? '#BDE3FF' : category === 'HOT' ? '#FF8C82' : 'initial',
                        border: `solid ${selectedType === category ? '#0D99FF' : category === 'HOT' ? '#F24822' : 'transparent'}`
                    }}
                    onClick={() => onTypeClick(category)}
                >
                    {category}
                </h2>
            ))}
        </section>
    )

}

export default IceHot
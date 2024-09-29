import React from 'react';

const IceHot = ({ selectedCategory, onCategoryClick }) => {
    const categories = ['ICE', 'HOT'];

    return (
        <section className="ice-hot">
            {categories.map(category => {
                const isSelected = selectedCategory === category;
                const backgroundColor = category === 'ICE' ? (isSelected ? '#BDE3FF' : '#FFFFFF') : (isSelected ? '#FF8C82' : '#FFFFFF');
                const borderColor = category === 'ICE' ? (isSelected ? '#0D99FF' : '#FFFFFF') : (isSelected ? '#F24822' : '#FFFFFF');

                return (
                    <h2
                        key={category}
                        className="icehot-box"
                        style={{
                            backgroundColor: backgroundColor,
                            border: `solid ${borderColor}`
                        }}
                        onClick={() => onCategoryClick(category)}
                    >
                        {category}
                    </h2>
                );
            })}
        </section>
    );
};

export default IceHot;

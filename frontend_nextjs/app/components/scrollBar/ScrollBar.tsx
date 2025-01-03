'use client';
import React, { useState, ChangeEvent, useRef } from 'react';
import styles from "../Home.module.css";
import AllElement from './ScrollableOptions';
import RowElement from './ScrollableRows';

const ScrollBar: React.FC = () => {
    const [isSelected, setIsSelected] = useState<boolean>(false); // Moved inside

    let secondaryElement = null;
    if (isSelected) {
        secondaryElement = <RowElement />;
    }

    return (
        <div className={styles.parent}>
            <div className={styles.child}>
                <AllElement setIsSelected={setIsSelected} />
            </div>
            <div className={styles.child}>
                {secondaryElement}
            </div>
        </div>
    );
};

export default ScrollBar;

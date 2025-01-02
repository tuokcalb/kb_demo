import React from 'react'
import styles from "../Home.module.css"

/**
 * Boiler Plate Table
 * @param param0 
 * @returns 
 */
function Table({data}: { data: any[] }) {
    const columns = Object.keys(data[0]); 
    return (
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {columns.map((col, index) => (
              <th 
              className={styles.th}
              key={index}>{col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr 
            key={rowIndex}
            className={styles.tr}>
              {columns.map((col, colIndex) => (
                <td 
                className={styles.td}
                key={colIndex}>{row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
export default Table;
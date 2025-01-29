import { useState, useEffect } from 'react'

export default function Library() {
    const [prices, setPrices] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data...");
            const response = await fetch('http://localhost:5001/api/prices/');
    
            if (!response.ok) {
                console.error(`Error fetching data: ${response.status}`);
                return;
            }
    
            const json = await response.json();
            setPrices(json);
        };
    
        fetchData();
    }, []);

    return (
        <div>
            <h1>Prices</h1>
            <ul>
                { prices.map((price, index) => (
                    <li key={index} style={{paddingBottom: '25px'}}>
                        <div>{price.have_currency}</div>
                        <div>{price.want_currency}</div>
                        <div>{price.have_amount}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
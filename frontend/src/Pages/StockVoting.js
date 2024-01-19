import React, { useState, useEffect } from 'react';
import '../styles/StockVoting.css';
import WebSocket from 'websocket';
import {BASE_URL} from '../utils/config'

function StockVoting() {
    const [symbol, setSymbol] = useState('');
    const validSymbols = ["GOOGL", "AAPL", "AMZN", "ADBE", "CSCO", "DELL", "HPQ", "IBM", "INTL", "INTU", "LYFT", "META", "MSFT", "NFLX", "NVDA", "ORCL", "PYPL","QCOM","SONY","TSLA","UBER"];
    const [vote, setVote] = useState('');
    const [isValidSymbol, setIsValidSymbol] = useState(false);
    const [votes, setVotes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const ws = new WebSocket.w3cwebsocket('ws://localhost:4000');
    // Create a state to hold the votes

    useEffect(() => {
        if (symbol) {
            fetch(`${BASE_URL}/validateSymbol/${symbol}`)
                .then((response) => response.json())
                .then((data) => setIsValidSymbol(data.valid));
        }
    }, [symbol]);

    useEffect(() => {
        fetch(`${BASE_URL}/votes`)
            .then((response) => response.json())
            .then((data) => setVotes(data))
            .catch((error) => console.error('Error fetching votes:', error));
    }, []);

    // Handle WebSocket messages
    useEffect(() => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'votes') {
                setVotes(data.data);
            }
        };
    }, );

    const handleVoteSubmit = () => {
        if (!symbol || !vote) {
            setErrorMessage('Please enter a valid symbol and select a vote');
            return;
        }

        const uppercaseSymbol = symbol.toUpperCase(); // Convert to uppercase for consistency
        if (!validSymbols.includes(uppercaseSymbol)) {
            setErrorMessage('Invalid symbol. Please enter one of: GOOGL, AAPL, AMZN');
            return;
        }

        fetch(`${BASE_URL}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symbol: uppercaseSymbol, vote: vote }),
        })
            .then((response) => response.json())
            .then(() => {
                setErrorMessage('');
                setSymbol('');
                setVote('');
                // Refresh vote results
                fetch(`${BASE_URL}/votes`)
                    .then((response) => response.json())
                    .then((data) => setVotes(data))
                    .catch((error) => console.error('Error fetching votes:', error));
            })
            .catch((error) => console.error('Error submitting vote:', error));
    };

    return (
        <div className="App">
            <h1>User Polling</h1>
            <div>
                <input
                    type="text"
                    placeholder="Stock Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                />
                <button onClick={handleVoteSubmit}>Validate Symbol</button>
                {isValidSymbol && (
                    <div>
                        <select value={vote} onChange={(e) => setVote(e.target.value)}>
                            <option value="">Select Vote</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </select>
                        <button onClick={handleVoteSubmit}>Submit Vote</button>
                    </div>
                )}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            <h2>Vote Results</h2>
            <table>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Buy Votes</th>
                    <th>Sell Votes</th>
                </tr>
                </thead>
                <tbody>
                {votes.map((vote) => (
                    <tr key={vote._id}>
                        <td>{vote._id}</td>
                        <td>{vote.buyCount}</td>
                        <td>{vote.sellCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockVoting;

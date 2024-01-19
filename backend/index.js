import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routers/auth.js'
import userRoute from './routers/users.js'
import subRoute from './routers/newsletter.js'
import mongoose from "mongoose";
import Vote from './models/StockVoting.js';
import { WebSocketServer } from "ws";
import request from 'request'
import axios from 'axios'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())


// const _dirname = path.dirname(new URL(import.meta.url).pathname);

// app.use(express.static("static"));



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// console.log(__dirname);


// // const __dirname = path.dirname("")
// const buildPath = path.join(__dirname  , "../frontend/build");

// app.use(express.static(buildPath))

// app.get("/*", function(req, res){

//     res.sendFile(
//         path.join(__dirname, "../frontend/build/index.html"),
//         function (err) {
//           if (err) {
//             res.status(500).send(err);
//           }
//         }
//       );

// })


const port = process.env.PORT || 4000
const MONGO_URI = process.env.REACT_APP_MONGO_URI;
 const corsOptions = {
     origin: true,
     credentials: true
 }

 const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: 'majority'
    }
  };
  
app.get("/", (req,res)=> {
    res.send("api is running");
})

mongoose.connect(MONGO_URI,options).then(r =>
console.log("DataBase is Connected"))

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/newsletter', subRoute);


const validSymbols = ["GOOGL", "AAPL", "AMZN", "ADBE", "CSCO",
    "DELL", "HPQ", "IBM", "INTL", "INTU", "LYFT", "META", "MSFT",
    "NFLX", "NVDA", "ORCL", "PYPL", "QCOM", "SONY", "TSLA", "UBER"];

// Yahoo Finance symbol validation
app.get('/api/v1/validateSymbol/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase(); // Convert to uppercase for case-insensitivity
    if (validSymbols.includes(symbol)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false, error: 'Invalid symbol' });
    }
});



// Submit a vote
app.post('/api/v1/vote', async (req, res) => {
    const { symbol, vote } = req.body;

    // Check if the symbol is valid
    if (!validSymbols.includes(symbol)) {
        return res.status(400).json({ error: 'Invalid symbol' });
    }

    try {
        // Store the vote in MongoDB
        const newVote = new Vote({ symbol, vote });
        await newVote.save();

        return res.json({ message: 'Vote submitted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error submitting vote' });
    }
});

// Get all votes with counts
app.get('/api/v1/votes', async (req, res) => {
    try {
        const votes = await Vote.aggregate([
            {
                $group: {
                    _id: '$symbol',
                    buyCount: {
                        $sum: { $cond: [{ $eq: ['$vote', 'buy'] }, 1, 0] },
                    },
                    sellCount: {
                        $sum: { $cond: [{ $eq: ['$vote', 'sell'] }, 1, 0] },
                    },
                },
            },
        ]);

        res.json(votes);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching votes' });
    }
});

app.get('/api/v1/get_stock_prediction/:stock_symbol', async(req, res) => {

    try {
        const stock_symbol = req.params.stock_symbol;
        const flaskAppURL = 'http://127.0.0.1:5000/';

        const stock_prediction = await axios.get(`${flaskAppURL}/predict/${stock_symbol}`);
        res.status(200).json(stock_prediction.data);

    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});

const wss = new WebSocketServer({ noServer: true });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Whenever a new vote is submitted, broadcast the updated votes
    Vote.watch().on('change', () => {
        Vote.aggregate([
            {
                $group: {
                    _id: '$symbol',
                    buyCount: {
                        $sum: { $cond: [{ $eq: ['$vote', 'buy'] }, 1, 0] },
                    },
                    sellCount: {
                        $sum: { $cond: [{ $eq: ['$vote', 'sell'] }, 1, 0] },
                    },
                },
            },
        ])
            .then((votes) => {
                const message = JSON.stringify({ type: 'votes', data: votes });
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocketServer.OPEN) {
                        client.send(message);
                    }
                });
            })
            .catch((error) => {
                console.error('Error aggregating votes:', error);
            });
    });
});


// Get stock data from Flask App
app.get('/api/v1/get_stock_data/:stock_symbol', async(req, res) => {

    try {
        const stock_symbol = req.params.stock_symbol;
        const flaskAppURL = 'http://127.0.0.1:5000/';

        const stock_data = await axios.get(`${flaskAppURL}/get_stock_data/${stock_symbol}`);
        res.status(200).json(stock_data.data);
    } catch (error) {
        res.status(500).send(error);
    }



app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

})
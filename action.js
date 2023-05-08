import express from "express";
import fetch from 'node-fetch';
const router = express.Router();

/*
The function sum all death and positive for each state in all days
Note: The funcion not in use
Input: covidData the covid data for all countrry in each day
Output: a map of keys of state and value of death and positive data
*/
const mergeDays = (covidData) => {
    const states = new Map();
    for (let covRec of covidData) {
        if (states[covRec.state]) {
            states[covRec.state].death += covRec.death;
            states[covRec.state].positive += covRec.positive;
        }
        else {
            states[covRec.state] = {
                death: covRec.death,
                positive: covRec.positive
            }
        }
    }
    return states;
}



const getTopDeaths = (covidData) => {
    // sort by deathes
    covidData = covidData.sort((recA, recB) => recB.death - recA.death);

    let topDeaths = new Array();
    for (let i = 0; i < 10; i++) {
        covidData[0].date = String(covidData[0].date);
        topDeaths.push({
            date: covidData[0].date.slice(6, 8) + '/' + covidData[0].date.slice(4, 6) + '/' + covidData[0].date.slice(0, 4),
            state: covidData[0].state,
            death: covidData[0].death
        });
        covidData = covidData.filter(rec => rec.state != covidData[0].state);
    }
    return topDeaths;
}

const getTopPositive = (covidData) => {
    // sort by positive
    covidData = covidData.sort((recA, recB) => recB.positive - recA.positive);

    let topPositives = new Array();
    for (let i = 0; i < 10; i++) {
        covidData[0].date = String(covidData[0].date);
        topPositives.push({
            date: covidData[0].date.slice(6, 8) + '/' + covidData[0].date.slice(4, 6) + '/' + covidData[0].date.slice(0, 4),
            state: covidData[0].state,
            positive: covidData[0].positive
        });
        covidData = covidData.filter(rec => rec.state != covidData[0].state);
    }
    return topPositives;
}

router.get('/getData/', async (req, res) => {
    const responseFromServer = await fetch("https://api.covidtracking.com/v1/states/daily.json",
        { method: 'get' });
    const covidData = await responseFromServer.json();
    return res.status(200).json(
        {
            topDeath: getTopDeaths(covidData),
            topPositive: getTopPositive(covidData)
        }
    );
}
)

export default router;
import express from "express";
import fetch from 'node-fetch';
const router = express.Router();

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



const getTopDeaths = (states) => {
    // sort by deathes
    states = Array.from(Object.entries(states), ([state, data]) => (
        {
            state: state, death: data.death
        }
    ));

    states.sort((stateA, stateB) => stateB.death - stateA.death);

    // return top ten
    return states.slice(0, 10).map((state) => {
        return {
            state: state.state,
            death: state.death
        }
    });
}

const getTopPositive = (states) => {
    // sort by positive
    states = Array.from(Object.entries(states), ([state, data]) => (
        {
            state: state, positive: data.positive
        }
    ));

    states.sort((stateA, stateB) => stateB.positive - stateA.positive);

    // return top ten
    return states.slice(0, 10).map((state) => {
        return {
            state: state.state,
            positive: state.positive
        }
    });
}

router.get('/getData/', async (req, res) => {
    const responseFromServer = await fetch("https://api.covidtracking.com/v1/states/daily.json",
        { method: 'get' });
    const covidData = await responseFromServer.json();
    const states = mergeDays(covidData)
    return res.status(200).json(
        {
            // mergeDays: states
            topDeath: getTopDeaths(states),
            topPositive: getTopPositive(states)
        }
    );
}
)

export default router;
const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    const { bucketXCapacity, bucketYCapacity, measureAmount } = req.body;
    console.log("requestBody: ", req.body);

    const response = findMinSteps(bucketXCapacity, bucketYCapacity, measureAmount);

    if(response === -1){
        res.status(400);
        return res.json({ "minStepsToMeasureWater": "No Solution" } );
    }

    console.log("minimum number of steps required to measure water is ", response);

    return res.json({ "minStepsToMeasureWater": response } );
});

const findMinSteps = (i, j, d) => {
    if (i > j) {
        let temp = i;
        i = j;
        j = i;
    }

    if (d > j) {
        return -1;
    }

    if ((d % getGCD(j, i)) !== 0) {
        return -1;
    }

    return Math.min(pourWater(j, i, d), pourWater(i, j, d));
}

const getGCD = (x, y) => {
    if(y === 0){
        return x;
    }
    return getGCD(y, x % y);
}

const pourWater = (fromCapacity, toCapacity, d) => {
    console.log("pouring water fromCapacity: ", fromCapacity, " toCapacity: ", toCapacity);

    let fromCap = fromCapacity;
    let toCap = 0;

    let reqStep = 1;

    while (fromCap !== d && toCap !== d) {
        let maxPour = Math.min(fromCap, toCapacity - toCap);

        toCap = toCap + maxPour;
        fromCap = fromCap - maxPour;

        reqStep++;

        if (fromCap === d || toCap === d){
            break;
        }

        if (fromCap === 0) {
            console.log("fill capacity: ", fromCapacity);
            fromCap = fromCapacity;
            reqStep++;
        }

        if (toCap === toCapacity) {
            console.log("empty to capacity: ", toCapacity);
            toCap = 0;
            reqStep++;
        }
    }
    return reqStep;
}

app.listen(3200, () => {
    console.log(`Express started at http://localhost:3200`);
});

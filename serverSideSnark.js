const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const app = express();
const port = 3000;
const cors = require('cors');
const util = require('util');
const execAsync = util.promisify(require('child_process').exec);

// Use cors middleware to allow cross-origin requests
app.use(cors());

app.use(bodyParser.json());

app.post('/generate-proof', async (req, res) => {

    const inputData = req.body;

    fs.writeFileSync('./circuits/verifier_js/input.json', JSON.stringify(inputData));

    exec('node ./circuits/verifier_js/generate_witness.js ./circuits/verifier_js/verifier.wasm ./circuits/verifier_js/input.json ./circuits/verifier_js/witness.wtns', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error generating witness: ${stderr}`);
        }

        // Generate proof using the witness
        exec('snarkjs groth16 prove ./circuits/verifier_0001.zkey ./circuits/verifier_js/witness.wtns ./circuits/proof.json ./circuits/public.json', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send(`Error generating proof: ${stderr}`);
            }
        });
    });
    exec('snarkjs generatecall ./circuits/public.json ./circuits/proof.json', (error, stdout, stderr) => {
        exec('node callWithdraw.js ' + JSON.stringify((stdout = stdout.split('\n'))[0]), (_error, stdout) => {
            console.log(stdout);
            res.status(200).json({ result: stdout });
        });
    });
});

app.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
});



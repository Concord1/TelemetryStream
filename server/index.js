const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

    const html = `


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Accelerometer Demo</title>
        <style>
            .card {
            padding: 10px;
            background-color: rgb(133, 130, 130);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            width: 300px;
            margin: auto;
            display: flex;
        flex-direction: column;
        align-items: center;
        }
        .card h2,
    .card p {
        color: #FFFFFF;
        font-family: system-ui;
        text-align: center;
        margin: 5px 0;
    }

        h1 {
            color: #FFFFFF;
            font-family: system-ui;
            margin-left: 20px;
        }

        h2 {
            color: #FFFFFF;
            font-family: system-ui;
            margin-left: 20px;
        }

        p {
            color: #FFFFFF;
            font-family: system-ui;
            margin-left: 20px;
        }

        body {
            background-color: #222629;
        }

        label {
            color: #86C232;
            font-family: system-ui;
            font-size: 20px;
            margin-left: 20px;
            margin-top: 20px;
        }

        button {
            background-color: #86C232;
            border-color: #86C232;
            color: #FFFFFF;
            font-family: system-ui;
            font-size: 20px;
            font-weight: bold;
            margin-left: 30px;
            margin-top: 20px;
            width: 140px;
        }

        input {
            color: #222629;
            font-family: system-ui;
            font-size: 20px;
            margin-left: 10px;
            margin-top: 20px;
            width: 100px;
        }

        #result {
            color: #FFFFFF;
        }
         </style>
         <script>
            // todo connect with dynamo to see if the generated code already exists in the db
            function generateCode(){
                const codeDisplay = document.getElementById('uniqueCode');
                let code = localStorage.getItem('deviceCode');
                if (!code) {
                    // Generate a new code if it doesn't exist in local storage
                    let x = Math.floor((Math.random() * 100) + 1);
                    return x;
                }

                codeDisplay.textContent = \`Code: ${code}\`;
                return code;

            }

            async function posttoDynamo(x, y, z, code){
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const data = { "x":x, "y":y, "z":z, "code":code }
                var raw = JSON.stringify(data);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                // make API call with parameters and use promises to get response
                const res = await fetch(process.env.SEND_TO_DYNAMODB_API, requestOptions)
                .catch(error => console.log('error', error));

            }
            var t = true;
            function stopAccel(){
                window.removeEventListener('deviceorientation', event)
                t = false;
            }
            function getAccel(){
                t = true;
                // Check for mobile user
                var mobileUser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                var permis = 'granted';
                if(mobileUser){
                    DeviceMotionEvent.requestPermission().then(response => {
                    permis = response;
                    });
                }                                
                if (permis == 'granted') {
                    const code = generateCode();

                    let lastApiCallTime = 0;
                    var x,y,z = 0.00
                    window.addEventListener('deviceorientation',(event) => {
                        const currentTime = Date.now();
                        const timeSinceLastCall = currentTime - lastApiCallTime;
                        const apiCallDelay = 500; // Delay in milliseconds (twice per second)                      
                            if(t){
                            x = event.alpha;
                            y = event.beta;
                            z = event.gamma;

                            var xElement = document.getElementById("x");
                            var yElement = document.getElementById("y");
                            var zElement = document.getElementById("z");

                            xElement.textContent = "X: " + x.toFixed(2);
                            yElement.textContent = "Y: " + y.toFixed(2);
                            zElement.textContent = "Z: " + z.toFixed(2);
                            }

                            if (timeSinceLastCall >= apiCallDelay && t) {
                                lastApiCallTime = currentTime;
                                console.log("OK")
                                posttoDynamo(x.toFixed(2), y.toFixed(2), z.toFixed(2), code);
                        }
                    });
                    }
                else{
                    const codeDisplay = document.getElementById('uniqueCode');
                    codeDisplay.textContent = 'Unable to access accelerometer.';
                    console.log("Unable to access accelerometer.")
                }
            }

         </script>
    </head> 
    <center>
        <h1>Send telemetry here.</h1>
    </center>
    <hr>
    <br>
    <br>      
        <div class="card">
            <h2>Gyroscope Values</h2>
            <p id="x">X: </p>
            <p id="y">Y: </p>
            <p id="z">Z: </p>
        </div>
        <center>
            <p id="uniqueCode">Code: Press start to create code.</p>
            <button type="button" onclick="getAccel()">START</button>
            <button type="button" onclick="stopAccel()">STOP</button>
        </center>
        
    </body>
</html>





    
  `;

  res.end(html);
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

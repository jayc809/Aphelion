## visit https://jayc809-aphelion.com/ for the game


### setting up locally (run server on heroku, no controll server-side)

run frontend 
1. make new terminal
2. `cd frontend`
3. `npm install` 
4. `npm run build`

run backend
1. make new terminal
2. `npm install`
3. `npm run dev`


### setting up locally (run server on localhost, full controll)

run frontend
1. go to `AnalyzerView.js` in `frontend` and change `const socket = socketIOClient("https://jayc809-aphelion.com")` to `const socket = socketIOClient("http://localhost:5000")`
2. make new terminal
3. `cd frontend`
4. `npm install`
5. `npm run build`

run backend
1. make new terminal
2. `npm install`
3. `npm run dev`

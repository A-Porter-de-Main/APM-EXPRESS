import express from "express";
import userRouter from "./routes/user.routes";

const app = express()
const port = process.env.PORT || 80;

app.use(express.json())
app.use(userRouter)

app.get("/ping", (req, res) => {
  res.json({message: "pong"})
})

app.listen(port, () =>{
  console.log(`Server running on http://localhost:${port}`)
})
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()
const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));

const flowSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description:{
        type: String
    },
    priority:{
        type:String,
        required:true,
        enum:["low","medium","high","urgent"]
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
    
});
const FlowSlot = mongoose.model("TaskSlot",flowSchema);

app.post('/api/tasks',(req,res)=>{
    const {title,description,priority} = req.body;

    if (!title||description==null||!priority){
        return res.status(400).json({message: "Title, Description and Priority is required"})
    }

    const flowItem = new FlowSlot({ title, description,priority});
    flowItem.save()
    .then(savedItem => {
        res.status(201).json({message: "Item added successfully", item: savedItem})
    })
    .catch(err => {
        res.status(500).json({message: "Error adding item",error: err.message});
    });
});

app.get('/api/tasks', (req, res) => {
  FlowSlot.find()
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching items", error: err.message });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
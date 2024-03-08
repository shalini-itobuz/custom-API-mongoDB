import express from 'express';
const app = express();
const PORT = 5000;
import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/weather-app').then(()=>
console.log("MongoDb connected")).catch((err)=>console.log("Failed to connect MongoDb"))
app.use(express.json());

const locationSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  region:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  },
  temp_c:{
    type:Number,
    required:true
  },
  temp_f:{
    type:Number,
    required:true
  },
  feelslike_c:{
    type:Number,
    required:true
  },
  feelslike_f:{
    type:Number,
    required:true
  },
  
})
const locationModel=mongoose.model('locationModel',locationSchema)

//mongo
app.get('/weather/:location', async (req, res) => {
  try {
    let locationName = req.params.location
    locationName = locationName[0].toUpperCase() + locationName.slice(1).toLowerCase()
    const locationData = await locationModel.findOne({ name: locationName} );

    if (locationData) {
      res.status(200).json({ data: locationData, status: 'successful', message: 'Weather data found' });
    } else {
      res.status(404).json({ status: 'error', message: 'Weather data not found for the specified location' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route post
app.post('/addweather', async (req, res) => {
  const newLocationData = req.body;
  console.log("Data added successfully");
  if (!newLocationData.name || !newLocationData.region || !newLocationData.country || !newLocationData.temp_c || !newLocationData.temp_f || !newLocationData.feelslike_c || !newLocationData.feelslike_f) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }
  newLocationData.name = newLocationData.name[0].toUpperCase() + newLocationData.name.slice(1).toLowerCase()
  const result=await locationModel.create({name:newLocationData.name,region:newLocationData.region ,country:newLocationData.country,temp_c:newLocationData.temp_c,temp_f:newLocationData.temp_f,feelslike_c:newLocationData.feelslike_c,feelslike_f:newLocationData.feelslike_f})

return  res.status(201).json({ data: result, status: 201, message: 'Weather data added successfully' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 500, message: 'Internal server error' });
});

// Route PATCH
app.patch('/weather/:location', async (req, res) => {
  try {
    let locationName = req.params.location
    locationName = locationName[0].toUpperCase() + locationName.slice(1).toLowerCase()
    const updatedLocationData = req.body;

    const result = await locationModel.findOneAndUpdate({ name: locationName }, updatedLocationData, { new: true });

    if (result) {
      res.status(200).json({ data: result, status: 'successful', message: 'Weather data updated successfully' });
    } else {
      res.status(404).json({ status: 'error', message: 'Weather data not found for the specified location' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Route DELETE
app.delete('/weather/:location', async (req, res) => {
  try {
     let locationName = req.params.location;
    locationName = locationName[0].toUpperCase() + locationName.slice(1).toLowerCase();

    const result = await locationModel.findOneAndDelete({ name: locationName });

    if (result) {
      res.status(200).json({ status: 'successful', message: 'Weather data deleted successfully' });
    } else {
      res.status(404).json({ status: 'error', message: 'Weather data not found for the specified location' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


// server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

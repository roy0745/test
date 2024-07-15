import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from './Grid';
import Charts from './Charts';



const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function Dashboard(props) {

  const classes = useStyles();
  const [plant, setPlant] = useState(8);
  const [turbine, setTurbine] = useState(0)

  const [device, setDevice] = useState([]);
  const [fault, setFault] = useState([]);

  const [deviceMap, setDeviceMap] = useState({})

  const [data, setData] = useState([]);
  const [currentDevice, setCurrentDevice] = useState([]);

  const handleChange = (event) => {
    var val = event.target.value;
    setPlant(val);
    setCurrentDevice(device.filter(device => device.asset_id === val));
    setData(fault.filter(fault => fault.asset_id === val));
    setTurbine(0);
  }

  const handleTurbine = (event) => {
    var val = event.target.value;
    setTurbine(val);

    if (val === 0) {
      // No turbine selected
      setData(fault.filter(fault => fault.asset_id === plant));
    }
    else {
      setData(fault.filter(fault => fault.asset_id === plant && fault.device_id === val));
    }
  }

  function processData() {
    const alarm = {}
    const category = {}
    var alarmArray = []
    var categoryArray = []
    for (var i = 0; i < data.length; i++) {

      alarm[data[i].code] = alarm[data[i].code] ? {freq: alarm[data[i].code]['freq'] + 1, sum: alarm[data[i].code]['sum'] + data[i].duration_seconds} : {freq: 1, sum: data[i].duration_seconds}
      category[data[i].category] = category[data[i].category] ? {freq: category[data[i].category]['freq'] + 1, sum: category[data[i].category]['sum'] + data[i].duration_seconds} : {freq: 1, sum: data[i].duration_seconds}

    }
    alarmArray = Object.keys(alarm).map(key => ({id:key, freq: alarm[key].freq, sum:alarm[key].sum}))
    categoryArray = Object.keys(category).map(key => ({id:key, freq: category[key].freq, sum:category[key].sum}))
    return [alarmArray, categoryArray]
  }
  React.useEffect(() => {
    if (device.length === 0) {
      fetch('./data/device.json'
      ,{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).then(resp => resp.json())
     .then(resp => {
       setDevice(resp)
       setCurrentDevice(resp.filter(resp => resp.asset_id === plant))
       var res = {};
       for (var i = 0; i < resp.length; i++) {
         res[resp[i].id] = resp[i].device_name;
       }
       setDeviceMap(res)
     })

     }
   }, [device, plant])

  React.useEffect(() => {
    if (fault.length === 0) {
      fetch('./data/fault.json'
      ,{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).then(resp => resp.json())
     .then(resp => {
       setFault(resp)
       setData(resp.filter(fault => fault.asset_id === plant));
     })

    }
  }, [fault, plant])

  return (
    <div>
      <FormControl className={classes.formControl}>
         <InputLabel id="select-label">Windfarm</InputLabel>
         <Select
           labelId="windfarm-label"
           id="windfarm-label"
           value={plant}
           onChange={handleChange}
         >
           <MenuItem value={8}>Minneapolis</MenuItem>
           <MenuItem value={9}>Colorado</MenuItem>
         </Select>
         <FormHelperText>Select Windfarm</FormHelperText>
       </FormControl>

       <FormControl className={classes.formControl}>
          <InputLabel id="select-label">Turbine</InputLabel>
          <Select
            labelId="turbine-label"
            id="turbine-label"
            value={turbine}
            onChange={handleTurbine}
            placeholder="None Selected"
          >
            <MenuItem value={0}> None </MenuItem>
            {currentDevice.map(currentDevice => {
              return (
                <MenuItem key={currentDevice.id} value={currentDevice.id}>
                  {currentDevice.device_name}
                </MenuItem>
              )
            }
            )}
          </Select>
          <FormHelperText>Select Turbine</FormHelperText>
        </FormControl>
       <Charts
        processed={processData()}/>
       <Grid
        deviceMap={deviceMap}
        rowData={data}/>
    </div>
  )


}

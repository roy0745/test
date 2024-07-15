import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'


import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';

import PieChartIcon from '@material-ui/icons/PieChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Charts(props) {
  const { processed } = props;
  const [alarmArray, categoryArray] = processed
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [mode, setMode] = React.useState(0);
  const [chartType, setChartType] = React.useState(0);

  function chartOptions() {
    var options = {}
    if (value === 0) {
      // alarm
      options = {
          title: {text: 'Top Alarm Codes'},
          xAxis: {type: 'category', title: {text: 'Alarm Code'}},
          legend: {enabled: false},}
      if (mode === 0) {
        // sum
        options.yAxis = {title: {text: 'Hours'}}
        options.tooltip = {pointFormat: ' <b>{point.y:.1f} hours </b><br/>'}
        options.series= [{data: alarmArray.sort((a,b) => b.sum - a.sum).map( a => ({name: a.id, y: a.sum/3600})).slice(0,10)}]
      }
      else if (mode === 1) {
        // Frequency
        options.yAxis = {title: {text: 'Frequency'}}
        options.tooltip = {pointFormat: ' <b>{point.y:.1f} counts </b><br/>'}
        options.series= [{data: alarmArray.sort((a,b) => b.freq - a.freq).map( a => ({name: a.id, y: a.freq})).slice(0,10)}]
      }
    }
    else if (value === 1) {
      // category
      options = {
        title: {text: 'Top Alarm Categories'},}
      if (mode === 0) {
        options.tooltip= {pointFormat: ' <b>{point.y:.1f} hours </b><br/>'}
        options.series= [{data: categoryArray.sort((a,b) => b.sum - a.sum).map( c => ({name: c.id, y: c.sum})).slice(0,10)}]
      }
      else if (mode === 1) {
        options.tooltip= {pointFormat: ' <b>{point.y:.1f} counts </b><br/>'}
        options.series= [{data: categoryArray.sort((a,b) => b.freq - a.freq).map( c => ({name: c.id, y: c.freq})).slice(0,10)}]
      }
    }

    // checking chart type
    if (chartType === 0) {
      // bar
      options.chart = {type: 'column'}
    }
    else if (chartType === 1) {
      // pie
      options.chart = {type: 'pie'}

    }
    return options
  }


  const handleGraphType = (event, newValue) => {
    setValue(newValue);
  };

  const handleGraphCategory = (event, newValue) => {
    setMode(newValue)
  }

  const handleBar = (event) => {
    setChartType(0);
  }
  const handlePie = (event) => {
    setChartType(1);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleGraphType} indicatorColor="primary" textColor="primary">
          <Tab label="By Code" />
          <Tab label="By Category" />
        </Tabs>
      </AppBar>
        <Grid container justify='flex-end'>

          <Box m={.5}>
            <Grid item>
              <Tooltip title = "Bar chart" placement="bottom">
                <IconButton aria-label="bar-icon" onClick={handleBar}>
                  <BarChartIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Box>

          <Box m={.5}>
            <Grid item>
              <Tooltip title = "Pie chart" placement="bottom">
                <IconButton aria-label="pie-icon" onClick={handlePie}>
                  <PieChartIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Box>

          <Grid item>
            <Tabs
              value={mode}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleGraphCategory}
            >
              <Tab label="Duration" />
              <Tab label="Frequency"/>
            </Tabs>
          </Grid>
        </Grid>

          <HighchartsReact highcharts={Highcharts} options={chartOptions()} />

    </div>
  );
}

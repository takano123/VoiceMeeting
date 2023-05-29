import React, { useEffect, useState } from 'react'
import { Bar , Radar , Line } from 'react-chartjs-2'
import { Chart, registerables ,Colors } from "chart.js"
import  './graph.css'
import Search from './search';
import axios from 'axios'

Chart.register(...registerables)
Chart.register(Colors)

const BarOptions = {
  spanGaps: true,
  scales: {
    y: {
        position: "left",

        min: 0,
        max: 100,

        ticks: {
            stepSize: 10,
        },
        title: {
            display:true,
            text: "平均値",

        },
    },
    y_right: {
        position: "right",
        min: 0,
        max: 10,
        ticks: {
            stepSize: 1,
        },
        title: {
            display:true,
            text: "日々件数",
        },
    },
    x: {
      autoSkip: true,
      maxTicksLimit: 30 
      
    },
  },
  plugins: {
    colors: {
      forceOverride: true
    }
  }

};


const RadarOptions = {
  maintainAspectRatio: false,
  scale: 
    {
      min: 0,
      max: 20,
      stepSize: 2,
    },
    plugins: {
      colors: {
        forceOverride: true
      }
    }

}


const LineOptions = {
  spanGaps: true,

  scales: {
    y: {
      min: 0,
      max: 120,
    },
    x: {
      autoSkip: true,
      maxTicksLimit: 30 
      
    },
  },
  plugins: {
    colors: {
      forceOverride: true
    }
  }

}





function Graph() {


  const [flagState,setFlagState] = useState('1')
  const [data,setData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
      },
    ],
  })

  const [graphState,setGraphState] = useState('')

  
  useEffect(() => {
    switch(flagState){
      case '1':
        setGraphState(<Radar data={data} options={RadarOptions}/>)
        break;
          

      case '2':
        setGraphState(<Line data={data} options={LineOptions}/> )
        break;

          
      case '3':
        setGraphState(<Bar data = {data} options={BarOptions}/>)
        break;
      
      default:
        break;
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[flagState,data]);



  return (
    <>
      <div className='graph'>
        {graphState}
      </div>
      <div>
        <Search setFlagState={setFlagState} setData={setData} />
      </div>
    </>
  )
}

export default Graph;
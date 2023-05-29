import React, { useEffect, useState } from 'react'
import {format} from 'date-fns'
import axios from 'axios'
import { datePickerValueManager } from '@mui/x-date-pickers/DatePicker/shared'





function Data(props) {
  const [Datas, setDatas] = useState([])
  const [graphData, setGraphData] = useState('')
  const [flagData, setFlagData] = useState('')
  const graphDates = []
  const RadarData = []
  const LineData = []
  const BarData = []
  const startDate = format(props.startDate,'yyyy/MM/dd')
  const date = new Date(startDate)

  useEffect(() => {
    //APIでデータを取得
    const getDatas = async () => {
      console.log(props.Department)
      const baseUrl = 'https://fv5enkj0rd.execute-api.ap-northeast-1.amazonaws.com/getVoiceMeetingResult'
      const result = await axios.post(baseUrl, {
        startDate: props.startDate.toISOString().slice(0,10).replace(/(\d\d\d\d)-(\d\d)-(\d\d)/g,'$1/$2/$3'),
        endDate: props.finishDate.toISOString().slice(0,10).replace(/(\d\d\d\d)-(\d\d)-(\d\d)/g,'$1/$2/$3'),
        Department: props.Department
      })
      if(result.data.Items.length > 0) {
        setDatas(result.data.Items)
      }
    }
    getDatas()
  },[props.startDate,props.finishDate,props.typeData,props.Department])


  useEffect(() => {
    if(Datas.length === 0){
      //alert('データがありません')
    }else{
      console.log(Datas)
      
      //選択されたデータタイプによってセットするデータが変わるためswitch
      switch(props.typeData){
        case '1':

          //レーダーチャート計算処理START
          props.Department.map((dep)=>{
            var calcData = Datas.filter
              (Datas =>
                dep === Datas.managingSection
              )

            const calc = calcData.map(obj => {
              const newObj = {};
              for (const key in obj) {
                if (key.startsWith("no") && (key.length === 3 || key.length === 4)) {
                  newObj[key] = obj[key];
                }
              }
              return newObj;
            });
            
            const result = {};

            for (const obj of calc) {
              for (const key in obj) {
                const num = parseInt(obj[key]);
                if (isNaN(num)) continue;
            
                if (!result[key]) {
                  result[key] = {
                    sum: 0,
                    count: 0
                  };
                }
            
                result[key].sum += num;
                result[key].count++;
              }
            }
            
            for (const key in result) {
              const average = result[key].sum / result[key].count;
              result[key] = average;
            }
            const resultArray = Object.values(result);
              
            RadarData.push({
              label:dep,
              data:resultArray
            })
          })
          //計算処理FINISH

          setGraphData(
            {
              labels: [
                'No1 年月日 3点',
                'No2 天候 3点',
                'No3 工事場所(名) 4点',
                'No4 班構成 5点',
                'No5 健康チェック 5点',
                'No6 当日の作業内容の説明 10点',
                'No7 作業員の配置と作業内容 10点',
                'No8 リスクアセスメントKYT 10点',
                'No9 安全指示(養成・安全器具の使用) 10点',
                'No10 品質等の注意・指示 10点',
                'No11 工事長指示内容の伝達 10点',
                'No12',
                'No13 安全唱和 10点',
                'No14'
              ],
              datasets: RadarData,
            }
          )

          setFlagData('1')
          break;
            
  
        case '2':
          //開始日から終了日までの一日ごとの日付を配列に格納
          while (date <= props.finishDate){
            graphDates.push(format(date,'yyyy/MM/dd')).toString()
            date.setDate( date.getDate() + 1);
          }
          var datas = []
          var matchedData = []

          //折れ線グラフ計算処理開始
          props.Department.map((dep)=>{
            var calcDatas = Datas.filter
            (Datas =>
              dep === Datas.managingSection
            )

            matchedData = graphDates.map((date) => {
              const matchingData = calcDatas.filter((d) => d.startDate === date.toString());
              if (matchingData.length === 0) {
                return { date, value: null };
              } else {
                
                const values = matchingData.map((dataPoint) => dataPoint.totalScore);
                console.log(values)
                var averageValue = values.reduce((accumulator, currentValue) => {
                  return accumulator + parseInt(currentValue);
                }, 0);
                averageValue = averageValue / values.length

                return { date, value: averageValue, length:values.length};
              }
          });      

            LineData.push({
              label:dep,
              data:matchedData.map((dataPoint) => dataPoint.value)
            })
          })


          setGraphData(
            {
              labels:matchedData.map((dataPoint) => dataPoint.date),
              datasets:LineData,
            }
          )
          //計算処理終了
          
          setFlagData('2')
          break;
          
            
        case '3':
          //開始日から終了日までの一日ごとの日付を配列に格納
          while (date <= props.finishDate){
            graphDates.push(format(date,'yyyy/MM/dd')).toString()
            date.setDate( date.getDate() + 1);
          }
          //経日のグラフはひとつの部署しか表示させない認識
          if(props.Department.length !== 1){
            alert('部署は一つだけ選択してください')
            break;
          }else{
            //計算処理開始
            props.Department.map((dep)=>{

              var calcDatas = Datas.filter
                (Datas =>
                  dep === Datas.managingSection
                )

              const matchedData = graphDates.map((date) => {
                const matchingData = calcDatas.filter((d) => d.startDate === date.toString());
                if (matchingData.length === 0) {
                  return { date, value: null };
                } else {
                  
                  const values = matchingData.map((dataPoint) => dataPoint.totalScore);
                  console.log(values)
                  var averageValue = values.reduce((accumulator, currentValue) => {
                    return accumulator + parseInt(currentValue);
                  }, 0);
                  averageValue = averageValue / values.length

                  return { date, value: averageValue, length:values.length};
                }
              });
              
                      
              BarData.push(
                {
                  type:'line',
                  label:dep ,
                  data:matchedData.map((dataPoint) => dataPoint.value),
                  yAxisID: 'y',
                }
              )
              BarData.push(
                {
                  type:'bar',    
                  label:'日々件数' ,
                  data:matchedData.map((dataPoint) => dataPoint.length),
                  yAxisID: 'y_right',
                }
              )
            })

            setGraphData(
              {
                labels: graphDates,
                datasets: BarData
              }
            )
            setFlagData('3')
            break;
          }
        
        default:
            break;
      } 
    }




    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[Datas])


  useEffect(() => {
    props.setFlagState(flagData)   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[flagData])

  useEffect(() => {
    props.setData(graphData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[graphData])
              
                
  return (
    <div>
    </div>
  )
}

export default Data
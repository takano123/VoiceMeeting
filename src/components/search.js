import React, { useEffect, useState } from 'react'
import './search.css'
import Data from './Data.js'
import {format} from 'date-fns'
import ja from 'date-fns/locale/ja'
//以下MUIのインポート
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, FormLabel } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {Checkbox ,FormControl ,FormGroup}from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

function Search(props) {
    const checkLists = [
        "SOL本部システムエンジニアリング部",
        "SOL本部コンストラクションエンジニアリング部",
        "SOL本部プロダクトエンジニアリング部",
        "社INF本部エンジニアリング部",
        "社INF本部都市土木部",
        "社INF本部ドローン・ジオソリューション部",
        "社INF本部クリーンエナジーアクセス部",
        "大国屋電機工業株式会社",
      ]

    const today = format(new Date(),'yyyy/MM/dd')

    const firstDay = format(new Date(new Date().setDate(1)),'yyyy/MM/dd')
    
      
    //開始日のData.js引き渡し用ステート
    const [startDate,setStartDate] = useState(new Date (firstDay))
    //終了日のData.js引き渡し用ステート
    const [finishDate,setFinishDate] = useState(new Date (today))
    //グラフタイプのData.js引き渡し用ステート
    const [typeData,setTypeData] = useState('1')
    //部門や人の選択のData.js引き渡し用ステート
    const [Department,setDepartment] = useState(checkLists)


    //開始日のステート
    const [value, setValue] = useState(new Date (firstDay))
    const handleChange = (newValue) => {
      setValue(newValue);
    }

     //終了日のステート
    const [value2, setValue2] = useState(new Date (today))
    const handleChange2 = (newValue) => {
      setValue2(newValue);
    }

     //グラフタイプのステート
    const [value3, setValue3] = useState('レーダーチャート')
    const handleChange3 = (newValue) => {
      setValue3(newValue.label);
    }

    //部門や人の選択(？)のステート
    const [value4,setValue4] = useState(checkLists)
    const handleChange4 = (newValue) => {
        if (value4.includes(newValue.target.value)) {
            setValue4(
                    value4.filter((checkedValue) => checkedValue !== newValue.target.value)
                );
        } else {
            setValue4([...value4, newValue.target.value]);
        }
    };


    

    //描画ボタンがクリックされたら引き渡し用ステートにデータをセット
    const setGraphStates = (graphes) => {
        setStartDate(value)
        setFinishDate(value2)
        setDepartment(value4)
        
        switch(graphes){
            case 'レーダーチャート':
                setTypeData('1')
                break;
                

            case '評価点推移グラフ':
                setTypeData('2')
                break;

                

            case '経日推移グラフ':
                setTypeData('3')
                break;

        
            default:
                break;
        }
    }

  return (
    <div className='search'>
        <div className= 'term'>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} dateFormats={{ monthAndYear: 'yyyy年MM月' }}>
                <Box sx={{ m: 2 }}>
                    <DatePicker
                    label="開始日"
                    value={value}
                    onChange={handleChange}
                    inputFormat='yyyy/MM/dd'
                    mask='____年__月__日'
                    leftArrowButtonText="前月を表示"
                    rightArrowButtonText="次月を表示"
                    renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} dateFormats={{ monthAndYear: 'yyyy年MM月' }}>
                <Box sx={{ m: 2 }}>
                    <DatePicker
                    label="終了日"
                    value={value2}
                    onChange={handleChange2}
                    inputFormat='yyyy/MM/dd'
                    mask='____年__月__日'
                    leftArrowButtonText="前月を表示"
                    rightArrowButtonText="次月を表示"
                    renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
            </LocalizationProvider>
        </div>
        
        <div className='graphType'>
            <Autocomplete
                options={[{ label: "レーダーチャート" }, { label: "評価点推移グラフ" },{label:"経日推移グラフ"}]}
                renderInput={(params) => <TextField {...params} label="グラフタイプ" />}
                onChange={(event,newValue)=>{handleChange3(newValue)}}
                value= {value3}
            />
        </div>

        <div className='target'>
            <Box>
                <FormControl>
                    <FormLabel>部署選択</FormLabel>
                    <FormGroup>
                        {checkLists.map((checkList)=>{
                            return(
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            value = {checkList}
                                            onChange={(event)=>{handleChange4(event)}} 
                                            defaultChecked
                                        />
                                    }  
                                    label={checkList}  
                                    key={checkList}
                                />
                            )
                        })}
                    </FormGroup>
                </FormControl>
            </Box>
            
        </div>

        <div className='button'>
            <Button variant="outlined" onClick={()=>setGraphStates(value3)}>グラフを描画</Button>
        </div>

        <Data 
            startDate={startDate} 
            finishDate={finishDate} 
            Department={Department}
            graph={value3} 
            setData={props.setData} 
            typeData={typeData} 
            setFlagState={props.setFlagState} 

        />
        

    </div>
  )

}


export default Search;
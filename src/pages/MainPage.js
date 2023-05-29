import Header from '../components/header';
import Graph from '../components/graph';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { spacing } from '@mui/system';



const MainPage = () => {
  return(
    <Box sx={{ flexGrow: 1 }}>
      <Header/>
      <Graph/>
    </Box>
  )
}

export default MainPage
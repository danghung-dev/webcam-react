import React from 'react';
import Webcam from "react-webcam";
import './App.css';
import {postImage} from './api'
const videoConstraints = {
  width: '100%',
  height: '50%',
  facingMode: "user"
};

const MAX_QUALITY = 150255

class App extends React.Component {
  constructor(props){
    super(props)
    this.webcamRef = React.createRef()
    this.state ={
      userName: 'No face',
      currentStatus: 1,
      currentQuatity: 1,
    }
  }
  componentDidMount (){
    this.intervalId = setInterval(this.capture, 1000);
  }
  componentWillUnmount (){
    this.clearInterval()
  }
  pressButtonStatus = ()=>{
    const {currentStatus} = this.state
    if(currentStatus===1){
      this.clearInterval();
      this.setState({
        currentStatus: 2
      })
      return 
    }
    if(currentStatus===2){
      this.clearInterval();
      this.intervalId = setInterval(this.capture, 1000);
      this.setState({
        currentStatus: 1
      })
      return 
    }
  }
  clearInterval = ()=>{
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
    
  }
  capture = ()=>{
    try {
      let imageSrc = this.webcamRef.current.getScreenshot();
      const jpgPrefix = 'data:image/jpeg;base64,'
    
      const tRadio = MAX_QUALITY/imageSrc.length 
      const radio = tRadio > 1 ? 1: tRadio

      postImage({ image: imageSrc.replace(jpgPrefix, '')}).then((respone)=>{
        this.setState({
          userName:respone,
          currentQuatity:radio,
        })
      })
    } catch (error) {
      
    }
  

  }
      

  render(){
    const {userName,currentStatus,currentQuatity } = this.state
   
    return (
      <div className="App">
        <div>
         <Webcam
          audio={false}
          height={720}
          ref={this.webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          screenshotQuality={currentQuatity}
        />
         </div>
        <p style={{fontSize: 40, color: '#1303fc', fontWeight: 'bold', marginBlockStart: '10px'}}> {userName}</p>
        {currentStatus === 2 ? <button style={{height: 50, width: 200, marginTop: 20, backgroundColor: '#0a802b', color: 'white', fontWeight: 'bold'}} onClick={this.capture}> CHỤP</button> : null}
         <button 
            style={{height: 50, width: 200, marginTop: 20, backgroundColor: '#f65335', color: 'white', fontWeight: 'bold'}} onClick={this.pressButtonStatus}> 
            {currentStatus === 1 ? 'BẬT CHẾ ĐỘ THỦ CÔNG': 'BẬT CHẾ ĐỘ AUTO'}
         </button>
       
      </div>
    );
  }
  
}

export default App;

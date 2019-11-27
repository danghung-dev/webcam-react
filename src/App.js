import React from 'react';
import Webcam from "react-webcam";
import './App.css';
import {postImage} from './api'
import smartcrop from 'smartcrop'
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
      currentStatus: 2,
      currentQuality: 1,
     
    }
    this.deviceQuality= 1
  }
  componentDidMount (){
    // this.intervalId = setInterval(this.capture, 1000);
  }
  componentWillUnmount (){
    // this.clearInterval()
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
      if(this.deviceQuality < imageSrc.length ){
        this.deviceQuality= imageSrc.length
      }
      const tRadio = MAX_QUALITY/ this.deviceQuality
      const radio = tRadio > 1 ? 1: tRadio

      var testimg = document.createElement('img');
      testimg.src = imageSrc
      document.body.appendChild(testimg);
      testimg.onload = function() {
        smartcrop.crop(testimg, {
          x: 11, // pixels from the left side
          y: 20, // pixels from the top
          width: 100, // pixels
          height: 100 // pixels
        }).then(function(result) {
          console.log(result);
        });
      };
      
      postImage({ image: imageSrc.replace(jpgPrefix, '')}).then((respone)=>{
        this.setState({
          userName:respone,
          currentQuality:radio,
        })
      })
    } catch (error) {
      
    }
  

  }
      

  render(){
    const {userName,currentStatus,currentQuality } = this.state
    
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
          screenshotQuality={currentQuality}
        />
         </div>
        <p style={{fontSize: 40, color: '#1303fc', fontWeight: 'bold', marginBlockStart: '10px'}}> {userName}</p>
        {currentStatus === 2 ? <button style={{height: 50, width: 200, marginTop: 20, backgroundColor: '#0a802b', color: 'white', fontWeight: 'bold'}} onClick={this.capture}> CHỤP</button> : null}
         {/* <button 
            style={{height: 50, width: 200, marginTop: 20, backgroundColor: '#f65335', color: 'white', fontWeight: 'bold'}} onClick={this.pressButtonStatus}> 
            {currentStatus === 1 ? 'BẬT CHẾ ĐỘ THỦ CÔNG': 'BẬT CHẾ ĐỘ AUTO'}
         </button> */}
       
      </div>
    );
  }
  
}

export default App;

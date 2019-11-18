import React from 'react';
import Webcam from "react-webcam";
import './App.css';
import {postImage} from './api'
const videoConstraints = {
  width: '100%',
  height: '50%',
  facingMode: "user"
};


class App extends React.Component {
  constructor(props){
    super(props)
    this.webcamRef = React.createRef()
    this.state ={
      userName: 'No face',
      currentStatus: 1
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
      postImage({ image: imageSrc.replace(jpgPrefix, '')}).then((respone)=>{
        this.setState({
          userName:respone
        })
      })
    } catch (error) {
      
    }
  

  }
     

  render(){
    const {userName,currentStatus} = this.state
   
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
          screenshotQuality={1}
        />
         </div>
        <p> {userName}</p>
         <button style={{height: 50, width: 200, marginTop: 20, backgroundColor: '#f65335', color: 'white'}} onClick={this.pressButtonStatus}> {currentStatus === 1 ? 'Bật chế độ thủ công': 'Bật chế độ auto'}</button>
         {currentStatus === 2 ? <button style={{height: 50, width: 200, marginTop: 20, backgroundColor: 'blue', color: 'white'}} onClick={this.capture}> Chup</button> : null}
      </div>
    );
  }
  
}

export default App;

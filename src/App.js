import React from 'react';
import './App.css';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai'
import {FaPlay, FaPause, FaSyncAlt} from 'react-icons/fa'


function secondsToTime(seconds){
  //https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  const m = Math.floor(seconds / 60).toString().padStart(2,'0'),
        s = Math.floor(seconds % 60).toString().padStart(2,'0');
  
  return m + ':' + s;
  //return `${m}:${s}`;
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      label: "Session",
      timer: 1500,
      running: false,
      intervalId: "",
      strokeDash: 0
    }
    this.handleDecrement = this.handleDecrement.bind(this)
    this.handleIncrement = this.handleIncrement.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.handleTimer = this.handleTimer.bind(this)
    this.handleSound = this.handleSound.bind(this)
    this.handleStroke = this.handleStroke.bind(this)
    this.handleStrokeReset = this.handleStrokeReset.bind(this)

  }

  handleIncrement(event) {
    // Only works if clock is not running
    if(!this.state.running){
    // Max break/session length = 60 min
    if(event.target.value < 60) {
      // Set break length incrementing value by one
      if(event.target.id === "break-increment") {
        this.setState({
          breakLength: this.state.breakLength + 1
        }, () => {
          // Update only if break is displayed
          if(this.state.label === "Break") {
            this.handleStrokeReset();
            this.setState({
              timer: this.state.breakLength * 60, 
              strokeDash: 0})
      }})}
      // Set session length incrementing value by one
      if(event.target.id === "session-increment") {
        this.setState({
          sessionLength: this.state.sessionLength + 1
          // Update only if session is displayed
        }, () => {
          if(this.state.label === "Session") {
            this.handleStrokeReset();
            this.setState({
              timer: this.state.sessionLength * 60,
              strokeDash: 0})
      }})
    }
  }}}

  handleDecrement(event) {
    // Only works if clock is not running
    if(!this.state.running){
      // Do not accept negative values
    if(event.target.value > 1) {
      // Set break length decrementing value by one
      if(event.target.id === "break-decrement") {
        this.setState({
          breakLength: this.state.breakLength - 1
        }, () => {
          // Update only if break is displayed
          if(this.state.label === "Break") {
            this.handleStrokeReset();
          this.setState({
            timer: this.state.breakLength * 60,
            strokeDash: 0
          })
          }
      })}
      // Set session length decrementing value by one
      if(event.target.id === "session-decrement") {
        this.setState({
          sessionLength: this.state.sessionLength - 1
          // Update only of session is displayed
        }, () => {
          if(this.state.label === "Session") {
            this.handleStrokeReset();
            this.setState({
              timer: this.state.sessionLength * 60,
              strokeDash: 0})
      }})
    }
  }}}

  handleSound() {
    //Seclect audio tag
    var audio = document.getElementById("beep")
    if(this.state.running) {
      audio.play();
    }
    else {
      audio.pause()
      //rewind
      audio.currentTime = 0;
    }
  }

  handleStroke() {
    const stroke = document.getElementById('stroke');
    //Stroke will fade according to break/session length
    if(this.state.label === "Session") {
      this.setState({
        strokeDash: this.state.strokeDash + (21/this.state.sessionLength) //21 finish full circle in 60 seconds
      }, () => {stroke.style.strokeDashoffset = this.state.strokeDash})
    }
    else {
      this.setState({
        strokeDash: this.state.strokeDash + (21/this.state.breakLength)
      }, () => {stroke.style.strokeDashoffset = this.state.strokeDash})
    }
  }

  handlePlay() {
    this.setState({
      //When play/pause button is clicked: If clock is paused set to true, if it's running set to false
      running: !this.state.running
    }, () => {this.handleTimer()}) //Update running status and then call function
  }

  handleTimer() {
    // If not reached 0, keep updating value by minus 1 every second
    if(this.state.timer > 0) {
      //Set warning color if timer is less than 1 minute
      this.handleWarningColor()
      setTimeout(() => {
        //Only starts if clock is set to running "true"
        if(this.state.running) {
          this.handleStroke();
          this.setState({
            timer: this.state.timer - 1
            }, () => {this.handleTimer()})};
          },1000)
    }
    //If reached 0, start new session/break and then update value every second
    if(this.state.timer === 0) {
      this.handleSound();
        setTimeout(() => {
          if(this.state.label === "Session") {
            this.handleStrokeReset();
            this.setState({
              label: "Break",
              timer:  this.state.breakLength * 60,  //Set timer with break length defined on settings
              strokeDash: 0
             }, () => {this.handleTimer()})
          }
          else {
            this.handleStrokeReset();
            this.setState({
              label: "Session",
              timer:  this.state.sessionLength * 60, //Set timer with session length defined on settings
              strokeDash: 0
            }, () => {this.handleTimer()})
          }
        }, 1000)
    } 
  }

  handleWarningColor() {
    //If timer is less than 1 minute, set clock to red
    if (this.state.timer < 60) {
       document.getElementById("time-left").style.color = '#a50d0d';
       document.getElementById('stroke').style.stroke = "#a50d0d"
    } 
    else {
      document.getElementById("time-left").style.color = '#D8AB00';
      document.getElementById('stroke').style.stroke = "#D8AB00"
    } 
  }

  handleStrokeReset() {
    document.getElementById('stroke').style.strokeDashoffset = 0;
  }


  handleReset() {
    this.setState({
      label: "Session",
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      running: false,
      strokeDash: 0
    }, () => {this.handleSound(); this.handleStrokeReset(); this.handleWarningColor()}) // this is the code that actually works but it does not pass tests -- Stop sound when running is false (=reset)
    //this.handleSound()  this piece of code pass tests but it doesn't work without setting interval
    document.getElementById("time-left").style.color = '#D8AB00' //reset timer color
  }  

  render() {
  return (
    <div id="container">
      <h1 id="title">25 + 5 Clock</h1>
      <Display sessionLength={this.state.sessionLength} label={this.state.label} reset={this.handleReset} playpause={this.handlePlay} timer={this.state.timer}/>
      <BreakSession increment={this.handleIncrement} decrement={this.handleDecrement} sessionLength={this.state.sessionLength} breakLength={this.state.breakLength}/>
    </div>  
  );
}
}

class BreakSession extends React.Component {
  render() {
  return (
    <div id="break-session">    
      <div id="break">
        <h3 id="break-label">Break Length</h3>
        <div className="settings">
          <label htmlFor="break-decrement"><AiFillCaretDown /></label><button id="break-decrement" onClick={this.props.decrement} value={this.props.breakLength}></button>
          <p id="break-length">{this.props.breakLength}</p>
          <label htmlFor="break-increment"><AiFillCaretUp /></label><button id="break-increment" onClick={this.props.increment} value={this.props.breakLength}></button>
        </div>
      </div>
    
      <div id="session">
        <h3 id="session-label">Session Length</h3>
        <div className="settings">
          <label htmlFor="session-decrement"><AiFillCaretDown /></label><button id="session-decrement" onClick={this.props.decrement} value={this.props.sessionLength}></button>
          <p id="session-length">{this.props.sessionLength}</p>
          <label htmlFor="session-increment"><AiFillCaretUp /></label><button id="session-increment" onClick={this.props.increment} value={this.props.sessionLength}></button>
        </div>
      </div>
    </div>

  );
  }
}


class Display extends React.Component {

  render() {
  return (
      <div className="display">
        <div className="display-set"> 
            <svg id="circle">
              <circle cx="200" cy="200" r="200"></circle>
              <circle id="stroke" cx="200" cy="200" r="200"></circle>
            </svg>
            <div className= "display-text">
              <h1 id="timer-label">{this.props.label}</h1>
              <p id="time-left">{secondsToTime(this.props.timer)}</p>
              <div className="controls"> 
                <audio id="beep" src={"https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"} type="audio/mp3"></audio>
                <label htmlFor="start_stop"><FaPlay /><FaPause /></label><button id="start_stop" onClick={this.props.playpause}></button>
                <label htmlFor="reset"><FaSyncAlt /></label><button id="reset" onClick={this.props.reset}></button>
              </div>
            </div>
        </div>
      </div>  
  );
  }
}


export default App;

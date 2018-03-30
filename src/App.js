import React, { Component } from 'react';
import logo from './img/logo.png';
import loading from './img/loading.png';
import './App.css';

// progress bar import
import { Line, Circle } from 'rc-progress';
// slider import
import 'rc-slider/assets/index.css';
import Slider, { createSliderWithTooltip } from 'rc-slider';
//video player
// import "video-react/dist/video-react.css"; // import css
// import { Player, ControlBar, BigPlayButton, 
//         VolumeMenuButton, TimeDivider,
//         DurationDisplay, CurrentTimeDisplay} from 'video-react';
import sample_video from './demo_videos/sample_1.mp4'


const marks = {
  style: {
    color: 'red',
  },
  0: <strong>Very Negative</strong>,
  100: {
    style: {
      color: 'red',
    },
    label: <strong>Very Positive</strong>,
  },
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  buttonCallback() {
    this.setState({value: 0});
  }
  render() {
    // switch(this.state.value) {
    //   case 0:
    //       return (<IntroductionPage onClick={() => this.buttonCallback()} />);
    //   case 1:
    //       return (<Experiments />);
    //   default:
    //       return (<IntroductionPage />);
    // }
    return (<EndPage />);
  }
}

// This very first page before introduction
class IntroductionPage extends Component {
  render() {
    return (      
      <div className="intropage">
        <img src={logo} width="280" height="180" alt="logo"/>
        <h1>Stanford Social Neuroscience Lab</h1>
        <p>
            In this study, we are interested in how people make judgments about other people's emotions. 
            This task will take approximately 30 minutes.
            <br></br><br></br>
            Please make sure your <b>sound</b> is on.
            <br></br><br></br>
            Do not do this HIT on a mobile device or tablet.
        </p>

        <button type="button" onClick={() => this.props.onClick()}>Start</button>

        <p id="legal">Legal information: By answering the
        following questions, you are participating in a study being performed by
        psychologists in the Stanford Department of Psychology. If you have
        questions about this research, please contact <b>Alison Mattek</b> at <a
        href="mailto:amattek@stanford.edu">amattek@stanford.edu</a> or Jamil
        Zaki, at jzaki@stanford.edu. You must be  at least 18 years old to
        participate. Your participation in this research is voluntary. You may
        decline to answer any or all of the following questions. You may decline
        further participation, at any time, without adverse consequences. Your
        anonymity is assured; the researchers who have requested your
        participation will not receive any personal information about you.
        </p>
      </div>
      
    );
  }
}

// Widgets - Progress Bar
class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10,
    };
  }
  render() {
    return (      
      <div className="progressbar">
        <div style={{ margin: 5, width: 200 , alignItems: 'center'}} >
          <Line strokeWidth="2" percent={this.state.value} trailWidth = '2'/>
        </div>
        <h3>Experiments Progress {this.state.value}%</h3>
      </div>
      
    );
  }
}

// Widgets - Interactive scoring bar
class ScoringSlidingBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 50,
    };
  }
  onSliderChange = (value) => {
    console.log(value); //eslint-disable-line
    this.setState({
      value,
    });
  }
  onAfterChange = (value) => {
    console.log(value); //eslint-disable-line
  }
  render() {
    return (
      <div className="scoringslidingbar">
        <h1 id = 'leftLabel'> Negative </h1>
        <h1 id = 'rightLabel'> Positive </h1>
        <div id = "bar">
          <div style={{margin: 10, width: 400}}>
            <Slider
              min={0}
              defaultValue={50}
              trackStyle={{ backgroundColor: 'blue', height: 10 }}
              handleStyle={{
                borderColor: 'blue',
                height: 28,
                width: 28,
                marginLeft: -14,
                marginTop: -9,
                backgroundColor: 'black',
              }}
              railStyle={{ backgroundColor: 'red', height: 10 }}
            />
          </div>
        </div>
        
      </div>
    );
  }
}

// This send introductory page for experiments
class StartPage extends Component {
  
  render() {
    const containerStyle = {
      width: '250px',
    };
    return (      
      <div className="intropage">
        <div className="bar" style={containerStyle} strokeColor='#000000'>
          <Line strokeWidth="5" percent='10' />
        </div>
        <h3>Experiments Progress 10%</h3>
        <h1>Instructions</h1>
        <p>
            In this task, you will watch 8 videos of people describing 
            emotional events that happened in their lives, and answer 
            several questions about them. The videos range from between 
            0.5 mins to 4 mins, and the total duration of the 8 videos 
            will be less than 20 minutes.
            <br></br><br></br>
            While watching these videos, we would like you to rate how 
            you believe the person in the video feels feeling at every 
            moment in time. Please pay special attention to the momentary 
            changes in emotion you see in this person. For instance, someone
             describing a sad event might nonetheless feel relatively more or
              less negative at different moments.
            <br></br><br></br>
            Please make your ratings using the slider below the video. 
            Whenever you want to change your rating, simply click on the 
            round "handle" of this slider and move the slider to wherever you like.
            <br></br><br></br>
            Far left indicates "Very negative", and far right indicates 
            "Very positive". Try making some ratings using the rating 
            scale below. Click on the next button when you are done.
        </p>

        <button type="button">Let's Start!</button>

      </div>
      
    );
  }
}

// This is the third page for video play and collecting data
class Experiments extends Component {
  constructor (props) {
      super(props);
      this.onPlayClicked = this.onPlayClicked.bind(this);
      this.state = {
          isButtonDisabled: false
      }
  }
  onPlayClicked (event) {
    event.preventDefault();
    this.setState({
        isButtonDisabled: true
    });
    var vid = document.getElementById("expvideo"); 
    vid.load();
    vid.play()
  }
  render() {
    return (
      <div className = 'experiments'>
        <ProgressBar />
        <div className = 'intropage'>
          <br></br><br></br>
          <p id="question"> 
              <b><u>When you see the first frame of the video</u></b>, click on the green button to start the video. Please rate how you believe the person in the video is feeling at every moment in time, and remember to <b>make your ratings throughout the video</b>.
          </p>
          <div className = 'videoplayer'>      
            <video id="expvideo">
              <source preload="auto" poster={loading} src={sample_video} type="video/mp4"/>
            </video>
          </div>
          <button class = "button" type="button" disabled={this.state.isButtonDisabled} onClick={this.onPlayClicked}>Play</button>
        </div>
        <ScoringSlidingBar />
      </div>
    );
  }
}

// Comp questionnaire
class CompQuestionnaire extends Component {
  render() {
    return (
      <div className = 'compquestionnaire'>
      <ProgressBar />
        <br></br>
        <br></br>
          <p id="question"> 
            Please answer the following questions regarding the video that you just watched. <br></br>
          </p>
          <br/>
          <p id="question">Did he live in Philadelphia for his childhood?</p>
          <ul id="answers">
            <input type="radio" name="q1" value="true" id="q1a" /> <label for="q1t" />True &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="q1" value="false" id="q1b" /> <label for="q1f" />False
          </ul>
          <br></br>
          <p id="question">Did he recently breakup with his girlfriend?</p>
          <ul id="answers">
            <input type="radio" name="q2" value="true" id="q2a" /> <label for="q2t" />True &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="q2" value="false" id="q2b" /> <label for="q2f" />False
          </ul>
          <br></br>
          <br></br>
          <button type="button" >Next</button>
      </div>
    );
  }
}

// Peronsal questionnaire
class PersonalQuestionnaire extends Component {
  render() {
    return (
      <div className = 'personalquestionnaire'>
      <ProgressBar />
        <br></br>
        <br></br>
        <p class="block-text">You are almost at the end! We would like you to fill in a few short questionnaires. For each item, indicate how well it describes you by choosing the appropriate response on the scale. There is no "right" or "wrong" answer. Please answer as honestly as you can. Thank you! </p>
        <p class="block-text">Note: sometimes due to the screen size or the font size, the labels on the scales may end up in a confusing place. If that happens, try to zoom in or zoom out (increase or decrease the font size).</p>
        <p class="block-text">For the following items, indicate how well it describes you from <br/>"This statement describes me not very well" on the <b>left</b> end, to <br/>"This statement describes me very well" on the <b>right</b>.</p>
          
      <button type="button" >Next</button>
      </div>
    );
  }
}

// Table questionnaire
class TableQuestionnaire extends Component {
  render() {
    return (
      <div className = 'tablequestionnaire'>
        <ProgressBar />
        <br></br>
        <br></br>
        <center>
        <table class="table-survey">
            <tr><td>
            </td><td style={{width:15 + 'em'}}>
                This statement describes me...
            </td></tr>
            <tr><td>
            </td><td>
                Not very well &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; &nbsp; Very well
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td>

                I often have tender, concerned feelings for people less fortunate than me.

            </td><td> 
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC1" value="1" /> &nbsp;&nbsp;
                                <input type="radio" name="IRI_EC1" value="2" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="3" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="4" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I sometimes find it difficult to see things from the "other guy's" point of view.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT1R" value="1" /> &nbsp;&nbsp;     
                                <input type="radio" name="IRI_PT1R" value="2" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="3" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="4" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td>

                Sometimes I don't feel very sorry for other people when they are having problems.

            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC2R" value="1" /> &nbsp;&nbsp;  
                                <input type="radio" name="IRI_EC2R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                In emergency situations, I feel apprehensive and ill-at-ease.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD1" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="5" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 50}}></tr>
            <tr><td>

                I often have tender, concerned feelings for people less fortunate than me.

            </td><td> 
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC1" value="1" /> &nbsp;&nbsp;
                                <input type="radio" name="IRI_EC1" value="2" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="3" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="4" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC1" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I sometimes find it difficult to see things from the "other guy's" point of view.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT1R" value="1" /> &nbsp;&nbsp;     
                                <input type="radio" name="IRI_PT1R" value="2" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="3" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="4" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_PT1R" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td>

                Sometimes I don't feel very sorry for other people when they are having problems.

            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC2R" value="1" /> &nbsp;&nbsp;  
                                <input type="radio" name="IRI_EC2R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC2R" value="5" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                In emergency situations, I feel apprehensive and ill-at-ease.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD1" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD1" value="5" /> &nbsp;&nbsp; 
            </td></tr>

        </table>
        <button type="button" >Next</button>
        </center>
      </div>
    );
  }
}

// Info questionnaire
class InfoQuestionnaire extends Component {
  render() {
    return (
      <div className = 'infoquestionnaire'>
        <center>
          <div id="form">


          <p id="infoQ"> <b> You have come to the final slide. We would like to find out a little more about yourself. </b></p>

          <br/>
          <div name="gender" class="demographic-div">
            <span id="infoQgender"> What gender do you identify with? </span>&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="M" />&nbsp;&nbsp; Male &nbsp;&nbsp; <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="F" />&nbsp;&nbsp; Female
            <br/>
          </div>
          
          <br/><br/>
          
          <div name="age" class="demographic-div">
            <span id="infoQage">What is your age?</span> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" id="ageRange" /><br />
          </div>
          
          <br/><br/>

          <div name="race" class="demographic-div">
            <span id="infoQrace"> What racial category do you identify with? Select all that apply </span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="raceButton-AmIndian" value="AmIndian" />
            American Indian / Alaska Native <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="raceButton-Asian" value="Asian" />
            Asian <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="raceButton-NativeHawaiian" value="NativeHawaiian" />
            American Indian / Alaska Native <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="raceButton-Black" value="Black" />
            Black or African American <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="raceButton-White" value="White" />
            White<br/>
          </div>
          
          <br/><br/>

          <div name="ethnicity" class="demographic-div">
          <span id="infoQrace"> What ethnic category do you identify with? </span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="hispanic" /> 
          Hispanic or Latino <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="notHispanic" /> 
          Not Hispanic or Latino<br/>
          </div>
          
          <br/><br/>
          
          <div name="language" class="demographic-div">
            <span id="infoQ">What is your native language?</span> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" name="nativeLanguage" /><br/>
          </div>
          
          <br/>
            <form name="comments">
              <br/>
                <span id="infoQ"> (Optional) Please leave any comments or suggestions regarding this HIT:</span>
                <br/><br/>
                <textarea name="commentsTextArea" style={{ROWS:10, COLS:50}} />
              <br/><br/>
              <p id="block-text"> Thank you for doing this task! Please hit the button below to end the study. </p>
            </form>
          <br/>

          </div>
          <button type="button" >End</button>
        </center>
      </div>
    );
  }
}

class EndPage extends Component {
  render() {
    return (      
      <div className="endpage">
        <center>
          <br/><br/>
          <br/><br/>
          <img src={logo} width="300" height="180" alt="logo"/>
          <br/><br/>
          <br/><br/>
          <p> Thanks you for your time! Your contribution means a lot to us!</p>
          <br/><br/>
          <br/><br/>
          <h1>Stanford Social Neuroscience Lab</h1>
        </center>
      </div>
    );
  }
}

export default App;

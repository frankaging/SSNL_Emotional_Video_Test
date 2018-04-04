import React, { Component } from 'react';
import logo from './img/logo.png';
import loading from './img/loading.png';
import './App.css';
import $ from 'jquery'; 

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
import sample_video from './demo_videos/sample_2.mp4'

// frequency of collection data
var freqSliderDataCollection = 1
var dataCollector = null
// number of experiments
var numExperiments = 1

// ______________________
//
//      Meta Data
//
// ______________________
var turk;
turk = turk || {};

(function() {
  if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
      var len = this.length >>> 0;
      if (typeof fun != "function") { throw new TypeError(); }

      var res = new Array(len);
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in this)
          res[i] = fun.call(thisp, this[i], i, this);
   		}
      return res;
    };
  }
  
  var hopUndefined = !Object.prototype.hasOwnProperty,
      showPreviewWarning = true;
  
  // We can disable the previewWarning by including this script with "nowarn" in the script url
  // (i.e. mmturkey.js?nowarn). This doesn't work in FF 1.5, which doesn't define document.scripts
  if (document.scripts) {
    for(var i=0, ii = document.scripts.length, src = document.scripts[i].src; i < ii; i++ ) {
      if ( /mmturkey/.test(src) && /\?nowarn/.test(src) ) {
        showPreviewWarning = false;
        break;
      }
    }
  }
  
  var param = function(url, name ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return ( results == null ) ? "" : results[1];
  }
  
  // Give an HTML representation of an object
  var htmlify = function(obj) {
    if (obj instanceof Array) {
      return "[" + obj.map(function(o) { return htmlify(o) } ).join(",") + "]";
    } else if (typeof obj == "object") {
      var strs = [];
      for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var str = "<li>" + htmlify(key) + ": " + htmlify(obj[key]) + "</li>";
          strs.push(str);
        }
      }
      return "{<ul>" + strs.join("") + "</ul>}";
    } else if (typeof obj == "string")  {
      return '"' + obj + '"';
    } else if (typeof obj == "undefined" ) {
      return "[undefined]"
    } else {
      return obj.toString();
    }
  };
  
  var addFormData = function(form,key,value) {
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  var url = window.location.href,
      src = param(url, "assignmentId") ? url : document.referrer,
      keys = ["assignmentId","hitId","workerId","turkSubmitTo"];
  
  keys.map(function(key) {
    turk[key] = unescape(param(src, key));
  });

  turk.previewMode = (turk.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE");

  // TODO: what do you do if data is an array, rather than an object?
  // Submit a POST request to Turk
  turk.submit = function(object) {
    var assignmentId = turk.assignmentId,
        turkSubmitTo = turk.turkSubmitTo,
        rawData = {},
        form = document.createElement('form');
   
    document.body.appendChild(form);

    if (assignmentId) {
      rawData.assignmentId = assignmentId;
      addFormData(form,"assignmentId",assignmentId);
    }

    // Filter out non-own properties and things that are functions
    for(var key in object) {
      if ((hopUndefined || object.hasOwnProperty(key)) && (typeof object[key] != "function") ) {
        rawData[key] = object[key];
        addFormData(form, key, JSON.stringify(object[key]));
      }
    }

    // If there's no turk info
    if (!assignmentId || !turkSubmitTo) {
      // Emit the debug output and stop
      var div = document.createElement('div');
      div.style.fontFamily = '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", sans-serif';
      div.style.fontSize = "14px";
      div.style.cssFloat = "right";
      div.style.padding = "1em";
      div.style.backgroundColor = "#dfdfdf";
      div.innerHTML = "<p><b>Debug mode</b></p>Here is the data that would have been submitted to Turk: <ul>" + htmlify(rawData) + "</ul>"
      document.body.appendChild(div);
      return;
    }

    // Otherwise, submit the form
    form.action = turk.turkSubmitTo + "/mturk/externalSubmit";
    form.method = "POST";
    form.submit();
  }
  
  // simulate $(document).ready() to show the preview warning
  if (showPreviewWarning && turk.previewMode) {
    var intervalHandle = setInterval(function() {
      try {
        var div = document.createElement('div'), style = div.style;
        style.backgroundColor = "gray";
        style.color = "white";
        
        style.position = "absolute";
        style.margin = "0";
        style.padding = "0";
        style.paddingTop = "15px";
        style.paddingBottom = "15px";
        style.top = "0";
        style.width = "98%";
        style.textAlign = "center";
        style.fontFamily = "arial";
        style.fontSize = "24px";
        style.fontWeight = "bold";
        
        style.opacity = "0.5";
        style.filter = "alpha(opacity = 50)";
        
        div.innerHTML = "PREVIEW MODE: CLICK \"ACCEPT\" ABOVE TO START THIS HIT";
        
        document.body.appendChild(div);
        clearInterval(intervalHandle);
      } catch(e) {
        
      }
    },20);
  }
  
})();
// record all the responce
var experimentResults = {

  videoClips: [],
  // video_timestampe_data: [],
  video_rating_data: [],

  comprehensionCheckQ1: new Array(numExperiments),
  comprehensionCheckQ2: new Array(numExperiments),
  comprehensionCheckQ1Answer: new Array(numExperiments),
  comprehensionCheckQ2Answer: new Array(numExperiments),

  comprehensionCheckQ1Response: new Array(numExperiments),
  comprehensionCheckQ2Response: new Array(numExperiments),
  comprehensionCheckQ1Correct: new Array(numExperiments),
  comprehensionCheckQ2Correct: new Array(numExperiments),

  // surveyResponses:
  IRI_EC1: -1, IRI_EC2R: -1, IRI_EC3: -1, IRI_EC4R: -1, IRI_EC5R: -1, IRI_EC6: -1, IRI_EC7: -1,
  IRI_PT1R: -1, IRI_PT2: -1, IRI_PT3: -1, IRI_PT4R: -1, IRI_PT5: -1, IRI_PT6: -1, IRI_PT7: -1,
  IRI_PD1: -1, IRI_PD2: -1, IRI_PD3R: -1, IRI_PD4: -1, IRI_PD5R: -1, IRI_PD6: -1, IRI_PD7: -1,

  BDI_1: -1, BDI_2: -1, BDI_3: -1, BDI_4: -1, BDI_5: -1, BDI_6: -1,
  BDI_7: -1, BDI_8: -1, BDI_9: -1, BDI_10: -1, BDI_11: -1, BDI_12: -1,

  LT_1R: -1, LT_2R: -1, LT_3R: -1, LT_4: -1, LT_5: -1, LT_6: -1,

  HPS_1: -1, HPS_2: -1, HPS_3: -1, HPS_4: -1, HPS_5: -1,
  HPS_6: -1, HPS_7: -1, HPS_8: -1, HPS_9: -1, HPS_10: -1,
  HPS_11: -1, HPS_12: -1, HPS_13: -1, HPS_14: -1, HPS_15: -1,
  HPS_16: -1, HPS_17: -1, HPS_18: -1, HPS_19: -1, HPS_20: -1,

  IRI_EC: -1, IRI_PT: -1, IRI_PD: -1,
  BDI: -1, LT_Empathy: -1, HPS: -1,
  

  // Demographics
  gender: "",
  age:"",
  
  race_AmericanIndian:"",
  race_Asian:"",
  race_NativeHawaiian:"",
  race_Black:"",
  race_White:"",
  ethnicity:"",
  nativeLanguage:"",
  browser: "",
  browserVersion: "",
  browserOS: "",
  comments:""
}

var videosMetaInfo = {
  videos: [[
  ]]
}

function validateComprehensionCheck() {
  if ($('input[name="comprehensionQ1"]:checked').val()!=null &&
      $('input[name="comprehensionQ2"]:checked').val()!=null) {
      return true;
  } else {
      alert ( "Please answer all the questions." );
      return false;
  }
}

function ValidateQuestionnairesSlide() {
  if ($('input[name="IRI_EC1"]:checked').val()!=null &&
      $('input[name="IRI_EC2R"]:checked').val()!=null &&
      $('input[name="IRI_EC3"]:checked').val()!=null &&
      $('input[name="IRI_EC4R"]:checked').val()!=null &&
      $('input[name="IRI_EC5R"]:checked').val()!=null &&
      $('input[name="IRI_EC6"]:checked').val()!=null &&
      $('input[name="IRI_EC7"]:checked').val()!=null &&
      $('input[name="IRI_PT1R"]:checked').val()!=null &&
      $('input[name="IRI_PT2"]:checked').val()!=null &&
      $('input[name="IRI_PT3"]:checked').val()!=null &&
      $('input[name="IRI_PT4R"]:checked').val()!=null &&
      $('input[name="IRI_PT5"]:checked').val()!=null &&
      $('input[name="IRI_PT6"]:checked').val()!=null &&
      $('input[name="IRI_PT7"]:checked').val()!=null &&
      $('input[name="IRI_PD1"]:checked').val()!=null &&
      $('input[name="IRI_PD2"]:checked').val()!=null &&
      $('input[name="IRI_PD3R"]:checked').val()!=null &&
      $('input[name="IRI_PD4"]:checked').val()!=null &&
      $('input[name="IRI_PD5R"]:checked').val()!=null &&
      $('input[name="IRI_PD6"]:checked').val()!=null &&
      $('input[name="IRI_PD7"]:checked').val()!=null &&
      $('input[name="BDI_1"]:checked').val()!=null &&
      $('input[name="BDI_2"]:checked').val()!=null &&
      $('input[name="BDI_3"]:checked').val()!=null &&
      $('input[name="BDI_4"]:checked').val()!=null &&
      $('input[name="BDI_5"]:checked').val()!=null &&
      $('input[name="BDI_6"]:checked').val()!=null &&
      $('input[name="BDI_7"]:checked').val()!=null &&
      $('input[name="BDI_8"]:checked').val()!=null &&
      $('input[name="BDI_9"]:checked').val()!=null &&
      $('input[name="BDI_10"]:checked').val()!=null &&
      $('input[name="BDI_11"]:checked').val()!=null &&
      $('input[name="BDI_12"]:checked').val()!=null &&
      $('input[name="LT_1R"]:checked').val()!=null &&
      $('input[name="LT_2R"]:checked').val()!=null &&
      $('input[name="LT_3R"]:checked').val()!=null &&
      $('input[name="LT_4"]:checked').val()!=null &&
      $('input[name="LT_5"]:checked').val()!=null &&
      $('input[name="LT_6"]:checked').val()!=null &&
      $('input[name="HPS_1"]:checked').val()!=null &&
      $('input[name="HPS_2"]:checked').val()!=null &&
      $('input[name="HPS_3"]:checked').val()!=null &&
      $('input[name="HPS_4"]:checked').val()!=null &&
      $('input[name="HPS_5"]:checked').val()!=null &&
      $('input[name="HPS_6"]:checked').val()!=null &&
      $('input[name="HPS_7"]:checked').val()!=null &&
      $('input[name="HPS_8"]:checked').val()!=null &&
      $('input[name="HPS_9"]:checked').val()!=null &&
      $('input[name="HPS_10"]:checked').val()!=null &&
      $('input[name="HPS_11"]:checked').val()!=null &&
      $('input[name="HPS_12"]:checked').val()!=null &&
      $('input[name="HPS_13"]:checked').val()!=null &&
      $('input[name="HPS_14"]:checked').val()!=null &&
      $('input[name="HPS_15"]:checked').val()!=null &&
      $('input[name="HPS_16"]:checked').val()!=null &&
      $('input[name="HPS_17"]:checked').val()!=null &&
      $('input[name="HPS_18"]:checked').val()!=null &&
      $('input[name="HPS_19"]:checked').val()!=null &&
      $('input[name="HPS_20"]:checked').val()!=null
      ) {
      return true;
  } else {
      alert ( "Please answer all the questions." );
      return false;    
  }
}

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

// ______________________
//
//      Meta Data
//
// ______________________


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      experimentCount: 0,
      experimentCountTotal: numExperiments,
    };
  }
  buttonCallback() {
    this.setState({ value: this.state.value + 1 })
  }
  buttonCallbackNextExperiment() {
    if (this.state.experimentCount == this.state.experimentCountTotal - 1) {
      this.setState({ value: this.state.value + 1 })
    } else {
      this.setState({ value: this.state.value - 1 })
      this.setState({ experimentCount: this.state.experimentCount + 1 })
    }
  }
  buttonCallbackEnd() {
    this.saveUserInfo();
  }
  buttonCallbackStart() {
    // generating select videos series with cooresponding comp questions and correct answers.
    this.generateExperiment();
    this.setState({ value: this.state.value + 1 })
  }
  generateExperiment() {
    // TODO: Fake generation process
    experimentResults.videoGroup = Math.floor(Math.random() * 5) +1;
    for (var i = 0; i < numExperiments; i++) {
      var name = '/sample_2.mp4';
      experimentResults.videoClips[i] = './demo_videos' + name;
      experimentResults.comprehensionCheckQ1[i] = 'This is fake question 1?'
      experimentResults.comprehensionCheckQ2[i] = 'This is fake question 2?'
      experimentResults.comprehensionCheckQ1Answer[i] = "true"
      experimentResults.comprehensionCheckQ2Answer[i] = "true"
    }
  }
  saveUserInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
              (verOffset=nAgt.lastIndexOf('/')) ) 
    {
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset+1);
    if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
      fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
      fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
    fullVersion  = ''+parseFloat(navigator.appVersion); 
    majorVersion = parseInt(navigator.appVersion,10);
    }
    // OS
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    // save to experimentResults
    experimentResults.browser = browserName
    experimentResults.browserVersion = majorVersion
    experimentResults.browserOS = OSName
    this.setState({ value: this.state.value + 1 })
  }
  submitToMTurk() {
    console.log(experimentResults)
    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know weâ€™re just submitting properties [i.e. data])
    */
   // setTimeout(function() { turk.submit(experimentResults);}, 1500);
  }
  render() {
    switch(this.state.value) {
      case 0:
          // save user basic info
          return (<IntroductionPage onClickParent={() => this.buttonCallbackStart()} />) ;
      case 1:
          return (<StartPage onClickParent={() => this.buttonCallback()}/>);
      case 2:
          // experiments video 1
          return (<Experiments onClickParent={() => this.buttonCallback()}/>);
      case 3:
          // experiments video 1 comprehension
          return (<CompQuestionnaire value={this.state.experimentCount} onClickParent={() => this.buttonCallbackNextExperiment()}/>);
      case 4:
          // table questions for emotion
          return (<TableQuestionnaire onClickParent={() => this.buttonCallback()}/>);
      case 5:
          // demo questions
          return (<InfoQuestionnaire onClickParent={() => this.buttonCallbackEnd()}/>);
      case 6:
          // demo questions
          // End page will submit the form to MTurk
          this.submitToMTurk()       
          return (<EndPage />);
      default:
          return (<IntroductionPage />);
    }
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

        <button type="button" onClick={() => this.props.onClickParent()}>Start</button>

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
              onChange={this.props.handleRecordVideoRatings}
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
        <ProgressBar />
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

        <button type="button" onClick={() => this.props.onClickParent()}>Let's Start!</button>

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
          isButtonDisabled: false,
          isVidPlayed: false,
          buttonText: "Play",
          videoRatings: 50,
          videoRatingsSet: [50]
      }
  }
  onPlayClicked (event) {
    var self = this;
    event.preventDefault();
    if (this.state.isVidPlayed) {
      // update the experiment data structure
      experimentResults.video_rating_data.push(self.state.videoRatingsSet)
      // reset the status
      self.setState({
        isButtonDisabled: false,
        isVidPlayed: false,
        buttonText: "Play",
        videoRatings: 50,
        videoRatingsSet: [50]
      });
      this.props.onClickParent()
    } else {
      this.setState({
          isButtonDisabled: true
      });
      var vid = document.getElementById("expvideo"); 
      vid.load();
      vid.play()
      // set up intervals to report values
      dataCollector = setInterval(
        function(){ 
          // console.log(self.state.videoRatings);
          var temp = self.state.videoRatingsSet
          temp.push(self.state.videoRatings)
          self.setState({
            videoRatingsSet: temp
          });
          console.log(self.state.videoRatings)
        }
      , freqSliderDataCollection * 1000);
      this.setState({
        buttonText: "Next"
      });
      vid.onended = function() {
        self.setState({
          isButtonDisabled: false,
          isVidPlayed: true
        });
        clearInterval(dataCollector);
        dataCollector = null
      }
    }
  }
  recordVideoRatings = (value) => {
    //console.log(value);
    this.setState({
      videoRatings: value
    });
  }
  render() {
    return (
      <div className = 'experiments'>
        <ProgressBar />
        <div className = 'intropage'>
          <br></br><br></br>
          <p id="question"> 
              <b><u>When you see the first frame of the video</u></b>, click on the play button to start the video. Please rate how you believe the person in the video is feeling at every moment in time, and remember to <b>make your ratings throughout the video</b>.
          </p>
          <div className = 'videoplayer'>      
            <video id="expvideo">
              <source preload="auto" poster={loading} src={sample_video} type="video/mp4"/>
            </video>
          </div>
          <button id="vidButton" type="button" disabled={this.state.isButtonDisabled} onClick={this.onPlayClicked}>{this.state.buttonText}</button>
        </div>
        <ScoringSlidingBar handleRecordVideoRatings={this.recordVideoRatings}/>
      </div>
    );
  }
}

// Comp questionnaire
class CompQuestionnaire extends Component {
  recordValues() {
    experimentResults.comprehensionCheckQ1Response[this.props.value] = $('input[name="comprehensionQ1"]:checked').val();
    experimentResults.comprehensionCheckQ2Response[this.props.value] = $('input[name="comprehensionQ2"]:checked').val();
    experimentResults.comprehensionCheckQ1Correct[this.props.value] = ($('input[name="comprehensionQ1"]:checked').val() == experimentResults.comprehensionCheckQ1Answer[this.props.value]);
    experimentResults.comprehensionCheckQ2Correct[this.props.value] = ($('input[name="comprehensionQ2"]:checked').val() == experimentResults.comprehensionCheckQ1Answer[this.props.value]);
  }
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
          <p id="question">{experimentResults.comprehensionCheckQ1[this.props.value]}</p>
          <ul id="answers">
            <input type="radio" name="comprehensionQ1" value="true" id="q1a" />True &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="comprehensionQ1" value="false" id="q1b" />False
          </ul>
          <br></br>
          <p id="question">{experimentResults.comprehensionCheckQ2[this.props.value]}</p>
          <ul id="answers">
            <input type="radio" name="comprehensionQ2" value="true" id="q2a" />True &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="comprehensionQ2" value="false" id="q2b" />False
          </ul>
          <br></br>
          <br></br>
          <button type="button" onClick={() => {if(validateComprehensionCheck()){this.props.onClickParent();this.recordValues()}}}>Next</button>
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
          
      <button type="button" onClick={() => this.props.onClickParent()}>Next</button>
      </div>
    );
  }
}

// Table questionnaire
class TableQuestionnaire extends Component {
  recordValues() {
    experimentResults.IRI_EC1 = parseInt($('input[name="IRI_EC1"]:checked').val(), 10);
    experimentResults.IRI_EC2R = parseInt($('input[name="IRI_PT1R"]:checked').val(), 10);
    experimentResults.IRI_EC3 = parseInt($('input[name="IRI_EC2R"]:checked').val(), 10);
    experimentResults.IRI_EC4R = parseInt($('input[name="IRI_PD1"]:checked').val(), 10);
  }
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

        </table>
        <button type="button" onClick={() => {this.props.onClickParent();this.recordValues()}}>Next</button>
        </center>
      </div>
    );
  }
}

// Info questionnaire
class InfoQuestionnaire extends Component {
  recordValues() {
    // Records demographics
    experimentResults.gender = $('input[name="genderButton"]:checked').val();
    //experiment.age = $('select[name="ageRange"]').val();
    experimentResults.age = $('#ageRange').val();

    experimentResults.race_AmericanIndian = $('input[name="raceButton-AmIndian"]:checked').val();
    experimentResults.race_Asian = $('input[name="raceButton-Asian"]:checked').val();
    experimentResults.race_NativeHawaiian = $('input[name="raceButton-NativeHawaiian"]:checked').val();
    experimentResults.race_Black = $('input[name="raceButton-Black"]:checked').val();
    experimentResults.race_White = $('input[name="raceButton-White"]:checked').val();

    experimentResults.ethnicity = $('input[name="ethnicityButton"]:checked').val();
    experimentResults.nativeLanguage = $('input[name="nativeLanguage"]').val();
    experimentResults.comments = $('textarea[name="commentsTextArea"]').val();
  }
  render() {
    return (
      <div className = 'infoquestionnaire'>
        <ProgressBar />
        <center>
          <div id="form">
          <p id="infoQ"> <b> You have come to the final slide. We would like to find out a little more about yourself. </b></p>

          <br/>
          <div name="gender" className="demographic-div">
            <span id="infoQgender"> What gender do you identify with? </span>&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="M" />&nbsp;&nbsp; Male &nbsp;&nbsp; <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="F" />&nbsp;&nbsp; Female
            <br/>
          </div>
          
          <br/><br/>
          
          <div name="age" className="demographic-div">
            <span id="infoQage">What is your age?</span> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" id="ageRange" /><br />
          </div>
          
          <br/><br/>

          <div name="race" className="demographic-div">
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

          <div name="ethnicity" className="demographic-div">
          <span id="infoQrace"> What ethnic category do you identify with? </span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="hispanic" /> 
          Hispanic or Latino <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="notHispanic" /> 
          Not Hispanic or Latino<br/>
          </div>
          
          <br/><br/>
          
          <div name="language" className="demographic-div">
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
          <button type="button" onClick={() => {this.props.onClickParent();this.recordValues()}}>End</button>
        </center>
      </div>
    );
  }
}

class EndPage extends Component {
  render() {
    return (      
      <div className="endpage">
        <ProgressBar />
        <center>
          <br/><br/>
          <br/><br/>
          <img src={logo} width="320" height="180" alt="logo"/>
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

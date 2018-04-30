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
// import all the needed videos

import Chart from 'chart.js';
var LineChart = require("react-chartjs").Line;

// frequency of collection data
var freqSliderDataCollection = 1
var dataCollector = null
// number of experiments
var numExperiments = 8

// ______________________
//
//      Videos Data
//
// ______________________
var in_sample_videos = [ ['118_3', '124_6', '120_4', '119_4', '164_3', '169_4', '144_1', '165_1'],
                         ['120_1', '129_5', '161_3', '128_2', '173_4', '121_5', '116_5', '124_3'],
                         ['167_2', '170_2', '135_3', '137_6', '171_1', '173_6', '129_2', '147_2'],
                         ['174_2', '181_4', '147_5', '178_6', '174_3', '181_2', '151_2', '153_3'] ]

var population_videos = [[
  {"participantID": 112, "clipID": 2, "videoSubset": 1,  "videoLength": 102, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Before this experience, she hated reading.",
   "comprehensionQ2text": "She felt intellectually stimulated by the book she was reading.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 120, "clipID": 1, "videoSubset": 1,  "videoLength": 181, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She and her boyfriend broke up at the beginning of the school year.",
   "comprehensionQ2text": "She's a runner and was preparing for a race.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 137, "clipID": 1, "videoSubset": 1,  "videoLength": 187, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her family struggled with making ends meet.",
   "comprehensionQ2text": "She lived in a shelter where she had access to free laundry.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 144, "clipID": 1, "videoSubset": 1,  "videoLength": 160, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was a starting player for her first game of the season.",
   "comprehensionQ2text": "Sports and atheltics were not a big part of her life growing up.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 153, "clipID": 4, "videoSubset": 1,  "videoLength": 120, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He walked several miles to get his raquet re-strung.",
   "comprehensionQ2text": "His friend offered to drive him, but he chose to walk.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 171, "clipID": 6, "videoSubset": 1,  "videoLength": 186, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She threw a party at her aunt's lake house after asking for her aunt's permission.",
   "comprehensionQ2text": "The party was absolutely wild and someone broke a window.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 173, "clipID": 1, "videoSubset": 1,  "videoLength": 128, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He crafted pieces of junk into a toy car.",
   "comprehensionQ2text": "He worked hard on his piece and was very proud of himself when he was done.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 180, "clipID": 4, "videoSubset": 1,  "videoLength": 95, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He strongly affiliated as a Muslim even though his parents were not.",
   "comprehensionQ2text": "After going to college, he became an atheist.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 117, "clipID": 4, "videoSubset": 2,  "videoLength": 161, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She did not injure herself until her last year of her college career.",
   "comprehensionQ2text": "She tore the ACL on both of her knees.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 127, "clipID": 2, "videoSubset": 2,  "videoLength": 167, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She got into her top college program.",
   "comprehensionQ2text": "She was alone when she recieved the news from the university.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 129, "clipID": 5, "videoSubset": 2,  "videoLength": 80, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "This was her first 'real' wedding.",
   "comprehensionQ2text": "She was upset because not many people from her family came.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 131, "clipID": 5, "videoSubset": 2,  "videoLength": 105, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was a soccer player when he was younger but started swimming in his twenties.",
   "comprehensionQ2text": "He is very close with his swim coach.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 142, "clipID": 3, "videoSubset": 2,  "videoLength": 52,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He always had many girlfriends in high school.",
   "comprehensionQ2text": "He was prom king that year.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 162, "clipID": 5, "videoSubset": 2,  "videoLength": 147, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His brother pushed him off the couch.",
   "comprehensionQ2text": "He fell unconscious immediately after the fall.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 174, "clipID": 7, "videoSubset": 2,  "videoLength": 172, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Once his dad stopped waking him up, he never went to visit the trainer again.",
   "comprehensionQ2text": "His dad set him up with a speed athletic trainer.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 180, "clipID": 6, "videoSubset": 2,  "videoLength": 147, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He applied to many universities for graduate school.",
   "comprehensionQ2text": "He was not stressed about the GRE exam and found it easy.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 117, "clipID": 1, "videoSubset": 3,  "videoLength": 122, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She met her partner at a neighbor's party.",
   "comprehensionQ2text": "She and her partner have moved together.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 120, "clipID": 2, "videoSubset": 3,  "videoLength": 169, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She kept improving her running times throuhgout high school.",
   "comprehensionQ2text": "She suffered from a lot of anxiety before and during races.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 121, "clipID": 6, "videoSubset": 3,  "videoLength": 87,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His basketball team was the best in the league.",
   "comprehensionQ2text": "They beat a team that they were projected to lose against.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 141, "clipID": 1, "videoSubset": 3,  "videoLength": 60,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Many people have seen the video of him recieving the news.",
   "comprehensionQ2text": "A company contacted him to use his video in their work.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 165, "clipID": 6, "videoSubset": 3,  "videoLength": 121, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He lived with an exchange family in the United States while he was in high school.",
   "comprehensionQ2text": "He shattered an item in the host family's house and was unable to fix it.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 171, "clipID": 3, "videoSubset": 3,  "videoLength": 157, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She and her sister are not very close.",
   "comprehensionQ2text": "She skipped a concert at her university to attend her sister's graduation.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 174, "clipID": 5, "videoSubset": 3,  "videoLength": 171, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He had never heard of Stanford before applying to college.",
   "comprehensionQ2text": "He recieved his acceptance to Stanford over the phone through the football coach.",        // FIX ME
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 181, "clipID": 2, "videoSubset": 3,  "videoLength": 126, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her birthday was a few days after she started university.",
   "comprehensionQ2text": "Her hallmates did not know it was her birthday and she spent it alone in her room.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 112, "clipID": 1, "videoSubset": 4,  "videoLength": 91,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Only the brother was expelled from school.",
   "comprehensionQ2text": "He/They were expelled for selling drugs.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 113, "clipID": 2, "videoSubset": 4,  "videoLength": 196, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His girlfriend cheated on him.",
   "comprehensionQ2text": "The relationship had lasted a very short time.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 115, "clipID": 2, "videoSubset": 4,  "videoLength": 176, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Many people from his high schools go to Ivy League schools.",
   "comprehensionQ2text": "Stanford was far from where he lived in high school.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 116, "clipID": 4, "videoSubset": 4,  "videoLength": 82,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She was bullied by her sister.",
   "comprehensionQ2text": "She was hulimiated for trying on her mother's makeup.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 127, "clipID": 6, "videoSubset": 4,  "videoLength": 185, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her parents bought her a ticket to Harry Potter World as a present.",
   "comprehensionQ2text": "Her experience at Harry Potter World was underwhelming and the trip was boring.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 130, "clipID": 2, "videoSubset": 4,  "videoLength": 115, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She felt excited and exhilarating that summer. ",
   "comprehensionQ2text": "The experience helped her realize what she wanted out of her life.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 161, "clipID": 3, "videoSubset": 4,  "videoLength": 134, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She would hang out in a parking lot and drive stick (manual transmission cars) with her friends.",
   "comprehensionQ2text": "She failed her learner's permit test.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 174, "clipID": 3, "videoSubset": 4,  "videoLength": 115, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He became obsessed with Aston Martin cars from a young age.",
   "comprehensionQ2text": "He bought his dream car with his own money.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 120, "clipID": 3, "videoSubset": 5,  "videoLength": 187, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her coaches told her that it was not a big deal for her to drop out of races.",
   "comprehensionQ2text": "She dropped out of more than one race.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 129, "clipID": 2, "videoSubset": 5,  "videoLength": 168, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She divorced her husband because he cheated on her.",
   "comprehensionQ2text": "She was able to keep her kids after the divorce.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 130, "clipID": 4, "videoSubset": 5,  "videoLength": 175, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "The rainforest was vibrant and had a lot of energy.",
   "comprehensionQ2text": "She decided that her relationship with nature was not important.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 153, "clipID": 1, "videoSubset": 5,  "videoLength": 55, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "When he was a child growing up, his mother was not around all the time.",
   "comprehensionQ2text": "He was never upset when saying bye to his mother.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 162, "clipID": 2, "videoSubset": 5,  "videoLength": 137, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His brother took him out on a day trip for his birthday.",
   "comprehensionQ2text": "When they got back to their house, the house was empty.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 165, "clipID": 2, "videoSubset": 5,  "videoLength": 131, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He and the girl talked on the phone and went on dates frequently.",
   "comprehensionQ2text": "The girl he was interested in got engaged to someone else.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 171, "clipID": 1, "videoSubset": 5,  "videoLength": 128, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She knew that college decisions were supposed to come out that day.",
   "comprehensionQ2text": "She did not open the email for several days after she recieved it.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 178, "clipID": 1, "videoSubset": 5,  "videoLength": 114, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She got kicked in the stomach during a soccer game.",
   "comprehensionQ2text": "After being knocked unconscious, she had a concussion for a long while.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 112, "clipID": 1, "videoSubset": 6,  "videoLength": 91,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Only the brother was expelled from school.",
   "comprehensionQ2text": "He/They were expelled for selling drugs.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 118, "clipID": 5, "videoSubset": 6,  "videoLength": 108, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She got the lead acting roll in a show at college.",
   "comprehensionQ2text": "She felt that her experience in theatre was rewarding.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 123, "clipID": 5, "videoSubset": 6,  "videoLength": 176, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He did not expect to gain admission to the program.",
   "comprehensionQ2text": "The program's focus was on the fine arts.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 130, "clipID": 6, "videoSubset": 6,  "videoLength": 112, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She spent some time with a friend she hadn't seen in a long time.",
   "comprehensionQ2text": "She and her friend went on a hike and swam in a lake.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 134, "clipID": 1, "videoSubset": 6,  "videoLength": 176, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her coaches learned about the partying but they did not care much.",
   "comprehensionQ2text": "She had always hated running track, even before this experience.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 142, "clipID": 1, "videoSubset": 6,  "videoLength": 69,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Before his grandmother died, several of his relatives had passed away.",
   "comprehensionQ2text": "His grandmother's death had a significant impact on him.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 156, "clipID": 2, "videoSubset": 6,  "videoLength": 194, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The foundation paid for him to go to a local day camp.",
   "comprehensionQ2text": "He learned a lot from the independence that he had during the experience.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 180, "clipID": 1, "videoSubset": 6,  "videoLength": 95,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He participated in a geography competition and did not win.",
   "comprehensionQ2text": "If he got first place, he would have recieved a laptop.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 123, "clipID": 2, "videoSubset": 7,  "videoLength": 175, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He and his brother were always very close growing up.",
   "comprehensionQ2text": "When his brother went to college, he moved away across the country.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 129, "clipID": 6, "videoSubset": 7,  "videoLength": 157, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "Her son won an NFL Superbowl.",
   "comprehensionQ2text": "Her son paid to fly her down for his party.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 131, "clipID": 6, "videoSubset": 7,  "videoLength": 100, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He knew that his friend was on antidepressants and was at a risk of overdose.",
   "comprehensionQ2text": "The woman he is speaking about was his very close childhood friend.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 134, "clipID": 3, "videoSubset": 7,  "videoLength": 178, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She moved from her childhood house before she started high school.",
   "comprehensionQ2text": "She immediately fell in love with her new place and considers it her home.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 137, "clipID": 4, "videoSubset": 7,  "videoLength": 174, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was rejected from her safety schools.",
   "comprehensionQ2text": "She saw her admission to college as an opportunity to make something of her life.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 142, "clipID": 2, "videoSubset": 7,  "videoLength": 61,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He ran a race with a stress fracture that he didn't know about.",
   "comprehensionQ2text": "Being on crutches was easy for him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 145, "clipID": 3, "videoSubset": 7,  "videoLength": 133, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She recieved an academic award in middle school.",
   "comprehensionQ2text": "She felt confident that she deserved the award.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 156, "clipID": 1, "videoSubset": 7,  "videoLength": 166, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His story is about getting into college.",
   "comprehensionQ2text": "He met incredible people and felt that he found his place.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 112, "clipID": 3, "videoSubset": 8,  "videoLength": 86,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The sisters were always close growing up.",
   "comprehensionQ2text": "They lived together abroad for a summer.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 118, "clipID": 3, "videoSubset": 8,  "videoLength": 108, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She had an amazing time at Stanford Admit Weekend.",
   "comprehensionQ2text": "She had never traveled from the East Coast to the West Coast before this trip.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 123, "clipID": 3, "videoSubset": 8,  "videoLength": 176, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The new drama director was supportive and loved by the school.",
   "comprehensionQ2text": "He had never done theatre before this story took place.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 143, "clipID": 5, "videoSubset": 8,  "videoLength": 111, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She traveled with her family after graduation.",
   "comprehensionQ2text": "She started a romantic relationship with an old friend on the trip.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 172, "clipID": 3, "videoSubset": 8,  "videoLength": 167, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He thought that the Harry Potter movie was amazing.",
   "comprehensionQ2text": "His parents always took him and his brother out to the movies.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 173, "clipID": 4, "videoSubset": 8,  "videoLength": 112, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He went rafting with his family one summer.",
   "comprehensionQ2text": "He sprained his ankle jumping off a cliff into a river.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 178, "clipID": 5, "videoSubset": 8,  "videoLength": 180, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was best friends with many girls on her soccer team.",
   "comprehensionQ2text": "Her friends on the volleyball team joined the soccer bus one night and they had a lot of fun.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
   {"participantID": 180, "clipID": 2, "videoSubset": 8, "videoLength": 99,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "After high school, he wanted to pursue math in university.",
   "comprehensionQ2text": "The Russian exam was easy and his score helped him get into his dream college.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 127, "clipID": 3, "videoSubset": 9,  "videoLength": 181, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "This story is about her first serious relationship.",
   "comprehensionQ2text": "She and her boyfriend were in the same American History class.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 137, "clipID": 6, "videoSubset": 9,  "videoLength": 163, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She always planned on going abroad and funding it herself.",
   "comprehensionQ2text": "There were several shops and places that she loved.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 147, "clipID": 1, "videoSubset": 9,  "videoLength": 71, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His first relationship taught him a lot.",
   "comprehensionQ2text": "He had many relationships throughout middle and high school.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 149, "clipID": 6, "videoSubset": 9,  "videoLength": 177, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She had acne growing up, but never felt that it impacted her emotionally.",
   "comprehensionQ2text": "She took Acutane and did not experience terrible side affects.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 153, "clipID": 3, "videoSubset": 9,  "videoLength": 63, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He did not let his experience with racism impact his impression of America.",
   "comprehensionQ2text": "He had never experienced racism before he came to the States.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 161, "clipID": 4, "videoSubset": 9,  "videoLength": 177, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She worked at her uncle's office for only a short period of time.",
   "comprehensionQ2text": "She ended up working very long shifts.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 169, "clipID": 2, "videoSubset": 9,  "videoLength": 170, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "Her and her twin brother both applied to Stanford.",
   "comprehensionQ2text": "She was at a restaurant when she heard her admission news.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 173, "clipID": 6, "videoSubset": 9,  "videoLength": 93, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He took a Waltz class at college.",
   "comprehensionQ2text": "He asked his RA for help with his Waltz, and she said she was too busy.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 115, "clipID": 3, "videoSubset": 10, "videoLength": 156, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He admits that he cries often.",
   "comprehensionQ2text": "His dad was emotional when they said goodbye.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 117, "clipID": 2, "videoSubset": 10, "videoLength": 122, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her study abroad experience was her first time in Europe.",
   "comprehensionQ2text": "She picked Sweden as a destination randomly, without prior interest.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 124, "clipID": 1, "videoSubset": 10, "videoLength": 100, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her graduation party was wildly fun and a great night.",
   "comprehensionQ2text": "Her boyfriend stayed at the party when she wanted to leave.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 153, "clipID": 5, "videoSubset": 10, "videoLength": 126, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "The girl in the story had feelings for him and they dated for a long time.",
   "comprehensionQ2text": "Once they stopped talking, he was devestated and could not get her off his mind.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 163, "clipID": 1, "videoSubset": 10, "videoLength": 159, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was in D.C. working on Capitol Hill.",
   "comprehensionQ2text": "When her internship ended, she felt sad and wished she could stay longer.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 171, "clipID": 5, "videoSubset": 10, "videoLength": 167, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her sister was out of the picture for most of her childhood.",
   "comprehensionQ2text": "Her sister taught her advanced math from her textbook.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 179, "clipID": 5, "videoSubset": 10, "videoLength": 132, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was not emotionally close with his mother growing up.",
   "comprehensionQ2text": "When he expressed sadness to his mother, she responded by hugging him and spending the day with him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 181, "clipID": 4, "videoSubset": 10, "videoLength": 171, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "When she moved to the U.S., she had to give up her two dogs.",
   "comprehensionQ2text": "Giving up her dogs was easier than expected and she was not that sad.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 124, "clipID": 3, "videoSubset": 11, "videoLength": 171, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The members of her basketball team were very religious.",
   "comprehensionQ2text": "She developed feelings for one of her teammates.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 127, "clipID": 4, "videoSubset": 11, "videoLength": 191, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her grandfather died just before a family vacation.",
   "comprehensionQ2text": "The storyteller found out that her mom lost her job.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 131, "clipID": 2, "videoSubset": 11, "videoLength": 153, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He has found the process of getting his degree easy and worth it.",
   "comprehensionQ2text": "He attributes his unhealthy eating habits to the stress of his degree.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 143, "clipID": 3, "videoSubset": 11, "videoLength": 93,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The exam she took was one that not many people took.",
   "comprehensionQ2text": "She performed better than most people at her school.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 162, "clipID": 6, "videoSubset": 11, "videoLength": 145, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He went on a Euro trip with a large group of friends.",
   "comprehensionQ2text": "He had dark and sad thoughts while on the trip.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 172, "clipID": 5, "videoSubset": 11, "videoLength": 178, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He developed a cough after he started smoking.",
   "comprehensionQ2text": "He ran to the bathroom to flush the toilet everytime he had to cough.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 174, "clipID": 2, "videoSubset": 11, "videoLength": 92,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His father had a stroke and the storyteller had to give up his startup to take care of his father.",
   "comprehensionQ2text": "The storyteller expresses resentment over having to give up his goals to care for his father.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 178, "clipID": 2, "videoSubset": 11, "videoLength": 75,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was confident that she was going to gain admission to Stanford.",
   "comprehensionQ2text": "Her parents had gotten her a cake to celebrate her acceptance.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 113, "clipID": 5, "videoSubset": 12, "videoLength": 179, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He saw his grandmother the night before she died.",
   "comprehensionQ2text": "His grandmother died in a car accident.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 116, "clipID": 3, "videoSubset": 12, "videoLength": 100, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She embarrased herself at basketball tryouts.",
   "comprehensionQ2text": "She was one of the worst players on her team senior year.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 119, "clipID": 6, "videoSubset": 12, "videoLength": 158, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She was involved in an automobile accident while driving.",
   "comprehensionQ2text": "Her coworkers were not supportive after her accident.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 131, "clipID": 3, "videoSubset": 12, "videoLength": 139, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He had played a slot machine several times before this experience.",
   "comprehensionQ2text": "He never gambled again after his 21st birthday.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 153, "clipID": 2, "videoSubset": 12, "videoLength": 67, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He won the tournament he is talking about.",
   "comprehensionQ2text": "He felt calm and confident during the entire tournament.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 167, "clipID": 2, "videoSubset": 12, "videoLength": 114, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her mom is dating a man who the storyteller absolutely loves.",
   "comprehensionQ2text": "Her mom's boyfriend was charged with a serious crime.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 172, "clipID": 2, "videoSubset": 12, "videoLength": 179, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He describes himself as angsty as a teenager.",
   "comprehensionQ2text": "He strongly disliked the book Catcher in the Rye.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 178, "clipID": 4, "videoSubset": 12, "videoLength": 160, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The last performance she stage managed went horribly.",
   "comprehensionQ2text": "She was a stage manager for performances in high school.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 114, "clipID": 5, "videoSubset": 13, "videoLength": 197, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She got along well with the people in her dorm.",
   "comprehensionQ2text": "She hated the dorm trip to Yosemite.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 115, "clipID": 5, "videoSubset": 13, "videoLength": 113, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His mom never expresses urgency over text.",
   "comprehensionQ2text": "His mom texted him to call her for trivial issues.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 129, "clipID": 3, "videoSubset": 13, "videoLength": 182, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She hated her job at Macy's.",
   "comprehensionQ2text": "She says she did not commit the fraud that she was accused of.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 137, "clipID": 2, "videoSubset": 13, "videoLength": 182, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her brother got into trouble for selling drugs.",
   "comprehensionQ2text": "Her sister started living in a car.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 141, "clipID": 6, "videoSubset": 13, "videoLength": 68,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His aunt and uncle do not have any pets.",
   "comprehensionQ2text": "He brought the dog back with his as his therapy animal.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 143, "clipID": 5, "videoSubset": 13, "videoLength": 111, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She traveled with her family after graduation.",
   "comprehensionQ2text": "She started a romantic relationship with an old friend on the trip.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 153, "clipID": 6, "videoSubset": 13, "videoLength": 101, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He did not have to work hard to secure his internship.",
   "comprehensionQ2text": "Getting his internship helped disprove the low expectations he had for himself.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 162, "clipID": 4, "videoSubset": 13, "videoLength": 154, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He felt that the relationship was his primary focus and he dropped a lot of other interests.",
   "comprehensionQ2text": "He describes the feeling of being in love as unpleasant.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 111, "clipID": 1, "videoSubset": 14, "videoLength": 242, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her child was a boy.",
   "comprehensionQ2text": "The woman had C-section surgery.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 113, "clipID": 3, "videoSubset": 14, "videoLength": 107, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He did well academically during his first semester in college.",
   "comprehensionQ2text": "His first job was a server at a restaruant.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 118, "clipID": 4, "videoSubset": 14, "videoLength": 105, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She grew up playing the Oboe since she was very young.",
   "comprehensionQ2text": "She fell in love with the Oboe when she tried it.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 164, "clipID": 5, "videoSubset": 14, "videoLength": 106, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She saved up her own money to buy her car.",
   "comprehensionQ2text": "She spent hours at the car dealership choosing between models.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 170, "clipID": 2, "videoSubset": 14, "videoLength": 47, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He didn't get along with the people who lived in his dorm.",
   "comprehensionQ2text": "The other students in his hall were quiet and didn't like to party.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 171, "clipID": 4, "videoSubset": 14, "videoLength": 173, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her mom decided to give away her dog without talking with her about it.",
   "comprehensionQ2text": "The night before she gave up her dog, she was so sad she couldn't even play with him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 179, "clipID": 6, "videoSubset": 14, "videoLength": 150, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His girlfriend was very reserved and not provocative.",
   "comprehensionQ2text": "He was devestated to learn that his girlfriend was unfaithful to him.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 180, "clipID": 3, "videoSubset": 14, "videoLength": 123, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He self-funded his travels to South Africa. ",
   "comprehensionQ2text": "He loved South Africa, and Cape Town is his favorite city.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 115, "clipID": 6, "videoSubset": 15, "videoLength": 194, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was not close with his dog.",
   "comprehensionQ2text": "The dog died in a hospital.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 116, "clipID": 1, "videoSubset": 15, "videoLength": 157, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was experiencing discomfort in her leg.",
   "comprehensionQ2text": "Her discomfort was a result of her birth control.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 127, "clipID": 5, "videoSubset": 15, "videoLength": 170, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "There was a sumo wrestling competition as one of the homecoming events.",
   "comprehensionQ2text": "Her team lost the competition.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 147, "clipID": 2, "videoSubset": 15, "videoLength": 103, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He moved from the U.S. to Canada when he was in high school.",
   "comprehensionQ2text": "He found it easy to make friends right away.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 154, "clipID": 4, "videoSubset": 15, "videoLength": 35,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His family was very proud of him when he gained admission.",
   "comprehensionQ2text": "He did not study hard at school.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 156, "clipID": 6, "videoSubset": 15, "videoLength": 189, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He forgot all of his preparation during the interview.",
   "comprehensionQ2text": "Securing the Teacher's Assistant position was an important goal to him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 163, "clipID": 5, "videoSubset": 15, "videoLength": 178, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her long-distance boyfriend came to visit her.",
   "comprehensionQ2text": "She confessed to her boyfriend that she cheated on him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 164, "clipID": 4, "videoSubset": 15, "videoLength": 92,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "This story is about a conversation with her best friends.",
   "comprehensionQ2text": "She feels that her friends are not very supportive. ",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  ],[
  {"participantID": 120, "clipID": 4, "videoSubset": 16, "videoLength": 142, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She ran a race with her best friend.",
   "comprehensionQ2text": "She did not finish the race.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 128, "clipID": 2, "videoSubset": 16, "videoLength": 112, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His mom kept checking on him and his brother as they were being punished.",
   "comprehensionQ2text": "He and his brother had to mop the floors for 2 hours as a punishment.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 147, "clipID": 5, "videoSubset": 16, "videoLength": 166, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He tried meditating and found it very unhelpful.",
   "comprehensionQ2text": "He feels that he is not as depressed or down as he used to be.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 161, "clipID": 1, "videoSubset": 16, "videoLength": 181, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She always wanted a cat growing up.",
   "comprehensionQ2text": "She put into a lot of time and effort into the research before getting a pet.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 165, "clipID": 3, "videoSubset": 16, "videoLength": 104, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He feels conflicted over flirting with more than one girl.",
   "comprehensionQ2text": "One of the girls who is interested in him has a boyfriend.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 171, "clipID": 4, "videoSubset": 16, "videoLength": 173, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her mom decided to give away her dog without talking with her about it.",
   "comprehensionQ2text": "The night before she gave up her dog, she was so sad she couldn't even play with him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 172, "clipID": 4, "videoSubset": 16, "videoLength": 188, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His father was clearly in a bad mood from the beginning of the day.",
   "comprehensionQ2text": "His dad was calm and composed throughout the family argument.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 173, "clipID": 3, "videoSubset": 16, "videoLength": 49,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He shot fireworks over the lake.",
   "comprehensionQ2text": "The holiday was Memorial Day.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 116, "clipID": 6, "videoSubset": 17, "videoLength": 122, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She went to Morocco on a service trip.",
   "comprehensionQ2text": "She felt that she did not gain anything from the trip.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 117, "clipID": 3, "videoSubset": 17, "videoLength": 125, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She had gone to overnight camp many times before this experience.",
   "comprehensionQ2text": "She is now comfortable being the 'new girl' in many situations now.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 118, "clipID": 1, "videoSubset": 17, "videoLength": 164, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was aware of the move before it happened.",
   "comprehensionQ2text": "She was excited to move from New York.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 165, "clipID": 4, "videoSubset": 17, "videoLength": 115, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He applied to several universities and was worried about money.",
   "comprehensionQ2text": "He recieved a full scholarship to a university that he really liked.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 168, "clipID": 1, "videoSubset": 17, "videoLength": 121, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His family had never all been to Stanford at the same time before his graduation.",
   "comprehensionQ2text": "His parents also attended and graduated from Stanford.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 172, "clipID": 1, "videoSubset": 17, "videoLength": 158, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "His parents were immigrants who were well assimilated into American culture.",
   "comprehensionQ2text": "He attended a summer program at MIT and surprised himself at how social he was.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 174, "clipID": 1, "videoSubset": 17, "videoLength": 88, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Someone replaced him as the starting quarterback, but he waited until the other person dropped off the team to reclaim his spot.",
   "comprehensionQ2text": "He got the Most Valuable Player reward that year for football.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 179, "clipID": 4, "videoSubset": 17, "videoLength": 185, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His dog got very obese under his mother's care.",
   "comprehensionQ2text": "Eventually, his dog died due to brain cancer.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 113, "clipID": 6, "videoSubset": 18, "videoLength": 118, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He describes himself as unmotivated and lazy.",
   "comprehensionQ2text": "He was eventually admitted to university. ",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 114, "clipID": 6, "videoSubset": 18, "videoLength": 182, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She gave the speech at her graduation.",
   "comprehensionQ2text": "The story is about graduation from college.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 116, "clipID": 2, "videoSubset": 18, "videoLength": 115, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She ignored her best friend because they had a huge fight.",
   "comprehensionQ2text": "She and her best friend carpooled together.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 129, "clipID": 4, "videoSubset": 18, "videoLength": 113, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She worked for an eye doctor after her divorce.",
   "comprehensionQ2text": "She did not pass the certification course.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 162, "clipID": 3, "videoSubset": 18, "videoLength": 171, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "When he came to visit her, it was as if nothing had changed between them.",
   "comprehensionQ2text": "After the breakup, he was able to focus more on his future and his goals.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 167, "clipID": 1, "videoSubset": 18, "videoLength": 96, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her father sent her a wedding invite but she could not make it.",
   "comprehensionQ2text": "She and her father don't see each other often since her parents got divorced.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 178, "clipID": 6, "videoSubset": 18, "videoLength": 130, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She gave a speech at her graduation.",
   "comprehensionQ2text": "She did not feel very connected with her high school.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 179, "clipID": 3, "videoSubset": 18, "videoLength": 163, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He met his current partner in graduate school.",
   "comprehensionQ2text": "He was orignally interested in Natasha's friend.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 113, "clipID": 4, "videoSubset": 19, "videoLength": 181, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His father and his mother were divorced.",
   "comprehensionQ2text": "He never confronted his mother about the things his dad told him.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 118, "clipID": 6, "videoSubset": 19, "videoLength": 126, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her and her friends were hanging out outside.",
   "comprehensionQ2text": "She and one of her friends discovered that they had romantic feelings for one another.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 124, "clipID": 6, "videoSubset": 19, "videoLength": 96,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her friend was vulnerable and open with her.",
   "comprehensionQ2text": "This event happened the first time she met this friend.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 128, "clipID": 6, "videoSubset": 19, "videoLength": 163, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was involved with crime because of underage drinking.",
   "comprehensionQ2text": "Rehab was an unhelpful experience for him, and he didn't change his habits.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 137, "clipID": 5, "videoSubset": 19, "videoLength": 171, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her nephew looks very similar to her.",
   "comprehensionQ2text": "Her nephew was born with some health problems and was in the ICU.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 151, "clipID": 6, "videoSubset": 19, "videoLength": 97, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He considers his father to be very supportive.",
   "comprehensionQ2text": "He describes his mom as unsupportive and harsh.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 174, "clipID": 6, "videoSubset": 19, "videoLength": 165, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He hurt himself during the first week of playing college football.",
   "comprehensionQ2text": "He hurt himself during college only once, and went on to have a successful athletic career.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 181, "clipID": 6, "videoSubset": 19, "videoLength": 126, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She got a very high grade on her first Chemistry midterm and felt confident about her academics.",
   "comprehensionQ2text": "She felt that everyone else deserved to be at her university more than she did.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 119, "clipID": 2, "videoSubset": 20, "videoLength": 107, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "This story is about her sister-in-law.",
   "comprehensionQ2text": "She helped a family member move from one place to another.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 130, "clipID": 1, "videoSubset": 20, "videoLength": 152, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She had lived abroad several times before this experience.",
   "comprehensionQ2text": "She felt that she did many of the things she wanted to do when she was abroad.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 131, "clipID": 1, "videoSubset": 20, "videoLength": 133, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He felt that high school was easy for him.",
   "comprehensionQ2text": "He sees his degrees as accomplishments that impact his life.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 145, "clipID": 1, "videoSubset": 20, "videoLength": 179, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her team did not place in the competition.",
   "comprehensionQ2text": "She hated being on the team and did not find it rewarding.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 149, "clipID": 3, "videoSubset": 20, "videoLength": 139, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She was a Fine Arts major in college.",
   "comprehensionQ2text": "After this internship, she felt connected to engineering.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 156, "clipID": 3, "videoSubset": 20, "videoLength": 140, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "His mother had a serious stomach virus. ",
   "comprehensionQ2text": "When he heard the diagnosis, he was very worried and troubled. ",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 163, "clipID": 2, "videoSubset": 20, "videoLength": 131, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She prefers to stay indoors most of the time.",
   "comprehensionQ2text": "She felt that her mood was affected by the weather in Boston.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 165, "clipID": 5, "videoSubset": 20, "videoLength": 83, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He ran as a member of student council and won.",
   "comprehensionQ2text": "He describes himself as popular in school.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 111, "clipID": 4, "videoSubset": 21, "videoLength": 172, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The woman completed the hike with both her son and daughter.",
   "comprehensionQ2text": "The hike was steep and difficult.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 114, "clipID": 4, "videoSubset": 21, "videoLength": 184, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Many people went to IHOP after the night was over.",
   "comprehensionQ2text": "She lost her keys and could never find them.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 117, "clipID": 5, "videoSubset": 21, "videoLength": 127, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She would not have done anything differently about parting ways with her friend.",
   "comprehensionQ2text": "She and her friend were never really that close.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "false"},
  {"participantID": 121, "clipID": 5, "videoSubset": 21, "videoLength": 77,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He traveled to South America before stuyding abroad.",
   "comprehensionQ2text": "He met his current girlfriend while he was abroad.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 145, "clipID": 2, "videoSubset": 21, "videoLength": 112, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She participated in the science team even though she didn't like it.",
   "comprehensionQ2text": "Her school placed first in the regional tournament.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 151, "clipID": 2, "videoSubset": 21, "videoLength": 47, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "It was painful saying goodbye to his family at the airport.",
   "comprehensionQ2text": "He is able to see and communicate with his family often.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 171, "clipID": 2, "videoSubset": 21, "videoLength": 179, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She was nervous and apprehensive before meeting her father.",
   "comprehensionQ2text": "When she met her father, she felt totally normal as if they were close her whole life.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 181, "clipID": 1, "videoSubset": 21, "videoLength": 165, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She tried to finish 12th grade in the U.S. after going to high school in Ghana.",
   "comprehensionQ2text": "She was sure she was going to get into Stanford.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 111, "clipID": 3, "videoSubset": 22, "videoLength": 192, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The woman bound several copies of her book.",
   "comprehensionQ2text": "The woman had always been interested in art.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 114, "clipID": 1, "videoSubset": 22, "videoLength": 186, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She danced with the studio for many years. ",
   "comprehensionQ2text": "She was sad when the dance studio closed, but got over it quickly.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 117, "clipID": 6, "videoSubset": 22, "videoLength": 117, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She believes she set herself up to fail in this situation.",
   "comprehensionQ2text": "She was able to deal with her stress in a healthy way.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 121, "clipID": 3, "videoSubset": 22, "videoLength": 119, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His story takes place before university.",
   "comprehensionQ2text": "His girlfriend was honest and they had a trusting relationship.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 128, "clipID": 5, "videoSubset": 22, "videoLength": 173, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "When he was in 8th grade, he became friends with kids in the 5th grade.",
   "comprehensionQ2text": "His new friends helped him mature and were his support system.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 147, "clipID": 3, "videoSubset": 22, "videoLength": 89, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His parents wanted him to study certain things in university.",
   "comprehensionQ2text": "He made friends in university and became more social.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"},
  {"participantID": 154, "clipID": 6, "videoSubset": 22, "videoLength": 48, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He never wanted to attend Stanford.",
   "comprehensionQ2text": "He gained admission to Stanford, fully funded.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 179, "clipID": 3, "videoSubset": 22, "videoLength": 163, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He met his current partner in graduate school.",
   "comprehensionQ2text": "He was orignally interested in Natasha's friend.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 119, "clipID": 4, "videoSubset": 23, "videoLength": 134, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her aunt is a young woman.",
   "comprehensionQ2text": "Her aunt lives by herself.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 123, "clipID": 4, "videoSubset": 23, "videoLength": 182, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The performance was a short play for a small audience.",
   "comprehensionQ2text": "He was cast as one of the wolves in Beauty and the Beast.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 124, "clipID": 2, "videoSubset": 23, "videoLength": 97, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She felt very nervous before her Bat Mitzvah.",
   "comprehensionQ2text": "The service was a disaster and she forgot her lines.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 135, "clipID": 3, "videoSubset": 23, "videoLength": 153, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "The first few days of orientation were very fun.",
   "comprehensionQ2text": "She wishes she went somewhere else for university.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 147, "clipID": 4, "videoSubset": 23, "videoLength": 120, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "His job was to be a server at a restaurant.",
   "comprehensionQ2text": "He was able to learn a lot about interesting topics while at work. ",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 165, "clipID": 7, "videoSubset": 23, "videoLength": 103, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "His parents own several expensive cars.",
   "comprehensionQ2text": "He stole his uncle's car to hang out with his friends.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 180, "clipID": 3, "videoSubset": 23, "videoLength": 123, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He self-funded his travels to South Africa. ",
   "comprehensionQ2text": "He loved South Africa, and Cape Town is his favorite city.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 181, "clipID": 3, "videoSubset": 23, "videoLength": 103, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her and her friends did a hike at night even though the trail was closed.",
   "comprehensionQ2text": "The view from the trail at night was stunning and she could see so many stars.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"}
  ],[
  {"participantID": 116, "clipID": 5, "videoSubset": 24, "videoLength": 94,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "Her trip was amazing from the beginning.",
   "comprehensionQ2text": "She likes to think back on her trip and remember how good she felt.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 117, "clipID": 4, "videoSubset": 24, "videoLength": 161, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She did not injure herself until her last year of her college career.",
   "comprehensionQ2text": "She tore the ACL on both of her knees.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 123, "clipID": 1, "videoSubset": 24, "videoLength": 164, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was very close to his granfather growing up.",
   "comprehensionQ2text": "His dad told him the news about his grandfather passing.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 129, "clipID": 1, "videoSubset": 24, "videoLength": 199, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her son was in a car accident that put him in a coma.",
   "comprehensionQ2text": "Her son was presumed dead but came out of the coma.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 154, "clipID": 1, "videoSubset": 24, "videoLength": 35,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He and his girlfriend fought a lot.",
   "comprehensionQ2text": "He looks back on the relationship as a happy time.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 164, "clipID": 3, "videoSubset": 24, "videoLength": 176, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "Her relationship lasted a very short time.",
   "comprehensionQ2text": "Her friend had a dream about her when she broke up with her boyfriend.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 179, "clipID": 1, "videoSubset": 24, "videoLength": 153, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He spearheaded the planning for his mother's birthday party.",
   "comprehensionQ2text": "He was dissapointed that his mother did not seem to appreciate the party.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 180, "clipID": 5, "videoSubset": 24, "videoLength": 85,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He won a sponsored fellowship to do research in the United States.",
   "comprehensionQ2text": "The experience was stressful for him, and he did not enjoy being in the States.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"}
  ],[
  {"participantID": 121, "clipID": 1, "videoSubset": 25, "videoLength": 118, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "He was accepted to his top choice college.",
   "comprehensionQ2text": "He was alone when he recieved his acceptance letter.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 129, "clipID": 7, "videoSubset": 25, "videoLength": 150, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her son became unconscious after playing in the sand pit.",
   "comprehensionQ2text": "She had a premonition that something bad would happen that day.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 144, "clipID": 3, "videoSubset": 25, "videoLength": 182, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "Her grandather dying was her first experience with death.",
   "comprehensionQ2text": "Her grandfather played for the NFL.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 145, "clipID": 4, "videoSubset": 25,  "videoLength": 193, "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "She knew that she was being sent to the hospital when she went back to California.",
   "comprehensionQ2text": "She struggled with mental health and weight issues.",
   "comprehensionQ1ans": "false", "comprehensionQ2ans": "true"},
  {"participantID": 151, "clipID": 6, "videoSubset": 25, "videoLength": 97,  "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "He considers his father to be very supportive.",
   "comprehensionQ2text": "He describes his mom as unsupportive and harsh.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 165, "clipID": 1, "videoSubset": 25, "videoLength": 111, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "His parents experienced financial issues as he was growing up. ",
   "comprehensionQ2text": "He was eating a bowl of pasta in the story.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 169, "clipID": 4, "videoSubset": 25, "videoLength": 104, "cropped": 0, "startTime": 0,
   "comprehensionQ1text": "She did a lot of touristy things in New York City with her family.",
   "comprehensionQ2text": "She hated her first time in New York and thought it was too crowded.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "false"},
  {"participantID": 170, "clipID": 7, "videoSubset": 25, "videoLength": 69,  "cropped": 1, "startTime": 0,
   "comprehensionQ1text": "The woman he is talking about is someone who supports him.",
   "comprehensionQ2text": "Their relationship is stronger because they spent some time apart.",
   "comprehensionQ1ans": "true", "comprehensionQ2ans": "true"}
]]

function find_video(video_label_str) {
  var res = video_label_str.split("_");
  var participant_id = parseInt(res[0], 10)
  var clip_id = parseInt(res[1], 10)
  for (var i = 0; i < population_videos.length; i++) {
    for (var j = 0; j < population_videos[i].length; j++)
      if (population_videos[i][j]["participantID"] == participant_id && population_videos[i][j]["clipID"] == clip_id) {
        return population_videos[i][j];
      }
  }
}
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
        style.width = "100%";
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

  video_channel_list: [],

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

  IRI_EC: -1, IRI_PT: -1, IRI_PD: -1,
  
  LTE_1:-1, LTE_2:-1, LTE_3:-1, LTE_4:-1, LTE_5:-1, LTE_6:-1,

  LTE:-1,

  // Demographics
  gender: "",
  age:"",
  
  race:"",
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
  if ($('input[name="IRI_EC_1"]:checked').val()!=null &&
      $('input[name="IRI_EC_2R"]:checked').val()!=null &&
      $('input[name="IRI_EC_3"]:checked').val()!=null &&
      $('input[name="IRI_EC_4R"]:checked').val()!=null &&
      $('input[name="IRI_EC_5R"]:checked').val()!=null &&
      $('input[name="IRI_EC_6"]:checked').val()!=null &&
      $('input[name="IRI_EC_7"]:checked').val()!=null &&
      $('input[name="IRI_PT_1R"]:checked').val()!=null &&
      $('input[name="IRI_PT_2"]:checked').val()!=null &&
      $('input[name="IRI_PT_3"]:checked').val()!=null &&
      $('input[name="IRI_PT_4R"]:checked').val()!=null &&
      $('input[name="IRI_PT_5"]:checked').val()!=null &&
      $('input[name="IRI_PT_6"]:checked').val()!=null &&
      $('input[name="IRI_PT_7"]:checked').val()!=null &&
      $('input[name="IRI_PD_1"]:checked').val()!=null &&
      $('input[name="IRI_PD_2"]:checked').val()!=null &&
      $('input[name="IRI_PD_3R"]:checked').val()!=null &&
      $('input[name="IRI_PD_4"]:checked').val()!=null &&
      $('input[name="IRI_PD_5R"]:checked').val()!=null &&
      $('input[name="IRI_PD_6"]:checked').val()!=null &&
      $('input[name="IRI_PD_7"]:checked').val()!=null &&
      $('input[name="LTE_1"]:checked').val()!=null &&
      $('input[name="LTE_2"]:checked').val()!=null &&
      $('input[name="LTE_3"]:checked').val()!=null &&
      $('input[name="LTE_4"]:checked').val()!=null &&
      $('input[name="LTE_5"]:checked').val()!=null &&
      $('input[name="LTE_6"]:checked').val()!=null
      ) {
      return true;
  } else {
      alert ( "Please answer all the questions." );
      return false;    
  }
}

function validateDemographicsCheck() {
  if ($('input[name="genderButton"]:checked').val()!=null &&
      $('input[name="raceButton"]:checked').val()!=null &&
      $('input[name="ethnicityButton"]:checked').val()!=null &&
      $('#ageRange').val().trim() != '' &&
      $('input[name="nativeLanguage"]').val().trim() != '') {
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

var chartOptions = {
  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines : true,
  //String - Colour of the grid lines
  scaleGridLineColor : "rgba(0,0,0,.05)",
  //Number - Width of the grid lines
  scaleGridLineWidth : 1,
  //Boolean - Whether to show horizontal lines (except X axis)
  scaleShowHorizontalLines: true,
  //Boolean - Whether to show vertical lines (except Y axis)
  scaleShowVerticalLines: true,
  //Boolean - Whether the line is curved between points
  bezierCurve : true,
  //Number - Tension of the bezier curve between points
  bezierCurveTension : 0.4,
  //Boolean - Whether to show a dot for each point
  pointDot : true,
  //Number - Radius of each point dot in pixels
  pointDotRadius : 4,
  //Number - Pixel width of point dot stroke
  pointDotStrokeWidth : 1,
  //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
  pointHitDetectionRadius : 20,
  //Boolean - Whether to show a stroke for datasets
  datasetStroke : true,
  //Number - Pixel width of dataset stroke
  datasetStrokeWidth : 2,
  //Boolean - Whether to fill the dataset with a colour
  datasetFill : true,
  //String - A legend template
  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
  //Boolean - Whether to horizontally center the label and point dot inside the grid
  offsetGridLines : false
};

var chartData = {
  labels: ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s","9s","10s", "11s"],
  datasets: [
    {
      label: "Baseline Ratings",
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: [65, 59, 80, 81, 56, 55, 40, 88, 55, 44, 76]
    },
    {
      label: "Your Ratings",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      //data: [65, 59, 80, 81, 56, 55, 40, 88, 55, 44]
      data: []
    }
  ]
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
    experimentResults.videoGroup = Math.floor(Math.random() * 3) +1;
    var videos_corp = in_sample_videos[experimentResults.videoGroup]

    // start video number 1~8; if it is 5, then play 5, 6, 7, 8, 1, 2, 3, 4
    var video_list = [-1, -1, -1, -1, -1, -1, -1, -1]
    var random_start = Math.floor(Math.random() * 8) +1;
    var index = 0
    for (var i = random_start; i < 9; i++) {
      video_list[index] = i
      index += 1
    }
    for (var i = 1; i < random_start; i++) {
      video_list[index] = i
      index += 1
    }
    // 1:audio only;2:visual only;3:both
    var video_channel_list = [-1, -1, -1, -1, -1, -1, -1, -1]
    if (Math.floor(Math.random()) < 0.5) {
      video_channel_list = [3, 1, 2, 1, 3, 2, 1, 2]
    } else {
      video_channel_list = [3, 2, 1, 2, 3, 1, 2, 1]
    }
    experimentResults.video_channel_list = video_channel_list
    //console.log(video_list)
    for (var i = 0; i < numExperiments; i++) {
      var video_label_str = videos_corp[video_list[i] - 1]
      var temp_video = find_video(video_label_str)
      var temp_video_name = ""
      if (temp_video["cropped"]) {
        temp_video_name = "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_crop_downsized.mp4"
      } else {
        temp_video_name = "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_downsized.mp4"
      }
      //var name = '/sample_2.mp4';
      experimentResults.videoClips[i] = temp_video_name;
      experimentResults.comprehensionCheckQ1[i] = temp_video["comprehensionQ1text"]
      experimentResults.comprehensionCheckQ2[i] = temp_video["comprehensionQ2text"]
      experimentResults.comprehensionCheckQ1Answer[i] = temp_video["comprehensionQ1ans"]
      experimentResults.comprehensionCheckQ2Answer[i] = temp_video["comprehensionQ2ans"]
    }
    // dummy code log out video names
    // var temp_names = []
    // for (var i = 0; i < 4; i++) {
    //   for (var j = 0; j < 8; j++) {
    //     var temp_video = find_video(in_sample_videos[i][j])
    //     var temp_video_name = ""
    //     if (temp_video["cropped"]) {
    //       temp_video_name = "import " + "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_crop_downsized" + " from " + './test_videos/' + "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_crop_downsized.mp4"
    //     } else {
    //       temp_video_name = "import " + "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_downsized" + " from " + './test_videos/' + "ID" + temp_video["participantID"] + "_vid" + temp_video["clipID"] + "_downsized.mp4"
    //     }
    //     temp_names.push(temp_video_name)
    //   }
    // }
    // console.log(temp_names)
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
   setTimeout(function() { turk.submit(experimentResults);}, 1500);
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
          return (<Experiments value={this.state.experimentCount} onClickParent={() => this.buttonCallback()}/>);
      // case 3:
      //     // TODO: Logic has to be changed as well
      //     return (<ValenceRatingResults value={experimentResults.video_rating_data} onClickParent={() => this.buttonCallback()}/>);
      case 3:
          // experiments video 1 comprehension
          return (<CompQuestionnaire value={this.state.experimentCount} onClickParent={() => this.buttonCallbackNextExperiment()}/>);
      case 4:
          // table questions for emotion
          return (<TableQuestionnaireIntro onClickParent={() => this.buttonCallback()}/>);
      case 5:
          // table questions for emotion
          return (<TableQuestionnaire onClickParent={() => this.buttonCallback()}/>);
      case 6:
          // demo questions
          return (<InfoQuestionnaire onClickParent={() => this.buttonCallbackEnd()}/>);
      case 7:
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

// This very first page before introduction
class ValenceRatingResults extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    console.log(chartData)
    return (      
      <div className="intropage">
        <h1>Your ratings comparing to others!</h1>
        <p>
            <br></br><br></br>
        
        <LineChart id="myChart" data={chartData} options={chartOptions} width="600" height="250"/>
        </p>
        <h2>Compared to the true values, you accuracy (based on p-value): 98%</h2>
        <br></br><br></br>
        <div name="gender" className="demographic-div">
            <span id="infoQgender"> How would you rate your experience on this website ? </span>&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="x" value="1" />&nbsp;&nbsp; Bad &nbsp;&nbsp; <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="x" value="2" />&nbsp;&nbsp; Ok <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="x" value="3" />&nbsp;&nbsp; Awesome <br/>
          </div>
        <br></br><br></br>
        <button type="button" onClick={() => this.props.onClickParent()}>Next</button>
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
          <Line strokeWidth="2" percent={this.props.value} trailWidth = '2'/>
        </div>
        <h3>Experiments Progress {this.props.value}%</h3>
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
        <ProgressBar value={0}/>
        <h1>Instructions</h1>
        <p>
            Need Update: In this task, you will watch 8 videos of people describing 
            emotional events that happened in their lives, and answer 
            several questions about them. The videos range from between 
            0.5 mins to 4 mins, and the total duration of the 8 videos 
            will be less than 20 minutes.
            <br></br><br></br>
            Need Update: While watching these videos, we would like you to rate how 
            you believe the person in the video feels feeling at every 
            moment in time. Please pay special attention to the momentary 
            changes in emotion you see in this person. For instance, someone
             describing a sad event might nonetheless feel relatively more or
              less negative at different moments.
            <br></br><br></br>
            Need Update: Please make your ratings using the slider below the video. 
            Whenever you want to change your rating, simply click on the 
            round "handle" of this slider and move the slider to wherever you like.
            <br></br><br></br>
            Need Update: Far left indicates "Very negative", and far right indicates 
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
      this.finishVideoLoading = this.finishVideoLoading.bind(this);
      this.state = {
          isButtonDisabled: true,
          isVidPlayed: false,
          buttonText: "Loading",
          videoRatings: 50,
          videoRatingsSet: [50]
      }
  }
  onPlayClicked (event) {
    // for testing you can uncomment these two lines
    // this.props.onClickParent()
    // return 
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
        chartData.datasets[1].data = self.state.videoRatingsSet
      }
    }
  }
  recordVideoRatings = (value) => {
    //console.log(value);
    this.setState({
      videoRatings: value
    });
  }
  finishVideoLoading(event) {
    var self = this;
    event.preventDefault();
    self.setState({
      isButtonDisabled: false,
      buttonText: "Play",
    });
  }
  render() {
    var temp_video_name = "https://web.stanford.edu/~wuzhengx/SSNL/EmotionalTest/Downsized%20Files/" + experimentResults.videoClips[this.props.value]
    if ((experimentResults.video_channel_list[this.props.value] == 1)) {
      return (
        <div className = 'experiments'>
          <ProgressBar value={this.props.value*10}/>
          <div className = 'intropage'>
            <br></br><br></br>
            <p id="question"> 
                <b>You will only hear voices in this trial.</b> Click on the play button to start the video. Please rate how you believe the person in the video is feeling at every moment in time, and remember to <b>make your ratings throughout the video</b>.
            </p>
            <div className = 'videoplayerhide'>      
              <video width="100" height="60" id="expvideo" onCanPlayThrough={this.finishVideoLoading}>
                <source preload="auto" poster={loading} src={temp_video_name} type="video/mp4"/>
              </video>
            </div>
            <button id="vidButton" type="button" disabled={this.state.isButtonDisabled} onClick={this.onPlayClicked}>{this.state.buttonText}</button>
          </div>
          <ScoringSlidingBar handleRecordVideoRatings={this.recordVideoRatings}/>
        </div>
      );
    } else if ((experimentResults.video_channel_list[this.props.value] == 2)) {
      return (
        <div className = 'experiments'>
          <ProgressBar value={this.props.value*10}/>
          <div className = 'intropage'>
            <br></br><br></br>
            <p id="question"> 
                <b>You will only be able to see the video without sound. The video is muted by us on purpose.</b> Click on the play button to start the video. Please rate how you believe the person in the video is feeling at every moment in time, and remember to <b>make your ratings throughout the video</b>.
            </p>
            <div className = 'videoplayer'>  
              <video width="500" height="350" id="expvideo" muted="muted" onCanPlayThrough={this.finishVideoLoading}>
                <source preload="auto" poster={loading} src={temp_video_name} type="video/mp4"/>
              </video>
            </div>
            <button id="vidButton" type="button" disabled={this.state.isButtonDisabled} onClick={this.onPlayClicked}>{this.state.buttonText}</button>
          </div>
          <ScoringSlidingBar handleRecordVideoRatings={this.recordVideoRatings}/>
        </div>
      );
    } else {
      return (
        <div className = 'experiments'>
          <ProgressBar value={this.props.value*10}/>
          <div className = 'intropage'>
            <br></br><br></br>
            <p id="question"> 
                <b>When you see the first frame of the video</b>, click on the play button to start the video. Please rate how you believe the person in the video is feeling at every moment in time, and remember to <b>make your ratings throughout the video</b>.
            </p>
            <div className = 'videoplayer'>     
              <video width="500" height="350" id="expvideo" onCanPlayThrough={this.finishVideoLoading}>
                <source preload="auto" poster={loading} src={temp_video_name} type="video/mp4"/>
              </video>
            </div>
            <button id="vidButton" type="button" disabled={this.state.isButtonDisabled} onClick={this.onPlayClicked}>{this.state.buttonText}</button>
          </div>
          <ScoringSlidingBar handleRecordVideoRatings={this.recordVideoRatings}/>
        </div>
      );
    }
    
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
    if (experimentResults.video_channel_list[this.props.value] != 2) {
      return (
        <div className = 'compquestionnaire'>
        <ProgressBar value={this.props.value*10}/>
          <br></br>
          <br></br>
            <p id="question"> 
              Please answer the following questions regarding the video that you just watched. <br></br>
            </p>
            <br/>
            <p id="question">{experimentResults.comprehensionCheckQ1[this.props.value]}</p>
            <ul id="answers">
              <input type="radio" name="comprehensionQ1" value="true" id="q1a" />&nbsp; &nbsp;True &nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" name="comprehensionQ1" value="false" id="q1b" />&nbsp; &nbsp;False
            </ul>
            <br></br>
            <p id="question">{experimentResults.comprehensionCheckQ2[this.props.value]}</p>
            <ul id="answers">
              <input type="radio" name="comprehensionQ2" value="true" id="q2a" />&nbsp; &nbsp;True &nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" name="comprehensionQ2" value="false" id="q2b" />&nbsp; &nbsp;False
            </ul>
            <br></br>
            <br></br>
            <button type="button" onClick={() => {if(validateComprehensionCheck()){this.props.onClickParent();this.recordValues()}}}>Next</button>
        </div>
      );
    } else {
      return (
        <div className = 'compquestionnaire'>
        <ProgressBar value={this.props.value*10}/>
          <br></br>
          <br></br>
            <p id="question"> 
              In the last trial, you are asked to evaluate only based on visual contents. Thus, you are not asked to answer
              any comprehension question here. <br></br>
            </p>
            <br></br>
            <button type="button" onClick={() => {if(1){this.props.onClickParent();this.recordValues()}}}>Next</button>
        </div>
      );
    }
    
  }
}

// Peronsal questionnaire
class TableQuestionnaireIntro extends Component {
  render() {
    return (
      <div className = 'personalquestionnaire'>
      <ProgressBar  value={80}/>
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
    experimentResults.IRI_EC1 = parseInt($('input[name="IRI_EC_1"]:checked').val(), 10);
    experimentResults.IRI_EC2R = parseInt($('input[name="IRI_EC_2R"]:checked').val(), 10);
    experimentResults.IRI_EC3 = parseInt($('input[name="IRI_EC_3"]:checked').val(), 10);
    experimentResults.IRI_EC4R = parseInt($('input[name="IRI_EC_4R"]:checked').val(), 10);
    experimentResults.IRI_EC5R = parseInt($('input[name="IRI_EC_5R"]:checked').val(), 10);
    experimentResults.IRI_EC6 = parseInt($('input[name="IRI_EC_6"]:checked').val(), 10);
    experimentResults.IRI_EC7 = parseInt($('input[name="IRI_EC_7"]:checked').val(), 10);

    experimentResults.IRI_PT1R = parseInt($('input[name="IRI_PT_1R"]:checked').val(), 10);
    experimentResults.IRI_PT2 = parseInt($('input[name="IRI_PT_2"]:checked').val(), 10);
    experimentResults.IRI_PT3 = parseInt($('input[name="IRI_PT_3"]:checked').val(), 10);
    experimentResults.IRI_PT4R = parseInt($('input[name="IRI_PT_4R"]:checked').val(), 10);
    experimentResults.IRI_PT5 = parseInt($('input[name="IRI_PT_5"]:checked').val(), 10);
    experimentResults.IRI_PT6 = parseInt($('input[name="IRI_PT_6"]:checked').val(), 10);
    experimentResults.IRI_PT7 = parseInt($('input[name="IRI_PT_7"]:checked').val(), 10);

    experimentResults.IRI_PD1 = parseInt($('input[name="IRI_PD_1"]:checked').val(), 10);
    experimentResults.IRI_PD2 = parseInt($('input[name="IRI_PD_2"]:checked').val(), 10);
    experimentResults.IRI_PD3R = parseInt($('input[name="IRI_PD_3R"]:checked').val(), 10);
    experimentResults.IRI_PD4 = parseInt($('input[name="IRI_PD_4"]:checked').val(), 10);
    experimentResults.IRI_PD5R = parseInt($('input[name="IRI_PD_5R"]:checked').val(), 10);
    experimentResults.IRI_PD6 = parseInt($('input[name="IRI_PD_6"]:checked').val(), 10);
    experimentResults.IRI_PD7 = parseInt($('input[name="IRI_PD_7"]:checked').val(), 10);

    experimentResults.LTE_1 = parseInt($('input[name="LTE_1"]:checked').val(), 10);
    experimentResults.LTE_2 = parseInt($('input[name="LTE_2"]:checked').val(), 10);
    experimentResults.LTE_3 = parseInt($('input[name="LTE_3"]:checked').val(), 10);
    experimentResults.LTE_4 = parseInt($('input[name="LTE_4"]:checked').val(), 10);
    experimentResults.LTE_5 = parseInt($('input[name="LTE_5"]:checked').val(), 10);
    experimentResults.LTE_6 = parseInt($('input[name="LTE_6"]:checked').val(), 10);

    experimentResults.IRI_EC = (experimentResults.IRI_EC1 + experimentResults.IRI_EC2R + experimentResults.IRI_EC3 + experimentResults.IRI_EC4R + experimentResults.IRI_EC5R + experimentResults.IRI_EC6 + experimentResults.IRI_EC7)
    experimentResults.IRI_PT = (experimentResults.IRI_PT1R + experimentResults.IRI_PT2 + experimentResults.IRI_PT3 + experimentResults.IRI_PT4R + experimentResults.IRI_PT5 + experimentResults.IRI_PT6 + experimentResults.IRI_PT7)
    experimentResults.IRI_PD = (experimentResults.IRI_PD1 + experimentResults.IRI_PD2 + experimentResults.IRI_PD3R + experimentResults.IRI_PD4 + experimentResults.IRI_PD5R + experimentResults.IRI_PD6 + experimentResults.IRI_PD7)
    experimentResults.LTE = (experimentResults.LTE_1 + experimentResults.LTE_2 + experimentResults.LTE_3 + experimentResults.LTE_4 + experimentResults.LTE_5 + experimentResults.LTE_6)
  }
  render() {
    return (
      <div className = 'tablequestionnaire'>
        <ProgressBar  value={80}/>
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
                                <input type="radio" name="IRI_EC_1" value="0" /> &nbsp;&nbsp;
                                <input type="radio" name="IRI_EC_1" value="1" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_1" value="2" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_1" value="3" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_1" value="4" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td>

                Sometimes I don't feel very sorry for other people when they are having problems.

            </td><td> 
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_2R" value="4" /> &nbsp;&nbsp;
                                <input type="radio" name="IRI_EC_2R" value="3" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_2R" value="2" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_2R" value="1" /> &nbsp;&nbsp;   
                                <input type="radio" name="IRI_EC_2R" value="0" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                When I see someone being taken advantage of, I feel kind of protective towards them.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_3" value="0" /> &nbsp;&nbsp;     
                                <input type="radio" name="IRI_EC_3" value="1" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_EC_3" value="2" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_EC_3" value="3" /> &nbsp;&nbsp;    
                                <input type="radio" name="IRI_EC_3" value="4" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td>

                Other people's misfortunes do not usually disturb me a great deal.

            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_4R" value="4" /> &nbsp;&nbsp;  
                                <input type="radio" name="IRI_EC_4R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_4R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_4R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_4R" value="0" /> &nbsp;&nbsp;
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                When I see someone being treated unfairly, I sometimes don't feel very much pity for them.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_5R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_5R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_5R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_5R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_5R" value="0" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I am often quite touched by things that I see happen.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_6" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_6" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_6" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_6" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_6" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I would describe myself as a pretty soft-hearted person.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_EC_7" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_7" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_7" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_7" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_EC_7" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 50}}></tr>
            <tr><td> 

                In emergency situations, I feel apprehensive and ill-at-ease.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_1" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_1" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_1" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_1" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_1" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I sometimes feel helpless when I am in the middle of a very emotional situation.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_2" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_2" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_2" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_2" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_2" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                When I see someone get hurt, I tend to remain calm.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_3R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_3R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_3R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_3R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_3R" value="0" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                Being in a tense emotional situation scares me.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_4" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_4" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_4" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_4" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_4" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I am usually pretty effective in dealing with emergencies.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_5R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_5R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_5R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_5R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_5R" value="0" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I tend to lose control during emergencies.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_6" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_6" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_6" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_6" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_6" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                When I see someone who badly needs help in an emergency, I go to pieces.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PD_7" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_7" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_7" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_7" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PD_7" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 50}}></tr>
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

                I sometimes find it difficult to see things from the "other guy's" point of view.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_1R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_1R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_1R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_1R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_1R" value="0" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I try to look at everybody's side of a disagreement before I make a decision.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_2" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_2" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_2" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_2" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_2" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I sometimes try to understand my friends better by imagining how things look from their perspective.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_3" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_3" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_3" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_3" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_3" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                If I'm sure I'm right about something, I don't waste much time listening to other people's arguments.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_4R" value="4" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_4R" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_4R" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_4R" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_4R" value="0" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                I believe that there are two sides to every question and try to look at them both.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_5" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_5" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_5" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_5" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_5" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                When I'm upset at someone, I usually try to "put myself in his shoes" for a while.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_6" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_6" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_6" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_6" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_6" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                Before criticizing somebody, I try to imagine how I would feel if I were in their place.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="IRI_PT_7" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_7" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_7" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_7" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="IRI_PT_7" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 50}}></tr>
            <tr><td> 

                A person’s level of empathy is something very basic about them, and it can’t be changed much.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_1" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_1" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_1" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_1" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_1" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                People can always change how much empathy they generally feel for others.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_2" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_2" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_2" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_2" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_2" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                People can’t really change how much empathy they tend to feel for others. Some people are very empathic and some aren’t and they can’t change that much. 
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_3" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_3" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_3" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_3" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_3" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                No matter who somebody is, they can always change how empathic a person they are.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_4" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_4" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_4" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_4" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_4" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                Whether a person is empathic or not is deeply ingrained in their personality. It cannot be changed very much.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_5" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_5" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_5" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_5" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_5" value="4" /> &nbsp;&nbsp; 
            </td></tr>
            <tr style={{height: 10}}></tr>
            <tr><td> 

                Anybody can change how empathic a person they are.
            
            </td><td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  
                                <input type="radio" name="LTE_6" value="0" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_6" value="1" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_6" value="2" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_6" value="3" /> &nbsp;&nbsp; 
                                <input type="radio" name="LTE_6" value="4" /> &nbsp;&nbsp; 
            </td></tr>

        </table>
        <button type="button" onClick={() => {if(ValidateQuestionnairesSlide()){this.props.onClickParent();this.recordValues()}}}>Next</button>
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

    experimentResults.race = $('input[name="raceButton"]:checked').val();

    experimentResults.ethnicity = $('input[name="ethnicityButton"]:checked').val();
    experimentResults.nativeLanguage = $('input[name="nativeLanguage"]').val();
    experimentResults.comments = $('textarea[name="commentsTextArea"]').val();
  }
  render() {
    return (
      <div className = 'infoquestionnaire'>
        <ProgressBar  value={90}/>
        <center>
          <div id="form">
          <p id="infoQ"> <b> You have come to the final slide. We would like to find out a little more about yourself. </b></p>

          <br/>
          <div name="gender" className="demographic-div">
            <span id="infoQgender"> What gender do you identify with? </span>&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="M" />&nbsp;&nbsp; Male &nbsp;&nbsp; <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="F" />&nbsp;&nbsp; Female <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="genderButton" value="NA" />&nbsp;&nbsp; Rather Not Say <br/>
          </div>
          
          <br/><br/>
          
          <div name="age" className="demographic-div">
            <span id="infoQage">What is your age?</span> &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" id="ageRange" /><br />
          </div>
          
          <br/><br/>

          <div name="race" className="demographic-div">
            <span id="infoQrace"> What racial category do you identify with?</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="AmIndian" />
            &nbsp;&nbsp;&nbsp;&nbsp;American Indian / Alaska Native <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="Asian" />
            &nbsp;&nbsp;&nbsp;&nbsp;Asian <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="NativeHawaiian" />
            &nbsp;&nbsp;&nbsp;&nbsp;American Indian / Alaska Native <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="Black" />
            &nbsp;&nbsp;&nbsp;&nbsp;Black or African American <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="White" />
            &nbsp;&nbsp;&nbsp;&nbsp;White<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="raceButton" value="NA" />
            &nbsp;&nbsp;&nbsp;&nbsp;Rather Not Say<br/>
          </div>
          
          <br/><br/>

          <div name="ethnicity" className="demographic-div">
          <span id="infoQrace"> What ethnic category do you identify with? </span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="hispanic" /> 
          &nbsp;&nbsp;&nbsp;&nbsp;Hispanic or Latino <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="notHispanic" /> 
          &nbsp;&nbsp;&nbsp;&nbsp;Not Hispanic or Latino<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="ethnicityButton" value="NA" /> 
          &nbsp;&nbsp;&nbsp;&nbsp;Rather Not Say <br/>
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
          <button type="button" onClick={() => {if(validateDemographicsCheck()){this.props.onClickParent();this.recordValues()}}}>Next</button>
        </center>
      </div>
    );
  }
}

class EndPage extends Component {
  render() {
    return (      
      <div className="intropage">
        <ProgressBar  value={100}/>
        <center>
          <br/><br/>
          <img src={logo} width="300" height="180" alt="logo"/>
          <h1>Stanford Social Neuroscience Lab</h1>
          <br/><br/>
          <h2> You're finished with this task. Thanks for participating! The experiment will automatically inform Amazon that you have completed the task.</h2>
          <br/><br/>
          <h2> Thanks you for your time! Your contribution means a lot to us!</h2>
          <br/><br/>
          <br/><br/>
        </center>
      </div>
    );
  }
}

export default App;

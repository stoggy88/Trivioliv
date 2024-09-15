//Declaring quesiton and answer display
const questionDisplay = document.querySelector('.question-container')
const answerDisplay = document.querySelector('.answer-container')

// Declaring game setting variables
var number_of_questions = 10;
var time_per_question = 5;
var time_per_answer = 5;
var game_started = false;
var menu_hidden = false;
var current_question_category = null;
let pauseFlag = false;

// Declaring banned category/difficulty/era lists
var category_list = [];
var difficulty_list = [];
var era_list = [];

// Declaring variables for ALL/NONE buttons
var all_none_categories = true;
var all_none_difficulties = true;
var all_none_eras = true;
var categoryButtons = document.querySelectorAll('.category');
var difficultyButtons = document.querySelectorAll('.difficulty');
var eraButtons = document.querySelectorAll('.era');

// Declaring of mapping of category, difficulty, and era numbers to their respective names
var category_number_identities = {
    1: 'Art',
    2: 'Economics',
    3: 'Food',
    4: 'Games',
    5: 'Geography',
    6: 'History',
    7: 'Human body',
    8: 'Language',
    9: 'Literature',
    10: 'Math',
    11: 'Miscellaneous',
    12: 'Movies',
    13: 'Music',
    14: 'Nature',
    15: 'Philosophy',
    16: 'Politics',
    17: 'Pop culture',
    18: 'Science',
    19: 'Sports',
    20: 'Technology',
    21: 'Television',
    22: 'Performing arts',
    23: 'Theology',
    24: 'Video games'
}

var difficulty_number_identities = {
    5: 'Genius',
    4: 'Sharp',
    3: 'Average',
    2: 'Easy',
    1: 'Casual'
}

var era_number_identities = {
    1: 'Pre-1500',
    2: '1500-1800',
    3: '1800-1900',
    4: '1900-1950',
    5: '1950s',
    6: '1960s',
    7: '1970s',
    8: '1980s',
    9: '1990s',
    10: '2000s',
    11: '2010s',
    12: '2020s'
}

// Mapping of category names to their associated colors
var category_colors = {
'Art': 'linear-gradient(345deg, rgba(165,50,27,1) 0%, rgba(221,126,107,1) 100%)',

'Economics': 'linear-gradient(345deg, rgba(17,68,16,1) 0%, rgba(89,140,88,1) 100%)',

'Food': 'linear-gradient(345deg, rgba(127,43,11,1) 0%, rgba(242,133,0,1) 100%)',

'Games': 'linear-gradient(345deg, rgba(103,38,24,1) 0%, rgba(204,85,0,1) 100%)',

'Geography': 'linear-gradient(345deg, rgba(61,38,19,1) 0%, rgba(154,123,79,1) 100%)',

'History': 'linear-gradient(345deg, rgba(241,194,50,1) 0%, rgba(241,154,50,1) 100%)',

'Human Body': 'linear-gradient(345deg, rgba(106,77,20,1) 0%, rgba(180,130,32,1) 100%)',

'Language': 'linear-gradient(345deg, rgba(28,60,133,1) 0%, rgba(102,147,245,1) 100%)',

'Law': 'linear-gradient(345deg, rgba(189,76,51,1) 0%, rgba(111,62,51,1) 100%)',

'Literature': 'linear-gradient(345deg, rgba(202,128,39,1) 0%, rgba(217,157,41,1) 100%)',

'Math': 'linear-gradient(345deg, rgba(63,61,54,1) 0%, rgba(101,99,92,1) 100%)',

'Miscellaneous': 'linear-gradient(345deg, rgba(13,109,122,1) 0%, rgba(18,168,152,1) 100%)',

'Movies': 'linear-gradient(345deg, rgba(184,34,34,1) 0%, rgba(102,0,0,1) 100%)',

'Music': 'linear-gradient(345deg, rgba(9,110,62,1) 0%, rgba(29,185,84,1) 100%)',

'Nature': 'linear-gradient(345deg, rgba(8,83,27,1) 0%, rgba(4,57,39,1) 100%)',

'Philosophy': 'linear-gradient(345deg, rgba(89,61,128,1) 0%, rgba(151,95,172,1) 100%)',

'Politics': 'linear-gradient(345deg, rgba(84,30,140,1) 0%, rgba(53,28,117,1) 100%)',

'Pop Culture': 'linear-gradient(345deg, rgba(233,85,148,1) 0%, rgba(255,143,171,1) 100%)',

'Science': 'linear-gradient(345deg, rgba(6,85,83,1) 0%, rgba(11,103,56,1) 100%)',

'Sports': 'linear-gradient(345deg, rgba(44,66,121,1) 0%, rgba(19,30,58,1) 100%)',

'Technology': 'linear-gradient(345deg, rgba(22,134,161,1) 0%, rgba(31,89,103,1) 100%)',

'Television': 'linear-gradient(345deg, rgba(45,44,41,1) 0%, rgba(87,81,78,1) 100%)',

'Theater': 'linear-gradient(345deg, rgba(183,75,0,1) 0%, rgba(183,0,0,1) 100%)',

'Theology': 'linear-gradient(345deg, rgba(64,14,66,1) 0%, rgba(60,19,33,1) 100%)',

'Video Games': 'linear-gradient(345deg, rgba(153,0,255,1) 0%, rgba(60,13,128,1) 100%)'
}

// Declaring variables for the base URL for fetching questions
var baseUrl = 'https://triviolivia.herokuapp.com/api/questions';
var moddedUrl = '';
var queryParams = [];
let globalData;

// Default message in bar
document.getElementById("demo").innerHTML = 'Press START GAME to play.'

// Async JS that kind of scares me, honestly
async function fetchData(moddedUrl) {
    const response = await fetch(moddedUrl);
    const data = await response.json();
    globalData = data.slice(); // Create a copy of the array
    shuffleArray(globalData); // Shuffle the copy
    console.log(globalData);
}

// Function to not fetch JSON data if any of cat/dif/era are all deselected
function dontFetchDataIfAllDeselected() {
    if (category_list.length > 23) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one category.';
    } else if (difficulty_list.length > 4) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one difficulty.';
    } else if (era_list.length > 11) {
        document.getElementById("demo").innerHTML = 'Cannot start game. You must select at least one era.';
    } else {
        changeButtonText();
        fetchQuestionsAndStartGame();
        const hideAllMenus = () => {
            checkboxes.forEach(checkbox => {
              checkbox.checked = false;
              checkbox.nextElementSibling.classList.remove('active');
            });
          };
        hideAllMenus();
    }
}

// Function to fetch JSON data asynchronously
function fetchQuestionsAndStartGame() {
    if (game_started == true) {
       console.log('Button pressed.');
       console.log("pauseFlag: " + pauseFlag);
        console.log("isPaused: " + isPaused);
    } else {
        game_started = true;
        globalData = [];
        if (category_list.length > 0) {
            queryParams.push('category=' + category_list.join(','));
        }
        if (difficulty_list.length > 0) {
            queryParams.push('difficulty=' + difficulty_list.join(','));
        }
        if (era_list.length > 0) {
            queryParams.push('era=' + era_list.join(','));
        }
        const urlWithParams = baseUrl + '?questions=' + number_of_questions + '&' + queryParams.join('&');
        moddedUrl = urlWithParams;
        menu_hidden = true;
        // hide_menu();
        fetchData(moddedUrl);
        mainGameFunction();
    }
}

// Function to toggle, hide, and show options menu
function toggle_menu() {
    if (menu_hidden == true) {
        menu_hidden = false;
        show_menu();
    } else {
        menu_hidden = true;
        hide_menu();
    }
}

// Function to shuffle returned array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function hide_menu() {
    document.getElementById("menu").style.left = "-1000px";
}

function show_menu() {
    document.getElementById("menu").style.left = "0px";
}

//Future function of reset functionality
function confirm_reset() {
    document.getElementById("demo").innerHTML = 'Are you sure you want to reset the game?';
    //Yes/No?
    //Reset function call
}

//Function for indicator light toggle
function toggleIndicator(button) {
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        button.classList.add('inactive');
        console.log(button);
    } else {
        button.classList.remove('inactive');
        button.classList.add('active');
        console.log(button);
    }
}

//Function to hide or show menu sections
  const checkboxes = document.querySelectorAll('.toggle');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        checkboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== this) {
            otherCheckbox.checked = false;
            otherCheckbox.nextElementSibling.classList.remove('active');
          }
        });
      }
      this.nextElementSibling.classList.toggle('active', this.checked);
    });
  });


//Functions to toggle categories, difficulties, and eras
function toggle_categories(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.push(clicked_id);
        console.log(category_list);

    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + category_number_identities[clicked_id] + ' category.';
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log(category_list);
    }
}

function toggle_difficulties(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.push(clicked_id);
        console.log(difficulty_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + difficulty_number_identities[clicked_id] + ' difficulty.';
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log(difficulty_list);
    }
}

function toggle_eras(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        document.getElementById("demo").innerHTML = 'You have disabled the ' + era_number_identities[clicked_id] + ' era.';
        era_list.push(clicked_id);
        console.log(era_list);
    } else {
        document.getElementById("demo").innerHTML = 'You have enabled the ' + era_number_identities[clicked_id] + ' era.';
        era_list.splice(era_list.indexOf(clicked_id), 1);
        console.log(era_list);
    }
}

//Functions to change number of questions, time per question, and time per answer
function change_number_of_questions(clicked_id) {
    number_of_questions = parseInt(clicked_id);
    document.getElementById("demo").innerHTML = 'Game set to ' + number_of_questions + ' questions.';
}

function change_time_per_question(clicked_id) {
    time_per_question = clicked_id;
    document.getElementById("demo").innerHTML = 'Questions will display for ' + time_per_question + ' seconds.';
    console.log(time_per_question);
}

function change_time_per_answer(clicked_id) {
    time_per_answer = clicked_id;
    document.getElementById("demo").innerHTML = 'Answers will display for ' + time_per_answer + ' seconds.';
    console.log(time_per_answer);
}

//Question class declaration
let Question = class {
    constructor(number, category, difficulty, question, answer) {
        this.number = number;
        this.category = category;
        this.difficulty = difficulty;
        this.question = question;
        this.answer = answer;
    }
}

//Arrow functions to show question and answer
const showQuestion = (displayed_question) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 1;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_question
    questionDisplay.append(messageElement)
    setTimeout(() => questionDisplay.removeChild(messageElement), time_per_question * 1000 + time_per_answer * 1000)
}

const showAnswer = (displayed_answer) => {
    const div = document.getElementById('question-container');
    div.style.opacity = 0.7;
    const messageElement = document.createElement('p')
    messageElement.textContent = displayed_answer
    answerDisplay.append(messageElement)
    setTimeout(() => answerDisplay.removeChild(messageElement), time_per_answer * 1000)
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const mainGameFunction = async () => {
    document.getElementById("demo").innerHTML = 'Fetching questions.';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Fetching questions..';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Fetching questions...';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = 'Game starts now!';
    await delay(1.5 * 1000);
    document.getElementById("demo").innerHTML = '';

    for (let i = 0; i < number_of_questions; i++) {
        if (!pauseFlag) {
            progressBar.style.animationPlayState = "running";
            progressBar.style.animation = "depleteProgress " + time_per_question + "s linear infinite";
            isPaused = false;
            console.log("pauseFlag: " + pauseFlag);
            console.log("isPaused: " + isPaused);
          } else {
            progressBar.style.animationPlayState = "paused";
            progressBar.style.animation = "none";
            progressBar.offsetHeight; // Trigger reflow to reset animation
            progressBar.style.animation = "depleteProgress " + time_per_answer + "s linear infinite";
            console.log("pauseFlag: " + pauseFlag);
            console.log("isPaused: " + isPaused);
          }
        // Check if paused
        while (!pauseFlag) {
            await delay(100); // Check every 10 milliseconds
        }

        document.body.style.background = category_colors[globalData[i].category_name];
        





        // Attempt at dictionary of SVGs system

        // Dictionary holding HTML content
        const contentDict = {
            'nature': `
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 390.8 556.2">
  <defs>
    <style>
      .cls-1 {
        fill: #e67a6c;
      }

      .cls-2 {
        fill: #c45f41;
      }

      .cls-3 {
        fill: #503c43;
      }

      .cls-4 {
        fill: #a51f4b;
      }

      .cls-5 {
        fill: #c05e58;
      }

      .cls-6 {
        fill: #6b1221;
      }

      .cls-7 {
        fill: #f3d5b5;
      }

      .cls-8 {
        fill: #ba3f2f;
      }

      .cls-9 {
        fill: #232323;
      }

      .cls-10 {
        fill: #0d7c86;
      }

      .cls-11 {
        fill: #bec3bf;
      }

      .cls-12 {
        fill: #8e3226;
      }

      .cls-13 {
        fill: #f7b750;
      }

      .cls-14 {
        fill: #a34737;
      }

      .cls-15 {
        fill: #12ac99;
      }

      .cls-16 {
        fill: #1a0d0d;
      }

      .cls-17 {
        fill: #a1a2a3;
      }

      .cls-18 {
        fill: #23110a;
      }

      .cls-19 {
        fill: #b14f3d;
      }

      .cls-20 {
        fill: #281a26;
      }

      .cls-21 {
        fill: #feb083;
      }

      .cls-22 {
        fill: #551610;
      }

      .cls-23 {
        fill: #f0935d;
      }

      .cls-24 {
        fill: #2c1525;
      }

      .cls-25 {
        fill: #bdeded;
      }

      .cls-26 {
        fill: #c12e4b;
      }

      .cls-27 {
        fill: #f58d67;
      }

      .cls-28 {
        fill: #e68d68;
      }

      .cls-29 {
        fill: #dc625f;
      }

      .cls-30 {
        fill: #290e11;
      }

      .cls-31 {
        fill: #e5fdfe;
      }

      .cls-32 {
        fill: #2e643c;
      }

      .cls-33 {
        fill: #fbfbfc;
      }

      .cls-34 {
        fill: #8e4237;
      }

      .cls-35 {
        fill: #ac8577;
      }

      .cls-36 {
        fill: #fcf4e1;
      }

      .cls-37 {
        fill: #74556c;
      }

      .cls-38 {
        fill: #efdd89;
      }

      .cls-39 {
        opacity: .2;
      }

      .cls-39, .cls-40 {
        fill: #7aebe9;
      }

      .cls-41 {
        fill: #c9892d;
      }

      .cls-42 {
        fill: #e6794d;
      }

      .cls-43 {
        fill: #e6704d;
      }

      .cls-44 {
        fill: #3f130b;
      }

      .cls-45 {
        fill: #6d5c6e;
      }

      .cls-46 {
        fill: #511407;
      }

      .cls-47 {
        fill: #de563f;
      }

      .cls-48 {
        fill: #deba9d;
      }

      .cls-49 {
        fill: #17ae9d;
      }

      .cls-50 {
        fill: #d53a5c;
      }

      .cls-51 {
        fill: #962e18;
      }

      .cls-52 {
        fill: #205446;
      }

      .cls-53 {
        fill: #fcfcfc;
      }

      .cls-54 {
        fill: #3d2744;
      }

      .cls-55 {
        fill: #c47258;
      }

      .cls-56 {
        fill: #95409b;
      }

      .cls-57 {
        fill: #532a56;
      }

      .cls-58 {
        fill: #a0898a;
      }

      .cls-59 {
        fill: #353535;
      }

      .cls-60 {
        fill: #ab7ab7;
      }

      .cls-61 {
        fill: #120f12;
      }

      .cls-62 {
        fill: #9f6d64;
      }

      .cls-63 {
        display: none;
      }

      .cls-64 {
        fill: #c95860;
      }

      .cls-65 {
        fill: #320532;
      }

      .cls-66 {
        fill: #1d121b;
      }

      .cls-67 {
        fill: #4e0b1b;
      }
    </style>
  </defs>
  <!-- Generator: Adobe Illustrator 28.7.1, SVG Export Plug-In . SVG Version: 1.2.0 Build 142)  -->
  <g>
    <g id="Layer_2">
      <path class="cls-43" d="M279,413s7.4-5,12-2l-3.7,7-4.6,2-3.7-7Z"/>
      <path class="cls-43" d="M334,398s-8-5-13-2l4,7,5,2,4-7Z"/>
      <g>
        <g>
          <path class="cls-13" d="M282.2,527.8c-1,6-1,7.2-2,12-1,5-40.7,16.2-55,16.2,0-1,12-17.2,12-18.2,14.9-1.4,30.9-4.8,45-10Z"/>
          <path class="cls-3" d="M193.2,428.8c8.6,2.4,12.3,1.9,20.5-1.5.4,1.3,1.3,2.3,2,3.5.9,1.6.9,2.4,1,2.5q-4.1,1.5-8.2,3c-7.9-2-15.8,2.2-26-6-7.3-5.9-8-13.9-9.2-22.5,2.7,2.3,6.3,2.4,6.5,2.7,1.1,1.8-3.8,13.4,13.5,18.2Z"/>
          <g>
            <path class="cls-38" d="M234.7,401.8c.5.3,2.4,0,2.5,0,1.5.4,2.9,1.2,4.5,1,.3,1.4.5.9.5,1,1.2,10.2-2.9,10.2-11.5,7,1.2-1.8,1.8-9,4-9Z"/>
            <g>
              <path class="cls-28" d="M234.7,401.8c-2.2,0-2.8,7.2-4,9,0,.1-2.2,2.2-2.5,2.5-6.1,5.5-27.5,14.9-35.5,12.5-2-.6-3.1-2.2-4.5-3.5,19,3.7,8.7.6,6.5-6.2-4.3-13.5,4-12.6-6.5-14.7-5.6-1.1-11.5-.5-16.5-3.5,1.1-4.9,15.4-4,20-4.5,4-.4,8-1,12-1.2-2-2.4-4.6-4.2-6.5-6.7,25.1-3.6,35.6,15.5,37.5,16.5Z"/>
              <path class="cls-55" d="M188.2,401.3c10.5,2.1,2.2,1.2,6.5,14.7,2.2,6.9,12.5,9.9-6.5,6.2-3.1-3-10.6-13.8-3-13.7-4.4-1.9-9.2-2.4-13-5.7,0-.2,0-.3,0-.5,1.3-2.5,12.8,2.1,16-1Z"/>
              <path class="cls-62" d="M188.2,422.3c1.4,1.3,2.5,2.9,4.5,3.5q.2,1.5.5,3c-17.3-4.9-12.4-16.4-13.5-18.2-.2-.3-3.8-.4-6.5-2.7-.3-1.8-.9-3-1-5,3.8,3.3,8.6,3.8,13,5.7-7.6,0-.1,10.8,3,13.7Z"/>
              <path class="cls-62" d="M188.2,401.3c-3.2,3.1-14.7-1.5-16,1,0-1.4-.9-2.9-.5-4.5,5,3,10.9,2.4,16.5,3.5Z"/>
              <path class="cls-55" d="M228.2,413.3c1.2.8,1.4,2.3,2,3.5-2,1.4-7,5.4-8,6-.8.5-8.1,4.3-8.5,4.5-8.2,3.4-11.9,3.9-20.5,1.5q-.2-1.5-.5-3c8,2.4,29.4-7,35.5-12.5Z"/>
            </g>
          </g>
          <g>
            <path class="cls-53" d="M226.7,428.8q6.2,9.7,12.5,19.5c-.5.1-6,3.3-9.5,4,0-.8-1-.9-1-1-.8-.8-10.7-15.8-12-18,0-.1,0-.9-1-2.5,2.7-1,6.2-1.8,9-2,.7,0,1.3,0,2,0Z"/>
            <path class="cls-60" d="M222.2,422.8c1.5,2.3,4.7,5,2.5,6-2.8.2-6.3,1-9,2-.7-1.2-1.6-2.2-2-3.5.4-.2,7.7-4,8.5-4.5Z"/>
          </g>
          <g>
            <path class="cls-43" d="M203.2,295.3c-.7,2.1-1.7,4-2.5,6-1.8-.3-1.9,1-2,1-.5.2.2-1.5-3,1.7-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1,2-.2,3.9.9,6,.5-.6,8.8-.2,18.2,6.7,24.5.4,0,3.6-3.9,4.2-4.5,6.8-6.2,12.8-13.3,19.5-19.5.9-.9,2.3-1.4,3-2.5.2.2,1.2.8,1.5,1Z"/>
            <path class="cls-21" d="M275.1,389s26.1-25.1,29-33c.8-2.1,5-16,3.6-22.2-2.2-8.6-5.3-16.9-11.1-23.7-11.1-13-23.1-9.9-32-12.7-2.1,4.4-4.6,8.6-7.5,12.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-21.1-34.3-27.4-38.3-1,1-4,2-5,1-.5.2-4.1,4.8-7.3,8.1-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1-7.5.6-11.2.9-18.2,5-10.2,5.9-20.9,23-18.2,28.2,3.5,6.9,12.5,17.9,19.5,23.9,1.9,1.6,3.8-.9,4.9-2.9-3.3,7.7-9.1,19.8-7.9,29.9,1.4,11.4,6.9,18,11,21,2.7,2.1,9,4,9,4,0,0,4,5,0,14-1.1,2.6-14,37-17,41,0-.1,1-.3,2.5-.4-8.6,11-10.6,26.9-13.5,55.4-.3,2.1-1.6,5.8-2.5,7.8,14.7,9.9,38.1,13.2,55.5,15,17.2,1.8,34.7,2.6,52,1,14.9-1.4,30.9-4.8,45-10,4.7-1.7,10.2-4,14.5-6.5-2.2-15.6-25.2-75.2-29.5-90.3-.5.2-1.1.5-1.6.7.8-13.7,1.6-29.7,1.6-29.7l6-14Z"/>
            <g>
              <path class="cls-27" d="M246.7,278.3c2.5,7.4,9.6,16.3,18,19-2.1,4.4-4.6,8.6-7.5,12.5-3.7,4.9-16.4,18.3-22.7,17.5-5.6-.7-24-26-26.7-32.5,10.7-3.6,21.7-10.1,29-18.7-.3-2.1-.6-4.2-1-6.2,5.7.6,7.9,6.6,11,8.5Z"/>
              <path class="cls-43" d="M207.7,294.8c2.8,6.5,21.1,31.8,26.7,32.5,6.3.8,19-12.6,22.7-17.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-15-13.5-21.2-17.5-.3-2.4-.8-3.4-1.5-5.5-.4-1.3-1-2.3-1.5-3.5-1.1-2.5-2.4-3.8-2.5-4-1.2-2.2-2.5-4.5-3-7,.1,0-.5-.2,2-1Z"/>
              <g>
                <path class="cls-27" d="M191.7,278.8c-1.4-.2-1.7,4.5-2.5,7-2.7,9.1-10.1,26.8-10.5,28.2-.2.6-.2,2.3.5,2.2-.6.6-3.8,4.5-4.2,4.5-7-6.3-7.3-15.7-6.7-24.5,6.5-4,11.2-9.9,15.5-16,2.9-4.1,4.5-9.1,8.5-12.5-.3,3.1-1,8.1-.5,11Z"/>
                <path class="cls-27" d="M198.7,296.8c-6.7,6.2-12.7,13.3-19.5,19.5-.7,0-.7-1.6-.5-2.2.4-1.5,7.8-19.2,10.5-28.2q4.7,5.5,9.5,11Z"/>
                <path class="cls-21" d="M191.7,278.8c.6,4,3.6,6.9,6,10,.6.8,3.7,5.3,4,5.5-.7,1.1-2.1,1.6-3,2.5q-4.7-5.5-9.5-11c.8-2.5,1.1-7.2,2.5-7Z"/>
              </g>
            </g>
          </g>
          <g>
            <path class="cls-34" d="M233.7,264.3c-9.1,11.6-21.8,20.5-36,24.5-2.4-3.1-5.4-6-6-10-.5-2.9.2-7.9.5-11,0-.7.1-.9.5-1.5,12.4,2.2,27.7-5.1,38.5-11,1.2,2.9,1.7,6,2.5,9Z"/>
            <path class="cls-28" d="M235.7,269.8c.4,2.1.7,4.2,1,6.2-7.3,8.7-18.3,15.1-29,18.7-2.5.8-1.9,1-2,1-.7.2-.4.7-2.1-.3s-.2-.1-.4-.2c-.3-.2-1.3-.8-1.5-1-.3-.2-3.4-4.7-4-5.5,14.2-4,26.9-12.9,36-24.5.7,2.4,1.9,5.2,2,5.5Z"/>
          </g>
        </g>
        <path class="cls-13" d="M237.2,537.8c0,1-11,18.1-12,18.2-24,1-60-1-67-7-3.8-3.3-7.8-20-8-21-4.2-16.8,69.8,11.4,87,9.8Z"/>
        <path class="cls-23" d="M246.6,179.3l5,23s2.5,3.6,4,3c4.1-1.7,7-9,7-17s-4-14-4-14l-12,5Z"/>
        <g>
          <g id="Background" class="cls-63">
            <path class="cls-17" d="M186.7,540c-76.7,0-153.3,0-230,0V28h512v512c-62.8,0-125.7,0-188.5,0q1-6,2-12c4.7-1.7,10.2-4,14.5-6.5,3.4-2,7.1-3.8,8.5-7.7-.6-6.9-2.4-13.6-4-20.2,78.7-56.2,100.3-140.9,35-218.5.4-.1,3.7,0,8.7-3,11.3-6.9,14-20.6,8.7-32.2,19.7-4.1,26.7-27,11.5-40.5,1.3-4.6,0-9.7-3.5-13,18.1-14.9,14.3-39.8-6.5-49.5,3.4-16.5-13-29.2-28.5-28,4-21.1-13.4-38.6-33.7-28.2-17-18-45.8-26.5-68.5-14.5-20.8-21.1-68.8-14-83,12-16.5-13.3-43.4,1.7-37.7,22.7q-5.9,5.1-11.7,10.2c-15.4,1.6-25.4,19.2-18.2,33.2-16.5,8.4-18.6,31.5-2,41-18.5,4.8-26.8,31.5-8,41.5-3.3,17.4,13.6,21.6,14,23-2.9,8-1.6,15.4,4,21.7-35.1,28.1-51.5,75.2-45,119.2,7.3,49.2,46.1,86.2,86.5,111.2-.7,4.4-1.8,8.7-1.5,13.2,2.5,2.9,4.9,4.7,8,6.7,14.7,9.9,38.1,13.2,55.5,15q.7,1.5,1.5,3Z"/>
          </g>
          <g>
            <g>
              <path class="cls-61" d="M281.7,180c-3.1-1.8-1.7,4.8-11,5.5,0-7.6-1.4-10.5-7-15.7l.7-.7c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4Z"/>
              <path class="cls-61" d="M281.7,180c.5,1.8.2,4.9,1,5.5-1.1.3-8.9,8-12.5,7.5.5-2.2.5-5.2.5-7.5,9.3-.7,7.9-7.3,11-5.5Z"/>
            </g>
            <g>
              <path class="cls-61" d="M129.2,112.5c-1.6,2-3.6,3.8-5,6,.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-.3-.4-2-8.5-2-9.2.1-4,3-8.2,6-10.7-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7Z"/>
              <path class="cls-61" d="M343.7,127c4.3,7.1,2.9,10.5,0,18.2,4.7,1.1,5.4.4,10,2.7l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7Z"/>
              <path class="cls-20" d="M94.2,223.5c-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-1.7-8.4,2.7-11.1,3.5-12.5q7-4.6,14-9.2-.5-4.6-1-9.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2,1.4-2.2,3.4-4,5-6,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7Z"/>
              <path class="cls-20" d="M346.2,220c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
              <path class="cls-66" d="M87.7,203c-.8,1.4-5.2,4.1-3.5,12.5-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2Z"/>
              <path class="cls-66" d="M100.7,184.5q.5,4.6,1,9.2-7,4.6-14,9.2c.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2Z"/>
              <g>
                <path class="cls-61" d="M133.2,180q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5l10-4.5Z"/>
                <path class="cls-49" d="M144.7,176c-1.4,3.7-2.8,5.7-3,10-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2Z"/>
              </g>
              <g>
                <path class="cls-66" d="M356.7,204.2c1.6-17.5-7.8-17.6-8.5-18.5-3.1-4.3,5.8-3.9,10.5-9.5,7.1-8.4,5-23.2-5-28.2l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7-4-6.7-11.3-9.8-18.7-6.5-2.9-.6,1-6.1-10.2-12.2,8.8-16.2-11.8-29.4-22.2-14.2-18.4-20.7-44.2-29.9-70-16-17.5-19.9-50.6-17.5-68.7.2-1.8,1.7,0,4.2-13.2,9.7-2.1,0-10.4-11.3-22.2-1.5-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8,0-1.6,0-2.3.1.7,0,1.5,0,2.3-.1-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-1.2.2-2.4.9-3.5,1.5-.6.9-1.1,1.8-1.5,2.7.4-.9.9-1.8,1.5-2.7-8,4.4-5.4,3.6-9.2,11.5-19.2-1.6-26.4,17.1-12.7,30.2-2.7.9-5.4,1.2-8,2.2-2.1.9-3.3,1.4-5,3-9.5,8.9-5.1,21.5,6,26.2.7,1.9-4.1,4.6,0,14-18.9-2.2-25.7,19.2-8,27.5-3.8,9.2,3,21.4,13.2,17.7,8.3,8.1-2.1,8.2-.2,19.7,1.4,9,14.2,14.7,21.7,9.2,10.7,4.5,5.5,5.2,9.2,10.2,4.7,6.5,16.4,5.9,21.7.2,1.4.3.7,14.1,20,11.5,4.7-8.2,6.2-2.5,13.5-6,5.4-2.6,5.4-9.9,10.7-5,2.9-4.1,4.5-9.1,8.5-12.5,0-.7.1-.9.5-1.5-7.7-1.4-26.9-15.7-33.1-21.2-10.4-9.2-16.6-17.4-16.4-31.5.2-.6-.4-8.4-1.5-10.7-.4-.9-.3-9.4,0-17-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2c.2-.4,1.4-3.3,1.5-3.5,1.4-2.6,2.5-7,6.5-5.7q-1-1.4-2-2.7c1.1-9.4,7.9-32.2,17.5-36.5,5.6-2.5,11,1.2,17.7-8.5,22.9,12.9,31.8-2.3,33.5-3,6.9-2.6,8.8,5.3,9.2,5.7,7.9,9,16.1,5.6,23,18,2.7,4.9,3.6,11.3,6.5,16,1.2,2-.8,16.6.4,19.5,4.6,10.3,4,21,1.1,25.7,6.7-10.7,1.7,3.7,8-2,.6-1.3,2.4-5.3,2.5-6,.5-2.2.5-5.2.5-7.5,0-7.6-1.4-10.5-7-15.7l.8-.8c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4,.5,1.8.2,4.9,1,5.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2-6.2,8.9-16.6,15.4-26,20.5,1.2,2.9,1.7,6,2.5,9,.7,2.4,1.9,5.2,2,5.5,5.7.6,7.9,6.6,11,8.5.6.4,3.6.9,4.7,1,7,13.8,25.6,10.6,30-4,9.6,10.2,24.4,12.2,28.5-4,7.3,0,12.5.8,17.5-5.5,18.4,2,25.3-16.4,12.2-28.7q3.1-4.1,6.2-8.2c6.2,1.5,12,.1,15.2-5.5,4.1-7.1,2.1-14.6-4.5-19.2ZM108.1,113.3c-.3.8-.5,1.6-.7,2.4.2-.8.4-1.6.7-2.4ZM91.4,122.5c.6-.2,1.1-.4,1.7-.5.6,0,1.2-.1,1.7-.1-.6,0-1.2,0-1.7.1-.6,0-1.1.2-1.7.5-.4.2-.8.4-1.2.6.4-.3.8-.5,1.2-.6ZM86.7,128.9c.1-.5.3-1.1.4-1.6-.2.5-.3,1-.4,1.6-.2.8-.2,1.6-.1,2.5,0-.8,0-1.7.1-2.5ZM346.2,220c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
                <g>
                  <path class="cls-20" d="M235.4,80c12.6-1.2,21.7,20.4,45.5,12.5,11.5,15.3,21.3,10.6,16.2,29.2,2.6,1.3,12.5,10,13.2,10.2,5.5,2,21.8-2.9,16.7,17.2,4.7,1.6,21.4,8.2,23.5,12,2.4,4.4.7,13-4.2,14.7-11.6,4-.9-9.6-1.2-11.2-12.5-11.5-29.9-.8-23-24.5l-13.2-1.2c-8.4-11.1-13.2-8.1-16.2-11.7-8-9.7,12.5-22.6-19.7-18.2q-1.2-4.2-2.5-8.5c-12.3.4-23-6.6-32.5-13.5-4.2-.3-17.2,8.1-14.2-.7.6-1.9,9.6-6,11.7-6.2Z"/>
                  <path class="cls-65" d="M282.4,98.5c3.1-.2-2.6,2.2-3.5,2.5-12,4.4-3.5-2,3.5-2.5Z"/>
                </g>
              </g>
            </g>
            <g>
              <g>
                <g>
                  <path class="cls-12" d="M233.7,264.5c-9.1,11.6-21.8,20.5-36,24.5-2.4-3.1-5.4-6-6-10-.5-2.9.2-7.9.5-11,0-.7.1-.9.5-1.5,12.4,2.2,27.7-5.1,38.5-11,1.2,2.9,1.7,6,2.5,9Z"/>
                  <path class="cls-42" d="M235.7,270c.4,2.1.7,4.2,1,6.2-7.3,8.7-18.3,15.1-29,18.7-2.5.8-1.9,1-2,1-.7.2-.4.7-2.5-.5-.3-.2-1.3-.8-1.5-1-.3-.2-3.4-4.7-4-5.5,14.2-4,26.9-12.9,36-24.5.7,2.4,1.9,5.2,2,5.5Z"/>
                </g>
                <path class="cls-42" d="M259.7,226c-6.4,16.8-49,37.4-61.2,37-15.6-.5-46.6-25.9-50.2-42.2,5.5,1.1,11.2,1.2,16.5-.2.6.9,3,3,6.5,8.5,7,11,11.1,22.4,27,20.5,12.7-1.5,15.7-10.1,19.5-14.5,3.2-3.7,6.8-7.3,10-11,3.6.9,7.6,1.5,11.2,1,2.1-.3,11.8-4.1,10.7-6,2.3-1.1,8.3-5.6,10-7.5,2,4.5,1.8,9.8,0,14.5Z"/>
                <path class="cls-5" d="M249.7,219c1.1,1.9-8.6,5.7-10.7,6-3.6.5-7.7-.1-11.2-1,.4-.5.6-1.4,1-2,6.8,1.4,14.8,0,21-3Z"/>
                <g>
                  <path class="cls-42" d="M257.2,235c-1.7-1.6,4.7-6.1,2.5-9,1.8-4.7,2-10,0-14.5,1.7-1.8,5.9-9.8,6.9-12.2.6-1.3,3.4-5.6,3.6-6.3,3.6.5,11.4-7.2,12.5-7.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2Z"/>
                  <path class="cls-14" d="M284.7,204.5c1.9,7-4.8,7.9-7.2,6.5-2.5-1.4-3.7-10.3-2.2-13.5,4.2,1.7,8.6,10.7,9.5,7Z"/>
                  <path class="cls-46" d="M284.7,204.5c-.9,3.7-5.3-5.3-9.5-7,2-4.5,16.9-7.5,14.2,4.5-1.4-9.8-9.5-5.7-9.7-4.7-.2.8,4.1,4.1,5,7.2Z"/>
                </g>
                <path class="cls-23" d="M226.7,222.5c-1.7.4-3.3,2-5.5,2.5-19,4.1-34.9,5.3-52.5-4.5-1-.5-2-1-3-1.5,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2Z"/>
                <g>
                  <path class="cls-67" d="M165.7,219c1,.5,2,1,3,1.5,2.3,3.6,7.4,6.7,11,10,.2.2,1,2.6,2.5,4.2.7.7,1.7,1.2,2.5,1.7-3.9,1.9-9.8-5.6-13.5-7.5-3.5-5.5-5.9-7.6-6.5-8.5,0,0,0-.7-.5-1.5.5,0,1,0,1.5,0Z"/>
                  <path class="cls-67" d="M228.7,222c-.4.6-.6,1.5-1,2-3.2,3.7-6.8,7.3-10,11-1.5.2-6.1,1.2-7,1.5,2.3-2.6,4.7-5,7-7.5,1.2-1.2,2.7-2.5,3.5-4,2.2-.5,3.8-2.1,5.5-2.5l2-.5Z"/>
                  <path class="cls-50" d="M217.7,235c-3.8,4.4-6.8,13-19.5,14.5-9.5-.5-18.3-11.2-13-12.5,11.9,7.1,20.2,1.4,25.5-.5.9-.3,5.5-1.3,7-1.5Z"/>
                  <path class="cls-26" d="M184.7,236.5c.6.4.5.5.5.5-5.3,1.3,3.5,12,13,12.5-15.9,1.9-20-9.5-27-20.5,3.7,1.9,9.6,9.4,13.5,7.5Z"/>
                  <path class="cls-26" d="M221.2,225c-.8,1.5-2.3,2.8-3.5,4-12.3,4.4-25.5,5.6-38,1.5-3.6-3.3-8.7-6.4-11-10,17.6,9.8,33.5,8.6,52.5,4.5Z"/>
                  <path class="cls-33" d="M217.7,229c-2.3,2.5-4.7,4.9-7,7.5-5.3,1.9-13.6,7.6-25.5.5,0,0,0-.1-.5-.5-.8-.6-1.8-1.1-2.5-1.7-1.5-1.6-2.3-4.1-2.5-4.2,12.5,4.1,25.7,2.9,38-1.5Z"/>
                </g>
              </g>
              <g>
                <g>
                  <path class="cls-33" d="M242.7,197.5c1.8-1.9,1-1.5,1.5-3.5,0-.4,0-1,0-1.5,0-.1,1.3-.4,0-3,3,.6,7,4.5,7,6.5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.7-3.5,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2Z"/>
                  <path class="cls-31" d="M244.2,189.5c1.3,2.6,0,2.9,0,3l-1.5,1.5c-6.6,1.4-5-5.9,1.5-4.5Z"/>
                  <path class="cls-40" d="M244.2,194c-.5,2,.3,1.6-1.5,3.5-3-1.7,0-1.5.5-3.5h1Z"/>
                  <path class="cls-32" d="M244.2,194h-1c-.2,0-.3,0-.5,0l1.5-1.5c0,.5,0,1.1,0,1.5Z"/>
                </g>
                <g>
                  <path class="cls-66" d="M155.6,165.3c-6.8,8.7-8.2,31.1-8,30,.5.7-4.6,20.7-5,20-4-7-10-22-2-38s9.4-11.7,15-12Z"/>
                  <path class="cls-23" d="M259.7,201c4.8-11-8.2-5-8.5-5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.8-3.5-.6-4.6,3.2-8.1,6.9-10.2s6-1,9-1,7,3,9.6,5.7c.8,1,14-18.9,14.2-19,.2,0,1.8-4,1.8-4.7-.2-1.8-5.8-6.5-7-8.5-2.9-4.7-3.8-11.1-6.5-16-6.9-12.4-15.1-9-23-18-.4-.5-2.4-8.3-9.2-5.7-1.7.7-10.6,15.9-33.5,3-6.7,9.7-12.1,6-17.7,8.5-8.6,10.8-21.6,44.5-21.4,44.2-1,4-3.1,9-3.1,13.6-.5,3.7-.6,13-1,14-4,9-1,19,0,21,.1.3,14.7-.3,21.6-1.3.5,0,1,0,1.5,0,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2l2-.5c6.8,1.4,14.8,0,21-3,2.3-1.1,8.3-5.6,10-7.5,1.7-1.8,6.9-10.1,8-12.5-6.3,5.7-1.2-8.6-8,2ZM182.2,190c-1.9-.4-.6,3.1-1,3.7-.9,1.3-3.3-1.6-4,1.2,0,.6.1,1.6,0,2,5,1.1-4,12-5.8,12-1.4,0-2.7-5-7-4.5-2,.2-10.5-1.6-15.4-9,.5-2.8,1-7.6,1.1-8,.1-.3-.2-1.6.5-2.7,4.3-7.5,20.8-9.1,28.5-8.7,2.1,4,3.2,9.5,3,14ZM230.3,156c-1.2,0-2.4,0-3.5.2,1.1-.1,2.3-.2,3.5-.2ZM220.4,157.7c-.5.2-1,.5-1.3.8.4-.3.8-.6,1.3-.8Z"/>
                  <path class="cls-33" d="M167.2,187c-16.7,4,1.1,19.8,5,7.5.6-2,.6-3.5.5-5.5.5,0,3.4,2.9,4,4.5,0,.3.5,1.4.5,1.5,0,.3,0,.6,0,1s0,.8,0,1c-1.7,5.9-18.6,5.3-25.5,3s-2.8-3.5-2.5-5.5c.9-6.8,16.1-10.5,18-7.5Z"/>
                  <path class="cls-42" d="M179.2,176c-7.7-.3-24.2,1.3-28.5,8.7-.7,1.2-.4,2.4-.5,2.7,6.8-9.9,27.7-7.3,26.5,6,0,.2.9,1.7,0,4.5-3.3,4.8-19.2,3.6-25,2-.4-.1-2.7-1.1-1.5.5,3.4,4.8,11.7,7.1,14.4,7.8,4,1,5.4,1.2,6.8.7,8.2-2.7,10.2-14.7,10.7-19s-.9-10-3-14Z"/>
                  <path class="cls-25" d="M172.2,194.5c-2.2,2.7-4.9,1.4-3.5-2,2-.5,2.9-3.5,4-3.5,0,2,.1,3.5-.5,5.5Z"/>
                </g>
              </g>
            </g>
          </g>
        </g>
        <path class="cls-61" d="M146.6,201.3"/>
        <path class="cls-2" d="M143.6,210.3c5,5.2,13.7,9.7,20.6,8.7.6.8.5,1.4.5,1.5-5.3,1.5-11,1.4-16.5.2,3.7,16.3,34.7,41.8,50.2,42.2,12.3.4,54.9-20.2,61.2-37,2.2,2.9-4.2,7.4-2.5,9-6.2,8.9-16.6,15.4-26,20.5-10.8,5.9-26.1,13.2-38.5,11-7.7-1.4-28.1-14-34.2-19.5-9.8-8.7-17.9-23.6-17.8-37.7,0,0,2.9,1,3,1Z"/>
        <path class="cls-2" d="M155.7,161c-1.7.9-7.5,10.1-9.1,11.3,1.1-9.4,11-42,21.6-44.8s-4.5,4.5-10.5,24.2c-.9,2.9-.9,6.3-2,9.2Z"/>
        <g>
          <path class="cls-42" d="M194.7,219.5c-4.1-.2-7.8-2.9-10.5-5.5-1.9-10.3,3.4-.9,5.7.5,6.2,3.7,18-.3,4.7,5Z"/>
          <path class="cls-46" d="M184.2,214c2.7,2.6,6.4,5.3,10.5,5.5,3.7.2,14.5-5.7,8.7-1-10.8,8.8-26.9-6.9-21-7,.5,0,.4,1.2,1.7,2.5Z"/>
        </g>
        <path class="cls-42" d="M228.7,169c3-.3.8.7-3.1,2.3-6.1,2.5-10,7-6.9,20.5.1.5-.4.4-.7.7l-9.2-3c-.4-15.9,5.9-19.2,20-20.5Z"/>
        <path class="cls-2" d="M282.6,214.3l1,2c1,2-3,3-3,3-1.2.4-2,1-3,0l1-5c1-2,3.7-.5,4,0Z"/>
        <path class="cls-42" d="M265.6,164.3c-.2-3.9-4.1-3.8-7-8-2.4-3.5-3.9-11.5-4-12-3-10-12-14-12-14,0,0,14,17,9,40-.6-.1-4.1-2.2-4.9-2.3-5.5.7-1.1,1.7,1.5,6.2,3.4,6,5.2,13.4,3.5,20.2,0,.3,0,1.8,0,1.8,0,0-1,2.2-2,3-5,4-14.9,2.8-18,2-2-.5-5-2-5-2,0,0,3,9,20,9s14.4-12.9,15-16c.9-4.5,0-10-3-16-.1-.2,7.1-10.1,7-12Z"/>
        <g>
          <path d="M145.6,173.7c0,.3.5,0,1-.4,6-4,9-6,11-7,4-2,6.6-2.1,7-2.1,3.7-1.2,17.6,3.6,12.7-3.7-4.5-6.7-17.1-1.6-22.5,1.2-1.7.9-9.3,7.6-9.3,12.1Z"/>
          <path d="M245.9,168.7c.6.6.8-2.4.2-4-4.1-10.9-27.4-9-28.7-4.2-2,7.1,10.4,1.2,21.5,4,2.8.9,3.8.9,7,4.2Z"/>
        </g>
        <g>
          <path class="cls-25" d="M283.6,222.3c0-2,0-5-1-6s-1.8-2-3-1-1.8,4.6-2,7c0,.8.4,3.4,1.1,4,2,1.5,3.3,1.3,4,.2,2-3.2,1-2.8,1-4.2Z"/>
          <path class="cls-40" d="M284.2,221.5c-.2-2.8-.5-4.8-1.6-5.2-3-1-1,3-4,5s-.6,3.3,0,4c3.4,4.1,5.8-1,5.6-3.8Z"/>
        </g>
        <path class="cls-2" d="M252.1,185.2c0,.3-.4.6-.5.4-4-7.3-17.2-9.1-22.3-6.7-3.1,1.5,7.5-8.2,17.3-3.6,4.9,2.3,5.2,7.9,5.5,10Z"/>
        <path class="cls-18" d="M258.4,189c-4.4,1.3-7.2.8-8.8-.8-.4-.4-.8-.7-1.1-1.1-6.9-9.9-25.9-4.9-24.9,6.3,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2-3-1.7,0-1.5.5-3.5-.2,0-.3,0-.5,0-6.6,1.4-5-5.9,1.5-4.5,3,.6,7,4.5,7,6.5.4,1.3-.6,2.4-.6,2.3,1-1,2-3,1-3.7,2.3,0,6.7-5.5,6.7-5.5Z"/>
        <path class="cls-2" d="M149.6,186.3s4.3-5.6,8-7c5.6-2.2,19-4,22-3s-11.7-4.6-21.2-1c-1.3.5-3.5,1.7-4.8,3-4,4-4,8-4,8Z"/>
        <path class="cls-18" d="M150.8,186.6h0c-3.2,2.7-7.4.4-7.4.4,0,0,1.4,3.6,4.7,4.3.1,0,.3,0,.5.1,0,1.8,0,2.3.6,3,.9-6.8,16.1-10.5,18-7.5.1.1.2.2.3.3.2.3.2.4,0,.5.2,0,.2-.2,0-.5,0,0-.2-.2-.3-.3-16.7,4,1.1,19.8,5,7.5-2.2,2.7-4.9,1.4-3.5-2-.9-.3-1.5-.5-2.1-.7.5.2,1.2.4,2.1.7,2-.5,2.9-3.5,4-3.5.5,0,3.4,2.9,4,4.5,1.2-12.9-18.4-15.7-25.8-6.8Z"/>
        <g>
          <path class="cls-39" d="M183.6,188.3c0,15.7-15.3,27-28,27s-19-10.3-19-26,9.3-22,22-22,25,5.3,25,21Z"/>
          <path class="cls-39" d="M262.6,189.5c0,22.8-17.9,29.8-32.8,29.8s-22.2-11.3-22.2-28.7,10.9-24.3,25.7-24.3,29.3,5.8,29.3,23.2Z"/>
          <g>
            <path d="M267.6,198.3c5.8-9.6-3.8-18.8-5-22-3-8-6.8-10-10-11s-6-1-13-1-29-3-34.5,13.7c-7.2-3.1-12.6-2.6-20-1-1.5-2.7-5.5-11.7-20.5-12.7-1.9-.1-9.2-.7-16,1-8,2-7.9,2.9-10,5-2.2,2.2-4.6,9.8-5,18-.3,7,2,17,3,19s3,6,5.8,7.5c13.2,7.5,15,5,21.2,4.5,15-1,26.3-18.5,26-32.8,21.2-1.9,7.5,3.4,18.2,22.7,2.6,4.6,9.8,11,16.8,13,4.9,1.4,14.8,1.8,23-2,13-6,17-17,20-22ZM181.4,191c-.3,7.5-3.3,13.5-8.1,17.3-6.2,5-15.2,6.5-24.9,3.7-5.8-1.7-7.8-6.3-8.8-8.7-4-10,0-24,1-27,1.9-5.8,10.4-7.7,16-8,8.6-.5,17.3.2,21.7,8.7,2.1,4,3.2,9.5,3,14ZM214.4,209.3c-3.5-4.7-5.4-13.9-5.5-19.7-.4-15.9,5.2-19.1,20-20.5,5.6-.5,11.5-.9,17,0,.8.1,2.4.4,3,.5,2.1.6,4.2,1.3,5.8,2.8s4.4,6,6,16.9c.5,3.4,0,8-1.7,12.7,0,0,0,0,0,0-8.9,20.4-36.1,18.5-44.5,7.2Z"/>
            <path class="cls-59" d="M282.2,175c-.6-.6-13.7-6.3-16-7-2.6-.7-8.2-.1-8.6.3,4.7,4.4,2.9,14.9,7,19s3.7-1.2,5.8-2.2l.2.2h2v-.8c9.1-.7,11.9-3,15-1.2-.4-1.6-4.5-7.2-5.4-8.3Z"/>
            <g>
              <path class="cls-9" d="M134.9,179l-10,4.5c-.5-1.1-2.6-9.7-1.2-10.5,22.8-3.4,17.7-10.3,11.2,6Z"/>
              <path d="M134.9,179q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5l10-4.5Z"/>
            </g>
            <path d="M283.6,185.3c-.8-.6,4.5-1.2,4-3-2.9-1.7-6,.8-13.6,2-9.5.8-12.4-2-12.4-2l1,3c0,.5.5,2.5,1,4.4l-2.1.7,2.1,6.9c5.4-5.4,8.4-3.5,15-9,2.4-1.8,4.5-2.9,5-3Z"/>
          </g>
        </g>
      </g>
      <path class="cls-41" d="M210.5,556.2l-1.3-10.7s2.7,10.7,4,10.7h-2.7Z"/>
      <path class="cls-56" d="M138.1,389"/>
      <g>
        <g id="Background-2" data-name="Background" class="cls-63">
          <path class="cls-11" d="M-43.7-83q0,285.1,0,570.2,285.1,0,570.2,0,0-285.1,0-570.2H-43.7Z"/>
          <path class="cls-11" d="M179.6,397.6c3.5-2.7,24.5-15.8,25.1-18.1-1.5-10.1-6.2-19.3-6.7-29.5l-1.4-1.4c-9.4-.1-13.1-2.8-14.5-12.3-30.8,5-15.3-22.4-14.2-29.2,5.5-33.4-26.1-18.3-40.9-21.4-30.1-6.3-22.9-58.6-20.9-80.5-32.4-6.1-31.6-43.7-27.8-69.6,4.3-29.7,16.8-38,17.3-41.8,1-7.4-10.2-14.9-12.3-26.2-6.4-35.2,39-35.6,59.3-49.8,15.2-10.6,29-34.2,54.9-46.8-1.1-12.2-11.1-3-12-2.8-6.5,2-8.1-.5-12.8,4.5-10.9,0-19.1,8.8-29.5,11.7-16.2,10.7-42.8,23.9-55.4,37.6-18.3,19.8-21.3,43.5-25.6,69.1-6.4,9.7-5.8,21.9-8.9,32.9-1.9,23.7.7,46.3,4.5,69.6,3.8,11.1,6.6,23,9.5,34.5,4.2,6,7,20.5,9.5,25.6,1.3,2.8,2.9,3.1,3.3,3.9.7,1.1,1,3.7,1.1,3.9,1.1,1.5,3.2,2.3,4.5,3.9,6.2,8.4,12.8,15.9,19.5,23.9,13.1,8,13.3,12.7,14.2,13.6,1,1,19.1,13.8,22.3,16.1,6.6,7.3,13.7,14.8,17,24.2,1.1,1.6,6.7,2.6,8.9,13.9q3.3,4.2,6.7,8.4c.6,10.8,3.2,14.8,3.3,15.6.6,3.9-1.3,8.4,2.2,16.4Z"/>
          <path class="cls-11" d="M351.7.5c.6,1.2,12.2,12.5,17.8,19.8,3.8,4.8,34.7,48.5,36.2,51.2,6.1,11.1,9.9,24.6,8.9,37.3-2.2,27.9-25.2,28.5-37,33.7-26,11.5-7.5,22.7-23.7,43.7-8.9,11.5-24.6,15.7-27,17.5-13.7,10.5,14.4,26.3,17,56,3.8,43.3-24.7,44.3-25.6,48.4,18.3,31.7-6.7,30.9-28.4,42.3-1.5,8.4-4.5,16.7-5.6,25.1.6,2.2,23.1,14.8,26.7,17.5,2.9,0,.7-14.6,2.2-22,3.5-16.7,37.6-49.7,46.8-66.3,1.4-2.5,1.8-5.6,3.9-7.8,5.1-13.3,6.1-27,8.9-41.2-.6-50.2-5.5-58.5,32.9-94.1,8.1-11,14.9-16.5,18.9-30.6,2.4-16.3,3.2-32.5,1.1-49-9-31.2-31.5-60.5-52.6-84.4-10.7-1.2-5.4-8.5-11.1-11.7-4.1-2.3-5.9,1.1-6.7,1.1-.8,0-7.2-5.6-5.3,3.6-7.9,4.8,5.8,3.7,6.1,5,.8,3.3-7.9-1.9-4.5,4.7Z"/>
          <path class="cls-11" d="M240.6,362.5c-11.1-3,.2,20.1,1.4,27,1,5.8,2.2,32.4,2.8,34,.7,1.9,4.3,1.8,5,0,.8-2.2.1-37.5,3.3-47.9-1.4-1.8-11.7-12.9-12.5-13.1Z"/>
        </g>
        <g>
          <path class="cls-4" d="M222.5,5.2c16,.4,25.6,2.5,40.5,7.5.2,0,.4,0,.6,0,6.6,2.3,12.9,5.4,19.3,8.1-10.1-19.9-53.1-26.4-60.5-15.6Z"/>
          <g>
            <path class="cls-64" d="M91.6,85.6c-11,2.4-56.3,16.3-47.4,33.4,4.8,9.2,55.7,32.3,68.3,35.9,2.2,3.8-21-6.3-21.5-3.7,10.2,3.5,20.9,5.7,31.2,8.7.5-2.6.9-5.5,2.5-7.8.2-2.7-5.1-6.8-1.2-15.6-22.1-16.8,8-50.4,34.9-53.9,0-.4.2-1.1-.3-1.2-1.6-.5-29.3-.2-33,0-10.9.6-22.7,2-33.4,4.4Z"/>
            <path class="cls-21" d="M159.5,66.3c-15.2-.2-30.3,1.5-45.5,1.2-2,.3-5.2,1.4-6.2,0-.6.3-.7,1.3-2.8,1.9-22,.5-86.4,15.3-67.7,48.6,2.2-2-.5-4.2,0-7.8,2-15.4,42.2-24.3,54.9-27.1,41.1-9.3,51.5-5.7,92.6-5,43.4,5.9,105.6,19.4,144,39.9,3.6,1.9,16.2,9.3,13.4,10,9.2,4.4,40,23.9,44.3,32.1,2.9,5.7,1,9,3.1,8.4,6.8-20.2-17.2-40.2-33.7-48-.2,0-.5,1.4-3.4,0-53.4-24.4-96.1-39.9-154.3-51.1-12.8-2.5-25.7-3-38.7-3.1Z"/>
            <path class="cls-21" d="M266.8,75c17.3,4.9,73.6,25.2,85.4,35.5.8,0,.8-1,.6-1.6-2.8-10.5-22.9-44.6-30.6-54.2-11.9-15-23.3-23.8-39.3-34-6.4-2.7-12.7-5.8-19.3-8.1,3.7,20.6,3.2,41.5,3.1,62.4Z"/>
            <path class="cls-27" d="M221.9,6.4c-38.8-1.3-79.9,28-104.8,56.1,15.6-4.5,50.5-4.3,67.3-3.1,10.8-19,24.5-39.8,42.4-52.7-.3-.6-4-.3-5-.3Z"/>
            <path class="cls-27" d="M198.2,69.4c58.2,11.2,100.9,26.8,154.3,51.1,3,1.4,3.3,0,3.4,0,0-.8.1-1.7,0-2.5-18.2-12.1-46.3-24.6-67-31.8-15.2-5.3-70.7-20.3-83.9-20.6-4.1,0-5.6-.8-6.9,3.7Z"/>
            <path class="cls-1" d="M386.5,160.1c-4.3-8.2-35-27.7-44.3-32.1-5.9-2.8-17.6-8.4-17.5-5,2.7.9,3.5,3,3.7,3.1,8.6,4.9,48.5,30.8,51.1,37.7,4.2,11-15.6,19.5-31.6,22.1,2,0,3,2,6,4,16-1.6,31.2-8.3,35.6-21.5-2.1.6-.2-2.7-3.1-8.4Z"/>
            <path class="cls-1" d="M37.3,118c8.6,15.3,37.4,27.4,53.6,33,.5-2.5,23.7,7.6,21.5,3.7-12.6-3.6-63.5-26.7-68.3-35.9-8.9-17,36.4-30.9,47.4-33.4q.3-1.2.6-2.5c-12.7,2.9-52.9,11.8-54.9,27.1-.5,3.6,2.2,5.8,0,7.8Z"/>
            <path class="cls-22" d="M205,65.7c13.2.3,68.7,15.3,83.9,20.6,20.7,7.2,48.8,19.7,67,31.8-.8-4.3-.4-4.6-3.7-7.5-11.8-10.3-68.1-30.7-85.4-35.5-1.3-.4-1.8-.6-1.9-.6-15.3-4.2-43.1-10.4-58.6-12.5l-1.2,3.7Z"/>
            <path class="cls-6" d="M117.1,62.5c-10.3,3-8.9,4.7-9.4,5,1.1,1.4,4.3.3,6.2,0,7.7-1.2,40.1-4.3,45.2-2.5.5.2.3.8.3,1.2,13,.2,25.9.6,38.7,3.1,1.2-4.5,2.7-3.8,6.9-3.7l1.2-3.7c-7.1-1-14.7-2-21.8-2.5-16.8-1.2-51.7-1.4-67.3,3.1Z"/>
            <path class="cls-64" d="M332.9,129.2c.7.3,1.4.7,2,1.1.4.2.9.5,1.3.7.3.1.7.3,1,.5-3.8-2.4-6.9-4.3-8.7-5.3,0,0,0,.2,0,.2,1.6.7,3.1,1.7,4.4,2.8Z"/>
            <path class="cls-64" d="M379.6,163.9c-1.9-5.1-24.1-20.5-39-30.2,2.1,1.7,6.4,5.3,2.4,11.3,12,2,16.3,8.1,18,12,2.5,5.6,2.4,14.3-3,20-4,3-9,2-11,7,.2.4.8,1.6,1,2,16.1-2.7,35.8-11.1,31.6-22.1Z"/>
            <path class="cls-27" d="M92.2,83.1q-.3,1.2-.6,2.5c10.6-2.3,22.5-3.8,33.4-4.4,3.8-.2,31.5-.5,33,0,.5.2.3.8.3,1.2,36.7-4.8,130.3,22.1,166.5,40.5-.1-3.4,11.5,2.1,17.5,5,2.7-.6-9.8-8-13.4-10-38.5-20.5-100.6-34-144-39.9-41.1-.7-51.5-4.3-92.6,5Z"/>
            <path class="cls-29" d="M114,67.5c15.2.2,30.3-1.4,45.5-1.2,0-.4.2-1.1-.3-1.2-5.1-1.8-37.5,1.3-45.2,2.5Z"/>
            <g>
              <path class="cls-21" d="M222.5,5.2c-.2.3-.5.8-.6,1.2,1,0,4.7-.3,5,.3-17.9,12.8-31.6,33.7-42.4,52.7,7.2.5,14.7,1.5,21.8,2.5,15.5,2.1,43.3,8.2,58.6,12.5-.1-20.6.7-41.2-1.9-61.7-14.9-5-24.5-7.1-40.5-7.5Z"/>
              <path class="cls-43" d="M264.9,74.4c0,0,.5.2,1.9.6.1-20.9.5-41.7-3.1-62.4-.2,0-.4,0-.6,0,2.6,20.5,1.7,41.1,1.9,61.7Z"/>
            </g>
          </g>
        </g>
      </g>
      <path class="cls-43" d="M274.7,442.3c-4.9-7-4.7-26.6-3.5-39.5,2.3-3,4.3-6.8,5-10.2,1-3.6.4-15.8-2.8-24.7-1.6.2,4.6,12.7-.8,23.9-2.1,3-4.9,6.9-9.4,9.9-2.2,1.3-4.8,2.6-7.9,3.6-5.9,1.6-13.7,1.7-24.2-1.3.6.2,35.3,40.1,43,56,7.5,15.4,16.2,62.8,15,67,.5-.1,6.8-3.4,10-5s-2.7-48.6-24.5-79.7Z"/>
      <path class="cls-43" d="M30.5,371.1s-9.5-26.1,35.5-48.4c0,0,18.8,13.1,15.9,18.3-3.8,6.9-8.4,12.6-16,22-4.8,6-21.7,8.2-24,11s-11.5-2.9-11.5-2.9Z"/>
      <path class="cls-43" d="M168.2,406.3c5,0,10-3,10-3-6,3-16,1.7-16,1.7,0,0,1.1,1.8,1,5-.1,3.3-1.5,8.1-4,12.3-4,7-7.1,12.9-9.6,17.9-2.8,4.8-4.9,10.2-6.1,13.6-.9,2.3-1.3,3.5-1.3,3.5-4.9,19.1-9.3,45.1-12,64.7,6.6,4,7,4,7,4,0,0-3.2-21.9,2-42.4,7.5-29,19.6-41.2,23-46.6,15-24,6-30.7,6-30.7Z"/>
      <path class="cls-43" d="M137.1,345s7,3,13-1c6.1-4.1-3,13-3,13,0,0-6.1-5.3-10-12Z"/>
      <path class="cls-27" d="M202,295s.6,49.4,2,68c1.7,22.3,1,57-1,81-1.8,21.8,3,95,3,95l2,1s-3.2-44-3.1-70.2c.1-29.8,1.9-48.9,2.1-63.8s-2-61-2-71-.8-24.6,0-34c.5-5.5,2-5,2-5l-5-1Z"/>
      <g>
        <g>
          <path class="cls-42" d="M37.7,296.2c-.7,19.2-6.1,39.1-2.1,67,17.5,7.7,32.2,6,33.2-15.5.1-2.8-.1-5.7,0-8.5.4-11,.4-21.4,1.4-32.5-8.7-8.3-20.9-9.7-32.5-10.6Z"/>
          <path class="cls-14" d="M60.2,284.9c-7.1,4.9-14.2,9.3-23.3,9.2,2.2,1.6.7,1,.7,2.1,11.6.9,23.7,2.3,32.5,10.6,1.3-15.2,1.4-21.2,5.6-36.7-5.7,4.1-8.8,11.4-14.5,15.5-.8.6-1-.7-1.1-.7Z"/>
        </g>
        <path class="cls-53" d="M166,293.3c-5.3-2.6-10.9-5-16.9-5.6-2.3,5.7-5.8,9.6-9.9,14.1,11.9-4.8,20.1-5.1,25-5.3.5-1.1,1.1-2.2,1.7-3.2Z"/>
        <g>
          <path class="cls-27" d="M25.7,217.2c11.5,1.1,15.4-1.4,16.2-1.4-.4-11.1,3.9-1.7,13.4.7-.3-1-3-9.7-2.5-9.9q4.1,3.9,8.1,7.8c1-.9,5.7,3,2.1-9.9,0-.2-1.7-1.2-1.4-3.2.5-.7,1.4,1.9,2.1,2.5,4.5,4,6,5.7,12,4.9-3.1-.3-8-12-6.7-12.7q6.5,5.3,13.1,10.6c1.3-.7,3.2,1.3,1.4-4.2-.4-1.1-5-5.2-3.2-6.3l12.3,3.5c-1.4-2.9-1.1-5-3.5-7.8-39.9-8.4-49.5,15.3-63.5,25.4Z"/>
          <path class="cls-27" d="M92.7,199.5c1.1,2.4,3.1,4.3,3.5,7.1.9,0,1.9,2,4.9-.7.6-.5,1.5-3.6,2.8-4.9-4.6-3.6-4.4-4.3-5.6-5.6,0,0-.8.2-.7-.7-2.2,0-6.1-2.3-8.5-2.8,2.4,2.7,2.1,4.9,3.5,7.8Z"/>
          <path class="cls-8" d="M55.3,216.5c.2.7.7.8.7,1.4.2,0-.9.7,3.5.7-.3-3.1-.1-2.8,1.4-4.2q-4.1-3.9-8.1-7.8c-.5.2,2.2,8.9,2.5,9.9Z"/>
          <path class="cls-44" d="M41.9,215.8c.4,0,1.3-1.1,3.9-.7,3.3,1.3,6.7,2.3,10.2,2.8,0-.6-.5-.7-.7-1.4-9.5-2.4-13.8-11.8-13.4-.7Z"/>
          <path class="cls-43" d="M83.5,202.4c5.8,1.1,6.7,3.9,12.7,4.2-.4-2.7-2.4-4.7-3.5-7.1l-12.3-3.5c-1.8,1.2,2.8,5.2,3.2,6.3Z"/>
          <path class="cls-47" d="M75.8,208.7c1.1-.1,5.4-1.6,6.3-2.1q-6.5-5.3-13.1-10.6c-1.3.7,3.6,12.4,6.7,12.7Z"/>
          <path class="cls-51" d="M63.1,204.5l.7-.7c-.7-.6-1.6-3.2-2.1-2.5-.3,2,1.4,3,1.4,3.2Z"/>
        </g>
        <path class="cls-16" d="M176.2,280.2c-3.9-2.2-7.8-4.6-10.2-5.9-.4.3-1.1-1.2-1.8-.7q-4.8,4.2-9.5,8.5c-1.1,1.9-2.4,4.7-4.9,4.2,0,0,0-.1-.7,1.4,6,.6,11.5,3,16.9,5.6,2.8-4.9,6.1-9.4,10.3-13.1Z"/>
        <g>
          <path class="cls-21" d="M327.4,421.1c8.2-25-10.7-93.1-31.6-112-1.4-.3-1.6-1-2.3-1.8-4.2,3.6-8.9,6.4-13.4,9.6-5.1,3.7-10.3,7.5-15.7,10.9.4,3.4,0,7-1.6,10.3-.4.8-.8,1.7-1.1,2.6,0,.3-.1.8-.3,1.3-.1,1.6-.4,3.2-.5,4.8,0,.2.2,3.6.3,4.1.2,2.5.5,5,.8,7.4.5,4.1,1,8.1,1.3,12.2,2.9-2.1,6.3-4.7,7.7-5.6-.7-26.9-3.6-32.9,8.9-7.3,1.5.8,10.1-4.8,12.7-5.3,0,0,.3-.6,1.5-.9-2,18.6-4,43.6-2.2,61.3,4.1,2,29.1,14.9,30.9,14.9,2.5,0,2.4-5.8,4.7-6.4Z"/>
          <path class="cls-21" d="M155.1,313.8c.7.1,1.4.9,2.2,2.1,1.8-6.7,4-13.3,7-19.4-4.9.2-13.1.5-25,5.3-2.9,1.2-7.3,4.1-10.6,5.6-17.9,8.6-34.6,20-52.2,28.9-1.3,6.9-.4,7.2-6.3,11.3,16.6-3.7,8.2,27.4-3.2,35.3-10.7,7.4-20.3,4.2-27.9-5.6,7.6,20.4,22,23.6,41.6,17.6,2.1-7,6-5.7,10.2-8.5,16.1-10.6,31.3-23.4,42.7-39.2,11.3-15.6,8.8-18.8,11.6-37.7l3.2,30.3c2.6-11.6,1.5-27.1,6.7-26.1Z"/>
          <path class="cls-14" d="M70.1,347.7h-1.4c-1,21.5-15.6,23.2-33.2,15.5.7,5.1,1.7,9.2,3.5,14.1,7.5,9.8,17.1,13,27.9,5.6,11.4-7.9,19.7-39,3.2-35.3Z"/>
          <path class="cls-43" d="M80.7,394.9c15.1-4.6,51.9-28.1,66.3-37.9,0-3.2.4-12.5,1.4-17.1q-1.6-15.2-3.2-30.3c-2.9,18.9-.3,22.1-11.6,37.7-11.4,15.7-26.6,28.5-42.7,39.2-4.2,2.8-8.1,1.4-10.2,8.5Z"/>
          <path class="cls-21" d="M292.5,352.2c1.1,3.5-9.8,8.3-14.6,12.5,4.9,20.3,4.2,20.9,9.1,41.2.9.8-2.6,8.3,4,12s8.9.7,14,1c-18.4-1-8.5-49.3-11-67.6-1.3.3-1.4.9-1.5.9Z"/>
          <path class="cls-43" d="M287.6,405.4q-4.9-20.3-9.7-40.7c4.8-4.2,15.7-9,14.6-12.5-2.6.5-11.2,6.1-12.7,5.3-12.5-25.6-9.6-19.6-8.9,7.3-1.3,1-4.8,3.5-7.7,5.6,0,.9.2,1.8.2,2.8,3.3-1.5,4.3-2,9.1-4.2,3.1,16.1,9.3,31.8,10.3,48.2.5.6,8.6-.8,9.1-.2-.4-2.4-3-3-4.4-11.6Z"/>
          <path class="cls-27" d="M68.7,339.2c-.1,2.8.1,5.7,0,8.5h1.4c6-4.1,5-4.4,6.3-11.3-2.3,1.2-5.2,2.1-7.8,2.8Z"/>
        </g>
        <g>
          <path class="cls-15" d="M112.5,192.5c-2.6-.2-6.8,1.9-9.2,0-1,.6-1.8.8-2.8,1.4-.1,0-.4.8-2.1,1.4,1.2,1.3,1,2.1,5.6,5.6,5.5,4.3,11.8,7.5,15.2,14.1.8.2,7.6-3.8,15.9-5.6-6.7-9.5-10.1-15.9-22.6-16.9Z"/>
          <path class="cls-52" d="M97.6,194.6c0,.9.7.7.7.7,1.7-.6,2-1.3,2.1-1.4-1.8-.4-2.3.7-2.8.7Z"/>
          <path class="cls-37" d="M194.3,222.1c-.1-.2-1.5-3-2.1-4.2-1.7-1.7-3.4-3.5-5.1-5.4-4.1-1.2-5.9-6-11.2-7.4-.4,0-7.4,0-7.8,0-.6.1-5.7,4.1-10.2,5.6-10.4,3.6-23.8,9.1-32.8,12,15.2,2.9,29.3,16,33.2,31q19-11.6,38.1-23.3c-.1-.4.6-2-2.1-8.5Z"/>
          <path class="cls-24" d="M101.2,205.9c2,.9,3.3,2.2,4.9,3.5,12.7,10.4,2.9,9.5-9.2,17.6,1.4,3.4-.4,2.8-2.8,5.6,11.2-8.4,22-7,31-9.9,9-2.9,22.4-8.3,32.8-12,4.5-1.6,9.7-5.5,10.2-5.6v-.7c-10.9,2.1-22.3,2.6-33.2,4.9-8.3,1.8-15.1,5.9-15.9,5.6-3.4-6.6-9.6-9.8-15.2-14.1-1.3,1.3-2.3,4.4-2.8,4.9Z"/>
          <g>
            <path class="cls-15" d="M41.9,215.8c-.8,0-4.7,2.5-16.2,1.4-8.1,5.9-15,4.7-21.2,15.9-14,25.1,6.7,60.7,32.5,61,9.1.1,16.2-4.3,23.3-9.2,7.1-6.1,13.1-32.3,12.7-39.9-.3-6.3-8.8-14.1,6-3.2,1.4-1,1-2,1.1-2.1-3.2-6.3-8.4-18.8-14.1-21.9-1.9,1.1-4.2.7-6.3.7-4.4,0-3.3-.7-3.5-.7-3.5-.5-6.9-1.5-10.2-2.8-2.6-.4-3.5.7-3.9.7Z"/>
            <path class="cls-30" d="M28.1,222.1c-36.1-3.2-24.7,58.7,6.3,66.3,41.4,10.1,28.7-63.2-6.3-66.3Z"/>
          </g>
          <path class="cls-45" d="M65.9,217.9c5.8,3,10.9,15.5,14.1,21.9,6.5-4.9,9.5-7.7,16.9-12.7,12.1-8.1,21.9-7.2,9.2-17.6-6.6-1.6-38.4,3.2-40.2,8.5Z"/>
          <path class="cls-54" d="M80,239.7c0,0,.4,1.1-1.1,2.1-14.8-11-6.3-3.1-6,3.2.4,7.5-5.6,33.7-12.7,39.9,0,0,.2,1.3,1.1.7,5.7-4.2,8.7-11.4,14.5-15.5,1-3.5,2.4-5.9,3.5-9.2,5.7-16.4,2.8-14,14.8-28.2,2.4-2.8,4.3-2.2,2.8-5.6-7.4,5-10.4,7.8-16.9,12.7Z"/>
          <path class="cls-30" d="M83.5,202.4c1.8,5.5,0,3.5-1.4,4.2-1,.5-5.3,2-6.3,2.1-6,.8-7.5-1-12-4.9l-.7.7c3.6,12.9-1.1,9-2.1,9.9-1.5,1.4-1.7,1.1-1.4,4.2,2.1,0,4.4.4,6.3-.7,1.8-5.3,33.6-10.1,40.2-8.5-1.6-1.3-2.9-2.6-4.9-3.5-3.1,2.7-4,.8-4.9.7-6-.3-6.9-3.1-12.7-4.2Z"/>
          <path class="cls-57" d="M158.3,253.9c.2.8-.2,2,0,2.8,1.8,9.6,1.7,16.7-3.5,25.4q4.8-4.2,9.5-8.5c.7-.5,1.3,1,1.8.7,4.6-2.9,9.5-5.5,14.1-8.5,2.2-1.4,5.5-2.8,6.3-3.5,4-3.1,11.7-12.2,12.7-16.9.1-.5.7-4,.7-4.2,0-2.7-2.8-7.9-3.5-10.6q-19,11.6-38.1,23.3Z"/>
          <g>
            <path class="cls-10" d="M149.8,286.3c2.5.5,3.8-2.3,4.9-4.2,5.2-8.7,5.3-15.8,3.5-25.4-8.3.3-4,16.4-8.5,29.6Z"/>
            <g>
              <path class="cls-15" d="M94.1,232.7c-12,14.2-9.1,11.8-14.8,28.2,2.5,27.2,20.1,49.4,49.4,46.6,3.3-1.6,7.7-4.5,10.6-5.6,4.1-4.6,7.6-8.4,9.9-14.1.6-1.5.7-1.3.7-1.4,4.5-13.2.2-29.3,8.5-29.6-.2-.9.2-2,0-2.8-3.9-15-17.9-28.2-33.2-31-9.1,2.9-19.8,1.5-31,9.9Z"/>
              <g>
                <path class="cls-30" d="M112.1,232c-39.4-5.4-29.6,59,4.2,68.4,42.9,11.9,33.8-63.2-4.2-68.4Z"/>
                <path class="cls-24" d="M90.2,261.6c-5.9-1.4,3.2,20.4,11.3,28.2,1,1,10.7,8.2,11.3,7.8,2.8-2-7.6-8.7-13.8-18-5.4-8.3-7.8-17.8-8.8-18Z"/>
              </g>
            </g>
          </g>
        </g>
      </g>
      <path class="cls-64" d="M203.9,348.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M204.9,369.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M204.9,388.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M204.9,408.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M203.9,328.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-27" d="M30.2,370.2s22,5.6,39.4-33.8l7.6-4.7s15.7,15,9.5,24,3.5,20.3-18.1,27.9c-21.6,7.6-17.8,6.2-23.4,4.9-11.6-2.7-14.9-18.3-14.9-18.3Z"/>
      <path class="cls-64" d="M203.9,430.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M203.9,448.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M203.9,468.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M203.9,488.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <path class="cls-64" d="M204.9,509.8c2.6-.3,3.1,4.3,1,5-3.1,1-3.9-4.7-1-5Z"/>
      <g>
        <path class="cls-66" d="M114.3,105.9c.4.5,9,7.2,10.5,7.7.2,1.5-.3,2.8-.5,4.2-.2,1.3-1.5,6.7-2,7.2-1.3,1.4-16.8,3.5-16,14.7-25.4,1.7-21.1-15.5-14.7-18,4.5-1.8,9.5,1.3,14,.5,1.5-1.2.5-7.5,5.2-15,1.1-.6,2.3-1.3,3.5-1.5Z"/>
        <path class="cls-61" d="M106.3,139.9c.3,4.2,2.5,9.7,2.5,10.2,0,6.5-11.1,4.3-20,8.2,1.2-1.7,3.1-1.5,2.5-2.2-5.1-.5-6-.2-3.2-4.7-4.7-.8-7.4,2.4-7.2,0,2.6-1.1,5.3-1.4,8-2.2-13.6-13.1-6.5-31.8,12.7-30.2,3.8-7.9,1.2-7.1,9.2-11.5-4.8,7.5-3.7,13.8-5.2,15-4.5.8-9.5-2.3-14-.5-6.4,2.5-10.7,19.7,14.7,18Z"/>
        <path class="cls-66" d="M80.8,151.4c-.2,2.4,2.5-.8,7.2,0-2.7,4.6-1.9,4.2,3.2,4.7.6.7-1.3.6-2.5,2.2-3.1,4.2-4.2,9.9-2,14.5-1-.7-1.8-.3-1.7-2-2.6.2-7.5-3.3-8.2-5.2-.9-2.4-.2-5.1-.5-7.5-.2-1.5-2.5-1.2-.5-3.7,1.7-1.6,2.9-2.1,5-3Z"/>
        <path class="cls-61" d="M129.3,111.9c-1.6,2-3.6,3.8-5,6,.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-.3-.4-2-8.5-2-9.2.1-4,3-8.2,6-10.7-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7Z"/>
        <path class="cls-20" d="M106.6,180.1c-3.8-7.1-12.8-9.5-15.1-12.2-3.4-4.2,9.2-4.4,14-6.5,16.7-7.2,4.8-18,7.2-24.2,22.9-12,14.4-10.8,17.5-17.5.5-1.1,8.2-7.7,8.5-8.5,1.1-3.1-3.1-7.7,5.7-13.7,18,2.3,32.5,10.2,36.5-13.5,3.6,5.3,3.2,11,7,8,4.1-3.2,1.5-15.7-8.5-14-7.2,1.2-7.1,15.7-10.5,16.5-22.5-2.9-21.6-9.7-37.7,8.2,1.7,8.8.3,6.4-2,9.2-1.6,2-3.6,3.8-5,6-.2,1.3-1.5,6.7-2,7.2-1.3,1.4-16.8,3.5-16,14.7.3,4.2,2.5,9.7,2.5,10.2,0,6.5-11.1,4.3-20,8.2-3.1,4.2-4.2,9.9-2,14.5,5.6,3.8,14.1,8.1,14,11,0,.9.2,1.6.2,2.2,1,.2,2,.4,2.9.7.4,0,.7.2,1,.3.4-2.3.9-4.6,1.6-6.9Z"/>
        <path class="cls-66" d="M101,186c0-.6-.1-1.3-.2-2.2l-14.5.2c0,.4,0,.7,0,1.1,5-.4,9.9-.1,14.8.8Z"/>
        <path class="cls-61" d="M81.8,180.6c.4,1.1-1.1,2.5-1.5,5.4,2-.4,4-.7,6-.8,0-.4,0-.7,0-1.1q7.2-.1,14.5-.2c.1-2.9-8.4-7.2-14-11-1-.7-1.8-.3-1.7-2-2.6.2-7.5-3.3-8.2-5.2-.9-2.4-.2-5.1-.5-7.5-.2-1.5-2.5-1.2-.5-3.7-9.5,8.9-5.1,21.5,6,26.2Z"/>
        <path class="cls-66" d="M221.7,76.5c-26.7-18.5-50.1-16.3-67.9,1.1-1.8,1.7,0,4.2-13.2,9.7-2.1,0-10.4-11.3-22.2-1.5-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.2,2.8,11.2,5.2,15.1,12.2,2.6-8.3,13.8-14.5,19.4-20.1,5.6-5.6,6.5-11.7,14.3-14.2,9.6-16.4,23.3-30.3,40.3-39.3,1.1-.6,2.3-1.2,3.4-1.7.2-.8.3-1.4.5-1.4.2.3.4.6.5.9,12.7-6.1,45.3-6.8,58.9-9.3-1.6-4.9-17.7-15.3-22.3-18.5Z"/>
      </g>
      <g>
        <path class="cls-35" d="M211.9,509.7c1.4.5,5.6,2.1,6.5,2.6,1.2.7,4.6,2,1.6,3.1-5.8,2.2-19.9-6.1-25.2-8.4-1.4-.6-1.6-1.3-2.2-1,0-.4.2-.5.2-.8,6.4.9,13,2.3,19.2,4.5Z"/>
        <path class="cls-7" d="M220,515.5l.6,2.2c-9.7,2.5-18.9-4.6-25.8-10.7,5.3,2.3,19.4,10.6,25.2,8.4Z"/>
        <path class="cls-48" d="M294.7,290.9c-3.4,10.9-8.8,21-12.7,31.6-7,19.2-42.7,121.7-44,133-.1,1.2-7.9,19.9-9,23-3.8,11.2-6.5,22.7-10.6,33.8,1.2.7,4.6,2,1.6,3.1l.6,2.2c1-.3,2.1-.5,3.1-.8q.4-.5.7-1c3.5-10.5,14.7-72.8,27.2-110.2,6-18.1,31.7-67.5,38.4-87.3,2-5.8,6.9-18.8,7.5-21.1.3-1.3.9-2.6.9-4-.1-.2-3.2-2-3.7-2.4ZM248.9,445.1c0,0-.1,0-.2-.1,0-.2.2-.5.3-.7,0,.3,0,.6,0,.9Z"/>
        <path class="cls-7" d="M292.3,289.2c-.6-.3-10.2-2.6-11.3-3.1-9.6,29-14.6,70.4-15.2,66.6-3.1,9.1-6.4,17.5-11.6,25.1,0,0-16.6,34-15.4,50.2,0,0-.2,0-.3,0-3.7,15-20.6,66-25.2,79.5-.2.7-.7,2.1-1.4,2.1,1.4.5,5.6,2.1,6.5,2.6,4.1-11.1,26.5-76.2,28-84.2,4.2-13.2,16.3-47.2,16.4-47.3,7.4-19.1,12.2-39.2,19.2-58.3,3.9-10.6,9.3-20.8,12.7-31.6-.8-.5-1.6-1.3-2.4-1.7Z"/>
        <path class="cls-36" d="M276.4,283.5c-.8-.2-6.8-1.1-7.1-.9-.5,1.6-1.5,2.9-2.2,4.5-.8,1.9-1.5,5.7-2.3,8-.5,1.5-9,46.5-25.7,94.2-18.9,53.8-46.2,111.2-46.5,112.5-.2,1-.4,1.9-.9,2.8.2.2.9.4,1,.7,6.4.9,13,2.3,19.2,4.5.8,0,1.2-1.5,1.4-2.1,4.4-13,20-59.9,24.6-77.2.1,0,.3.1.4.2q2.5-11,5-22c-1.6.2,18.4-43.7,22.6-55.9,3.5-10.2,6.5-22,9.7-32.4,1.3-4.2,3.4-8.3,4.6-12.5,1.8-5.8,3.8-19.1,6.5-20.6-2.5-1-8-3.1-10.3-3.6Z"/>
      </g>
      <g>
        <g>
          <path class="cls-2" d="M264.3,394.8c-.1.6-1.2.8-1.2,1-.5,2.9,5.3,4.6-2.4,20.7-2.3,4.8-4.6,7.6-7.9,11.7-.9,1.2-8.8,8.7-8.2,9.6,20.2,12.6,76.1,38.2,87.5,7.1-.4,6.1-.8,12.5-2.5,18.4-1.2,4.2-3,8.2-6.7,10.9-13.1,9.9-40.8-3.4-53.2-10.7-3.3-2-24.1-16.5-27.2-19-11.2-9.1-11.6-11.2-9.3-25.7,1.4-.5,4.2,3.6,7.3,5.5,4.3-4.7,18.1-10,19.9-14.8.3-.9,1.7-13.1,1.7-14.2.9-.5,1.2-.5,2.2-.6Z"/>
          <path class="cls-42" d="M329.9,408.9c1.5,13.4,3.2,21.5,2.2,36.1-11.4,31.1-67.3,5.4-87.5-7.1-.5-1,7.3-8.5,8.2-9.6,3.8,1.9,4.2.8,4.4.8,10.6,2.5,21.2,4.3,31.8,6.6,3.4.7,7.3,1.3,9.8,1.9,7.2,1.7,14.7,3.2,21.1,6.9-4.3-6.3-12.2-8.1-18.8-11,7.4-12,17-17.2,28.6-24.5Z"/>
          <path class="cls-2" d="M329.9,408.9c-11.6,7.4-21.2,12.5-28.6,24.5-.8,1.3-2.1,2.5-2.3,4.1-2.6-.6-6.4-1.1-9.8-1.9-2.1-4.2-2.7-11.6-3.8-14.5,10-1.2,14.1-2,23.4-5.2,7.5-2.6,14.3-5.8,21.2-9.7,0,.2-.1,1.3,0,2.5Z"/>
          <path class="cls-2" d="M298.9,437.6c.2-1.7,1.5-2.8,2.3-4.1,6.6,2.8,14.4,4.7,18.8,11-6.4-3.7-13.9-5.2-21.1-6.9Z"/>
          <g>
            <path class="cls-42" d="M262.2,395.4c0,1.1-1.4,13.3-1.7,14.2-1.8,4.8-15.5,10-19.9,14.8-3.1-1.8-5.9-6-7.3-5.5.3-2.1.8-4.3,1.2-6.4,15.5,10.5-1,.6,2.3-5.2,16.9,9.3,14.4,4.3-.5-1.6.1-.5.2-1,.3-1.5,0-.3.1-.7.2-1,.8-.7.6-1.3.9-1.9,5.8,1.3,11.3,5,17.7,5.7-12.7-8.6-18.6-2.2-9.7-11.8,18.7,14.6,13.3,7.3-.4-3.1l.6-4.5c2.1-2.4,2.4-1.6,3.5-2.4,2.5-1.9-2.4-4.7,10.3.5-.1-6.6,2.4,3.8,2.5,9.6Z"/>
            <path class="cls-2" d="M234.5,412.5c0-.2,0-.3,0-.5.3-1.4,1.2-4.3,1.7-6.3,14.8,5.9,17.3,10.9.5,1.6-3.3,5.8,13.2,15.6-2.3,5.2Z"/>
            <path class="cls-19" d="M237.6,401.4c2-4.4,5.8-7.4,6.4-12.3.9-1.3,1.7-1.3,1.8-1.4l-.6,4.5c13.7,10.4,19.1,17.8.4,3.1-8.9,9.6-3,3.2,9.7,11.8-6.5-.7-11.9-4.4-17.7-5.7Z"/>
            <path class="cls-19" d="M253.2,390.6c5.9,6.3,5.2,9.5-.4.7v-.5q.2,0,.4-.2Z"/>
          </g>
        </g>
        <path class="cls-58" d="M279.1,378.1c.1-1,.3-2.1.3-3.1,0-1,.1-1.9.1-2.6,0,.7,0,1.6-.1,2.6,0,1-.2,2-.3,3.1,0,.7-.2,1.4-.3,2.1.1-.7.2-1.4.3-2.1Z"/>
        <g>
          <path class="cls-43" d="M313,431s-9,4-28.2-2-1.4-1.6-1.6-5.5c12.2,7,10.8-6.5,11.3-5.6-2.2-4,18.5,13,18.5,13Z"/>
          <path class="cls-27" d="M334,398c-11.5,13.9-24.6,15.8-37.2,15.8-.5,0-1.2.4-3.4.3,0,0,0,0,0,0-3.8-.3-10.6-.2-14.4-1,.3,3.8,2,12,5,16,10,2,14.2,6,12.4-8,3.6,3.5,9.4,8,12.6,11,8-1.4,15.6-4.6,23.3-9.1.2-2.9,2.1-13.7,2.6-19.4,0-3.8-1-5.2-1-5.5Z"/>
        </g>
      </g>
    </g>
  </g>
</svg>`,
            'default': 
                `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 310 491">
  <defs>
    <style>
      .cls-1 {
        fill: #c45f41;
      }

      .cls-2 {
        fill: #c05e58;
      }

      .cls-3 {
        fill: #2d0903;
      }

      .cls-4 {
        fill: #232323;
      }

      .cls-5 {
        fill: #a383b5;
      }

      .cls-6 {
        fill: #d7dadc;
      }

      .cls-7 {
        fill: #8e3226;
      }

      .cls-8 {
        fill: #f7b750;
      }

      .cls-9 {
        fill: #503740;
      }

      .cls-10 {
        fill: #a34737;
      }

      .cls-11 {
        fill: #cf99ce;
      }

      .cls-12 {
        fill: #a1a2a3;
      }

      .cls-13 {
        fill: #23110a;
      }

      .cls-14 {
        fill: #281a26;
      }

      .cls-15 {
        fill: url(#linear-gradient);
      }

      .cls-16 {
        fill: #f0935d;
      }

      .cls-17 {
        fill: #bdeded;
      }

      .cls-18 {
        fill: #c12e4b;
      }

      .cls-19 {
        fill: #ddcfe4;
      }

      .cls-20 {
        fill: #080707;
      }

      .cls-21 {
        fill: #e5fdfe;
      }

      .cls-22 {
        fill: #7f2c86;
      }

      .cls-23 {
        fill: #dcb5d8;
      }

      .cls-24 {
        fill: #2e643c;
      }

      .cls-25 {
        fill: #a66bb7;
      }

      .cls-26 {
        fill: #fbfbfc;
      }

      .cls-27 {
        fill: #885f93;
      }

      .cls-28 {
        fill: #c386c3;
      }

      .cls-29 {
        opacity: .2;
      }

      .cls-29, .cls-30 {
        fill: #7aebe9;
      }

      .cls-31 {
        fill: #c9892d;
      }

      .cls-32 {
        fill: #e6794d;
      }

      .cls-33 {
        fill: #efd870;
      }

      .cls-34 {
        fill: #736b8a;
      }

      .cls-35 {
        fill: #511407;
      }

      .cls-36 {
        fill: #661b6a;
      }

      .cls-37 {
        fill: #17ae9d;
      }

      .cls-38 {
        fill: #d53a5c;
      }

      .cls-39 {
        fill: #f9efed;
      }

      .cls-40 {
        fill: #95409b;
      }

      .cls-41 {
        fill: #353535;
      }

      .cls-42 {
        fill: #835c76;
      }

      .cls-43 {
        fill: #bb7ba0;
      }

      .cls-44 {
        fill: #120f12;
      }

      .cls-45 {
        display: none;
      }

      .cls-46 {
        fill: #320532;
      }

      .cls-47 {
        fill: #1d121b;
      }

      .cls-48 {
        fill: #4e0b1b;
      }
    </style>
    <linearGradient id="linear-gradient" x1="112.42" y1="292.68" x2="69.81" y2="383.14" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#506f61"/>
      <stop offset="1" stop-color="#565054"/>
    </linearGradient>
  </defs>
  <!-- Generator: Adobe Illustrator 28.7.1, SVG Export Plug-In . SVG Version: 1.2.0 Build 142)  -->
  <g>
    <g id="Layer_1">
      <path class="cls-8" d="M180.54,472.03c0,1-10.04,18.13-11.03,18.18-24,1-61-1-68-7-3.81-3.27-7.75-19.99-8-21-4.15-16.78,69.78,11.4,87.03,9.82Z"/>
      <g>
        <g id="Background" class="cls-45">
          <path class="cls-12" d="M86.77,475.93c-76.66-.03-153.33.02-229.99,0V-36.06h511.99v511.99c-62.83.03-125.66-.04-188.49,0l2-12c4.67-1.72,10.18-4.03,14.5-6.5,3.45-1.97,7.1-3.76,8.5-7.75-.58-6.9-2.36-13.56-4-20.25,78.66-56.22,100.3-140.93,35-218.49.44-.15,3.73.06,8.75-3,11.31-6.89,14.02-20.62,8.75-32.25,19.68-4.09,26.74-27.04,11.5-40.5,1.3-4.6-.06-9.71-3.5-13,18.09-14.94,14.27-39.84-6.5-49.5,3.45-16.49-13-29.19-28.5-28,3.97-21.09-13.43-38.56-33.75-28.25C176.04-1.59,147.23-10.1,124.52,1.94c-20.79-21.07-68.84-13.98-83,12C24.98.63-1.9,15.6,3.78,36.69q-5.87,5.12-11.75,10.25c-15.38,1.62-25.36,19.24-18.25,33.25-16.51,8.39-18.6,31.46-2,41-18.55,4.77-26.83,31.52-8,41.5-3.31,17.4,13.59,21.59,14,23-2.88,8.02-1.6,15.43,4,21.75-35.08,28.1-51.49,75.22-45,119.25,7.26,49.22,46.06,86.19,86.5,111.25-.66,4.4-1.83,8.73-1.5,13.25,2.47,2.94,4.86,4.65,8,6.75,14.74,9.85,38.13,13.18,55.5,15q.75,1.5,1.5,3Z"/>
        </g>
        <g>
          <path class="cls-8" d="M184.32,472.19c0,1-10.04,18.13-11.03,18.18-24,1-61-1-68-7"/>
          <path class="cls-8" d="M184.32,472.19c0,1-11.03,17.18-11.03,18.18,14.33,0,53.02-11.14,54.03-16.18l1.83-11.58-44.83,9.58Z"/>
          <path class="cls-31" d="M156.29,479.95s3.67,10.67,5,10.67h-2.67l-2.33-10.67"/>
          <path class="cls-36" d="M46.28,357.93c.7.87,7.21,13.46,11.5,19v.5c-16.64,5.31-25.35-11.01-24.5-25.5,2.22,2.24,8.03,5.32,11.25,4,.46.86,1.45,1.63,1.75,2Z"/>
          <path class="cls-5" d="M69.78,385.43c1.93,2.89,6.03,7.8,8.5,10.5-.47.39-2.33,3-2.75,3-.85,0-8.39-11.71-10-12.5-.59-.29-3.07,3.5-7.75-9v-.5c2.92,3.77,6.73,10.57,12,8.5Z"/>
          <path class="cls-10" d="M48.78,353.93c5.23,8.51,10.61,18.16,17.5,25.5.08.12.41.84,1.5,2.5,2.04,3.11,1.89,3.33,2,3.5-5.27,2.07-9.08-4.73-12-8.5-4.29-5.54-10.8-18.13-11.5-19-1.16-2.36.18-3.39,2.5-4Z"/>
          <path class="cls-33" d="M48.78,343.43c3.99,1.61,4.18,8.07.5,10-1.21-2.15-4.86-6.37-2-6.25-2.26-4.46,1.27-3.56,1.5-3.75Z"/>
          <g>
            <path class="cls-32" d="M27.78,318.43c3.02-.45,16.07-8.25,16.5-1.75.33,4.9-18.98,11.01-23.25,11.25,12.56.89,22.64-7.73,24-8,4.23-.84,7.72,1.18,5.75,5-2.56,4.95-24.82,7.95-26.5,11.5-5.4-.1-7.47-7.12-9.5-11-.77-4.1-3.34-18.47-.5-19,3.39,4.19,6.67,8.46,10.25,12.5,1.07-.3,2.17-.34,3.25-.5Z"/>
            <path class="cls-32" d="M53.78,333.43c.2,1.73,5.66,1.28-5,10-.23.19-3.76-.71-1.5,3.75-2.86-.12.79,4.1,2,6.25.07.13-.07.37,0,.5h-.5c-2.32.61-3.66,1.64-2.5,4-.3-.37-1.29-1.14-1.75-2-3.22,1.32-9.03-1.76-11.25-4-.04-.04-.43-.74-.5-1,5.57,1.06,16.63-4.72,11.25-4-.8.11-10.08,6.61-14.25-1,6.95-5.38,16.53-7.44,24-12.5Z"/>
            <path class="cls-7" d="M24.28,336.43c-1.11,2.35,1.37,5.98,3.75,6.5,3.02.66,22.15-7.6,25.25-11,.2,1,.47,1.26.5,1.5-7.47,5.06-17.05,7.12-24,12.5-.56.43-1.39.61-2,1-7.83-6.53-11.16-11.74-13-21.5,2.03,3.88,4.1,10.9,9.5,11Z"/>
            <path class="cls-10" d="M32.78,350.93c-2.46-.47-3.42-2.68-5-4,.61-.39,1.44-.57,2-1,4.17,7.61,13.45,1.11,14.25,1,5.38-.72-5.68,5.06-11.25,4Z"/>
            <path class="cls-32" d="M53.78,327.93c.52,2.08-.54,3.8-.5,4-3.1,3.4-22.23,11.66-25.25,11-2.38-.52-4.86-4.15-3.75-6.5,1.13.02,14.8-4.09,17.25-5,6.3-2.34,8.82-7.16,12.25-3.5Z"/>
            <path class="cls-7" d="M53.78,327.93c-3.43-3.66-5.95,1.16-12.25,3.5-2.45.91-16.12,5.02-17.25,5,1.68-3.55,23.94-6.55,26.5-11.5,1.29,1.28,2.44.78,3,3Z"/>
          </g>
          <g>
            <path class="cls-15" d="M138.77,329.43c-4.61.46-18.88-.4-20,4.5-.36,1.59.43,3.09.5,4.5,0,.17,0,.33,0,.5.11,1.99.74,3.24,1,5,1.28,8.55,1.93,16.57,9.25,22.5,10.18,8.24,18.1,3.96,26,6l8.25-3c1.32,2.2,11.19,17.17,12,18-25.74,4.12-63.33,2.72-86.5,5.5-2.7.32-5.53.48-8.25.5-2.13.66-2.27,2.1-2.75,2.5-2.47-2.7-6.57-7.61-8.5-10.5-.11-.17.04-.39-2-3.5.11-1.26-.79-1.75-1.5-2.5-4.26-6.48-15.62-23.09-17-25.5-.07-.13.07-.37,0-.5,3.68-1.93,3.49-8.39-.5-10,10.66-8.72,5.2-8.27,5-10-.03-.24-.3-.5-.5-1.5-.04-.2,1.02-1.92.5-4-.56-2.22-1.71-1.72-3-3,1.97-3.82-1.52-5.84-5.75-5-1.36.27-11.44,8.89-24,8,4.27-.24,23.57-6.35,23.25-11.25-.43-6.5-13.48,1.3-16.5,1.75-3.79-3.14-20.36-27.75-22-28.5-.03-.31.59-.96.75-1,2.45-.54,17.05-.41,22.75-1.5.07.33.59,1.26.75,3,1.08-.02,2.17.03,3.25,0-.03.31.59.96.75,1,4.2.93,35.23-2.93,43.5-3,.32-.19,1.65-.99,1.75-1,1.29-.17,6.1-1.82,8-2.5,4.03,1.51,18.1-2.07,20.25-1.5q15.62,23,31.25,46Z"/>
            <path class="cls-44" d="M80.78,275.93c.22.25,2.93,1.4,5,4.5,1.03,1.55,1.83,2.4,1.5,4.5-1.9.68-6.71,2.33-8,2.5-1.6-2.49-2.19-1.94-4.75-2-8.53-.2-37.92,4.92-41.25,5-1.08.03-2.17-.02-3.25,0-.16-1.74-.68-2.67-.75-3-.14-.7-.07-2.6,0-3.5.11-1.55-.48-3.15.75-4q7.12-1.12,14.25-2.25c-1.17-3.85-11.65-25.86-11-27.5.26-.65,2.43-1.76,4-.5,1.29,1.04,13.98,24.65,17.25,28.25l13-1q.25-3.25.5-6.5c4.15,7.25,4.07,6.59,12.75,5.5Z"/>
            <path class="cls-27" d="M5.78,289.93c1.64.75,18.21,25.36,22,28.5-1.08.16-2.18.2-3.25.5-3.58-4.04-6.86-8.31-10.25-12.5-4.31-5.33-8.85-11.2-12.5-17,2.07,1.95.75-.98,4,.5Z"/>
            <path class="cls-5" d="M29.28,283.93c-.07.9-.14,2.8,0,3.5-5.7,1.09-20.3.96-22.75,1.5-.16.04-.78.69-.75,1-3.25-1.48-1.93,1.45-4-.5-.08-.13-1.17-.48-2-2.25,9.57-1.89,19.73-1.76,29.5-3.25Z"/>
            <path class="cls-34" d="M176.77,388.43c-3.41.66-38.34,3.07-46.25,3.5-13.72.75-27.54.51-41.25,1.5v-.5c23.16-2.78,60.76-1.38,86.5-5.5.05.05.92.24,1,1Z"/>
            <path class="cls-26" d="M144.27,321.43c1.93,2.51,4.46,4.35,6.5,6.75-4.02.27-8,.85-12,1.25q-15.62-23-31.25-46c-2.14-.57-16.22,3.01-20.25,1.5.33-2.1-.47-2.95-1.5-4.5.64-1.6,4.28-1.24,6-1.5,1.17-.18,2.33-.33,3.5-.5,7.57-1.09,15.09-2.57,22.75-3,6.58,11.71,19.12,36.73,26.25,46Z"/>
            <path class="cls-9" d="M140.27,364.93c8.59,2.41,12.27,1.9,20.5-1.5.44,1.29,1.34,2.35,2,3.5.91,1.59.93,2.38,1,2.5l-8.25,3c-7.9-2.04-15.82,2.24-26-6-7.32-5.93-7.97-13.95-9.25-22.5,2.73,2.32,6.32,2.45,6.5,2.75,1.08,1.8-3.79,13.4,13.5,18.25Z"/>
            <path class="cls-6" d="M79.28,287.43c-.1.01-1.43.81-1.75,1-8.26.07-39.3,3.93-43.5,3-.16-.04-.78-.69-.75-1,3.33-.08,32.72-5.2,41.25-5,2.56.06,3.15-.49,4.75,2Z"/>
            <path class="cls-42" d="M66.28,379.43c-6.89-7.33-12.27-16.99-17.5-25.5h.5c1.38,2.41,12.74,19.02,17,25.5Z"/>
            <path class="cls-42" d="M67.78,381.93c-1.09-1.66-1.42-2.38-1.5-2.5.71.75,1.61,1.24,1.5,2.5Z"/>
          </g>
          <g>
            <path class="cls-33" d="M181.77,337.93c.53.28,2.38-.03,2.5,0,1.47.35,2.91,1.19,4.5,1,.27,1.41.49.94.5,1,1.19,10.16-2.94,10.15-11.5,7,1.15-1.83,1.77-8.97,4-9Z"/>
            <g>
              <path class="cls-10" d="M233.77,374.43c-1,2.82-1.69,5.8-4,8q-2.25-.5-4.5-1c-1.21-.97-2.22-1.99-3.5-3-9.91-7.81-26.88-15.06-37.5-23.5.5-.44,2.28-2.95,2.75-3,15.12,8.47,30.78,15.78,46.75,22.5Z"/>
              <path class="cls-32" d="M202.27,341.43c9.91,1.32,16.26,2.91,25.75,5.5.53.14,2.11-2.39,9.75,3.5.04.13-.01.33,0,.5.28,3.92-2.74-.17-3.5,1.25-.21.39,2.26,2.14,2.5,8.25.2,5.05-1.37,9.38-3,14-15.97-6.72-31.63-14.03-46.75-22.5-.47.05-2.25,2.56-2.75,3-2.15,1.86-1.79,4.05-5.5,1.75.28-4.33-1.4-3.55-1.5-3.75-.59-1.17-.8-2.72-2-3.5.34-.31,2.41-2.35,2.5-2.5,8.56,3.15,12.69,3.16,11.5-7,4.32.57,8.68.92,13,1.5Z"/>
              <path class="cls-43" d="M238.27,353.43c-.49,3.23-.18,6.74-1.5,7-.24-6.11-2.71-7.86-2.5-8.25.76-1.42,3.78,2.67,3.5-1.25h.5v2.5Z"/>
            </g>
            <g>
              <path class="cls-32" d="M181.77,337.93c-2.23.03-2.85,7.17-4,9-.09.15-2.16,2.19-2.5,2.5-6.1,5.52-27.48,14.95-35.5,12.5-1.98-.6-3.11-2.17-4.5-3.5,18.99,3.66,8.71.64,6.5-6.25-4.34-13.54,3.99-12.61-6.5-14.75-5.58-1.14-11.5-.48-16.5-3.5,1.12-4.9,15.39-4.04,20-4.5,4-.4,7.98-.98,12-1.25-2.04-2.4-4.57-4.24-6.5-6.75,25.12-3.65,35.58,15.5,37.5,16.5Z"/>
              <path class="cls-1" d="M135.27,337.43c10.49,2.14,2.16,1.2,6.5,14.75,2.21,6.89,12.49,9.91-6.5,6.25-3.11-2.97-10.62-13.76-3-13.75-4.44-1.93-9.22-2.43-13-5.75,0-.17,0-.33,0-.5,1.32-2.47,12.76,2.1,16-1Z"/>
              <path class="cls-10" d="M135.27,358.43c1.39,1.33,2.52,2.9,4.5,3.5l.5,3c-17.29-4.85-12.42-16.45-13.5-18.25-.18-.3-3.77-.43-6.5-2.75-.26-1.76-.89-3.01-1-5,3.78,3.32,8.56,3.82,13,5.75-7.62-.01-.11,10.78,3,13.75Z"/>
              <path class="cls-10" d="M135.27,337.43c-3.24,3.1-14.68-1.47-16,1-.07-1.41-.86-2.91-.5-4.5,5,3.02,10.91,2.36,16.5,3.5Z"/>
              <path class="cls-1" d="M175.27,349.43c1.2.78,1.41,2.33,2,3.5-2.03,1.42-7,5.4-8,6-.78.47-8.06,4.32-8.5,4.5-8.23,3.4-11.91,3.91-20.5,1.5l-.5-3c8.02,2.45,29.4-6.98,35.5-12.5Z"/>
            </g>
          </g>
          <g>
            <path class="cls-26" d="M173.77,364.93q6.25,9.75,12.5,19.5c-.5.11-6.03,3.33-9.5,4-.08-.76-.95-.95-1-1-.81-.83-10.68-15.8-12-18-.07-.12-.09-.91-1-2.5,2.7-1.02,6.17-1.82,9-2,.66-.04,1.34.01,2,0Z"/>
            <path class="cls-25" d="M169.27,358.93c1.5,2.32,4.67,5.01,2.5,6-2.83.18-6.3.98-9,2-.66-1.15-1.56-2.21-2-3.5.44-.18,7.72-4.03,8.5-4.5Z"/>
          </g>
          <g>
            <path class="cls-36" d="M184.27,354.93c10.62,8.44,27.59,15.69,37.5,23.5,5.55,10.5,8.77,21.66,12,33-18.8,8.66-39.21,13.17-59.75,15-5.11.46-24.9,1.51-29.25,1.5-.5,0-1,0-1.5,0-12.66-.13-35.59-2.26-47.75-6q2.37,7.62,4.75,15.25-11.25,7.12-22.5,14.25c2.7-19.56,6.64-38.86,11.5-58,13.71-.99,27.53-.75,41.25-1.5,7.91-.43,42.84-2.84,46.25-3.5,3.47-.67,9-3.89,9.5-4,6.54-1.44,13.92.41,20.5-.75q-9.37-8.87-18.75-17.75c-4.79-.19-9.43-1.1-14.25-1-.66.01-1.34-.04-2,0,2.17-.99-1-3.68-2.5-6,1-.6,5.97-4.58,8-6,.1.2,1.78-.58,1.5,3.75,3.71,2.3,3.35.11,5.5-1.75Z"/>
            <path class="cls-36" d="M275.77,379.93c-4.66,15.46-24.61,18.75-37.75,12.5-5.17-2.46-8.54-7.6-12.75-11q2.25.5,4.5,1c1.22,1.73,3.6-4.38,4.25-4.5.3-.06,4.18,3.18,5,3.5,8.91,3.51,30.42,7.62,36.75-1.5Z"/>
            <path class="cls-36" d="M150.27,231.44c-.68,2.07-1.7,3.96-2.5,6-1.83-.3-1.9.96-2,1-.53.21.22-1.48-3,1.75-3.25,3.26-20.49,27.48-22.25,27.75-.29.04-5.13-2.48-5.25-2.75-1.4-3.12-.03-30.67-2.75-32.25-.73-.42-3.62.87-3.25-1,2.03-.15,3.94.87,6,.5-.58,8.83-.24,18.16,6.75,24.5.41,0,3.62-3.92,4.25-4.5,6.77-6.24,12.8-13.26,19.5-19.5.93-.87,2.32-1.39,3-2.5.19.17,1.22.84,1.5,1Z"/>
            <path class="cls-40" d="M243.77,457.43c-4.32,2.47-9.83,4.78-14.5,6.5-14.1,5.2-30.06,8.63-45,10-17.25,1.58-34.8.8-52-1-17.37-1.82-40.75-5.15-55.5-15,.91-2.05.7-4.36,1-6.5q11.25-7.12,22.5-14.25-2.37-7.62-4.75-15.25c12.16,3.74,35.09,5.87,47.75,6-8.18,5.75,8.4,7.23,1.5,0,4.35.01,24.14-1.04,29.25-1.5,20.54-1.83,40.95-6.34,59.75-15,4.3,15.12,7.83,30.39,10,46Z"/>
            <path class="cls-36" d="M224.27,331.43q-.5-1.37-1-2.75c-.97,4.59-4.14,9.76-7.5,13l8.5.5c.07-3.25-.1-6.51,0-9.75l22,6.25c-33.57,2.88-10.1,6.47-8.5,11.75-7.64-5.89-9.22-3.36-9.75-3.5-9.49-2.59-15.84-4.18-25.75-5.5,30.5-10.39,15.92-37.16,18.25-37.5,3.18,8.93,3.93,18.14,3.75,27.5Z"/>
            <path class="cls-36" d="M140.77,254.43c.06.91-.04,1.84,0,2.75.18.49,1.14.92,1.5,1.25-4.75,6.42,6.79,10.22,2.75,9.5-.51-.09-1.95-1.38-2.5-2,2.35,8.5,7.18,9.34,14.75,5.5,4.99-2.53-2.85,6.03-6.25,6.5-7.5,1.03-10.54-8.74-11.25-14.75-.29-2.47-.34-9.47,1-8.75Z"/>
            <path class="cls-39" d="M224.27,331.43c0,.33.01.67,0,1-.1,3.24.07,6.5,0,9.75l-8.5-.5c3.36-3.24,6.53-8.41,7.5-13q.5,1.37,1,2.75Z"/>
            <g>
              <path class="cls-40" d="M109.28,231.94c-.37,1.87,2.52.58,3.25,1,2.72,1.58,1.35,29.13,2.75,32.25.12.27,4.96,2.79,5.25,2.75,1.76-.26,19-24.49,22.25-27.75,3.22-3.23,2.47-1.54,3-1.75-2.84,5.1-5.4,10.09-5,16-1.34-.72-1.29,6.28-1,8.75.71,6.01,3.75,15.78,11.25,14.75,3.4-.47,11.24-9.03,6.25-6.5-.67-5.24-3.73-1.6-4-2.75,6.48-3.55,8.77-9.74,8-16.75,6.3,4.01,11.87,18.11,21.25,17.5,6.66-.43,19.96-16.95,21.75-23.5,2.94-3.85,5.44-8.11,7.5-12.5,8.93,2.83,20.94-.3,32,12.75,11.73,13.84,12.51,33.75,17,50.5,4.06,15.14,15.03,50.02,16.5,62.75-1.33,5.92-.54-1.46-3-5.25-1.85-2.85-11.8-11.4-16-11.5,14.61,8.66,19.57,20.42,17.5,37.25-6.33,9.12-27.83,5.01-36.75,1.5-.82-.32-4.7-3.56-5-3.5-.65.12-3.02,6.23-4.25,4.5,2.31-2.2,3-5.18,4-8,1.63-4.62,3.2-8.95,3-14,1.32-.26,1.01-3.77,1.5-7,.02-.12,1.39-1.3,0-2.5h-.5c-.01-.17.04-.37,0-.5-1.6-5.28-25.07-8.87,8.5-11.75l-22-6.25c.01-.33,0-.67,0-1,.18-9.36-.57-18.57-3.75-27.5-2.33.34,12.25,27.11-18.25,37.5-4.32-.57-8.68-.93-13-1.5,0-.06-.23.41-.5-1-1.7-8.75-4.9-12.02-4.5-1-.12-.03-1.97.28-2.5,0-1.92-1-12.38-20.15-37.5-16.5-7.13-9.27-19.67-34.29-26.25-46-7.66.43-15.18,1.91-22.75,3q-.37-9.25-.75-18.5-1.37,9.5-2.75,19c-1.72.26-5.36-.1-6,1.5-2.07-3.1-4.78-4.25-5-4.5-1.73-1.97-7.7-8.7-8-10.75-.85-5.78,8.07-22.36,18.25-28.25,7.06-4.08,10.76-4.43,18.25-5Z"/>
              <g>
                <path class="cls-32" d="M188.77,338.93c-1.59.19-3.03-.65-4.5-1-.4-11.02,2.8-7.75,4.5,1Z"/>
                <g>
                  <path class="cls-36" d="M95.28,278.43c-1.17.17-2.32.32-3.5.5q1.37-9.5,2.75-19,.37,9.25.75,18.5Z"/>
                  <path class="cls-32" d="M240.02,357.93c2.5-.04,1.42,10.25-1.5,9-1.77-.76-.68-8.97,1.5-9Z"/>
                  <path class="cls-19" d="M151.02,284.93c2.63-.31,3.1,4.32,1,5-3.13,1.02-3.92-4.65-1-5Z"/>
                  <g>
                    <path class="cls-22" d="M277.27,359.43c.62,5.36,1.58,16.07-1.5,20.5,2.07-16.83-2.89-28.59-17.5-37.25,4.19.1,14.15,8.65,16,11.5,2.46,3.79,1.67,11.17,3,5.25Z"/>
                    <path class="cls-22" d="M234.02,340.93c7.16.98,13.01,1.04,19.75,3.75-5.65-.58-18.52-1.09-19.75-3.75Z"/>
                    <path class="cls-36" d="M238.27,353.43v-2.5c1.39,1.2.02,2.38,0,2.5Z"/>
                  </g>
                </g>
              </g>
            </g>
            <path class="cls-40" d="M186.27,384.43q-6.25-9.75-12.5-19.5c4.82-.1,9.46.81,14.25,1q9.37,8.87,18.75,17.75c-6.58,1.16-13.96-.69-20.5.75Z"/>
            <g>
              <path class="cls-28" d="M193.77,214.44c2.5,7.39,9.61,16.34,18,19-2.06,4.39-4.56,8.65-7.5,12.5-3.73,4.89-16.44,18.28-22.75,17.5-5.61-.69-23.98-26.03-26.75-32.5,10.69-3.61,21.74-10.07,29-18.75-.28-2.07-.61-4.2-1-6.25,5.71.57,7.95,6.6,11,8.5Z"/>
              <path class="cls-36" d="M154.77,230.94c2.77,6.47,21.14,31.81,26.75,32.5,6.31.78,19.02-12.61,22.75-17.5-1.79,6.55-15.09,23.07-21.75,23.5-9.38.61-14.95-13.49-21.25-17.5-.27-2.45-.78-3.36-1.5-5.5-.43-1.28-.98-2.29-1.5-3.5-1.09-2.53-2.39-3.79-2.5-4-1.19-2.2-2.49-4.5-3-7,.11-.03-.48-.16,2-1Z"/>
              <g>
                <path class="cls-25" d="M138.77,214.94c-1.42-.22-1.75,4.51-2.5,7-2.73,9.06-10.13,26.79-10.5,28.25-.16.62-.16,2.32.5,2.25-.63.58-3.84,4.5-4.25,4.5-6.99-6.34-7.33-15.67-6.75-24.5,6.55-3.95,11.23-9.94,15.5-16,2.87-4.07,4.54-9.14,8.5-12.5-.31,3.11-.95,8.1-.5,11Z"/>
                <path class="cls-28" d="M145.77,232.94c-6.7,6.24-12.73,13.26-19.5,19.5-.66.07-.66-1.63-.5-2.25.37-1.46,7.77-19.18,10.5-28.25q4.75,5.5,9.5,11Z"/>
                <path class="cls-11" d="M138.77,214.94c.63,4.03,3.64,6.92,6,10,.61.79,3.74,5.28,4,5.5-.68,1.11-2.07,1.63-3,2.5q-4.75-5.5-9.5-11c.75-2.49,1.08-7.22,2.5-7Z"/>
              </g>
            </g>
          </g>
          <path class="cls-2" d="M152.77,231.94c.51,2.5,1.81,4.8,3,7,.38,1.95-3.11.52-5.5,1-4.79.96-5.67,5.61-2.5-2.5.8-2.04,1.82-3.93,2.5-6,2.14,1.23,1.76.67,2.5.5Z"/>
          <g>
            <path class="cls-23" d="M161.27,251.93c.77,7.01-1.52,13.2-8,16.75.27,1.15,3.33-2.49,4,2.75-7.57,3.84-12.4,3-14.75-5.5.55.62,1.99,1.91,2.5,2,4.04.72-7.5-3.08-2.75-9.5,1.1.99,9.96,4.57,10.75,4,.98-.71-.66-3.37-.25-4.75.3-1.02,3.05-1.61,4-3,1.53-2.24.81-6.54,3-8.25.72,2.14,1.23,3.05,1.5,5.5Z"/>
            <path class="cls-23" d="M147.77,237.44c-3.17,8.11-2.29,3.46,2.5,2.5-5.47,4.24-3.9,6.84-3.25,13,5.58-11.84,6.28,4.99,7.25-7.25l4-2.75c.52,1.21,1.07,2.22,1.5,3.5-2.19,1.71-1.47,6.01-3,8.25-.95,1.39-3.7,1.98-4,3-.41,1.37,1.23,4.04.25,4.75-.79.57-9.65-3.01-10.75-4-.36-.33-1.32-.76-1.5-1.25-.04-.91.06-1.84,0-2.75-.4-5.91,2.16-10.9,5-16,.1-.04.17-1.3,2-1Z"/>
            <path class="cls-28" d="M158.27,242.94l-4,2.75c-.97,12.24-1.67-4.59-7.25,7.25-.65-6.16-2.22-8.75,3.25-13,2.39-.48,5.88.95,5.5-1,.11.21,1.41,1.47,2.5,4Z"/>
          </g>
          <g>
            <path class="cls-7" d="M180.77,200.44c-9.09,11.59-21.81,20.53-36,24.5-2.36-3.08-5.37-5.97-6-10-.45-2.9.19-7.89.5-11,.07-.73.15-.89.5-1.5,12.44,2.19,27.65-5.12,38.5-11,1.21,2.88,1.66,6.03,2.5,9Z"/>
            <path class="cls-32" d="M182.77,205.94c.39,2.05.72,4.18,1,6.25-7.26,8.67-18.31,15.14-29,18.75-2.48.84-1.89.97-2,1-.74.17-.36.73-2.5-.5-.28-.16-1.31-.83-1.5-1-.26-.22-3.39-4.71-4-5.5,14.19-3.97,26.91-12.91,36-24.5.67,2.38,1.94,5.17,2,5.5Z"/>
          </g>
        </g>
      </g>
      <path class="cls-16" d="M193.8,115.76l5,23s2.54,3.61,4,3c4.09-1.7,7-9,7-17,0-6-4-14-4-14l-12,5Z"/>
      <g>
        <g id="Background-2" data-name="Background" class="cls-45">
          <path class="cls-12" d="M133.85,476.45c-76.66-.03-153.33.02-229.99,0V-35.54h511.99v511.99c-62.83.03-125.66-.04-188.49,0l2-12c4.67-1.72,10.18-4.03,14.5-6.5,3.45-1.97,7.1-3.76,8.5-7.75-.58-6.9-2.36-13.56-4-20.25,78.66-56.22,100.3-140.93,35-218.49.44-.15,3.73.06,8.75-3,11.31-6.89,14.02-20.62,8.75-32.25,19.68-4.09,26.74-27.04,11.5-40.5,1.3-4.6-.06-9.71-3.5-13,18.09-14.94,14.27-39.84-6.5-49.5,3.45-16.49-13-29.19-28.5-28,3.97-21.09-13.43-38.56-33.75-28.25C223.12-1.07,194.31-9.58,171.6,2.46c-20.79-21.07-68.84-13.98-83,12-16.54-13.31-43.42,1.66-37.75,22.75q-5.87,5.12-11.75,10.25c-15.38,1.62-25.36,19.24-18.25,33.25-16.51,8.39-18.6,31.46-2,41-18.55,4.77-26.83,31.52-8,41.5-3.31,17.4,13.59,21.59,14,23-2.88,8.02-1.6,15.43,4,21.75-35.08,28.1-51.49,75.22-45,119.25,7.26,49.22,46.06,86.19,86.5,111.25-.66,4.4-1.83,8.73-1.5,13.25,2.47,2.94,4.86,4.65,8,6.75,14.74,9.85,38.13,13.18,55.5,15q.75,1.5,1.5,3Z"/>
        </g>
        <g>
          <g>
            <path class="cls-44" d="M228.85,116.46c-3.15-1.77-1.69,4.85-11,5.5-.09-7.58-1.39-10.46-7-15.75l.75-.75c2.25.72,15.41,6.36,16,7,.94,1.03.84,2.4,1.25,4Z"/>
            <path class="cls-44" d="M228.85,116.46c.47,1.85.18,4.88,1,5.5-1.15.27-8.92,7.99-12.5,7.5.46-2.25.53-5.19.5-7.5,9.31-.65,7.85-7.27,11-5.5Z"/>
          </g>
          <g>
            <path class="cls-44" d="M76.35,48.96c-1.63,2.04-3.57,3.78-5,6,.19-1.43.69-2.78.5-4.25-1.51-.55-10.12-7.22-10.5-7.75-.27-.39-2.03-8.46-2-9.25.15-4.05,2.97-8.24,6-10.75-6.17,13.7,9.55,19.62,10.5,22.25.54,1.49-1.15,3.47.5,3.75Z"/>
            <path class="cls-44" d="M290.85,63.46c4.3,7.14,2.89,10.53,0,18.25,4.74,1.13,5.42.43,10,2.75l-.25,1c-1-2.02-.65,1.72-6-1.5-1.24,5.64-7.36-2.51-4.75,5.25-6.69,3.07-2.27-16.99,2-18,.3-.86-5.64-11.37-1-7.75Z"/>
            <path class="cls-14" d="M41.35,159.96c-.28.1-1.57,1.84-5.25,3-.58-.14-4.63-10.41-4.75-11-1.71-8.39,2.69-11.1,3.5-12.5l14-9.25q-.5-4.62-1-9.25c.11-2.85-8.42-7.18-14-11-2.2-4.63-1.1-10.32,2-14.5,8.85-3.96,19.92-1.71,20-8.25,0-.53-2.22-6.02-2.5-10.25-.76-11.25,14.72-13.37,16-14.75.53-.57,1.82-5.9,2-7.25,1.43-2.22,3.37-3.96,5-6,2.29-2.88,3.73-.42,2-9.25,16.16-17.95,15.22-11.2,37.75-8.25,3.36-.78,3.34-15.27,10.5-16.5,10.02-1.72,12.59,10.8,8.5,14-3.85,3.01-3.35-2.71-7-8-3.96,23.69-18.53,15.83-36.5,13.5-8.86,6.09-4.68,10.64-5.75,13.75-.29.84-8,7.42-8.5,8.5-3.14,6.73,5.44,5.47-17.5,17.5-2.47,6.25,9.47,17.04-7.25,24.25-4.78,2.06-17.43,2.26-14,6.5,2.78,3.44,16,6.31,16.75,18.25,1.5,23.8-28.24,10.73-14,36.75Z"/>
            <path class="cls-14" d="M293.35,156.46c-.15-.14-.32-.33-.5-.5-.33-19.2-12.79-13.07-20.25-18-4.82-3.19-8.2-20.29,14.75-19.25,5.83,8.32-14.62,6.65-12.5,11,.5,1.03,15.81,6.36,18,9,3.14,3.8,3.12,14.57.5,17.75Z"/>
            <path class="cls-47" d="M34.85,139.46c-.81,1.4-5.21,4.11-3.5,12.5-6.04-2.19-15.67-2.79-14.5-11.25,1.89-13.63,16.47-1.23,18-1.25Z"/>
            <path class="cls-47" d="M47.85,120.96q.5,4.62,1,9.25l-14,9.25c.56-.97,2.28-2.16,2.5-2.75,2.09-5.65-4.57-9.8-4-15.5l14.5-.25Z"/>
            <g>
              <path class="cls-44" d="M80.35,116.46q-.62,5-1.25,10c-3.24-2.09-6.93-1.68-8.75-5.5l10-4.5Z"/>
              <path class="cls-37" d="M91.85,112.46c-1.43,3.7-2.82,5.67-3,10-3.54,2.02-1.21-8.87,3.5-12.25l-.5,2.25Z"/>
            </g>
            <g>
              <path class="cls-47" d="M303.85,140.71c1.56-17.51-7.84-17.59-8.5-18.5-3.13-4.35,5.77-3.93,10.5-9.5,7.13-8.4,5.01-23.18-5-28.25l-.25,1c-1-2.02-.65,1.72-6-1.5-1.24,5.64-7.36-2.51-4.75,5.25-6.69,3.07-2.27-16.99,2-18,.3-.86-5.64-11.37-1-7.75-4.02-6.67-11.27-9.78-18.75-6.5-2.88-.57.99-6.14-10.25-12.25,8.77-16.21-11.85-29.39-22.25-14.25-18.44-20.74-44.24-29.93-70-16-17.52-19.85-50.64-17.47-68.75.25-1.76,1.72.06,4.18-13.25,9.75-2.07.09-10.4-11.31-22.25-1.5-6.17,13.7,9.55,19.62,10.5,22.25.54,1.49-1.15,3.47.5,3.75,2.29-2.88,3.73-.42,2-9.25,16.16-17.95,15.22-11.2,37.75-8.25,3.36-.78,3.34-15.27,10.5-16.5,10.02-1.72,12.59,10.8,8.5,14-3.85,3.01-3.35-2.71-7-8-3.96,23.69-18.53,15.83-36.5,13.5-8.86,6.09-4.68,10.64-5.75,13.75-.29.84-8,7.42-8.5,8.5-3.14,6.73,5.44,5.47-17.5,17.5-2.47,6.25,9.47,17.04-7.25,24.25-4.78,2.06-17.43,2.26-14,6.5,2.78,3.44,16,6.31,16.75,18.25,1.5,23.8-28.24,10.73-14,36.75-.28.1-1.57,1.84-5.25,3-.58-.14-4.63-10.41-4.75-11-6.04-2.19-15.67-2.79-14.5-11.25,1.89-13.63,16.47-1.23,18-1.25.56-.97,2.28-2.16,2.5-2.75,2.09-5.65-4.57-9.8-4-15.5l14.5-.25c.11-2.85-8.42-7.18-14-11-2.2-4.63-1.1-10.32,2-14.5,8.85-3.96,19.92-1.71,20-8.25,0-.53-2.22-6.02-2.5-10.25-.79.05-1.56.08-2.3.1.74-.02,1.5-.05,2.3-.1-.76-11.25,14.72-13.37,16-14.75.53-.57,1.82-5.9,2-7.25.19-1.43.69-2.78.5-4.25-1.51-.55-10.12-7.22-10.5-7.75-1.24.21-2.42.91-3.5,1.5-.6.93-1.11,1.85-1.54,2.74.43-.89.94-1.8,1.54-2.74-8.04,4.38-5.41,3.64-9.25,11.5-19.21-1.57-26.38,17.1-12.75,30.25-2.69.87-5.35,1.16-8,2.25-2.08.86-3.34,1.44-5,3-9.5,8.94-5.06,21.52,6,26.25.67,1.87-4.07,4.57,0,14-18.91-2.17-25.65,19.21-8,27.5-3.77,9.25,2.97,21.41,13.25,17.75,8.31,8.13-2.07,8.21-.25,19.75,1.42,9.01,14.15,14.74,21.75,9.25,10.74,4.47,5.55,5.18,9.25,10.25,4.73,6.48,16.42,5.88,21.75.25,1.45.33.7,14.11,20,11.5,4.65-8.22,6.22-2.49,13.5-6,5.43-2.62,5.36-9.86,10.75-5,2.87-4.07,4.54-9.14,8.5-12.5.07-.73.15-.89.5-1.5-7.7-1.35-26.87-15.73-33.05-21.2-10.43-9.22-16.58-17.43-16.45-31.55.16-.65-.36-8.41-1.5-10.75-.41-.85-.31-9.43,0-17-3.54,2.02-1.21-8.87,3.5-12.25q-.25,1.12-.5,2.25c.16-.41,1.41-3.33,1.5-3.5,1.38-2.59,2.52-7,6.5-5.75q-1-1.37-2-2.75c1.05-9.45,7.93-32.25,17.5-36.5,5.63-2.5,11.02,1.17,17.75-8.5,22.91,12.92,31.77-2.35,33.5-3,6.9-2.59,8.84,5.28,9.25,5.75,7.93,8.99,16.12,5.63,23,18,2.7,4.86,3.57,11.29,6.5,16,1.24,1.99-.84,16.62.45,19.55,4.55,10.33,4,21,1.05,25.7,6.68-10.66,1.74,3.66,8-2,.56-1.27,2.36-5.32,2.5-6,.46-2.25.53-5.19.5-7.5-.09-7.58-1.39-10.46-7-15.75l.75-.75c2.25.72,15.41,6.36,16,7,.94,1.03.84,2.4,1.25,4,.47,1.85.18,4.88,1,5.5,11.74-2.81,17.12,18.97,3.25,30.5-10.76,8.95-16.49-2.44-23.25,7.75-.35.52-.95,4.71-5.5,11.25-6.2,8.9-16.64,15.42-26,20.5,1.21,2.88,1.66,6.03,2.5,9,.67,2.38,1.94,5.17,2,5.5,5.71.57,7.95,6.6,11,8.5.57.35,3.59.9,4.75,1,7.02,13.81,25.6,10.64,30-4,9.65,10.18,24.39,12.18,28.5-4,7.34.07,12.54.78,17.5-5.5,18.36,1.98,25.31-16.44,12.25-28.75q3.12-4.12,6.25-8.25c6.18,1.54,11.99.11,15.25-5.5,4.13-7.12,2.13-14.55-4.5-19.25ZM55.23,49.78c-.3.83-.54,1.63-.74,2.39.2-.76.44-1.56.74-2.39ZM38.6,58.96c.56-.22,1.13-.37,1.71-.46.58-.09,1.16-.12,1.74-.11-.59-.01-1.17.02-1.74.11-.58.09-1.14.24-1.71.46-.4.16-.79.38-1.17.64.38-.26.77-.48,1.17-.64ZM33.88,65.4c.11-.54.26-1.07.45-1.57-.19.51-.34,1.03-.45,1.57-.16.81-.21,1.64-.15,2.48-.07-.84-.01-1.67.15-2.48ZM293.35,156.46c-.15-.14-.32-.33-.5-.5-.33-19.2-12.79-13.07-20.25-18-4.82-3.19-8.2-20.29,14.75-19.25,5.83,8.32-14.62,6.65-12.5,11,.5,1.03,15.81,6.36,18,9,3.14,3.8,3.12,14.57.5,17.75Z"/>
              <g>
                <path class="cls-14" d="M182.6,16.46c12.59-1.18,21.73,20.41,45.5,12.5,11.55,15.33,21.28,10.62,16.25,29.25,2.59,1.28,12.46,9.97,13.25,10.25,5.52,1.97,21.76-2.94,16.75,17.25,4.73,1.63,21.44,8.22,23.5,12,2.37,4.36.74,13.01-4.25,14.75-11.6,4.05-.85-9.6-1.25-11.25-12.49-11.45-29.9-.84-23-24.5l-13.25-1.25c-8.41-11.05-13.23-8.1-16.25-11.75-8.01-9.69,12.51-22.62-19.75-18.25l-2.5-8.5c-12.27.4-22.98-6.63-32.5-13.5-4.24-.3-17.15,8.1-14.25-.75.62-1.89,9.58-6.05,11.75-6.25Z"/>
                <path class="cls-46" d="M229.6,34.96c3.09-.23-2.57,2.16-3.5,2.5-12.02,4.38-3.48-1.99,3.5-2.5Z"/>
              </g>
            </g>
          </g>
          <g>
            <g>
              <g>
                <path class="cls-7" d="M180.85,200.96c-9.09,11.59-21.81,20.53-36,24.5-2.36-3.08-5.37-5.97-6-10-.45-2.9.19-7.89.5-11,.07-.73.15-.89.5-1.5,12.44,2.19,27.65-5.12,38.5-11,1.21,2.88,1.66,6.03,2.5,9Z"/>
                <path class="cls-32" d="M182.85,206.46c.39,2.05.72,4.18,1,6.25-7.26,8.67-18.31,15.14-29,18.75-2.48.84-1.89.97-2,1-.74.17-.36.73-2.5-.5-.28-.16-1.31-.83-1.5-1-.26-.22-3.39-4.71-4-5.5,14.19-3.97,26.91-12.91,36-24.5.67,2.38,1.94,5.17,2,5.5Z"/>
              </g>
              <path class="cls-32" d="M206.85,162.46c-6.38,16.78-48.99,37.36-61.25,37-15.57-.46-46.55-25.9-50.25-42.25,5.46,1.13,11.16,1.2,16.5-.25.62.86,3.05,3.04,6.5,8.5,6.96,11.01,11.15,22.41,27,20.5,12.69-1.53,15.68-10.12,19.5-14.5,3.24-3.72,6.8-7.26,10-11,3.56.88,7.61,1.46,11.25,1,2.15-.27,11.8-4.06,10.75-6,2.32-1.12,8.28-5.63,10-7.5,1.97,4.54,1.79,9.8,0,14.5Z"/>
              <path class="cls-2" d="M196.85,155.46c1.05,1.94-8.6,5.73-10.75,6-3.64.46-7.69-.12-11.25-1,.45-.52.6-1.41,1-2,6.79,1.39,14.77,0,21-3Z"/>
              <g>
                <path class="cls-32" d="M204.35,171.46c-1.7-1.63,4.69-6.08,2.5-9,1.79-4.7,1.97-9.96,0-14.5,1.7-1.85,5.87-9.75,6.95-12.2.56-1.27,3.41-5.62,3.55-6.3,3.57.49,11.35-7.23,12.5-7.5,11.74-2.81,17.12,18.97,3.25,30.5-10.76,8.95-16.49-2.44-23.25,7.75-.35.52-.95,4.71-5.5,11.25Z"/>
                <path class="cls-10" d="M231.85,140.96c1.89,7.03-4.85,7.85-7.25,6.5-2.45-1.38-3.65-10.33-2.25-13.5,4.22,1.75,8.63,10.67,9.5,7Z"/>
                <path class="cls-35" d="M231.85,140.96c-.87,3.67-5.28-5.25-9.5-7,2-4.53,16.88-7.53,14.25,4.5-1.36-9.79-9.49-5.73-9.75-4.75-.2.77,4.14,4.06,5,7.25Z"/>
              </g>
              <path class="cls-16" d="M173.85,158.96c-1.75.41-3.29,2.02-5.5,2.5-19.03,4.12-34.89,5.34-52.5-4.5-.97-.54-2.02-.97-3-1.5,14.47-3.04,25.1-19.17,24.75-33.5,21.23-1.93,7.52,3.43,18.25,22.75,4.41,7.95,10.07,10.74,18,14.25Z"/>
              <g>
                <path class="cls-48" d="M112.85,155.46c.98.53,2.03.96,3,1.5,2.32,3.62,7.36,6.67,11,10,.18.17.97,2.64,2.5,4.25.69.69,1.68,1.18,2.5,1.75-3.91,1.89-9.8-5.6-13.5-7.5-3.45-5.46-5.88-7.64-6.5-8.5-.05-.06.07-.75-.5-1.5.48-.07,1.04.1,1.5,0Z"/>
                <path class="cls-48" d="M175.85,158.46c-.4.59-.55,1.48-1,2-3.2,3.73-6.76,7.28-10,11-1.5.22-6.06,1.16-7,1.5,2.26-2.56,4.66-5.01,7-7.5,1.17-1.25,2.7-2.51,3.5-4,2.21-.48,3.75-2.09,5.5-2.5l2-.5Z"/>
                <path class="cls-38" d="M164.85,171.46c-3.82,4.38-6.81,12.97-19.5,14.5-9.5-.47-18.33-11.18-13-12.5,11.85,7.12,20.2,1.39,25.5-.5.94-.34,5.5-1.28,7-1.5Z"/>
                <path class="cls-18" d="M131.85,172.96c.57.39.47.48.5.5-5.33,1.32,3.5,12.03,13,12.5-15.85,1.91-20.04-9.49-27-20.5,3.7,1.9,9.59,9.39,13.5,7.5Z"/>
                <path class="cls-18" d="M168.35,161.46c-.8,1.49-2.33,2.75-3.5,4-12.26,4.39-25.52,5.59-38,1.5-3.64-3.33-8.68-6.38-11-10,17.6,9.84,33.47,8.62,52.5,4.5Z"/>
                <path class="cls-26" d="M164.85,165.46c-2.34,2.49-4.74,4.94-7,7.5-5.29,1.89-13.65,7.62-25.5.5-.03-.02.07-.11-.5-.5-.82-.57-1.81-1.06-2.5-1.75-1.53-1.61-2.32-4.08-2.5-4.25,12.48,4.09,25.74,2.89,38-1.5Z"/>
              </g>
            </g>
            <g>
              <g>
                <path class="cls-26" d="M189.85,133.96c1.78-1.9,1.04-1.5,1.5-3.5.1-.44-.05-1.02,0-1.5.02-.15,1.31-.41,0-3,3.03.64,6.98,4.52,7,6.5.08,7.3-19.65,8.35-28.25,1-4.29-3.67-.81-2.34.75-3.5,3.27-2.45,5.48-8.74,15.25-7,5.27.94-3.64-.08-5.75,3.75-4.02,7.3,4.26,12.85,9.5,7.25Z"/>
                <path class="cls-21" d="M191.35,125.96c1.31,2.59.02,2.85,0,3l-1.5,1.5c-6.57,1.4-4.99-5.86,1.5-4.5Z"/>
                <path class="cls-30" d="M191.35,130.46c-.46,2,.28,1.6-1.5,3.5-3.01-1.72-.06-1.54.5-3.5h1Z"/>
                <path class="cls-24" d="M191.35,130.46h-1c-.16.03-.34-.03-.5,0l1.5-1.5c-.05.48.1,1.06,0,1.5Z"/>
              </g>
              <g>
                <path class="cls-47" d="M102.8,101.76c-6.84,8.65-8.22,31.13-8,30,.5.75-4.59,20.71-5,20-4-7-10-22-2-38,1.94-3.88,9.39-11.67,15-12Z"/>
                <path class="cls-16" d="M206.85,137.46c4.81-10.97-8.25-5-8.5-5,.08,7.3-19.65,8.35-28.25,1-4.29-3.67-.81-2.34.75-3.5-.63-4.55,3.23-8.13,6.95-10.2,1.81-1.01,6-1,9-1s7,3,9.55,5.7c.8,1.04,13.98-18.89,14.25-19,.23-.1,1.83-3.98,1.75-4.75-.19-1.78-5.76-6.51-7-8.5-2.93-4.71-3.8-11.14-6.5-16-6.88-12.37-15.07-9.01-23-18-.41-.47-2.35-8.34-9.25-5.75-1.73.65-10.58,15.92-33.5,3-6.73,9.67-12.12,6-17.75,8.5-8.55,10.8-21.62,44.46-21.44,44.21-1.02,4-3.06,9-3.11,13.59-.51,3.74-.56,13.02-1,14-4,9-1,19,0,21,.15.29,14.7-.32,21.55-1.3.48-.07,1.04.1,1.5,0,14.47-3.04,25.1-19.17,24.75-33.5,21.23-1.93,7.52,3.43,18.25,22.75,4.41,7.95,10.07,10.74,18,14.25l2-.5c6.79,1.39,14.77,0,21-3,2.32-1.12,8.28-5.63,10-7.5,1.7-1.85,6.92-10.05,8-12.5-6.26,5.66-1.16-8.56-8,2ZM129.35,126.46c-1.92-.4-.55,3.12-1,3.75-.89,1.25-3.31-1.57-4,1.25.04.57.1,1.65,0,2,4.98,1.11-3.99,12.02-5.75,12-1.44-.01-2.67-5.02-7-4.5-2.04.24-10.5-1.63-15.36-9.04.46-2.76.98-7.64,1.11-7.96.13-.31-.18-1.56.5-2.75,4.28-7.49,20.77-9.08,28.5-8.75,2.09,4,3.16,9.45,3,14ZM177.48,92.44c-1.21-.01-2.39.05-3.52.16,1.13-.11,2.31-.17,3.52-.16ZM167.6,94.15c-.52.25-.97.52-1.33.81.36-.29.81-.56,1.33-.81Z"/>
                <path class="cls-26" d="M114.35,123.46c-16.66,4,1.12,19.78,5,7.5.62-1.97.58-3.5.5-5.5.54,0,3.37,2.88,4,4.5.1.25.49,1.42.5,1.5.02.26.04.62.05.96.01.43,0,.84-.05,1.04-1.72,5.93-18.55,5.3-25.5,3-2.43-.8-2.76-3.46-2.5-5.5.86-6.82,16.1-10.5,18-7.5Z"/>
                <path class="cls-32" d="M126.35,112.46c-7.73-.33-24.21,1.26-28.5,8.75-.68,1.19-.37,2.44-.5,2.75,6.84-9.85,27.74-7.32,26.5,6,.09.24.86,1.69.04,4.46-3.26,4.82-19.2,3.6-25.04,2.04-.38-.1-2.67-1.13-1.5.5,3.45,4.8,11.69,7.11,14.45,7.8,4,1,5.44,1.15,6.8.7,8.2-2.7,10.2-14.7,10.75-19,.46-3.55-.91-10-3-14Z"/>
                <path class="cls-17" d="M119.35,130.96c-2.21,2.69-4.89,1.38-3.5-2,2.04-.45,2.86-3.5,4-3.5.08,2,.12,3.53-.5,5.5Z"/>
              </g>
            </g>
          </g>
        </g>
      </g>
      <path class="cls-44" d="M93.8,137.76"/>
      <path class="cls-1" d="M90.8,146.76c4.97,5.18,13.69,9.68,20.55,8.7.57.75.45,1.44.5,1.5-5.34,1.45-11.04,1.38-16.5.25,3.7,16.35,34.67,41.78,50.25,42.25,12.26.37,54.87-20.22,61.25-37,2.19,2.92-4.2,7.37-2.5,9-6.2,8.9-16.64,15.42-26,20.5-10.85,5.88-26.06,13.19-38.5,11-7.7-1.35-28.07-14.02-34.25-19.5-9.8-8.7-17.93-23.58-17.8-37.7,0,0,2.89,1.04,3,1Z"/>
      <path class="cls-1" d="M102.85,97.46c-1.72.9-7.55,10.06-9.05,11.3,1.05-9.45,11-42,21.55-44.8,13.32-3.53-4.46,4.46-10.5,24.25-.88,2.89-.94,6.33-2,9.25Z"/>
      <g>
        <path class="cls-32" d="M141.85,155.96c-4.14-.18-7.77-2.85-10.5-5.5-1.92-10.29,3.36-.91,5.75.5,6.19,3.67,18.03-.26,4.75,5Z"/>
        <path class="cls-35" d="M131.35,150.46c2.73,2.65,6.36,5.32,10.5,5.5,3.74.16,14.46-5.68,8.75-1-10.76,8.83-26.91-6.88-21-7,.47,0,.4,1.19,1.75,2.5Z"/>
      </g>
      <path class="cls-32" d="M175.85,105.46c2.95-.27.79.68-3.05,2.3-6.05,2.55-10,7-6.95,20.45.12.52-.37.37-.75.75q-4.62-1.5-9.25-3c-.37-15.93,5.95-19.2,20-20.5Z"/>
      <path class="cls-1" d="M229.8,150.76l1,2c1,2-3,3-3,3-1.16.37-2,1-3,0l1-5c1-2,3.66-.46,4,0Z"/>
      <path class="cls-32" d="M212.8,100.76c-.19-3.9-4.12-3.84-7-8-2.42-3.5-3.86-11.54-4-12-3-10-12-14-12-14,0,0,14,17,9,40-.57-.15-4.14-2.17-4.95-2.3-5.49.66-1.06,1.68,1.5,6.25,3.39,6.05,5.2,13.36,3.5,20.25-.07.3,0,1.83-.05,1.8.03.02-.99,2.19-2,3-5,4-14.93,2.85-18,2-1.96-.54-5-2-5-2,0,0,3,9,20,9,6.84,0,14.37-12.87,15-16,.9-4.5,0-10-3-16-.12-.25,7.09-10.07,7-12Z"/>
      <g>
        <path d="M92.75,110.19c0,.28.52-.08,1.04-.43,6-4,9-6,11-7,4-2,6.64-2.09,7-2.14,3.73-1.21,17.62,3.61,12.75-3.75-4.46-6.74-17.09-1.59-22.5,1.25-1.72.9-9.25,7.64-9.3,12.07Z"/>
        <path d="M193.05,105.11c.57.59.75-2.36.25-4-4.07-10.9-27.41-8.99-28.75-4.25-1.99,7.07,10.41,1.2,21.5,4,2.75.89,3.75.89,7,4.25Z"/>
      </g>
      <g>
        <path class="cls-17" d="M230.8,158.76c0-2,0-5-1-6s-1.79-2.03-3-1c-.85.72-1.85,4.6-2,7-.05.8.36,3.41,1.05,3.95,1.97,1.52,3.28,1.28,3.96.21,1.99-3.16.99-2.77.99-4.16Z"/>
        <path class="cls-30" d="M231.35,157.96c-.22-2.79-.45-4.83-1.55-5.2-3-1-1,3-4,5-1.18.78-.56,3.32,0,4,3.39,4.13,5.76-1.04,5.55-3.8Z"/>
      </g>
      <path class="cls-1" d="M199.28,121.71c.05.3-.38.64-.53.38-3.95-7.33-17.16-9.14-22.26-6.7-3.07,1.47,7.49-8.19,17.31-3.63,4.89,2.27,5.17,7.94,5.48,9.95Z"/>
      <path class="cls-13" d="M205.58,125.51c-4.38,1.26-7.2.83-8.78-.75-.41-.41-.76-.75-1.09-1.06-6.91-9.94-25.91-4.94-24.86,6.26,3.27-2.45,5.48-8.74,15.25-7,5.27.94-3.64-.08-5.75,3.75-4.02,7.3,4.26,12.85,9.5,7.25-3.01-1.72-.06-1.54.5-3.5-.16.03-.34-.03-.5,0-6.57,1.4-4.99-5.86,1.5-4.5,3.03.64,6.98,4.52,7,6.5.45,1.3-.65,2.39-.55,2.3,1-1,2-3,1.04-3.71,2.34-.06,6.74-5.53,6.74-5.53Z"/>
      <path class="cls-1" d="M96.8,122.76s4.34-5.57,8-7c5.61-2.2,19-4,22-3s-11.67-4.57-21.18-1.02c-1.3.49-3.52,1.72-4.82,3.02-4,4-4,8-4,8Z"/>
      <path class="cls-13" d="M98,123.11v-.02c-3.18,2.76-7.38.42-7.38.42,0,0,1.44,3.61,4.67,4.29.14.03.3.09.47.15.03,1.81.08,2.26.58,3.01.86-6.82,16.1-10.5,18-7.5.12.11.21.21.27.29.2.25.17.39-.01.48.18-.09.21-.23.01-.48-.07-.08-.15-.18-.27-.29-16.66,4,1.12,19.78,5,7.5-2.21,2.69-4.89,1.38-3.5-2-.88-.28-1.53-.49-2.08-.67.55.18,1.2.39,2.08.67,2.04-.45,2.86-3.5,4-3.5.54,0,3.37,2.88,4,4.5,1.2-12.92-18.43-15.69-25.85-6.85Z"/>
      <g>
        <path class="cls-29" d="M130.8,124.76c0,15.74-15.3,27-28,27s-19-10.26-19-26,9.3-22,22-22,25,5.26,25,21Z"/>
        <path class="cls-29" d="M209.8,125.95c0,22.81-17.9,29.81-32.77,29.81s-22.23-11.33-22.23-28.71c0-20.29,10.88-24.29,25.74-24.29,19.26,0,29.26,5.81,29.26,23.19Z"/>
        <g>
          <path d="M214.8,134.76c5.75-9.59-3.81-18.84-5-22-3-8-6.78-10.04-10-11-2-.6-6-1-13-1-6,0-29-3-34.5,13.71-7.21-3.06-12.58-2.59-20-1-1.5-2.71-5.52-11.66-20.5-12.71-1.93-.13-9.16-.71-16,1-8,2-7.86,2.86-10,5-2.22,2.22-4.6,9.78-5,18-.35,7.04,2,17,3,19,.63,1.26,3,6,5.75,7.46,13.25,7.54,15.01,4.96,21.25,4.54,15-1,26.35-18.47,26-32.79,21.23-1.93,7.52,3.43,18.25,22.75,2.56,4.62,9.75,11.04,16.75,13.04,4.9,1.4,14.82,1.78,23-2,13-6,17-17,20-22ZM128.55,127.47c-.26,7.54-3.33,13.47-8.14,17.34-6.18,4.97-15.23,6.52-24.86,3.66-5.75-1.71-7.78-6.29-8.75-8.71-4-10,0-24,1-27,1.92-5.77,10.39-7.67,16-8,8.61-.51,17.34.25,21.75,8.71,2.09,4,3.16,9.45,3,14ZM161.55,145.72c-3.52-4.73-5.36-13.94-5.5-19.75-.37-15.93,5.18-19.09,20-20.5,5.57-.53,11.46-.87,17,0,.81.13,2.43.35,3,.5,2.12.56,4.25,1.34,5.79,2.84.47.46,4.36,5.98,5.96,16.95.49,3.39,0,8-1.72,12.65-.01.02-.02.03-.04.05-8.92,20.35-36.11,18.5-44.5,7.25Z"/>
          <path class="cls-41" d="M229.35,111.49c-.59-.64-13.73-6.35-16-7-2.56-.74-8.18-.11-8.56.26,4.7,4.42,2.9,14.9,7,19,.64.64,3.66-1.18,5.75-2.25l.25.25h2v-.78c9.09-.73,11.88-2.98,15-1.22-.41-1.6-4.5-7.23-5.44-8.26Z"/>
          <g>
            <path class="cls-4" d="M82.11,115.49l-10,4.5c-.53-1.11-2.64-9.66-1.25-10.5,22.79-3.44,17.71-10.26,11.25,6Z"/>
            <path d="M82.11,115.49q-.62,5-1.25,10c-3.24-2.09-6.93-1.68-8.75-5.5l10-4.5Z"/>
          </g>
          <path d="M230.8,121.76c-.82-.62,4.47-1.15,4-3-2.95-1.66-6.05.78-13.57,2.04-9.53.83-12.43-2.04-12.43-2.04l1,3c-.01.55.5,2.45,1,4.38l-2.08.7,2.08,6.92c5.43-5.43,8.4-3.49,15-9,2.38-1.82,4.45-2.87,5-3Z"/>
        </g>
      </g>
      <path class="cls-3" d="M159.54,463.54l-1.54,3.08"/>
      <path class="cls-20" d="M130.29,434.3"/>
      <path class="cls-20" d="M130.29,464.79c-.13,0-.26,0-.38,0"/>
      <path class="cls-20" d="M131.06,432.38"/>
    </g>
  </g>
</svg>`,
            'art': `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 374 550">
  <defs>
    <style>
      .cls-1 {
        fill: #c1ada7;
      }

      .cls-2 {
        fill: #742e74;
      }

      .cls-3 {
        fill: #372526;
      }

      .cls-4 {
        fill: #c45f41;
      }

      .cls-5 {
        fill: #ae3c2d;
      }

      .cls-6 {
        fill: #c05e58;
      }

      .cls-7 {
        fill: #2d0903;
      }

      .cls-8 {
        fill: #fbac6c;
      }

      .cls-9 {
        fill: #038353;
      }

      .cls-10 {
        fill: #232323;
      }

      .cls-11 {
        fill: #0a9c74;
      }

      .cls-12 {
        fill: #b84d34;
      }

      .cls-13 {
        fill: #491c48;
      }

      .cls-14 {
        fill: #fed6b1;
      }

      .cls-15 {
        fill: #8e3226;
      }

      .cls-16 {
        fill: #f7b750;
      }

      .cls-17 {
        fill: #a34737;
      }

      .cls-18 {
        fill: #cf99ce;
      }

      .cls-19 {
        fill: #db7141;
      }

      .cls-20 {
        fill: #4edf49;
      }

      .cls-21 {
        fill: #ead6cd;
      }

      .cls-22 {
        fill: #f38849;
      }

      .cls-23 {
        fill: #a1a2a3;
      }

      .cls-24 {
        fill: #5e131c;
      }

      .cls-25 {
        fill: #23110a;
      }

      .cls-26 {
        fill: #edd8de;
      }

      .cls-27 {
        fill: #b14f3d;
      }

      .cls-28 {
        fill: #281a26;
      }

      .cls-29 {
        fill: #18bb48;
      }

      .cls-30 {
        fill: #8e0d40;
      }

      .cls-31 {
        fill: #ffbf92;
      }

      .cls-32 {
        fill: #f0935d;
      }

      .cls-33 {
        fill: #ab1a60;
      }

      .cls-34 {
        fill: #a7629d;
      }

      .cls-35 {
        fill: #bdeded;
      }

      .cls-36 {
        fill: #c12e4b;
      }

      .cls-37 {
        fill: #fce593;
      }

      .cls-38 {
        fill: #ddcfe4;
      }

      .cls-39 {
        fill: #080707;
      }

      .cls-40 {
        fill: #747ad6;
      }

      .cls-41 {
        fill: #3b1932;
      }

      .cls-42 {
        fill: #1c0f10;
      }

      .cls-43 {
        fill: #a04394;
      }

      .cls-44 {
        fill: #6d1916;
      }

      .cls-45 {
        fill: #e5fdfe;
      }

      .cls-46 {
        fill: #f9f0e7;
      }

      .cls-47 {
        fill: #dcbdd8;
      }

      .cls-48 {
        fill: #2e643c;
      }

      .cls-49 {
        fill: #075a36;
      }

      .cls-50 {
        fill: #3546c3;
      }

      .cls-51 {
        fill: #a66bb7;
      }

      .cls-52 {
        fill: #fbfbfc;
      }

      .cls-53 {
        fill: #a6403b;
      }

      .cls-54 {
        fill: #fea17a;
      }

      .cls-55 {
        fill: #f7f5f5;
      }

      .cls-56 {
        fill: #f7d613;
      }

      .cls-57 {
        fill: #c386c3;
      }

      .cls-58 {
        fill: #992d24;
      }

      .cls-59 {
        opacity: .2;
      }

      .cls-59, .cls-60 {
        fill: #7aebe9;
      }

      .cls-61 {
        fill: #e2633f;
      }

      .cls-62 {
        fill: #d6cfc9;
      }

      .cls-63 {
        fill: #bda6b8;
      }

      .cls-64 {
        fill: #c9892d;
      }

      .cls-65 {
        fill: #e6794d;
      }

      .cls-66 {
        fill: #eee4dc;
      }

      .cls-67 {
        fill: #882c80;
      }

      .cls-68 {
        fill: #676081;
      }

      .cls-69 {
        fill: #903893;
      }

      .cls-70 {
        fill: #511407;
      }

      .cls-71 {
        fill: #c392c2;
      }

      .cls-72 {
        fill: #58ccb3;
      }

      .cls-73 {
        fill: #19ab86;
      }

      .cls-74 {
        fill: #661b6a;
      }

      .cls-75 {
        fill: #90eaeb;
      }

      .cls-76 {
        fill: #17ae9d;
      }

      .cls-77 {
        fill: #d53a5c;
      }

      .cls-78 {
        fill: #eb6351;
      }

      .cls-79 {
        fill: #f77850;
      }

      .cls-80 {
        fill: #fcfcfc;
      }

      .cls-81 {
        fill: #432229;
      }

      .cls-82 {
        fill: #c4cac5;
      }

      .cls-83 {
        fill: #95409b;
      }

      .cls-84 {
        fill: #931313;
      }

      .cls-85 {
        fill: #cb6781;
      }

      .cls-86 {
        fill: #e42219;
      }

      .cls-87 {
        fill: #29999b;
      }

      .cls-88 {
        fill: #d8f6fb;
      }

      .cls-89 {
        fill: #353535;
      }

      .cls-90 {
        fill: #fe9c5d;
      }

      .cls-91 {
        fill: #2d0e14;
      }

      .cls-92 {
        fill: #120f12;
      }

      .cls-93 {
        display: none;
      }

      .cls-94 {
        fill: #e2afc4;
      }

      .cls-95 {
        fill: #1d121b;
      }

      .cls-96 {
        fill: #1c121d;
      }

      .cls-97 {
        fill: #cabcca;
      }

      .cls-98 {
        fill: #227adf;
      }

      .cls-99 {
        fill: #4e0b1b;
      }
    </style>
  </defs>
  <!-- Generator: Adobe Illustrator 28.7.1, SVG Export Plug-In . SVG Version: 1.2.0 Build 142)  -->
  <g>
    <g id="Layer_1">
      <g>
        <path class="cls-32" d="M245.3,173.9l5,23s2.5,3.6,4,3c4.1-1.7,7-9,7-17s-4-14-4-14l-12,5Z"/>
        <g>
          <g id="Background" class="cls-93">
            <path class="cls-23" d="M185.4,534.6c-76.7,0-153.3,0-230,0V22.6h512v512c-62.8,0-125.7,0-188.5,0l2-12c4.7-1.7,10.2-4,14.5-6.5,3.4-2,7.1-3.8,8.5-7.7-.6-6.9-2.4-13.6-4-20.2,78.7-56.2,100.3-140.9,35-218.5.4-.1,3.7,0,8.7-3,11.3-6.9,14-20.6,8.7-32.2,19.7-4.1,26.7-27,11.5-40.5,1.3-4.6,0-9.7-3.5-13,18.1-14.9,14.3-39.8-6.5-49.5,3.4-16.5-13-29.2-28.5-28,4-21.1-13.4-38.6-33.7-28.2-17-18-45.8-26.5-68.5-14.5-20.8-21.1-68.8-14-83,12-16.5-13.3-43.4,1.7-37.7,22.7q-5.9,5.1-11.7,10.2c-15.4,1.6-25.4,19.2-18.2,33.2-16.5,8.4-18.6,31.5-2,41-18.5,4.8-26.8,31.5-8,41.5-3.3,17.4,13.6,21.6,14,23-2.9,8-1.6,15.4,4,21.7-35.1,28.1-51.5,75.2-45,119.2,7.3,49.2,46.1,86.2,86.5,111.2-.7,4.4-1.8,8.7-1.5,13.2,2.5,2.9,4.9,4.7,8,6.7,14.7,9.9,38.1,13.2,55.5,15l1.5,3Z"/>
          </g>
          <g>
            <g>
              <path class="cls-92" d="M280.4,174.6c-3.1-1.8-1.7,4.8-11,5.5,0-7.6-1.4-10.5-7-15.7l.7-.7c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4Z"/>
              <path class="cls-92" d="M280.4,174.6c.5,1.8.2,4.9,1,5.5-1.1.3-8.9,8-12.5,7.5.5-2.2.5-5.2.5-7.5,9.3-.7,7.9-7.3,11-5.5Z"/>
            </g>
            <g>
              <path class="cls-92" d="M127.9,107.1c-1.6,2-3.6,3.8-5,6,.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-.3-.4-2-8.5-2-9.2.1-4,3-8.2,6-10.7-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7Z"/>
              <path class="cls-92" d="M342.4,121.6c4.3,7.1,2.9,10.5,0,18.2,4.7,1.1,5.4.4,10,2.7l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7Z"/>
              <path class="cls-28" d="M92.9,218.1c-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-1.7-8.4,2.7-11.1,3.5-12.5q7-4.6,14-9.2-.5-4.6-1-9.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2,1.4-2.2,3.4-4,5-6,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7Z"/>
              <path class="cls-28" d="M344.9,214.6c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
              <path class="cls-95" d="M86.4,197.6c-.8,1.4-5.2,4.1-3.5,12.5-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2Z"/>
              <path class="cls-95" d="M99.4,179.1q.5,4.6,1,9.2-7,4.6-14,9.2c.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2Z"/>
              <g>
                <path class="cls-92" d="M131.9,174.6q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5q5-2.2,10-4.5Z"/>
                <path class="cls-76" d="M143.4,170.6c-1.4,3.7-2.8,5.7-3,10-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2Z"/>
              </g>
              <g>
                <path class="cls-95" d="M355.4,198.8c1.6-17.5-7.8-17.6-8.5-18.5-3.1-4.3,5.8-3.9,10.5-9.5,7.1-8.4,5-23.2-5-28.2l-.2,1c-1-2-.7,1.7-6-1.5-1.2,5.6-7.4-2.5-4.7,5.2-6.7,3.1-2.3-17,2-18,.3-.9-5.6-11.4-1-7.7-4-6.7-11.3-9.8-18.7-6.5-2.9-.6,1-6.1-10.2-12.2,8.8-16.2-11.8-29.4-22.2-14.2-18.4-20.7-44.2-29.9-70-16-17.5-19.9-50.6-17.5-68.7.2-1.8,1.7,0,4.2-13.2,9.7-2.1,0-10.4-11.3-22.2-1.5-6.2,13.7,9.6,19.6,10.5,22.2.5,1.5-1.2,3.5.5,3.7,2.3-2.9,3.7-.4,2-9.2,16.2-18,15.2-11.2,37.7-8.2,3.4-.8,3.3-15.3,10.5-16.5,10-1.7,12.6,10.8,8.5,14-3.8,3-3.4-2.7-7-8-4,23.7-18.5,15.8-36.5,13.5-8.9,6.1-4.7,10.6-5.7,13.7-.3.8-8,7.4-8.5,8.5-3.1,6.7,5.4,5.5-17.5,17.5-2.5,6.2,9.5,17-7.2,24.2-4.8,2.1-17.4,2.3-14,6.5,2.8,3.4,16,6.3,16.7,18.2,1.5,23.8-28.2,10.7-14,36.7-.3.1-1.6,1.8-5.2,3-.6-.1-4.6-10.4-4.7-11-6-2.2-15.7-2.8-14.5-11.2,1.9-13.6,16.5-1.2,18-1.2.6-1,2.3-2.2,2.5-2.7,2.1-5.6-4.6-9.8-4-15.5l14.5-.2c.1-2.9-8.4-7.2-14-11-2.2-4.6-1.1-10.3,2-14.5,8.9-4,19.9-1.7,20-8.2,0-.5-2.2-6-2.5-10.2-.8,0-1.6,0-2.3.1.7,0,1.5,0,2.3-.1-.8-11.2,14.7-13.4,16-14.7.5-.6,1.8-5.9,2-7.2.2-1.4.7-2.8.5-4.2-1.5-.5-10.1-7.2-10.5-7.7-1.2.2-2.4.9-3.5,1.5-.6.9-1.1,1.8-1.5,2.7.4-.9.9-1.8,1.5-2.7-8,4.4-5.4,3.6-9.2,11.5-19.2-1.6-26.4,17.1-12.7,30.2-2.7.9-5.4,1.2-8,2.2-2.1.9-3.3,1.4-5,3-9.5,8.9-5.1,21.5,6,26.2.7,1.9-4.1,4.6,0,14-18.9-2.2-25.7,19.2-8,27.5-3.8,9.2,3,21.4,13.2,17.7,8.3,8.1-2.1,8.2-.2,19.7,1.4,9,14.2,14.7,21.7,9.2,10.7,4.5,5.5,5.2,9.2,10.2,4.7,6.5,16.4,5.9,21.7.2,1.4.3.7,14.1,20,11.5,4.7-8.2,6.2-2.5,13.5-6,5.4-2.6,5.4-9.9,10.7-5,2.9-4.1,4.5-9.1,8.5-12.5,0-.7.1-.9.5-1.5-7.7-1.4-26.9-15.7-33.1-21.2-10.4-9.2-16.6-17.4-16.4-31.5.2-.6-.4-8.4-1.5-10.7-.4-.9-.3-9.4,0-17-3.5,2-1.2-8.9,3.5-12.2q-.2,1.1-.5,2.2c.2-.4,1.4-3.3,1.5-3.5,1.4-2.6,2.5-7,6.5-5.7q-1-1.4-2-2.7c1.1-9.4,7.9-32.2,17.5-36.5,5.6-2.5,11,1.2,17.7-8.5,22.9,12.9,31.8-2.3,33.5-3,6.9-2.6,8.8,5.3,9.2,5.7,7.9,9,16.1,5.6,23,18,2.7,4.9,3.6,11.3,6.5,16,1.2,2-.8,16.6.4,19.5,4.6,10.3,4,21,1.1,25.7,6.7-10.7,1.7,3.7,8-2,.6-1.3,2.4-5.3,2.5-6,.5-2.2.5-5.2.5-7.5,0-7.6-1.4-10.5-7-15.7l.8-.8c2.3.7,15.4,6.4,16,7,.9,1,.8,2.4,1.2,4,.5,1.8.2,4.9,1,5.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2-6.2,8.9-16.6,15.4-26,20.5,1.2,2.9,1.7,6,2.5,9,.7,2.4,1.9,5.2,2,5.5,5.7.6,7.9,6.6,11,8.5.6.4,3.6.9,4.7,1,7,13.8,25.6,10.6,30-4,9.6,10.2,24.4,12.2,28.5-4,7.3,0,12.5.8,17.5-5.5,18.4,2,25.3-16.4,12.2-28.7q3.1-4.1,6.2-8.2c6.2,1.5,12,.1,15.2-5.5,4.1-7.1,2.1-14.6-4.5-19.2ZM106.7,107.9c-.3.8-.5,1.6-.7,2.4.2-.8.4-1.6.7-2.4ZM90.1,117.1c.6-.2,1.1-.4,1.7-.5.6,0,1.2-.1,1.7-.1-.6,0-1.2,0-1.7.1-.6,0-1.1.2-1.7.5-.4.2-.8.4-1.2.6.4-.3.8-.5,1.2-.6ZM85.4,123.5c.1-.5.3-1.1.4-1.6-.2.5-.3,1-.4,1.6-.2.8-.2,1.6-.1,2.5,0-.8,0-1.7.1-2.5ZM344.9,214.6c-.2-.1-.3-.3-.5-.5-.3-19.2-12.8-13.1-20.2-18-4.8-3.2-8.2-20.3,14.7-19.2,5.8,8.3-14.6,6.7-12.5,11,.5,1,15.8,6.4,18,9,3.1,3.8,3.1,14.6.5,17.7Z"/>
                <path class="cls-28" d="M234.1,74.6c12.6-1.2,21.7,20.4,45.5,12.5,11.5,15.3,21.3,10.6,16.2,29.2,2.6,1.3,12.5,10,13.2,10.2,5.5,2,21.8-2.9,16.7,17.2,4.7,1.6,21.4,8.2,23.5,12,2.4,4.4.7,13-4.2,14.7-11.6,4-.9-9.6-1.2-11.2-12.5-11.5-29.9-.8-23-24.5l-13.2-1.2c-8.4-11.1-13.2-8.1-16.2-11.7-8-9.7,12.5-22.6-19.7-18.2l-2.5-8.5c-12.3.4-23-6.6-32.5-13.5-4.2-.3-17.2,8.1-14.2-.7.6-1.9,9.6-6,11.7-6.2Z"/>
              </g>
            </g>
            <g>
              <g>
                <g>
                  <path class="cls-15" d="M232.4,259.1c-9.1,11.6-21.8,20.5-36,24.5-2.4-3.1-5.4-6-6-10-.5-2.9.2-7.9.5-11,0-.7.1-.9.5-1.5,12.4,2.2,27.7-5.1,38.5-11,1.2,2.9,1.7,6,2.5,9Z"/>
                  <path class="cls-65" d="M234.4,264.6c.4,2.1.7,4.2,1,6.2-7.3,8.7-18.3,15.1-29,18.7-2.5.8-1.9,1-2,1-.7.2-.4.7-2.5-.5-.3-.2-1.3-.8-1.5-1-.3-.2-3.4-4.7-4-5.5,14.2-4,26.9-12.9,36-24.5.7,2.4,1.9,5.2,2,5.5Z"/>
                </g>
                <path class="cls-65" d="M258.4,220.6c-6.4,16.8-49,37.4-61.2,37-15.6-.5-46.6-25.9-50.2-42.2,5.5,1.1,11.2,1.2,16.5-.2.6.9,3,3,6.5,8.5,7,11,11.1,22.4,27,20.5,12.7-1.5,15.7-10.1,19.5-14.5,3.2-3.7,6.8-7.3,10-11,3.6.9,7.6,1.5,11.2,1,2.1-.3,11.8-4.1,10.7-6,2.3-1.1,8.3-5.6,10-7.5,2,4.5,1.8,9.8,0,14.5Z"/>
                <path class="cls-6" d="M248.4,213.6c1.1,1.9-8.6,5.7-10.7,6-3.6.5-7.7-.1-11.2-1,.4-.5.6-1.4,1-2,6.8,1.4,14.8,0,21-3Z"/>
                <g>
                  <path class="cls-65" d="M255.9,229.6c-1.7-1.6,4.7-6.1,2.5-9,1.8-4.7,2-10,0-14.5,1.7-1.8,5.9-9.8,6.9-12.2.6-1.3,3.4-5.6,3.6-6.3,3.6.5,11.4-7.2,12.5-7.5,11.7-2.8,17.1,19,3.2,30.5-10.8,8.9-16.5-2.4-23.2,7.7-.3.5-.9,4.7-5.5,11.2Z"/>
                  <path class="cls-17" d="M283.4,199.1c1.9,7-4.8,7.9-7.2,6.5-2.5-1.4-3.7-10.3-2.2-13.5,4.2,1.7,8.6,10.7,9.5,7Z"/>
                  <path class="cls-70" d="M283.4,199.1c-.9,3.7-5.3-5.3-9.5-7,2-4.5,16.9-7.5,14.2,4.5-1.4-9.8-9.5-5.7-9.7-4.7-.2.8,4.1,4.1,5,7.2Z"/>
                </g>
                <path class="cls-32" d="M225.4,217.1c-1.7.4-3.3,2-5.5,2.5-19,4.1-34.9,5.3-52.5-4.5-1-.5-2-1-3-1.5,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2Z"/>
                <g>
                  <path class="cls-99" d="M164.4,213.6c1,.5,2,1,3,1.5,2.3,3.6,7.4,6.7,11,10,.2.2,1,2.6,2.5,4.2.7.7,1.7,1.2,2.5,1.7-3.9,1.9-9.8-5.6-13.5-7.5-3.5-5.5-5.9-7.6-6.5-8.5,0,0,0-.7-.5-1.5.5,0,1,0,1.5,0Z"/>
                  <path class="cls-99" d="M227.4,216.6c-.4.6-.6,1.5-1,2-3.2,3.7-6.8,7.3-10,11-1.5.2-6.1,1.2-7,1.5,2.3-2.6,4.7-5,7-7.5,1.2-1.2,2.7-2.5,3.5-4,2.2-.5,3.8-2.1,5.5-2.5l2-.5Z"/>
                  <path class="cls-77" d="M216.4,229.6c-3.8,4.4-6.8,13-19.5,14.5-9.5-.5-18.3-11.2-13-12.5,11.9,7.1,20.2,1.4,25.5-.5.9-.3,5.5-1.3,7-1.5Z"/>
                  <path class="cls-36" d="M183.4,231.1c.6.4.5.5.5.5-5.3,1.3,3.5,12,13,12.5-15.9,1.9-20-9.5-27-20.5,3.7,1.9,9.6,9.4,13.5,7.5Z"/>
                  <path class="cls-36" d="M219.9,219.6c-.8,1.5-2.3,2.8-3.5,4-12.3,4.4-25.5,5.6-38,1.5-3.6-3.3-8.7-6.4-11-10,17.6,9.8,33.5,8.6,52.5,4.5Z"/>
                  <path class="cls-52" d="M216.4,223.6c-2.3,2.5-4.7,4.9-7,7.5-5.3,1.9-13.6,7.6-25.5.5,0,0,0-.1-.5-.5-.8-.6-1.8-1.1-2.5-1.7-1.5-1.6-2.3-4.1-2.5-4.2,12.5,4.1,25.7,2.9,38-1.5Z"/>
                </g>
              </g>
              <g>
                <g>
                  <path class="cls-52" d="M241.4,192.1c1.8-1.9,1-1.5,1.5-3.5,0-.4,0-1,0-1.5,0-.1,1.3-.4,0-3,3,.6,7,4.5,7,6.5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.7-3.5,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2Z"/>
                  <path class="cls-45" d="M242.9,184.1c1.3,2.6,0,2.9,0,3l-1.5,1.5c-6.6,1.4-5-5.9,1.5-4.5Z"/>
                  <path class="cls-60" d="M242.9,188.6c-.5,2,.3,1.6-1.5,3.5-3-1.7,0-1.5.5-3.5h1Z"/>
                  <path class="cls-48" d="M242.9,188.6h-1c-.2,0-.3,0-.5,0l1.5-1.5c0,.5,0,1.1,0,1.5Z"/>
                </g>
                <g>
                  <path class="cls-95" d="M154.3,159.9c-6.8,8.7-8.2,31.1-8,30,.5.7-4.6,20.7-5,20-4-7-10-22-2-38,1.9-3.9,9.4-11.7,15-12Z"/>
                  <path class="cls-32" d="M258.4,195.6c4.8-11-8.2-5-8.5-5,0,7.3-19.7,8.3-28.2,1-4.3-3.7-.8-2.3.8-3.5-.6-4.6,3.2-8.1,6.9-10.2s6-1,9-1,7,3,9.6,5.7c.8,1,14-18.9,14.2-19,.2,0,1.8-4,1.8-4.7-.2-1.8-5.8-6.5-7-8.5-2.9-4.7-3.8-11.1-6.5-16-6.9-12.4-15.1-9-23-18-.4-.5-2.4-8.3-9.2-5.7-1.7.7-10.6,15.9-33.5,3-6.7,9.7-12.1,6-17.7,8.5-8.6,10.8-21.6,44.5-21.4,44.2-1,4-3.1,9-3.1,13.6-.5,3.7-.6,13-1,14-4,9-1,19,0,21,.1.3,14.7-.3,21.6-1.3.5,0,1,0,1.5,0,14.5-3,25.1-19.2,24.7-33.5,21.2-1.9,7.5,3.4,18.2,22.7,4.4,8,10.1,10.7,18,14.2l2-.5c6.8,1.4,14.8,0,21-3,2.3-1.1,8.3-5.6,10-7.5,1.7-1.8,6.9-10.1,8-12.5-6.3,5.7-1.2-8.6-8,2ZM180.9,184.6c-1.9-.4-.6,3.1-1,3.7-.9,1.3-3.3-1.6-4,1.2,0,.6.1,1.6,0,2,5,1.1-4,12-5.8,12-1.4,0-2.7-5-7-4.5-2,.2-10.5-1.6-15.4-9,.5-2.8,1-7.6,1.1-8,.1-.3-.2-1.6.5-2.7,4.3-7.5,20.8-9.1,28.5-8.7,2.1,4,3.2,9.5,3,14ZM229,150.6c-1.2,0-2.4,0-3.5.2,1.1-.1,2.3-.2,3.5-.2ZM219.1,152.3c-.5.2-1,.5-1.3.8.4-.3.8-.6,1.3-.8Z"/>
                  <path class="cls-52" d="M165.9,181.6c-16.7,4,1.1,19.8,5,7.5.6-2,.6-3.5.5-5.5.5,0,3.4,2.9,4,4.5,0,.3.5,1.4.5,1.5,0,.3,0,.6,0,1s0,.8,0,1c-1.7,5.9-18.6,5.3-25.5,3s-2.8-3.5-2.5-5.5c.9-6.8,16.1-10.5,18-7.5Z"/>
                  <path class="cls-65" d="M177.9,170.6c-7.7-.3-24.2,1.3-28.5,8.7-.7,1.2-.4,2.4-.5,2.7,6.8-9.9,27.7-7.3,26.5,6,0,.2.9,1.7,0,4.5-3.3,4.8-19.2,3.6-25,2-.4-.1-2.7-1.1-1.5.5,3.4,4.8,11.7,7.1,14.4,7.8,4,1,5.4,1.2,6.8.7,8.2-2.7,10.2-14.7,10.7-19,.5-3.6-.9-10-3-14Z"/>
                  <path class="cls-35" d="M170.9,189.1c-2.2,2.7-4.9,1.4-3.5-2,2-.5,2.9-3.5,4-3.5,0,2,.1,3.5-.5,5.5Z"/>
                </g>
              </g>
            </g>
          </g>
        </g>
        <path class="cls-92" d="M145.3,195.9"/>
        <path class="cls-4" d="M142.3,204.9c5,5.2,13.7,9.7,20.6,8.7.6.8.5,1.4.5,1.5-5.3,1.5-11,1.4-16.5.2,3.7,16.3,34.7,41.8,50.2,42.2,12.3.4,54.9-20.2,61.2-37,2.2,2.9-4.2,7.4-2.5,9-6.2,8.9-16.6,15.4-26,20.5-10.8,5.9-26.1,13.2-38.5,11-7.7-1.4-28.1-14-34.2-19.5-9.8-8.7-17.9-23.6-17.8-37.7,0,0,2.9,1,3,1Z"/>
        <path class="cls-4" d="M154.4,155.6c-1.7.9-7.5,10.1-9.1,11.3,1.1-9.4,11-42,21.6-44.8,13.3-3.5-4.5,4.5-10.5,24.2-.9,2.9-.9,6.3-2,9.2Z"/>
        <g>
          <path class="cls-65" d="M193.4,214.1c-4.1-.2-7.8-2.9-10.5-5.5-1.9-10.3,3.4-.9,5.7.5,6.2,3.7,18-.3,4.7,5Z"/>
          <path class="cls-70" d="M182.9,208.6c2.7,2.6,6.4,5.3,10.5,5.5,3.7.2,14.5-5.7,8.7-1-10.8,8.8-26.9-6.9-21-7,.5,0,.4,1.2,1.7,2.5Z"/>
        </g>
        <path class="cls-65" d="M227.4,163.6c3-.3.8.7-3.1,2.3-6.1,2.5-10,7-6.9,20.5.1.5-.4.4-.7.7q-4.6-1.5-9.2-3c-.4-15.9,5.9-19.2,20-20.5Z"/>
        <path class="cls-65" d="M264.3,158.9c-.2-3.9-4.1-3.8-7-8-2.4-3.5-3.9-11.5-4-12-3-10-12-14-12-14,0,0,14,17,9,40-.6-.1-4.1-2.2-4.9-2.3-5.5.7-1.1,1.7,1.5,6.2,3.4,6,5.2,13.4,3.5,20.2,0,.3,0,1.8,0,1.8,0,0-1,2.2-2,3-5,4-14.9,2.8-18,2-2-.5-5-2-5-2,0,0,3,9,20,9s14.4-12.9,15-16c.9-4.5,0-10-3-16-.1-.2,7.1-10.1,7-12Z"/>
        <g>
          <path d="M144.3,168.3c0,.3.5,0,1-.4,6-4,9-6,11-7,4-2,6.6-2.1,7-2.1,3.7-1.2,17.6,3.6,12.7-3.7-4.5-6.7-17.1-1.6-22.5,1.2-1.7.9-9.3,7.6-9.3,12.1Z"/>
          <path d="M244.6,163.3c.6.6.8-2.4.2-4-4.1-10.9-27.4-9-28.7-4.2-2,7.1,10.4,1.2,21.5,4,2.8.9,3.8.9,7,4.2Z"/>
        </g>
        <g>
          <path class="cls-4" d="M282.3,208.9l1,2c1,2-3,3-3,3-1.2.4-2,1-3,0l1-5c1-2,3.7-.5,4,0Z"/>
          <g>
            <path class="cls-35" d="M283.3,216.9c0-2,0-5-1-6s-1.8-2-3-1-1.8,4.6-2,7,.4,3.4,1.1,4c2,1.5,3.3,1.3,4,.2,2-3.2,1-2.8,1-4.2Z"/>
            <path class="cls-60" d="M283.9,216.1c-.2-2.8-.5-4.8-1.6-5.2-3-1-1,3-4,5s-.6,3.3,0,4c3.4,4.1,5.8-1,5.6-3.8Z"/>
          </g>
        </g>
        <path class="cls-4" d="M250.8,179.8c0,.3-.4.6-.5.4-4-7.3-17.2-9.1-22.3-6.7s7.5-8.2,17.3-3.6c4.9,2.3,5.2,7.9,5.5,10Z"/>
        <path class="cls-25" d="M257.1,183.6c-4.4,1.3-7.2.8-8.8-.8-.4-.4-.8-.7-1.1-1.1-6.9-9.9-25.9-4.9-24.9,6.3,3.3-2.4,5.5-8.7,15.2-7,5.3.9-3.6,0-5.7,3.7-4,7.3,4.3,12.8,9.5,7.2-3-1.7,0-1.5.5-3.5-.2,0-.3,0-.5,0-6.6,1.4-5-5.9,1.5-4.5,3,.6,7,4.5,7,6.5.4,1.3-.6,2.4-.6,2.3,1-1,2-3,1-3.7,2.3,0,6.7-5.5,6.7-5.5Z"/>
        <path class="cls-4" d="M148.3,180.9s4.3-5.6,8-7c5.6-2.2,19-4,22-3s-11.7-4.6-21.2-1c-1.3.5-3.5,1.7-4.8,3-4,4-4,8-4,8Z"/>
        <path class="cls-25" d="M149.5,181.2h0c-3.2,2.7-7.4.4-7.4.4,0,0,1.4,3.6,4.7,4.3.1,0,.3,0,.5.1,0,1.8,0,2.3.6,3,.9-6.8,16.1-10.5,18-7.5.1.1.2.2.3.3.2.3.2.4,0,.5.2,0,.2-.2,0-.5,0,0-.2-.2-.3-.3-16.7,4,1.1,19.8,5,7.5-2.2,2.7-4.9,1.4-3.5-2-.9-.3-1.5-.5-2.1-.7.5.2,1.2.4,2.1.7,2-.5,2.9-3.5,4-3.5.5,0,3.4,2.9,4,4.5,1.2-12.9-18.4-15.7-25.8-6.8Z"/>
        <g>
          <path class="cls-59" d="M182.3,182.9c0,15.7-15.3,27-28,27s-19-10.3-19-26,9.3-22,22-22,25,5.3,25,21Z"/>
          <path class="cls-59" d="M261.3,184.1c0,22.8-17.9,29.8-32.8,29.8s-22.2-11.3-22.2-28.7,10.9-24.3,25.7-24.3,29.3,5.8,29.3,23.2Z"/>
          <g>
            <path d="M266.3,192.9c5.8-9.6-3.8-18.8-5-22-3-8-6.8-10-10-11s-6-1-13-1-29-3-34.5,13.7c-7.2-3.1-12.6-2.6-20-1-1.5-2.7-5.5-11.7-20.5-12.7-1.9-.1-9.2-.7-16,1s-7.9,2.9-10,5c-2.2,2.2-4.6,9.8-5,18-.3,7,2,17,3,19s3,6,5.8,7.5c13.2,7.5,15,5,21.2,4.5,15-1,26.3-18.5,26-32.8,21.2-1.9,7.5,3.4,18.2,22.7,2.6,4.6,9.8,11,16.8,13,4.9,1.4,14.8,1.8,23-2,13-6,17-17,20-22ZM180.1,185.6c-.3,7.5-3.3,13.5-8.1,17.3-6.2,5-15.2,6.5-24.9,3.7-5.8-1.7-7.8-6.3-8.8-8.7-4-10,0-24,1-27,1.9-5.8,10.4-7.7,16-8,8.6-.5,17.3.2,21.7,8.7,2.1,4,3.2,9.5,3,14ZM213.1,203.9c-3.5-4.7-5.4-13.9-5.5-19.7-.4-15.9,5.2-19.1,20-20.5,5.6-.5,11.5-.9,17,0,.8.1,2.4.4,3,.5,2.1.6,4.2,1.3,5.8,2.8s4.4,6,6,16.9c.5,3.4,0,8-1.7,12.7,0,0,0,0,0,0-8.9,20.4-36.1,18.5-44.5,7.2Z"/>
            <path class="cls-89" d="M280.9,169.6c-.6-.6-13.7-6.3-16-7-2.6-.7-8.2-.1-8.6.3,4.7,4.4,2.9,14.9,7,19s3.7-1.2,5.8-2.2l.2.2h2v-.8c9.1-.7,11.9-3,15-1.2-.4-1.6-4.5-7.2-5.4-8.3Z"/>
            <g>
              <path class="cls-10" d="M133.6,173.6q-5,2.2-10,4.5c-.5-1.1-2.6-9.7-1.2-10.5,22.8-3.4,17.7-10.3,11.2,6Z"/>
              <path d="M133.6,173.6q-.6,5-1.2,10c-3.2-2.1-6.9-1.7-8.7-5.5q5-2.2,10-4.5Z"/>
            </g>
            <path d="M282.3,179.9c-.8-.6,4.5-1.2,4-3-2.9-1.7-6,.8-13.6,2-9.5.8-12.4-2-12.4-2l1,3c0,.5.5,2.5,1,4.4l-2.1.7,2.1,6.9c5.4-5.4,8.4-3.5,15-9,2.4-1.8,4.5-2.9,5-3Z"/>
          </g>
        </g>
        <path class="cls-83" d="M138.5,382.3"/>
        <g>
          <g id="Background-2" data-name="Background" class="cls-93">
            <path class="cls-63" d="M143.9,540.3c-41.3,0-82.6,0-123.9,0V146.2h394.1v394.1c-41.2,0-82.4,0-123.6,0,3.7-19.5-3.3-40.2-7.3-59.3,29-12.9,43.8-30.1,49.7-61.6,9.9-16.8,9.6-39.8,12.3-59.1,2.4-16.9,8.2-43.9,6.9-60-1.4-18.2-14.4-30.8-31.6-35.2,3.7-12.5,10.8-39.9-3.3-48.1-9.4-5.5-19.2-3-25-5.4-.7.5.7,10.1.2,11.9,0,0-.7,1.4-1,1.5-26.2-2.3-6.9-16.3-22.9-42.9-29.6-49.2-112-33.3-118.9,25-4.1,34.2,16.3,33.4,10.8,55.4-6.3,24.9-68,35.6-44.3,87.2-2.8,12.3-5,21.1-6.5,33.9-2.7,22-4.8,49.7,5.8,69.7,1,1.9,2.3,3.6,3.5,5.4,8.3,13.2,15.9,22.2,30.4,28.9-.5,1.4-1.1,2.8-1.5,4.2-3.7,13.1-5.5,34.9-3.8,48.5Z"/>
            <path class="cls-62" d="M292.4,223.6c3.1-1.1,5.7-2.8,8.9-3.8,1.2.4,1.8,1.6,2.7,2.3.3,8.8.8,17.8-7.9,23.1-10,6.1-12.4-2.5-13.9-3.8-6.4-6.1-17.8-7.6-24.1-.6-5.8,6.4-5.1,11.7-1.2,18.9,6.3,11.5,20.4,17.3,32.7,12.9,9.8-2,18.8-6.8,28.9-7.7-.5,2.2-1.3,4.3-1.5,6.5-2.1,0-10.4.1-11.2,1.5-.2.3-1.3,6.8-1.2,7.1.2.3,1.4.1,1.9,1,.9,1.6,1.7,5.2,3.1,6.9-2.1,2.5-5.5,7.8-4.6,11,.8,2.9,3,0,4.2-1,1.3-.9,2.3-2.1,3.5-3.1,3.2.5-.1,1.8-.4,3.5-4.1,3.3-2.7,5.3-2.7,6.5-1.6,0,1.3,2.6-3.7,1.2-1.2-.4-13.2-9.3-22.3-13.1-8.1-3.4-17.1-5.2-25.4-8.1-3.8-1.3-9.1-4.5-10.2-3.1-3.6-5.7-9.4-9.3-16.2-7.7-.9.1-.7-.2-.8-.8,6.1,1,.9-3.6,1.2-6.7,12-5.6,9-18,9.2-19.6.7-4.3,9.7-5.3,5.4-8.7,1.5-2.4,2.4-6.4,2.7-9.2,4.6-1,9.6-6.5,5.4-6.5,1.8-2.8,2.5-5.8,1.5-9,2.2-.6,5-4.7,5-6.7,5.3,1.7-2.3-12.8-3.1-19.8-10.3-15.9-28-27.5-47.5-25.6-2.4.2-18.2,4.4-19.1,6.5-.2,0-.4.3-1.2.4-1.3.2-2.3.6-3.7.4-10.1,7.6-17.5,14.9-21.7,27.1.2,10.8,2.2,11,2.3,11.5,0,.1-.8.6-.8.8,0,.3.8.2.8.2,0,.1,0,.3,0,.4-1.1-.2-.9,1.1-1.2,1.5-.3.6-1.9,2.8-1.9,3.3,0,.5,5,6.4,5.8,8.1,1.5,3.3,3.4,12.1,3.8,13.1,2.8,5.7.6-9.3-3.8-16.4,1.5.9,3.6,6.2,4.2,8.1,1.5,4.6.5,8.7,5,13.5,2.6,2.8,4.8,3.1,5,3.7-.6,11.8,2,16,10,23.7-1.3-.4-2,3-5.4,5.6,2.9,2-4,1.6-4.2,4-2,1.2-3.9,3-5,5-1.9.2-1.5,3.8-3.3,4.6-.4.2-7.8,1.3-9.2,1.5-2,.4-3.4-1.3-3.8.4-16.1,3-27.7,9.4-36,23.9-.4.6-.8,1.3-1.2,1.9-4.2,8.2-8.1,25.9-10.4,35.8-23.7-51.6,38-62.3,44.3-87.2,5.5-22-14.9-21.2-10.8-55.4,7-58.3,89.3-74.2,118.9-25,16,26.6-3.3,40.6,22.9,42.9.3-.1.9-1.5,1-1.5Z"/>
            <path class="cls-62" d="M289.7,272.4c-12.3,4.4-26.4-1.4-32.7-12.9-4-7.2-4.6-12.4,1.2-18.9,6.3-7,17.6-5.5,24.1.6,1.4,1.3,3.9,10,13.9,3.8,8.6-5.3,8.2-14.3,7.9-23.1,16.2,14,4.1,43.9-14.2,50.4Z"/>
            <path class="cls-63" d="M318.6,264.7c-10,.9-19.1,5.7-28.9,7.7,18.4-6.5,30.5-36.4,14.2-50.4-.8-.7-1.5-1.9-2.7-2.3,6.5-2.1,10.1-1.2,10.2-3.1,18.9,5.8,10.5,33.6,7.1,48.1Z"/>
            <path class="cls-66" d="M261.6,206.6c0-3.1-3.8-6-3.8-6.4-.3-1.5,3.4-2.8-3.5-7.7,2.8-7.4,1.7-6.4-6.2-8.9,1.1-9.5-3-6.8-4.8-8.3-1.6-1.3.5-5.6-7.7-4.2-9.2-10.6-12.6-3-13.5-3.1-.9,0-9.3-11.1-15.4-.8-6.3-2-8.6,1.1-9.2,1.2-.5,0-3.4-1.5-3.8-1.5-.6,0-1.3.7-1.7.8.8-2.2,16.7-6.3,19.1-6.5,19.6-1.9,37.2,9.7,47.5,25.6.7,7,8.3,21.5,3.1,19.8Z"/>
            <path class="cls-55" d="M190.8,168.1c-6,2.9-3.4,6.8-4.8,7.3-.2,0-3.3-1.2-3.5-1.2-1.6.3-4.1,7.2-4.4,7.5-1.7,1.9-6.4,0-4.2,8.1-4.5.7-7.7,5.3-4.6,8.9-4.1,6.2,0,8.3-1.5,9.4,0,0-.7.1-.8-.2,0-.1.8-.7.8-.8-.1-.6-2.1-.8-2.3-11.5,4.2-12.2,11.7-19.6,21.7-27.1,1.3.3,2.4-.2,3.7-.4Z"/>
            <path class="cls-21" d="M231.2,273.2c-.3-2.4-.5-4.9-.4-7.3,7.3-5.8,10.4-13.4,8.9-22.7,2.8-.2,5.9-2.7,7.3-5,4.3,3.3-4.7,4.4-5.4,8.7-.2,1.6,2.8,14-9.2,19.6-.2,3.1,4.9,7.8-1.2,6.7Z"/>
            <path class="cls-21" d="M170.4,218.2c4.4,7.1,6.6,22.1,3.8,16.4-.5-.9-2.3-9.8-3.8-13.1-.8-1.7-5.8-7.6-5.8-8.1,0-.5,1.6-2.7,1.9-3.3-.3,3.6.9,6,3.8,8.1Z"/>
            <path class="cls-62" d="M194.7,267.1c.1.1,2.8.8,2.7,2.3-.3,1-.6,2-.8,3.1-.2,1.2-.6.5-.8,1.2-3.8,0-7.6,1.1-10.8,3.1.3-2.4,7.2-2.1,4.2-4,3.4-2.6,4.1-6,5.4-5.6Z"/>
            <path class="cls-21" d="M249.7,229c.1-1.2.8-2.6.8-2.7,1.6-.4,3.8-2.5,4.6-3.8,4.2,0-.8,5.6-5.4,6.5Z"/>
            <path class="cls-63" d="M288.2,391.8c0,.1,0,.3,0,.4,1.1,12.9,5.3,25.4,8.5,37.9-9.7,7.7-16,18.1-22.7,28.3-2.2-1.9-5.3-17.4-5.4-19.1-.4-7.9,5.6-12.2,4.6-20,3.9-8.9,7.7-18,13.1-26.2.6-.9,1.2-2.1,1.9-1.3Z"/>
            <path class="cls-63" d="M164.3,441c0,.5.8,3.7.8,3.8q-2.9,6.9-5.8,13.9c-6.2-6.9-5.5-7.7-15.4-16.9-1.1-1-2.3-1.9-3.5-2.9,2-8,6.5-32.3,8.1-37.1,0-.2,0-.5,0-.8,3.2,6.5,5.1,13.5,7.7,20.2,1.1,2.9,3.1,5.5,4.2,8.5,1.4,3.7,1.9,8.8,3.8,11.4Z"/>
          </g>
          <g>
            <path class="cls-7" d="M213.1,521.1q-.8,1.5-1.5,3.1"/>
            <g>
              <path class="cls-83" d="M304.4,310.7c-1.2-1.6-3.7-2.4-3.8-2.5-10.1-8.3-24.1-16.9-3-2.8-.6,1.8-3,7.2-4,7.6-.2.7.5,1.1.4,1.7-4.1,12.4-6.4,33.8-9.2,44.5-.1.4-.5,1.6-1.2,1.3-.6-3.4-1.2-6.6-1.5-10-1.5-13.5-1.7-32.5-1.2-46.2.8-.7-1.7-4.4-2.3-5-7.3-2.6-9.1-5-16.5-7-4-1-7.4-5.9-3.7-4.6,8.3,2.8,17.1,3.2,25.2,6.6,9.1,3.8,21.4,13.9,22.5,14.6,5.5,3.4,3.5,38.4,3.5,38.4,0,0-4.3-29.6-5.2-36.7Z"/>
              <path class="cls-83" d="M319.5,370.3c-8-17-13.4-47.6-15.2-61.7-1.2-1.6-2.4-1.9-2.4-2.2,0,0-1,0-1,0,.3-1.6-.7.6-.5-1.3-10.1-8.3-26.5,4.9-27.5,5.3-.2.7,21.1.6,21,1.3-4.1,12.4-19.6,50.6-19,57.7,0,.8,2,15-2,20,0,.1,31.5-1.3,31.6-2.1-.3-.7-.7-1.4-1.1-2.3,1.8-7.1,4.7-3.6,6.9-11.1,0,.1.1.3.2.4,1-3.6,10.6-.6,9-4Z"/>
            </g>
          </g>
        </g>
        <path class="cls-39" d="M303.5,368.3"/>
        <g>
          <path class="cls-83" d="M131.2,345.2c-.6,2.7-4.5,27-5.2,28.3-1.3,2.1-4.8,23-5,23-4-5.8-12-28.2-16-34,0-.2,7.7-.5,7.7-.8,4.4-9,15.2-50.3,18.8-54.5,1.3-1,3-1.6,4.2-2.5-1.3,12.8-1.8,28.1-4.5,40.5Z"/>
          <path class="cls-83" d="M133.2,409.7c-1.8-2.3-5.9-5.5-7.5-7.5-1.7-2.2-3.7-4.1-5.5-6.2-.4-.6-.4-2.2-.5-2.2,3.1-6.3,2.6-13.3-.5-19.5,0-1.7.3-.4,1.5-.5.2,0,.2,1.4,1.5-.8.7-1.3,8.6-30.5,9-27.8-2.2-13.7,10.8-9.7,14.8,2.3,1.4,4.1-1.1,20.1-1,26,.2,11.6-11.4,34.9-11.8,36.2Z"/>
        </g>
        <path class="cls-74" d="M133,410.4l11-26s-1.3-11-1-14c.4-3.2,2-19,6-26,2.6-4.5-9.3,4.8-12-5,3,11,5,20.4,0,39-2.5,9.2-11,24-11,24l7,8Z"/>
        <g>
          <g>
            <path class="cls-16" d="M236.1,531.6c-17.2,1.6-91.2-26.6-87-9.8.2,1,4.2,17.7,8,21,7,6,43,8,67,7,14.3,0,54-11.1,55-16.2,1-4.8,1-6,2-12-14.1,5.2-30.1,8.6-45,10Z"/>
            <path class="cls-64" d="M209.4,550l-1.3-10.7s2.7,10.7,4,10.7h-2.7Z"/>
          </g>
          <path class="cls-65" d="M205.5,288.5c.7,3.5,2.5,6.8,4.2,9.9.5,2.8-4.4.7-7.8,1.4-6.8,1.3-8,7.9-3.5-3.5,1.1-2.9,2.6-5.5,3.5-8.5,3,1.7,2.5.9,3.5.7Z"/>
          <g>
            <path class="cls-83" d="M274.2,382.7s2-1.3,2-1c.8.2,24.1-24.1,27-32,.8-2.1,5-16,3.6-22.2-2.2-8.6-5.3-16.9-11.1-23.7-11.1-13-23.1-9.9-32-12.7-2.1,4.4-4.6,8.6-7.5,12.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-15-13.5-21.2-17.5.8,7-1.5,13.2-8,16.7.3,1.2,3.3-2.5,4,2.7,5-2.5-2.8,6-6.2,6.5-7.5,1-10.5-8.7-11.2-14.7-.3-2.5-.3-9.5,1-8.7-.4-5.9,2.2-10.9,5-16-.5.2.2-1.5-3,1.7-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1-7.5.6-11.2.9-18.2,5-10.2,5.9-16.6,22.6-18.2,28.2s-22.4,36.2-19.8,39.7,8.9,11.6,17,4c4.8-4.6,10.8-26.1,14-28s7.2,7.3,8.2,8.2c1.9,1.6,3.8-.9,4.9-2.9-3.3,7.7-9.1,19.8-7.9,29.9,1.4,11.4,6.9,18,11,21,2.7,2.1,9,4,9,4,0,0,5,5.2-1,15-2.4,4-10,14.2-19,37.3-4.9,19.1-8.8,38.4-11.5,58-.3,2.1,0,4.4-1,6.5,14.7,9.9,38.1,13.2,55.5,15,17.2,1.8,34.7,2.6,52,1,14.9-1.4,30.9-4.8,45-10,4.7-1.7,10.2-4,14.5-6.5-2.2-15.6-5.7-30.9-10-46-3.2-11.3-6.5-22.5-12-33-7.4-5.9-5.1-31.1-3.9-43l4.4-10.3Z"/>
            <path class="cls-74" d="M270.2,386.7c0,0,0,.1,0,.2,0-.2,0-.2,0-.2Z"/>
            <path class="cls-74" d="M270.3,386.9c0,.2,0,.6,0,1.1.1-.5.1-.8,0-1.1Z"/>
          </g>
          <path class="cls-83" d="M137.1,382.8"/>
          <path class="cls-74" d="M273.6,434.1c-4.9-7-4.7-26.6-3.5-39.5,2.3-3,4.3-6.8,5-10.2,1-3.6.4-15.8-2.8-24.7-1.6.2,4.6,12.7-.8,23.9-2.1,3-4.9,6.9-9.4,9.9-2.2,1.3-4.8,2.6-7.9,3.6-5.9,1.6-13.7,1.7-24.2-1.3.6.2,35.3,40.1,43,56,7.5,15.4,16.2,62.8,15,67,.5-.1,6.8-3.4,10-5s-2.7-48.6-24.5-79.7Z"/>
          <path class="cls-74" d="M167.1,400.1c5,0,10-3,10-3-6,3-16,1.7-16,1.7,0,0,1.1,1.8,1,5-.1,3.3-1.5,8.1-4,12.3-4,7-7.1,12.9-9.6,17.9-2.8,4.8-4.9,10.2-6.1,13.6-.9,2.3-1.3,3.5-1.3,3.5-4.9,19.1-9.3,45.1-12,64.7,6.6,4,7,4,7,4,0,0-3.2-21.9,2-42.4,7.5-29,19.6-41.2,23-46.6,15-24,6-30.7,6-30.7Z"/>
          <path class="cls-83" d="M137.2,382.7"/>
          <path class="cls-74" d="M136.2,338.7s7,3,13-1c6.1-4.1-3,13-3,13,0,0-6.2-2.2-10-12Z"/>
          <path class="cls-38" d="M202.2,355.4c-3.1,1-3.9-4.7-1-5,2.6-.3,3.1,4.3,1,5"/>
          <path class="cls-38" d="M202.2,375.4c-3.1,1-3.9-4.7-1-5,2.6-.3,3.1,4.3,1,5"/>
          <g>
            <path class="cls-74" d="M202.3,289c-.7,2.1-1.7,4-2.5,6-1.8-.3-1.9,1-2,1-.5.2.2-1.5-3,1.7-3.2,3.3-20.5,27.5-22.2,27.7-.3,0-5.1-2.5-5.2-2.7-1.4-3.1,0-30.7-2.7-32.2-.7-.4-3.6.9-3.2-1,2-.2,3.9.9,6,.5-.6,8.8-.2,18.2,6.7,24.5.4,0,3.6-3.9,4.2-4.5,6.8-6.2,12.8-13.3,19.5-19.5.9-.9,2.3-1.4,3-2.5.2.2,1.2.8,1.5,1Z"/>
            <path class="cls-74" d="M192.8,312c0,.9,0,1.8,0,2.7.2.5,1.1.9,1.5,1.2-4.8,6.4,6.8,10.2,2.7,9.5-.5,0-2-1.4-2.5-2,2.4,8.5,7.2,9.3,14.7,5.5,5-2.5-2.8,6-6.2,6.5-7.5,1-10.5-8.7-11.2-14.7-.3-2.5-.3-9.5,1-8.7Z"/>
            <g>
              <path class="cls-57" d="M245.3,273c2.5,7.4,10.1,15.3,18.5,18-2.1,4.4-4.6,8.6-7.5,12.5-3.7,4.9-16.4,18.3-22.7,17.5-5.6-.7-24-26-26.7-32.5,10.7-3.6,21.3-9.8,28.5-18.5-.3-2.1-1.6-5.9-2-8,5.7.6,8.9,9.1,12,11Z"/>
              <path class="cls-74" d="M206.8,288.5c2.8,6.5,21.1,31.8,26.7,32.5,6.3.8,19-12.6,22.7-17.5-1.8,6.5-15.1,23.1-21.7,23.5-9.4.6-16.7-11.6-21.2-17.5s-2.3-3.5-3-5.6c-.4-1.3-.5-1.8-1-3-1.1-2.5-1.4-4.2-1.5-4.4-1.2-2.2-2.5-4.5-3-7,.1,0-.5-.2,2-1Z"/>
              <g>
                <path class="cls-51" d="M190.8,272.5c-1.4-.2-1.7,4.5-2.5,7-2.7,9.1-10.1,26.8-10.5,28.2-.2.6-.2,2.3.5,2.2-.6.6-3.8,4.5-4.2,4.5-7-6.3-7.3-15.7-6.7-24.5,6.5-4,11.2-9.9,15.5-16,2.9-4.1,4.5-9.1,8.5-12.5-.3,3.1-1,8.1-.5,11Z"/>
                <path class="cls-57" d="M197.8,290.5c-6.7,6.2-12.7,13.3-19.5,19.5-.7,0-.7-1.6-.5-2.2.4-1.5,7.8-19.2,10.5-28.2q4.7,5.5,9.5,11Z"/>
                <path class="cls-18" d="M190.8,272.5c.6,4,3.6,6.9,6,10,.6.8,3.7,5.3,4,5.5-.7,1.1-2.1,1.6-3,2.5q-4.7-5.5-9.5-11c.8-2.5,1.1-7.2,2.5-7Z"/>
              </g>
            </g>
          </g>
          <g>
            <path class="cls-47" d="M213.3,309.9c.8,7-1.7,12.9-8.1,16.5.3,1.2,3.3-2.5,4,2.7-7.6,3.8-12.4,3-14.7-5.5.5.6,2,1.9,2.5,2,4,.7-7.5-3.1-2.7-9.5,1.1,1,10,4.6,10.7,4,1-.7-.7-3.4-.2-4.7.3-1,3-1.6,4-3,1.5-2.2.8-6.5,3-8.2.7,2.1,1.4,3.3,1.6,5.8Z"/>
            <path class="cls-47" d="M199.6,295.1c-3.2,8.1-2.3,3.5,2.5,2.5-5.5,4.2-3.9,6.8-3.2,13,5.6-11.8,6.3,5,7.2-7.2l4-2.7c.5,1.2,1.1,2.2,1.5,3.5-2.2,1.7-1.5,6-3,8.2-1,1.4-3.7,2-4,3-.4,1.4,1.2,4,.2,4.7-.8.6-9.6-3-10.7-4-.4-.3-1.3-.8-1.5-1.2,0-.9,0-1.8,0-2.7-.4-5.9,2.2-10.9,5-16,.1,0,.2-1.3,2-1Z"/>
            <path class="cls-71" d="M210.1,300.6l-4,2.7c-1,12.2-1.7-4.6-7.2,7.2-.7-6.2-2.2-8.8,3.2-13,2.4-.5,5.9,1,5.5-1,.1.2,1.4,1.5,2.5,4Z"/>
          </g>
          <path class="cls-74" d="M171,434.4s23,26,17,56.3c-3.3,16.3-25,26.7-35.6,27.9-17.4,1.9-21.4-4.2-21.4-4.2l19-81,21,1Z"/>
          <path class="cls-74" d="M274.7,427.7l-45.5-43.2-35.3,18.9s-4,12-27,24c-2.6,1.4-13,4-13,4l26,34s23-28,39-50c0,0,23.5,30.5,57.7,42.8l-2-30.5Z"/>
        </g>
        <path class="cls-19" d="M111.9,376.3s.8-22.8-5.2-26.5c-6-3.7-6.5,6.3-6.5,6.3,0,0,6.5,17.2,3.3,21l8.5-.8Z"/>
        <path class="cls-74" d="M280,384.4s-2.4-15.5-2.8-19.2c-1-9.1,9.3-16.5,9.6-25.7,0-.5.1-4.1-.2-4.1-.2,1.2-.4,2.5-.6,3.7-.9,6.2-14.8,14.8-13.8,21,2,13,3.7,12.5,1.8,25.2,2,.1,6-1,6-1Z"/>
        <g>
          <path class="cls-12" d="M140,490.1c2.8,11.9-2.8,5.3-9,8-54.5-5.6-112.8-64.3-126-116.2-4-15.8-8.4-46,6.5-57.2-32,65.2,59.6,165.9,128.5,165.5Z"/>
          <path class="cls-5" d="M141.5,498.6c-3.5,0-7-.1-10.5-.5,6.2-2.7,11.8,3.9,9-8,12.7,0,24.6-2.2,32-13.5-3,17.4-14.7,21.8-30.5,22Z"/>
          <g>
            <g>
              <path class="cls-8" d="M111.5,383.1c2,1,4.5,2.4,6,4,4,4.1,10.6,19.7,14.5,26,0,0,0,1.7.5,2.2,1.8,2.1,3.8,4.1,5.5,6.2,1.2,5.9,4.9,18.4-1.1,22.9-12.1,8.9-52.4-28.5-42-23,4.4,2.4,17.3-5.9,16.1-11.9.9-.1,5.3-1.8,5.5-2.8-.9-3.2-2.4-6.2-3.5-9.2-2.1-6-4.2-10.4-7.5-15.8-.4-.6.5-.7.5-.8,1.8.7,3.8,1.2,5.5,2Z"/>
              <path class="cls-46" d="M86,383.6c-.1,3.1,4.3,10.3,5.5,13.5.8,5.1-6.4,5.9-10.5,6-.9-2.4-3.7-9.5-4-10.5,1.7-3.9,5.1-7.2,9-9Z"/>
            </g>
            <g>
              <path class="cls-19" d="M113,397.6c1.1,3.1,2.6,6.1,3.5,9.2-.2,1-4.6,2.6-5.5,2.8-4.1.7-10.6-.4-14.2-2.5-6.7-3.9-3.5-5.4-5.2-10-1.2-3.2-5.6-10.4-5.5-13.5.1-3.5,3.7-5,5-8,.9-.2,2.3-1.2,3.2-1,11.3,7.2,9.5,23.6,18.8,23Z"/>
              <path class="cls-79" d="M91,375.6c-1.3,3-4.9,4.5-5,8-3.9,1.8-7.3,5.1-9,9-3-11.7,3.2-10.4,6.5-12.5,1.3-.8,1.9-1.9,2-2,2.3-1.2,2.7-1.8,5.5-2.5Z"/>
            </g>
          </g>
          <path class="cls-41" d="M85,369.6c11.1,7.5,3.5,2-4,3v-.5c-1.3-3.5-3.2-6.7-5-10,4,3.6,2,2.8,9,7.5Z"/>
          <path class="cls-8" d="M132,391.4c2.3,5.1,8.5,30.4,5,35-.8-1.4-21.6-40.6-19-38-3-3,7.9-6.4,6.3-8.1,4.7,5.1,6.8,9.2,7.7,11.1Z"/>
          <g>
            <path class="cls-61" d="M47,367.6c.7,1.7,1,1.7,2,3,0,0-.5.1,1.5,2,.7,9.1-2.4,10.4-9,15-1.3,0-3.4.2-4.5.5-5-1.5-7.5-1.7-12.5-4,1.5-.4.9-.9,1-2.5,3.5,2.9,13.4,2.9,9.5-2.5,2.7-1.7,3.1-2.1-.2-4.5-5.2-3.9-16.9-3.6-19.2-13.5,8.5-8.4,25.6-2.6,31.5,6.5Z"/>
            <path class="cls-86" d="M35,379.1c-.4-.5-5.9-3.7-6.8-4-9.9-3.3-4.6,5-2.8,6.5,0,1.6.5,2.1-1,2.5-8.9-4-18.2-13.9-9-23,2.4,9.9,14,9.6,19.2,13.5,3.3,2.4,2.9,2.8.2,4.5Z"/>
            <path class="cls-90" d="M35,379.1c3.9,5.4-6,5.4-9.5,2.5-1.8-1.5-7.2-9.8,2.8-6.5.8.3,6.4,3.5,6.8,4Z"/>
          </g>
          <g>
            <path class="cls-8" d="M125,381.1v.5c-.8,0-.9,1-1,1-2.1,1.6-4.6,2.6-6.5,4.5-1.5-1.6-4-3-6-4-1.6-1.3-11.9-11.6-12.8-11.5-2.8.5,3.6,3.8,7.2,9.5,0,0-.9.1-.5.8,3.3,5.4,5.4,9.8,7.5,15.8-9.3.6-7.5-15.8-18.8-23-.9-.2-2.3.8-3.2,1-2.8.7-3.2,1.3-5.5,2.5l-5-1.5c-1.2-2.2-4.8-3.3.5-4,7.5-1,15.1,4.5,4-3,8.1,2.3-9.5-11.8-11.5-11-11-9.8-34-8.4-26.5,9-5.9-9.1-23-14.9-31.5-6.5-9.2,9.1,0,19,9,23,5,2.3,7.5,2.5,12.5,4-.9.2-1.7,1-2.5,1.5-12.8,8.2,5.2,26.1,21.2,25,19.5-1.3,9.2-23.5-4.8-26.5-2.7-.6-6.7-.7-9.5-.5,6.6-4.6,9.7-5.9,9-15,7.3,6.9,21.4,9.2,31,8,.4,0,.8-.8,2-.5-3.3,2.1-9.5.8-6.5,12.5.3,1,3.1,8.1,4,10.5,4.2,11,2.5,13,13.9,18.4,11.2,3.6,29.7,26.6,41.8,17.6,6-4.4,2.5-11.6,1.2-17.5,1.6,2,4.7,5.2,6.5,7.5.1.2.9,1.1,1,1.2,4.4,5.5,9.2,10.7,13.5,16.2,3.2,4.1,10.2,11.2,12,15.5.9,2.2,1.4,4.7,1.5,7,.2,2.5,0,5-.5,7.5-7.4,11.3-19.3,13.4-32,13.5-68.9.4-160.5-100.3-128.5-165.5,13.2-10,33.4-.8,46.8,5.5,25.5,11.9,48,30.2,66.8,51Z"/>
            <g>
              <path class="cls-79" d="M85,369.6c-7-4.7-5-3.9-9-7.5,0-.1.2-1.3-2-2.5-.7-.7-.5-1-.5-1,2-.8,19.6,13.3,11.5,11Z"/>
              <path class="cls-8" d="M111.5,383.1c-1.7-.8-3.7-1.3-5.5-2-3.7-5.7-10.1-9-7.2-9.5.8-.1,11.1,10.2,12.8,11.5Z"/>
              <path class="cls-33" d="M85.5,378.1c-.1,0-.7,1.2-2,2-1.2-.3-1.6.4-2,.5,0-1.3-.4-2.9-1-4l5,1.5Z"/>
              <g>
                <path class="cls-87" d="M130.3,451.1c6.7-.5,16.9,4.7,20.8,10.2,10.4,15-7.6,26.8-23.8,15.2-12.9-9.2-9.5-24.7,3-25.5Z"/>
                <path class="cls-75" d="M131.3,467.1c6.8-1.6,13.4,11.9,2.5,8.5-4.2-1.3-6.9-7.4-2.5-8.5Z"/>
              </g>
              <g>
                <path class="cls-22" d="M40.5,356.1c8.4-3.6,7.6-19.5-9.5-25.5,12.2,1.7,22.4,11.8,17,21.2-.8,1.5-5.4,5.6-7.5,4.2Z"/>
                <g>
                  <path class="cls-56" d="M31,330.6c17.1,6,17.9,21.9,9.5,25.5-7.3,3.2-25.1-3.4-27.5-10.2-1.2-3.4-.7-10.2,2.2-12.8,4-3.5,10.9-3.2,15.8-2.5Z"/>
                  <path class="cls-37" d="M24.8,344.1c14.3,1.3,13.9,9.2,8,7-.5-.2-7.7-5.6-8-7Z"/>
                </g>
              </g>
              <g>
                <path class="cls-29" d="M63.3,414.6c23.8-3.2,36.5,26.9,8.5,25-22.1-1.5-25.6-22.7-8.5-25Z"/>
                <path class="cls-20" d="M60.3,428.6c3.1-.2,6.9.3,9.5,2,11.3,7.3-11.1,6.9-9.5-2Z"/>
              </g>
              <g>
                <path class="cls-30" d="M113,437.6c1.9,2.1-.5,1,0,2.8.5,1.7,4.2,4,3,10.5-.8,4.1-4.1,5.6-7.5,6.2,4.4-3.2-.8-8.9-5-7-1.6-6.9-12.8.3-6.5,4-2.4,1.5,0,1.7.5,2-2.6,2.9,2.6,1.9,3,4-4.4-.8-12.4-5.5-15-9.2-9.2-13.5,10.4-27.5,27.5-13.2Z"/>
                <path class="cls-30" d="M100.5,460.1c-.4-2.1-5.6-1.1-3-4,3.2,1.9,7.4,1.7,11,1,3.4-.7,6.7-2.1,7.5-6.2,1.2-6.5-2.5-8.8-3-10.5-.5-1.7,1.9-.7,0-2.8,14.4,11.9,4.7,25.7-12.5,22.5Z"/>
                <path class="cls-33" d="M108.5,457.1c-3.6.7-7.8.9-11-1-.6-.3-2.9-.5-.5-2,3,1.8,7.4,0,6.5-4,4.2-1.9,9.4,3.8,5,7Z"/>
                <path class="cls-85" d="M103.5,450.1c.9,3.9-3.5,5.8-6.5,4-6.3-3.7,4.9-10.9,6.5-4Z"/>
              </g>
            </g>
          </g>
          <g>
            <g>
              <path class="cls-98" d="M73.5,358.6s-.2.3.5,1c.1.1-.6.1,2,2.5,1.8,3.3,3.7,6.5,5,10-5.2,3-9.1-8.7-19.8-9.5-12.9-.9-9,10.1-12.2,8-1-1.3-1.3-1.3-2-3-7.5-17.4,15.5-18.8,26.5-9Z"/>
              <path class="cls-68" d="M76,362.1c-2.6-2.4-1.9-2.4-2-2.5,2.2,1.2,1.9,2.4,2,2.5Z"/>
            </g>
            <g>
              <path class="cls-50" d="M81,372.1v.5c-5.3.7-1.7,1.8-.5,4,.6,1.1,1.1,2.7,1,4-9.6,1.2-23.7-1.1-31-8-2-1.9-1.4-1.9-1.5-2,3.3,2.1-.6-8.9,12.2-8,10.7.8,14.5,12.5,19.8,9.5Z"/>
              <path class="cls-40" d="M58.8,370.1c2.9-1,11,2.2,12.2,5.8-5.8,2.2-17.7-3.8-12.2-5.8Z"/>
            </g>
          </g>
          <g>
            <path class="cls-49" d="M34.5,389.6l-.8,1.5h12.5c2,1.1,2.2,3,2.8,3.5-2.4,1.3-4.6,2.5-6.5,4.5-1.1,1.1-1.2.6-2,2.5-.9,2.2-1.8,2.1,0,5.5,3.3,6.1,16.8,7.4,22,2.8-.7-.5-.9-1.2-1-1.2,1.9-1,1.6-3.6,1.5-5.5-.3-7.4-5.9-12.4-12.8-14l.8-1c13.9,3,24.3,25.2,4.8,26.5-16.1,1.1-34-16.8-21.2-25Z"/>
            <path class="cls-11" d="M41.5,387.6c2.8-.2,6.8,0,9.5.5l-.8,1c6.8,1.6,12.4,6.6,12.8,14-7-.6-9.7-4.2-14-8.5-.5-.5-.7-2.4-2.8-3.5h-12.5l.8-1.5c.8-.5,1.6-1.3,2.5-1.5,1.1-.3,3.2-.4,4.5-.5Z"/>
            <path class="cls-11" d="M61.5,408.6c0,0,.3.8,1,1.2-5.2,4.7-18.7,3.3-22-2.8,3.3.8,4,2.4,7.5,2,6.1-.6,3.7-8.4-6-7.5h-1.5c.8-1.9.9-1.4,2-2.5,3.7-.8,17.6,7.8,19,9.5Z"/>
            <path class="cls-9" d="M63,403.1c0,1.9.4,4.5-1.5,5.5-1.4-1.7-15.3-10.3-19-9.5,1.9-2,4.1-3.2,6.5-4.5,4.3,4.3,7,7.9,14,8.5Z"/>
            <path class="cls-72" d="M42,401.6c-3.1,5.5.6.4,3.2,1,1.3.3,5.4,5.1,2.8,6.5-3.5.4-4.2-1.2-7.5-2-1.8-3.4-.9-3.3,0-5.5h1.5Z"/>
            <path class="cls-73" d="M48,409.1c2.7-1.4-1.4-6.2-2.8-6.5-2.6-.6-6.3,4.5-3.2-1,9.7-.9,12.1,6.9,6,7.5Z"/>
          </g>
        </g>
        <g>
          <g id="Background-3" data-name="Background" class="cls-93">
            <path class="cls-82" d="M201.3,380.8c11.5-8.8,18.6-6.8,20.4-7.4,4.9-1.4,3-10.6,13.7-11.8q14.5-12.9,29.1-25.8c3.9-9.8,17.9-18.3,28-20.5,2.4-.5,8.9-1.4,10.6,0,12.3,0,7,16.5,2.5,22.4-1.4,1.8-3.1,3.2-4.5,5q-27.4,24-54.7,47.9c-3.4,2.1-5.2-.5-7.4,3.1-1,1.6-2.5,9.8-7.6,15.6.5.7,1.7.5,2.6,1,.4.2,2.3,2.3,4.4,3.6q4.4,2.1,8.8,4.3c6.8,1.6,13.7,2,20.6,2.9.3,0,1.9.9,5.2,1.2,3.2.3,8.6-1.2,8.1,1.2,23.8-20.9,47.5-41.8,71.3-62.8q-44.5-50.5-88.9-101.1c-21.3,18.7-42.6,37.5-63.8,56.2,0,2.1-3.2,4-4.6,5.5-8.2,8.7-4,7-5.5,19.1,1.2,3.7,1.5,7.7,2.3,11.4.5,2.1,2.5,6.2,2.1,9.5,3.1,4.1,3.9,8.4,5.2,13.3,0,.4-.5,1.3.4,2.1.5,1.3.6,4.1,2,3.9Z"/>
            <path class="cls-94" d="M160.2,350.5c-12,10.6-24,21.1-36,31.7q44.5,50.5,88.9,101.1c6.5-5.7,12.9-11.4,19.4-17.1.5-5.5,7-10.4,10.1-14.7,4-5.4-2.4,0-1-4.7.2-.6,2.7-4.2,3.4-5.2,1.6-2.3,4-2.9.9-6.5.9-4.9-.8-2.5-4.9.8-.1,0-.2-.2-.4-.2-4.5,2.8-4.6,2.3-10,1.7,0,0,0-.4-.4-.4-5.2-.6-4.4.4-8.8,2.9-1.2,0-1.5-5.5-1.8-5.9-1.2-1.6-6.3,5.6-8.6,2-.2-.3-.2-1.8-.5-2-5.6,1.6-10.3,8.8-9.5,0-3.3,1.6-3.7.8-3.9.9-1.4.3-5.9,1.9-6.1,1.7-.2-.3.8-1.7,0-2.2-4.3,3.1-.4-1.9-1.1-2.4-1.6,0-6.3,5.4-7.4,4.1-.7-.8,2.1-3.7,1.7-4.4-.3-.6-1.6.6-1.7-.1,1.3-2.2,6.2-3.9,4.8-5.9-2.3.8-9.9,4.1-11.9,2.6-2.2-1.6-.6-4,0-6-.3-.9-1.2-.5-1.4-.8-.2-.2,1-4.6.7-5-.6-.7-3.7,2.5-2.5-1.2-2.1-2.1,1.3-3.7,1.7-5.8-7,1.9-4-.5-5.2-1.5-.6-.5-1.6.6-2-.1-.6-1,3.3-8.9-.1-6-.2-2.1,2.5-2.7,3.7-4,1.1-1.2,2.2-4.1.5-3-1,.6-5.9,7.3-2-1.5-1.3-3.2-5.5-.4-.7-8.4-.5-7.1,3-10.9,3.8-14,.3-.9-.3-4,2.3-7.5-3.8-11.6,2.4-10.6,3.9-18.7-1.2-1.9-5.6,5.9-7.4,3.4-.4-.5-.3-3.6-1.3-3.3-3.4,3-1.8,5.3-2.9,7.1-6.1,6.2-7.8,8.7-6.4-1.6Z"/>
            <path class="cls-97" d="M175.6,422.5c2.1-6.2,5.8-12.2,9.5-17.5,1.1-9.6,8.8-18.5,16.2-24.2-1.4.2-1.5-2.6-2-3.9-.9-.7-.3-1.7-.4-2.1-1.3-4.9-2.1-9.2-5.2-13.3.4-3.3-1.6-7.4-2.1-9.5-.9-3.8-1.1-7.7-2.3-11.4,1.4-12.2-2.7-10.4,5.5-19.1,1.4-1.5,4.6-3.4,4.6-5.5-13.1,11.5-26.2,23-39.3,34.5-1.5,10.3.3,7.9,6.4,1.6,1.1-1.8-.5-4.1,2.9-7.1,1-.3,1,2.8,1.3,3.3,1.7,2.5,6.2-5.3,7.4-3.4-1.5,8.1-7.7,7.1-3.9,18.7-2.6,3.5-2,6.6-2.3,7.5-.9,3.1-4.3,6.8-3.8,14-4.8,8-.6,5.2.7,8.4-3.9,8.8.9,2.1,2,1.5,1.7-1,.7,1.9-.5,3-1.2,1.3-3.9,1.9-3.7,4,3.4-2.8-.5,5,.1,6,.4.7,1.5-.3,2,.1,1.1,1-1.9,3.4,5.2,1.5-.4,2.1-3.7,3.6-1.7,5.8-1.2,3.7,1.9.4,2.5,1.2.3.3-.9,4.7-.7,5,.2.3,1.1-.1,1.4.8Z"/>
            <path class="cls-97" d="M232.6,466.1c16.1-14.2,32.2-28.4,48.4-42.6.5-2.5-4.8-.9-8.1-1.2-3.3-.3-4.9-1.2-5.2-1.2-6.9-.9-13.8-1.2-20.6-2.9q-4.4-2.1-8.8-4.3c-2.1-1.3-4-3.4-4.4-3.6-.9-.5-2.1-.3-2.6-1-4.6,5.2-12.8,9.6-19.3,11.9-2.3.8-11.6,3.2-10.8,1,0,0-.4-.1-.8,0-1.2.5-2.1.6-3.4.8-.2,0-1.6-.2-3.3.2-1.1.3-4.5,1.8-6.4,2.5,1.4,2-3.5,3.7-4.8,5.9.1.7,1.3-.5,1.7.1.4.6-2.4,3.6-1.7,4.4,1.2,1.2,5.9-4.2,7.4-4.1.8.5-3.1,5.5,1.1,2.4.8.4-.3,1.9,0,2.2.2.2,4.7-1.3,6.1-1.7.2,0,.6.7,3.9-.9-.8,8.9,3.9,1.7,9.5,0,.3.2.3,1.7.5,2,2.2,3.6,7.3-3.6,8.6-2,.3.4.6,5.9,1.8,5.9,4.4-2.5,3.5-3.5,8.8-2.9.4,0,.3.4.4.4,5.4.6,5.4,1.2,10-1.7.1,0,.3.2.4.2,4.1-3.3,5.9-5.7,4.9-.8,3.1,3.5.6,4.2-.9,6.5-.7,1-3.2,4.6-3.4,5.2-1.4,4.8,5-.8,1,4.7-3.1,4.2-9.6,9.1-10.1,14.7Z"/>
            <path class="cls-1" d="M231.3,409.4c5.1-5.8,6.6-14,7.6-15.6,2.2-3.6,4-1,7.4-3.1q27.4-24,54.7-47.9c1.4-1.7,3.2-3.2,4.5-5,4.5-5.9,9.9-22.3-2.5-22.4,2.6,2.3,1.9,5.3.9,8.3-2.5,8.3-10.3,19.5-18.9,22.4q-16,14.1-32.1,28.2c-6.2,1.9-2.5,5.6-8.3,9.7-4.8,3.4-7.5-.4-11.6,6.6-.8,1.4-2.5,6.2-4.4,9.7-.3.6-.8.9-.9,1-.1.2-.4,1.6-.6,2-3.3,5.1-8.1,9.7-13.1,13-2,1.3-10.8,5.7-12.9,6-.9,2.2,8.5-.2,10.8-1,6.5-2.3,14.7-6.7,19.3-11.9Z"/>
          </g>
          <g>
            <path class="cls-3" d="M209.5,401.1c-.1-.1-.2-.3-.4-.4-1.2-1.5-2.4-3-3.7-4.5-.6-.7-1.5-1.4-2.2-2,7.9-6.2,16.8-11.2,25-16.9.5,0,.6.3.8.5-.4-2.1-3.1,1.5-2.9-.3-.7.5-1.7.9-2.4,1.4-6.4,4.3-12.8,8.4-19,12.9-.8.6-1.7,1.2-2.4,1.9l7.2,7.4Z"/>
            <g>
              <path class="cls-91" d="M179.4,426.8c0,0,6.5-.3,17.3-7.9.9-.7.7-2.3.8-2.4.3-.6,1.2-1,.7-1.3-3.2,2.3-15.3,8.8-15.7,7.9.2-.8.9-.9,1.4-1.4-.6-.5,2.2-4,3.1-6.1,0-.4-.2,0-.6.3-1.9,1.4-3.4,3.4-5.5,4.6,2.9-5.2,5.8-10.4,9.4-15.2,2-2.7,2-3,4.6-5.5.9-.9,1.7-2,2.8-2.7,5.8-4-1.4,4.4-2.6,5.7,1.5-.5,3.2-2.5,3.8-2.9.2-.1.6.2.6.2,1.3-.8,3-3.6,3.9,1.5.4,2.4-.4,4.6-.3,4.9.2.5,2.7,1.1,1.5,3.1,3-1.7,3.4-5.6,5.1-8.1,0,0-.2-.2-.2-.3l-7.2-7.4c-7.8-.4-14.8,15.9-19.4,21.5-6.7,8.1-12.9,9.8-12,10.3,1.2-.1,6.8,1.5,8.4,1.4Z"/>
              <path class="cls-42" d="M197.5,418.7c4.7-2.6,9.5-5.6,12.6-10.2.9-1.4,1.4-3.1,1.7-3.7,0,0-.4,0,.4-1.1q10-10.9,20-21.7l-.2-.3c-6.7,6.9-13.2,14.4-19.7,21.7l-1.2.4c-.4-.8-.9-1.7-1.4-2.5-1.7,2.6-2.1,6.4-5.1,8.1-.6,1.1-5.1,4.7-6.5,5.7.5.3-.4.7-.7,1.3,0,.1,0,1.5-.8,2.4-5.1,2.5-9.7,5.8-15.1,7.6-.1,0,11.5-5.4,15.9-7.8Z"/>
              <path class="cls-87" d="M198.1,415.2c1.4-1,5.9-4.6,6.5-5.7,1.2-2-1.3-2.6-1.5-3.1,0-.2.7-2.5.3-4.9-.9-5.1-2.5-2.3-3.9-1.5,0,0-.4-.3-.6-.2-.6.4-2.3,2.4-3.8,2.9-.4.4-.9.9-1.1.7,0,0-.5.4-.1.6q2.3-1.6,4.7-3.3c2.8,4.3-3.3,10-6.5,13.3-2.4,2.5-5.6,5.4-8.3,7.7-.5.5-1.2.6-1.4,1.4.4.9,12.5-5.6,15.7-7.9Z"/>
              <path class="cls-75" d="M183.9,421.8c2.6-2.4,5.9-5.3,8.3-7.7,3.2-3.3,9.3-9,6.5-13.3q-2.3,1.6-4.7,3.3c-.4-.2,0-.5.1-.6.7-1.8,3.2-3.8,2.6-4l-1.8.3c-2.6,2.5-2.6,2.8-4.6,5.5,5-2.4,3.9-1-.3,5-1.1,1.6-3.9,4.8-3.6,5.6.4-.3.6-.6.6-.3-.9,2.2-3.8,5.7-3.1,6.1Z"/>
              <path class="cls-88" d="M186.4,415.9c-.3-.8,2.5-4,3.6-5.6,4.1-6.1,5.2-7.4.3-5-3.5,4.8-6.4,10-9.4,15.2,2.1-1.2,3.6-3.1,5.5-4.6Z"/>
              <path class="cls-75" d="M195.1,402.7c1.2-1.3,8.4-9.7,2.6-5.7-1.1.7-1.9,1.8-2.8,2.7l1.8-.3c.5.2-1.9,2.2-2.6,4,.1.2.7-.3,1.1-.7Z"/>
            </g>
            <path class="cls-1" d="M209.2,400.7c7.9-6.1,14-14.3,21.3-21.1.1-.4-.1-.5-.2-.6-.5.5-1.3-.1-1.6,0-2.1.6-19.5,14.7-23.2,17.3,1.3,1.4,2.5,2.9,3.7,4.5Z"/>
            <path class="cls-80" d="M205.5,396.2c3.7-2.6,21.1-16.7,23.2-17.3.3,0,1.1.5,1.6,0-.1-.3-.9-.9-1.2-1.1-.2-.1-.3-.6-.8-.5-8.3,5.7-17.2,10.7-25,16.9.7.6,1.6,1.3,2.2,2Z"/>
            <path class="cls-1" d="M241.7,371.1c-1-1.1-2-2.3-3-3.4l-1.7,2.2c1.6,1.9,2.5,3.1,4.7,1.2Z"/>
            <path class="cls-80" d="M237,369.9l1.7-2.2c-.5-.5-.7-.5-.7-.6-1.9,1.1-2.2,1.3-.9,2.8Z"/>
            <g>
              <path class="cls-81" d="M232.3,382c1.6.9,2.7.2,3.9-1,.1-.6.3-1.2.7-1.6.6-.7,1.3,0,2-.3,1.1-.6,1.2-1.5,1.3-1.6.8-.6,1.1-.5,1.2-.6,1.1-.9,2.2-2.5,3.2-3.4-.1-.2-2.5-2.4-3-3-2.2,1.9-2.9,1.3-4.6-.6-1.2-1.5-1-1.6.9-2.8,0,0,.1-.3-.5-.8,0,0-.8,0-.9.2-.5.3-1.1,1-1.8,1.8,0,0-1.5,0-1.4,2-3,.1-.6,3.6-4,3.1-2.1.8-1.6,3-1.7,3.2-.2.3-.9.6-1.4,1-.2,1.8,2.6-1.8,2.9.3.3.2,1.1.8,1.2,1.1,0,.1.3.2.2.6-7.3,6.8-13.3,15-21.3,21.1.1.1.2.3.4.4,0,0,.2.2.2.3.5.7,1.1,1.6,1.4,2.5l1.2-.4c6.5-7.3,13-14.8,19.7-21.7l.2.3Z"/>
              <g>
                <path class="cls-1" d="M230.2,374.5c1.8,1.6,4.8,3.8,2.3,4,.2.2,1.4,2,1.9,2.8,3,0-1-6.7-4.2-6.7Z"/>
                <path class="cls-80" d="M236.2,375.7l.3-2.4c-.6-.6-2.4-2.8-3.4-2.3-1.5.7,2.4,4,3.1,4.7Z"/>
                <path class="cls-80" d="M232.5,378.5c2.5-.2-.6-2.4-2.3-4-3.7,0,1.2,2.9,2.3,4Z"/>
                <path class="cls-1" d="M236.4,373.3l-.3,2.4c.7.7,2,3.2,2.9,1.8.5-.8-2.1-3.6-2.6-4.2Z"/>
                <path class="cls-80" d="M234.3,370c0,.2,1.5.8,2,1.2.4.3.9,1.2,1.2,1.4,2.6,1.6-1-4.1-2.5-3.5-.2,0-.8.7-.7,1Z"/>
                <path class="cls-26" d="M234.1,376.7c0,.2.4.4.5.2.1-.3-.5-.6-.5-.2Z"/>
              </g>
            </g>
            <g>
              <path class="cls-84" d="M238.6,368.5c1,1.1,2.3,1.3,3.2,2.5.5.6,2.8,2.6,2.9,2.7,5.3-4.5,10.9-8.8,16.2-13.4,37.1-32.2,71.4-66.8,106.9-100.3,3-3.1,4-4.8,5.5-6.6-1.5,0-3.1,1-4.9,2.2q0,1.1,0,2.1c-37.4,32.2-70.9,68.4-108.5,100.3-1.9,1.6-15.6,12.8-16.3,12.7-.4-.3-.6-.8-1-1.2-.8-.6-1-1.7-1.6-2.4-.3-.3-.5-.7-.8-1-.1-.1-1.1-.8-1.6-.6-.2.2-1.8.8-2,1,.7.4,1.4.6,1.4.6,0,0,.1.8.6,1.4Z"/>
              <path class="cls-78" d="M260,358c-1.9,1.6-15.6,12.8-16.3,12.7-.4-.3-.6-.8-1-1.2-.8-.6-1-1.7-1.6-2.4,11.9-12,24.9-22.8,37.6-34,6.3-5.5,12.8-10.8,19.1-16.4,3.5-3.1,11.5-10.3,12.3-12.1-4.3,3.6-8.7,7.2-13,10.8-6.3,5.3-12.6,10.6-18.9,16-13,11.1-26.5,22.3-37.9,34.8-.1-.1-1.4-.6-1.9-.4.4-.8,2.5-3.1,3.2-3.8,20.5-20.3,58.5-51.6,81.8-70.6,8.4-6.8,34.9-28.1,41.4-32.9,1.1-.8,2.7-2.2,3.8-2.9v2.1c-37.3,32.2-70.8,68.4-108.5,100.3Z"/>
              <g>
                <path class="cls-14" d="M241.1,367.1c11.9-12,24.9-22.8,37.6-34-1,0,.4-1.3-.5-1.8-13,11.1-26.5,22.3-37.9,34.8.3.3.6.6.8,1Z"/>
                <path class="cls-31" d="M278.6,333.1c6.3-5.5,12.8-10.8,19.1-16.4l-.7-1.4c-6.3,5.3-12.6,10.6-18.9,16,.9.5-.5,1.7.5,1.8Z"/>
                <path class="cls-54" d="M297.7,316.7c3.5-3.1,11.5-10.3,12.3-12.1-4.3,3.6-8.7,7.2-13,10.8l.7,1.4Z"/>
              </g>
            </g>
          </g>
        </g>
        <g>
          <g>
            <path class="cls-4" d="M254.4,365.9c-.1.6-1.2.8-1.2,1-.5,2.9,5.3,4.6-2.4,20.7-2.3,4.8-4.6,7.6-7.9,11.7-.9,1.2-8.8,8.7-8.2,9.6,20.2,12.6,76.1,38.2,87.5,7.1-.4,6.1-.8,12.5-2.5,18.4-1.2,4.2-3,8.2-6.7,10.9-13.1,9.9-40.8-3.4-53.2-10.7-3.3-2-24.1-16.5-27.2-19-11.2-9.1-11.6-11.2-9.3-25.7,1.4-.5,4.2,3.6,7.3,5.5,4.3-4.7,18.1-10,19.9-14.8.3-.9,1.7-13.1,1.7-14.2.9-.5,1.2-.5,2.2-.6Z"/>
            <path class="cls-65" d="M319.9,380.1c1.5,13.4,3.2,21.5,2.2,36.1-11.4,31.1-67.3,5.4-87.5-7.1-.5-1,7.3-8.5,8.2-9.6,3.8,1.9,4.2.8,4.4.8,10.6,2.5,21.2,4.3,31.8,6.6,3.4.7,7.3,1.3,9.8,1.9,7.2,1.7,14.7,3.2,21.1,6.9-4.3-6.3-12.2-8.1-18.8-11,7.4-12,17-17.2,28.6-24.5Z"/>
            <path class="cls-15" d="M319.9,380.1c-11.6,7.4-21.2,12.5-28.6,24.5-.8,1.3-2.1,2.5-2.3,4.1-2.6-.6-6.4-1.1-9.8-1.9-2.1-4.2-2.7-11.6-3.8-14.5,10-1.2,14.1-2,23.4-5.2,7.5-2.6,14.3-5.8,21.2-9.7,0,.2-.1,1.3,0,2.5Z"/>
            <path class="cls-15" d="M289,408.7c.2-1.7,1.5-2.8,2.3-4.1,6.6,2.8,14.4,4.7,18.8,11-6.4-3.7-13.9-5.2-21.1-6.9Z"/>
            <g>
              <path class="cls-65" d="M252.3,366.6c0,1.1-1.4,13.3-1.7,14.2-1.8,4.8-15.5,10-19.9,14.8-3.1-1.8-5.9-6-7.3-5.5.3-2.1.8-4.3,1.2-6.4,15.5,10.5-1,.6,2.3-5.2,16.9,9.3,14.4,4.3-.5-1.6.1-.5.2-1,.3-1.5,0-.3.1-.7.2-1,.8-.7.6-1.3.9-1.9,5.8,1.3,11.3,5,17.7,5.7-12.7-8.6-18.6-2.2-9.7-11.8,18.7,14.6,13.3,7.3-.4-3.1l.6-4.5c2.1-2.4,2.4-1.6,3.5-2.4,2.5-1.9-2.4-4.7,10.3.5-.1-6.6,2.4,3.8,2.5,9.6Z"/>
              <path class="cls-4" d="M224.6,383.6c0-.2,0-.3,0-.5.3-1.4,1.2-4.3,1.7-6.3,14.8,5.9,17.3,10.9.5,1.6-3.3,5.8,13.2,15.6-2.3,5.2Z"/>
              <path class="cls-27" d="M227.7,372.5c2-4.4,5.8-7.4,6.4-12.3.9-1.3,1.7-1.3,1.8-1.4l-.6,4.5c13.7,10.4,19.1,17.8.4,3.1-8.9,9.6-3,3.2,9.7,11.8-6.5-.7-11.9-4.4-17.7-5.7Z"/>
              <path class="cls-27" d="M243.3,361.8c5.9,6.3,5.2,9.5-.4.7v-.5q.2,0,.4-.2Z"/>
            </g>
          </g>
          <g>
            <path class="cls-57" d="M319.9,377.5c-6.9,3.8-13.7,7.1-21.2,9.7-4.1-.5-12.2-1.1-15.4-1.9-.9-.2-2.2-.6-2.8-1.5,3-.6,3.8-1.1,4.3-1.2,12-3.1,24.3-7.2,33.6-15.9,0,.1,1.2.5,1.6,2.1.1,2.5-.3,7.6-.2,8.9Z"/>
            <path class="cls-51" d="M298.7,387.2c-9.3,3.2-13.4,4-23.4,5.2-.2-.6-1.5-.3-2.2-1.9,12.5,0,13.8,1.3,10.2-5.2,3.2.8,11.3,1.4,15.4,1.9Z"/>
            <path class="cls-57" d="M283.3,385.2c3.7,6.5,2.3,5.1-10.2,5.2-.6-1.6-.9-3.3-1.6-4.9,3-.4,6-1.2,9-1.8.5.9,1.8,1.3,2.8,1.5Z"/>
          </g>
        </g>
        <g>
          <path class="cls-19" d="M83.2,378.2c0,1-3.9,9.3-5.2,9.1-2.6-7.3-5.5-11.7-1.6-19.6,2.7-5.4,9.4-8.2,9.5-8.1.8.3,5-1.7,5.2-1.6.1,0,.3.2.4.2-1.4,1.1,6,2,4,7.1-2,5.1-12.9,6.4-14.1,8.7-.9,1.7,1.7,3.8,1.7,4.1Z"/>
          <path class="cls-24" d="M99.3,370.1c-.4,0-7.8,2.2-8.3,2.5-2.7,2-2.3,3.3-2.5,3.5-1.7,1.4-2.5,2-5.3,2.2,0-.3-2.6-2.4-1.7-4.1,1.2-2.3,12.1-3.6,14.1-8.7,2-5.1-5.4-6-4-7.1,2.2.2,6.1,2,7.2,4.1,1.7,3.1-1.1,7.3.5,7.7Z"/>
          <path class="cls-53" d="M93.7,414.6c-7.4-5.5-12.5-18.3-15.6-27.2,1.2.1,5.2-8.2,5.2-9.1,2.8-.2,3.5-.7,5.3-2.2,9.7,13.5-8.2,15.1,4.5,23.5-2.5,5.7-2,9.7.7,15Z"/>
          <g>
            <path class="cls-19" d="M105.2,374c-1.6,1.1-1.8,3.3-2,3.5-.5.4-4.3,1.6-5.3,2.8l6.9,1.6c2.6,4.9,12.4,14.2,13.4,23.1.1,1,.2,1.9,0,2.9-3.5,7-13,13-20.9,9.5-2.2-1-2.9-2.1-3.7-2.7-2.7-5.4-3.1-9.4-.7-15-12.8-8.4,5.2-10-4.5-23.5.2-.2-.2-1.5,2.5-3.5.5-.3,7.9-2.5,8.3-2.5.1,0,.6.6,2,0,1,1.2,2.6,3,3.8,3.9Z"/>
            <path class="cls-44" d="M104.8,381.8l-6.9-1.6c.9-1.2,4.8-2.3,5.3-2.8.8,1.4.8,2.9,1.6,4.3Z"/>
            <path class="cls-58" d="M106.9,388.7q3.1,5.4,6.3,10.7c-13.2,6.2-19.9,9.5-2.6-1.5-2.1-9.7-19.9-2.2-3.7-9.3Z"/>
          </g>
        </g>
        <g>
          <path class="cls-13" d="M271,24.6c.3-1.3.5-.2,1.4.2,0-1.3,3.7-2.2,5-4.8-1.6-2.1-12.3-7.9-13.1-7.8-8.5.5,6.1,11.8,6.7,12.4Z"/>
          <path class="cls-43" d="M150.5,62.9c-.3,1.8-.7,3.6-.9,5.5-1.4,10.5-4.1,12.2,3.8,7,.6-.4.6-4.3,13.1-4.8,20.5-.9,51.5,10.3,70.4,18.8,14.9,6.7,28.6,14.8,41.7,24.6-.1-1.9-.6-2.8,1.8-2.5-1.7-3.1-7.5-8.9-10.2-10.9-13.4-9.7-49.9-24.1-66.4-28-18.5-4.3-42.3-2.8-39.1-14.6,2.7-9.8,13.5-7.8,10.2-10.6-4.5,0-7.9.7-12.2,1.5-4.2.7-7.9,3.2-9.2,2.7-3.1-5.6-7.8-10.8-5.9-17.5.8-2.7,4.1-4.3,4.3-4.6.8-1.4.9-1.2.9-1.3.3-.4-2.4-.1,4.6-6.6,7.7-5.9,15.2-11.4,23.8-16.1.3-.2,1.7,1,1.7-1.8v-.7c-16,10.6-51.4,26.5-30,49.5,0,1-1.6,5.2-2.5,10.5Z"/>
          <path class="cls-69" d="M192.6.9c5.1,5.2,11.8,4.3,18.9,6.7,21.7,7.3,43.2,17.8,40.8,44.1,3,1,4.1,4.2,7.3,6.9,2.9-3.2,21.4-9.5,22.4-12.1.7-1.8-1.4-5.7,2-7.8-4.3-4.8-8.7-9.5-13.1-14.2-.6-.6-15.2-11.9-6.7-12.4.8,0,11.5,5.8,13.1,7.8,3.8-7.5-3.4-15.9-11.4-13.9-6.7,1.7-3.3,11.7-5.5,11.8C243.6,9.6,210.7,1.3,192.6.9Z"/>
          <path class="cls-69" d="M185.5,1.1c-.8.5-1.6,1.2-2.4,1.7v.7c14.3,18.7,47,40.2,69.3,48.2,2.4-26.3-19.1-36.9-40.8-44.1-7.2-2.4-13.8-1.4-18.9-6.7-2.3,0-4.8.5-7.1.2Z"/>
          <path class="cls-2" d="M271,24.6c4.5,4.6,8.8,9.4,13.1,14.2,8.3,9.1,15.2,16.6,22.2,27,0,.1,1.3-.4,2.6,1.5,6,9.1,8.9,20.7,9.5,31.5,4.4,3.3,15,24.5,18.5,7.3.1-3.6-1.6-8.9-2.8-12.4-6.1-17.2-45.1-61.4-61.7-68.8-.9-.4-1-1.5-1.4-.2Z"/>
          <path class="cls-13" d="M181.3,5.4c-3.2,8.9-2.7,13.6-.9,22.4,1.4,6.9,5.2,13.5,7.2,20.2,43.5,5.3,81.5,33.9,114,61.3,1.2,1.1.6,2.2.7,2.2.2.2.8-.9,2.4.4,3.8,3.2,7.5,8.7,8,9.1,3.4,2.4,9.6,4.1,13.6,3,7.6-2.1,10.5-10.9,10.7-17.9-3.5,17.2-14.1-4-18.5-7.3-.7-.6-11.8-6.2-16.1-9-21.6-14.1-22.5-14.6-42.7-31.1-3.2-2.6-4.3-5.9-7.3-6.9-22.3-8-55-29.5-69.4-48.2,0,2.9-1.4,1.7-1.7,1.8Z"/>
          <path class="cls-67" d="M303.9,139.2c4.3-6.1,6.8-10.7,8.7-18.3-.5-.4-4.2-5.9-8-9.1-1.5-1.3-2.1-.2-2.4-.4-7.8,8.3-11.9,5.3-21.8-.1-2.5-.3-1.9.6-1.8,2.5,8.1,6,21.8,16.3,25.3,25.4"/>
          <path class="cls-34" d="M203.8,72.5c16.6,3.9,53.1,18.3,66.4,28,3.5-.5,9.7-3.8,6.6-8-1.9-2.6-47.9-30.5-55-33.1-18.3-6.7-43.6-7.8-25.9,1-9.2,5.1,2.6,5.3,7.8,12.2Z"/>
          <path class="cls-43" d="M187.5,47.9c-4.7-.6-7.8-.8-12.6-.7,3.3,2.8-7.6.8-10.2,10.6-3.2,11.8,20.6,10.3,39.1,14.6-5.2-6.9-17-7.2-7.8-12.2-17.8-8.8,7.5-7.7,25.9-1,7.1,2.6,53.1,30.5,55,33.1,3.1,4.3-3.1,7.5-6.6,8,2.7,1.9,8.4,7.8,10.2,10.9,9.9,5.4,14,8.5,21.8.1,0,0,.6-1.2-.7-2.2-32.5-27.4-70.5-56-114-61.3Z"/>
          <path class="cls-2" d="M152.8,28.1c0,0,0-.1-.9,1.3q5.4,9.7,10.8,19.4c4.4-.8,7.7-1.4,12.2-1.5,4.7,0,7.9.1,12.6.7-2-6.7-5.8-13.3-7.2-20.2-9.2,1.1-18.4,2.1-27.5.3Z"/>
          <path class="cls-69" d="M152.8,28.1c9.1,1.8,18.4.8,27.5-.3-1.8-8.8-2.3-13.5.9-22.4-8.6,4.7-16.1,10.2-23.8,16.1-7,6.5-4.4,6.3-4.6,6.6Z"/>
          <path class="cls-13" d="M162.7,48.7q-5.4-9.7-10.8-19.4c-.2.3-3.5,1.9-4.3,4.6-1.9,6.8,2.7,11.9,5.9,17.5,1.4.6,5.1-2,9.2-2.7Z"/>
          <path class="cls-69" d="M284.1,38.7c-3.4,2-1.3,6-2,7.8-1.1,2.6-19.5,8.9-22.4,12.1,20.2,16.5,21.1,16.9,42.7,31.1,7.7-6.5,6.6-15.3,4-24-7-10.3-13.9-17.8-22.2-27Z"/>
          <path class="cls-2" d="M306.3,65.7c2.5,8.6,3.7,17.5-4,24,4.3,2.8,15.4,8.5,16.1,9-.6-10.8-3.5-22.4-9.5-31.5-1.3-1.9-2.5-1.3-2.6-1.5Z"/>
          <path class="cls-96" d="M271.7,125.4"/>
        </g>
        <path class="cls-1" d="M204.1,403c-1-1.1-2-2.3-3-3.4l-1.7,2.2c1.6,1.9,2.5,3.1,4.7,1.2Z"/>
        <path class="cls-80" d="M199.4,401.8l1.7-2.2c-.5-.5-.7-.5-.7-.6-1.9,1.1-2.2,1.3-.9,2.8Z"/>
      </g>
    </g>
  </g>
</svg>`
        };


         // Function to load content into the div
         function loadContent(globalData[i].category_name) {
            const contentDiv = document.getElementById('character');
            
            if (contentDict[globalData[i].category_name]) {
                contentDiv.innerHTML = contentDict[key];
                console.log(`Content loaded for key: ${globalData[i].category_name}`);
            } else {
                contentDiv.innerHTML = '<p>No content available for this section.</p>';
                console.log(`No content found for key: ${globalData[i].category_name}`);
            }
        }


        
        
        let questionTimeRemaining = time_per_question * 10; // Convert to tenths of a second
        let answerTimeRemaining = time_per_answer * 10; // Convert to tenths of a second
        
        showQuestion(globalData[i].text);

        while (questionTimeRemaining > 0) {
            if (!pauseFlag) {
                await delay(100);
                continue;
            }
            await delay(100); // Update ten times a second
            questionTimeRemaining--;
            let question_seconds = Math.floor(questionTimeRemaining / 10);
            let question_tenths = questionTimeRemaining % 10;
            document.getElementById("demo").innerHTML = 'Q' + (i + 1) + ' - ' + globalData[i].category_name.toUpperCase() + ' - ' + globalData[i].difficulty_name.toUpperCase() + ' - Mark Mazurek - ' + question_seconds + '.' + question_tenths + 's';
            console.log(question_seconds,question_tenths);
        }
        showQuestion(""); // Clear question display
        showAnswer(globalData[i].answer);

        while (answerTimeRemaining > 0) {
            if (!pauseFlag) {
                await delay(100);
                continue;
            }
            await delay(100); // Update ten times a second
            answerTimeRemaining--;
            let answer_seconds = Math.floor(answerTimeRemaining / 10);
            let answer_tenths = answerTimeRemaining % 10;
            document.getElementById("demo").innerHTML = 'Q' + (i + 1) + ' - ' + globalData[i].category_name.toUpperCase() + ' - ' + globalData[i].difficulty_name.toUpperCase() + ' - Mark Mazurek - ' + answer_seconds + '.' + answer_tenths + 's';
            console.log(answer_seconds, answer_tenths);
        }
        showAnswer(""); // Clear answer display
    }
    game_started = false;
    pauseFlag = false;
    showQuestion("Thanks for playing!");
    progressBar.style.animationPlayState = "paused";
    // isPaused = true;
    document.getElementById('start-pause').textContent = 'START GAME';
    document.getElementById("demo").innerHTML = 'Press START GAME to play again. Brought to you by MARKADE GAMES and CREATIVENDEAVORS Copyright &copy; 2024. Contact us at mark.mazurek@triviolivia.com';
};



// Function to pause the game
function pauseGame() {
    pauseFlag = true;
}

// Function to resume the game
function resumeGame() {
    pauseFlag = false;
    mainGameFunction(); // Resume execution
}

//Functions to disable and enable category, difficulty, era
function disable_category(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        category_list.push(clicked_id);
        console.log(category_list);

    } else {
        console.log(category_list);
    }
}

function enable_category(clicked_id) {
    if (!category_list.includes(clicked_id)) {
        console.log(category_list);

    } else {
        category_list.splice(category_list.indexOf(clicked_id), 1);
        console.log(category_list);
    }
}

function disable_difficulty(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        difficulty_list.push(clicked_id);
        console.log(difficulty_list);

    } else {
        console.log(difficulty_list);
    }
}

function enable_difficulty(clicked_id) {
    if (!difficulty_list.includes(clicked_id)) {
        console.log(difficulty_list);

    } else {
        difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
        console.log(difficulty_list);
    }
}

function disable_era(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        era_list.push(clicked_id);
        console.log(era_list);

    } else {
        console.log(era_list);
    }
}

function enable_era(clicked_id) {
    if (!era_list.includes(clicked_id)) {
        console.log(era_list);

    } else {
        era_list.splice(era_list.indexOf(clicked_id), 1);
        console.log(era_list);
    }
}

//Functions for ALL/NONE buttons
function allNoneCategoriesButton() {
    if (all_none_categories == true) {
        for (var i = 0; i < categoryButtons.length; i++) {
            categoryButtons[String(i)].classList.remove('active');
            categoryButtons[String(i)].classList.add('inactive');
            disable_category(String(i+1));
            document.getElementById("demo").innerHTML = 'You must select at least one category before starting the game.';
        }
        all_none_categories = false;
    } else {
        category_list = [];
        for (var i = 0; i < categoryButtons.length; i++) {
            categoryButtons[String(i)].classList.remove('inactive');
            categoryButtons[String(i)].classList.add('active');
            enable_category(String(i+1));
        }
        all_none_categories = true;
        document.getElementById("demo").innerHTML = 'You have enabled all categories.';
    }
    console.log(categoryButtons);
}

function allNoneDifficultiesButton() {
    if (all_none_difficulties == true) {
        for (var i = 0; i < difficultyButtons.length; i++) {
            difficultyButtons[String(i)].classList.remove('active');
            difficultyButtons[String(i)].classList.add('inactive');
            disable_difficulty(String(i + 1));
            document.getElementById("demo").innerHTML = 'You must select at least one difficulty before starting the game.';
        }
        all_none_difficulties = false;
    } else {
        difficulty_list = [];
        for (var i = 0; i < difficultyButtons.length; i++) {
            difficultyButtons[String(i)].classList.remove('inactive');
            difficultyButtons[String(i)].classList.add('active');
            enable_difficulty(String(i + 1));
        }
        all_none_difficulties = true;
        document.getElementById("demo").innerHTML = 'You have enabled all difficulties.';
    }
}

function allNoneErasButton() {
    if (all_none_eras == true) {
        for (var i = 0; i < eraButtons.length; i++) {
            eraButtons[String(i)].classList.remove('active');
            eraButtons[String(i)].classList.add('inactive');
            document.getElementById("demo").innerHTML = 'You must select at least one era before starting the game.';
            disable_era(String(i + 1));
        }
        all_none_eras = false;
    } else {
        category_list = [];
        for (var i = 0; i < eraButtons.length; i++) {
            eraButtons[String(i)].classList.remove('inactive');
            eraButtons[String(i)].classList.add('active');
            enable_era(String(i + 1));
        }
        all_none_eras = true;
        document.getElementById("demo").innerHTML = 'You have enabled all eras.';
    }
}

// Slider functions
const questionSlider = document.getElementById('questionSlider');
const perQuestionSlider = document.getElementById('perQuestionSlider');
const perAnswerSlider = document.getElementById('perAnswerSlider');

questionSlider.addEventListener('input', function () {
    updateLabel('questionLabel', this.value, ' QUESTIONS');
    change_number_of_questions(this.value);
});

perQuestionSlider.addEventListener('input', function () {
    updateLabel('perQuestionLabel', this.value, 's / QUESTION');
    change_time_per_question(this.value);
});

perAnswerSlider.addEventListener('input', function () {
    updateLabel('perAnswerLabel', this.value, 's / ANSWER');
    change_time_per_answer(this.value);
});

function updateLabel(labelId, value, unit) {
    document.getElementById(labelId).textContent = value + unit;
}

//Function to change START GAME text
function changeButtonText() {
    var button = document.getElementById('start-pause');
    if (pauseFlag === false) {
        button.textContent = 'PAUSE GAME';
        progressBar.style.animationPlayState = "running";
        pauseFlag = true;
    } else if (pauseFlag === true && game_started === true) {
        button.textContent = 'RESUME GAME';
        progressBar.style.animationPlayState = "paused";
        pauseFlag = false;
        console.log('Game paused.');
        document.getElementById("demo").innerHTML = 'Game paused. Press RESUME GAME to continue.';
    } else {
        button.textContent = 'START GAME';
        pauseFlag = false;
    }
}


//Dynamic question and answer timer bar attempt
let progressBar = document.getElementById("progress");
let startButton = document.getElementById("startButton");
let pauseButton = document.getElementById("pauseButton");
let isPaused = true;

startButton.addEventListener("click", function() {
    if (isPaused) {
    //   progressBar.style.animationPlayState = "paused";
      progressBar.style.animation = "depleteProgress " + time_per_question + "s linear infinite";
      isPaused = false;
    } else {
    //   progressBar.style.animationPlayState = "running";
      progressBar.style.animation = "none";
      progressBar.offsetHeight; // Trigger reflow to reset animation
      progressBar.style.animation = "depleteProgress " + time_per_answer + "s linear infinite";
    }
});

  pauseButton.addEventListener("click", function() {
    if (!isPaused) {
      progressBar.style.animationPlayState = "running";
      isPaused = false;
    } else {
      progressBar.style.animationPlayState = "paused";
      isPaused = true;
    }
  });

  progressBar.addEventListener("animationiteration", function() {
    if (!isPaused) {
        progressBar.style.animation = "replenishProgress " + time_per_answer + "s linear forwards, shrinkProgress " + time_per_question + "s linear forwards";
    }
  });



  const progressElement = document.getElementById('progress');
  

  
  
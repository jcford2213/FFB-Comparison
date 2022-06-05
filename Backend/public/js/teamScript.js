// Imports
const teamSelect = document.getElementById('teamSelect');
const teamOptions = document.querySelectorAll('.teamOptions');


// Event Listeners
const createEventListeners = () => {
  // When the team selection element is changed
  teamSelect.addEventListener('change', () => { 
    const selectValue = teamSelect.value; // stores the value of the selection area. Ex: Denver Broncos
    const teamID = getTeamID(selectValue);  // Stores the teamId of the selection area value. Ex: DEN
    getTeamData(teamID);  // Calls the server/api for the selection value team season stats
  });
};


// Function - gets the <option> tag id; the abbreviated team name
// For Indinaapolis Colts - expected output: 'IND'
const getTeamID = (selection) => {
  let id =''
  teamOptions.forEach(element => {
    if (selection === element.value) {
      id = element.id;
    }
  });
  return id;
};

// Function - calls SDIO api for team stats
const getTeamData = (id) => {
  console.log('Calling API with team id: ' + id);
  fetch('./routes/teamRouter.js', {
    method: 'POST',
    body: JSON.stringify({
      'teamId': id
    }),
  })
    .then (response => {
      response.json();
    })
    .then (result => {
      console.log('Results: ' + result);
    });
};


// Runs on window load
window.addEventListener('load', createEventListeners);
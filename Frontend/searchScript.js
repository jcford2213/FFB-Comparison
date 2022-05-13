/*
Date Last Modified: 5/7/2022

This program is the javascript for the Huddle Up team search

*/

// Dependencies
import teamAbbvr from './Scripts/ApiObjects.js';

// Define variables
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const teamDisplayTable = document.getElementById('teamDisplayTable');

function displaySearchResults() {
  var team = searchInput.value;
  if (teamAbbvr.find(team) != undefined) {
    fs.readFile('./JsonData/' + team + '.json', (err, data) =>{
      if(err) {
        console.log('Error: ' + err);
      } else {
        teamData = JSON.parse(data);
      }
    });
  } else {
    var searchError = teamDisplayTable.insertRow();
    var errorMessage = 'No search results found';
    searchError.appendChild(errorMessage);
  }
}

function createEventListeners() {
  searchButton.addEventListener("click", displaySearchResults, false);
}

if (window.addEventListener) {
  window.addEventListener("load", createEventListeners, false);
} else if (window.attacheEvent) {
  window.attachEvent("onload", createEventListeners);
}
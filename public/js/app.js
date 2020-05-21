// API Key for OpenWeatherMap
const apiKey = '4f5a3ec920fab1fcb799864398e820a7';
const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?';

let submitButton;
let zip;
let feelings;
let journalData;

let postsToShow = 1;

// Changes if degrees are in Ferenheit(true) or Celsius(false)
const useImperial = true;

/**
 * @description - shorthand for querySelector
 * @param {string} elem - element to select from DOM  (e.g. '#submit')
 * @returns {Element} - a single element from the DOM
 */
const $ = (elem) => {
    return document.querySelector(`${elem}`);
}

/**
 * @description - shorthand for querySelectorAll
 * @param {string} elem - elements to select from DOM (e.g. '.menu__item')
 * @returns {Element} - a single element from the DOM
 */
const $$ = (elem) => {
    return document.querySelectorAll(`${elem}`);
}

/**
 * @description - checks if the zip code is valid and can be submitted
 * @param {string} zip - value to check if it could be a vaild zip code
 */
const validateZip = (zip) => {
    if ((!isNaN(zip)) && zip.length == 5) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}



const loadMore = () => {
    let currentPost = postsToShow;
    postsToShow += 3;

    let cards = populateCard(journalData, currentPost, postsToShow);
    cards.forEach((card) => {
        $('#journal').insertBefore(card, $('#journal__loadMore'));
    });
}

/**
 * @description - Generates an array of cards that contain journal entries
 * @param {JSON} data - information to be parsed into journal cards
 * @param {Number} currentPost - the number of posts currently shown
 * @param {Number} maxPosts - the max number of posts to show
 * @returns {Array} the cards to be added to DOM
 */
const populateCard = (data, currentPost, maxPosts) => {
    let cards = [];
    for (let i = currentPost; i < maxPosts; i++) {
        const card = document.createElement("div");
        card.className = 'journal__entry card';
        if (data[i]) {
            $("#journal__loadMore").disabled = false;
            const currentEntry = data[i];
            const date = new Date(currentEntry.date);
            const dateString = `${date.toLocaleString("default", {
              month: "long",
            })} ${date.getDate()}, ${date.getFullYear()}`;
            card.innerHTML = generateJournal(
            dateString,
            currentEntry.weather.main.temp,
            currentEntry.feelings
            );
            cards.push(card);
        } else {
            $("#journal__loadMore").disabled;
        }
    }
    return cards;
};

const generateJournal = (date, temp, entry) => {
    return `
        <h3>Journal Entry:</h3>
        <div class="journal__entry__item">Date: ${date}</div>
        <div class="journal__entry__item">Current Temperature: ${temp}</div>
        <div class="journal__entry__item" id="content">${entry}</div>
    `;
};

/**
 * 
 * @param {string} url - API Endpoint
 * @param {string} apiKey - API Key
 * @param {string} q - search query
 */
const getWeatherData = async (url, apiKey, q) => {

    const response = await fetch(
        `${url}q=${q},us&appid=${apiKey}&units=${useImperial ? "imperial" : "metric"}`
    );
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Uh oh! Something went wrong trying to get this data...",
        error
      );
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Hmm... something went wrong parsing this data.', error);
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const data = await response.json();
        return data;
    }
    catch (error){
        console.log("error", error);
    }
}

const getData = async (url = '') => {
    const response = await fetch(url);

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Uh oh! Something went wrong trying to get this data...', error);
    }
}

const populateJournal = async () => {
    getData("/posts")
        .then(data => {
            if (data.length) {
                $('#entryHolder').classList.remove('noContent');
                let currentEntry = data[0];
                let date = new Date(currentEntry.date);
                $("#date").innerHTML = `Date: ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
                $("#temp").innerHTML = `Current Temperature: ${currentEntry.weather.main.temp || 'No data available'}`;
                $("#content").innerHTML = `${currentEntry.feelings}`;

                $('#body__background').className = `page default ${currentEntry.weather.weather[0].main.toLowerCase() || ''}`;
            }
            if (data.length > 1) {
                if (!$('#journal__loadMore')) {
                    const loadMoreButton = document.createElement("input");
                    Object.assign(loadMoreButton, {
                      className: "button",
                      type: "button",
                      id: "journal__loadMore",
                      value: "Load Past Entries",
                    });
                    $("#journal").appendChild(loadMoreButton);
                    $('#journal__loadMore').addEventListener('click', () => {
                        loadMore();
                    });
                }   
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    submitButton = $("#generate");
    zip = $("#zip");
    feelings = $("#feelings");
    zip.addEventListener('input', function () {
        validateZip(this.value);
    });
    submitButton.addEventListener("click", async () => {
        getWeatherData(weatherUrl, apiKey, zip.value)
            .then(async (data) => {
                let date = new Date();
                journalData = await postData('/posts', { 'weather': data, 'date': date.toJSON(), 'feelings': feelings.value });
            })
            .then(() => {
                populateJournal();
            });
    });
});




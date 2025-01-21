"use strict";

// Wrapper around https://stormglass.io/ api
function StormglassWrapper()
{
    const DAYS_TO_GET = 7;
    const TEST_MODE = false; // Setting for testing, can return fake responses for API requests.

    this.stateDataReady = false; // Parsed tide data is ready to use.
    this.stateRequestProcessing = false; // Request sent for tide data, awaiting response.
    this.stateRequestDone = false; // Request complete. This is used during debugging so that the API is not spammed and quota exceeded.
    this.stateRequestError = false; // Request returned an error.

    this.result = {};

    this.updateTides = function(lat, long)
    {
        // Check if we have stored tide data
        let storedData = localStorage.getItem(globals.STORAGE_DATA_TIDE);
        if (storedData != null)
        {
            // We have stored data! ...but is it valid for today's date?
            let dataTide = JSON.parse(storedData);
            if (this.checkTideDataValid(dataTide))
            {
                // Valid! Use it!
                // console.log("Stored tide data is still valid!");
                this.result = this.parseStoredData(dataTide);
                this.stateDataReady = true;
            }
            else
            {
                // Different date! Get new data!
                if (this.checkApiReady())
                {
                    console.log("Stored tide data NOT valid! Requesting new data!");
                    this.sendApiRequest(new Date(), lat, long);
                }
            }
        }
        else
        {
            // Got no data, lets request some!
            if (this.checkApiReady())
            {
                console.log("Stored tide data empty. Requesting new data!");
                this.sendApiRequest(new Date(), lat, long);
            }
        }
    }

    this.sendApiRequest = function(dateStart, lat, long)
    {
        this.stateRequestProcessing = true;
        let response = null;

        const dateFormatedStart = this.formatDateForApi(dateStart);
        const dateEnd = this.addDaysToDate(dateStart, DAYS_TO_GET);
        const dateFormatedEnd = this.formatDateForApi(dateEnd);

        if (!TEST_MODE)
        {
            console.log("Do a real request to the API.");
            // Do a real request to the API.
            if (settings.stormglassKey.input.value != null)
            {
                fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${long}&start=${dateFormatedStart}&end=${dateFormatedEnd}`, {
                    headers: {
                        'Authorization': settings.stormglassKey.input.value
                    }
                }).then((response) => response.json()).then((jsonData) => {
                    localStorage.setItem(globals.STORAGE_DATA_STORMGLASS_LAST, JSON.stringify(jsonData));
                    this.parseApiResponse(jsonData);
                    this.stateRequestDone = true;
                });
            }
            else
            {
                console.error("Stormglass API key not set! Cannot retrieve tide data. Press ESC to open settings and set an API key.");
                this.stateRequestError = true;
                this.stateRequestDone = true;
            }
        }
        else
        {
            // Just testing so respond with fake data, don't send a request to the API.
            response = JSON.parse(globals.TEST_STORMGLASS_RESPONSE);
            this.parseApiResponse(response);
            this.stateRequestDone = true;
        }
    }

    this.parseStoredData = function(value)
    {
        for (let i = 0; i < value.length; i++)
        {
            value[i].date = new Date(value[i].date);
        }
        return value;
    }

    this.parseApiResponse = function(dataObj)
    {
        if (dataObj.errors != null && dataObj.errors.key != null)
        {
            console.error("Stormglass API error: " + dataObj.errors.key);
            console.error(dataObj);
            this.stateRequestError = true;
        }
        else
        {
            if (!TEST_MODE)
            {
                localStorage.setItem(globals.STORAGE_DATA_STORMGLASS_GOOD, JSON.stringify(dataObj));
            }

            this.result = [];
            for (let i = 0; i < dataObj.data.length; i++)
            {   
                let originalTimeString = dataObj.data[i].time;

                let dataTimeStringFixed = originalTimeString.substring(0, originalTimeString.length - 9); // Remove incorrect timezone content that breaks things
                let dateTimeObj = new Date(dataTimeStringFixed);
                let dayPerc = this.calcCurrentDayPercentage(dateTimeObj);

                let tideEvent = {};
                tideEvent.date = dateTimeObj;
                tideEvent.dayPerc = dayPerc;
                tideEvent.tideHeight = dataObj.data[i].height;
                tideEvent.tideType = dataObj.data[i].type;

                this.result.push(tideEvent);
            }

            localStorage.setItem(globals.STORAGE_DATA_TIDE, JSON.stringify(this.result));
            this.stateDataReady = true;
        }

        this.stateRequestProcessing = false;
    }

    // HELPERS
    this.checkApiReady = function()
    {
        if (!this.stateRequestError && !this.stateRequestProcessing && !this.stateRequestDone)
        {
            return true;
        }
        return false;
    }

    this.checkTideDataValid = function(dataObj)
    {
        let sameDate = false;
        for (let i = 0; i < 7; i++)
        {
            // Check a few tide events because sometimes we can get yesterday's events first...
            if (this.checkSameDate(new Date(), new Date(dataObj[i].date)))
            {
                sameDate = true;
            }
        }
        return sameDate;
    }

    this.checkSameDate = function(d1, d2)
    {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    this.formatDateForApi = function(date)
    {
        return date.getFullYear() + "-" +((date.getMonth()+1).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" + (date.getDate().toString().length != 2 ?"0" + date.getDate() : date.getDate());
    }

    this.addDaysToDate = function(date, days)
    {
        const dateCopy = new Date(date);
        dateCopy.setDate(date.getDate() + days);
        return dateCopy;
    }

    this.calcCurrentDayPercentage = function(dateGiven)
    {
      // Copy the date to compare start of day with given time
      let startOfDay = new Date(dateGiven.valueOf());
      
      // Set copied date to start of the same day
      startOfDay.setHours(0);
      startOfDay.setMinutes(0);
      startOfDay.setSeconds(0);
      startOfDay.setMilliseconds(0);

      // Subtract the two days to find the time since beginning of the day,
      // divide by number of ms in day to get percentage
      let MS_IN_A_DAY = 86400000; // = 1000ms * 60s * 60m * 24h;
      return ( dateGiven - startOfDay ) / MS_IN_A_DAY;
    }
}
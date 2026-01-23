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
                    if (this.checkApiKeyReady())
                    {
                        console.log("Stored tide data NOT valid! Requesting new data!");
                        this.sendApiRequest(this.getYesterdayDate(), lat, long);
                    }
                    else 
                    {
                        console.log("Stored tide data NOT valid! Stormglass API key NOT valid! Cannot request new data.");
                    }
                }
            }
        }
        else
        {
            // Got no data, lets request some!
            if (this.checkApiReady())
            {
                if (this.checkApiKeyReady())
                {
                    console.log("Stored tide data empty. Requesting new data!");
                    this.sendApiRequest(this.getYesterdayDate(), lat, long);
                }
                else 
                {
                    console.log("Stored tide data empty. Stormglass API key NOT valid! Cannot request new data.");
                }
            }
        }
    }

    this.getYesterdayDate = function()
    {
        let oneDayOffset = (24*60*60*1000);
        let result = new Date();
        result.setTime(result.getTime() - oneDayOffset);
        return result;
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
            // Do a real request to the API.
            if (settings.stormglassKey.input.value != globals.DEFAULT_API_KEY 
                && settings.stormglassKey.input.value != null)
            {
                fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${long}&start=${dateFormatedStart}&end=${dateFormatedEnd}`, {
                    headers: {
                        'Authorization': settings.stormglassKey.input.value
                    }
                    // 'd952c4a8-2f92-11ee-8b7f-0242ac130002-d952c53e-2f92-11ee-8b7f-0242ac130002'
                    //settings.stormglassKey.input.value
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

            // Extrapolate tide data forward and backward infinitely based on average interval
            this.extrapolateTideData();

            console.log(this.result);

            localStorage.setItem(globals.STORAGE_DATA_TIDE, JSON.stringify(this.result));
            this.stateDataReady = true;
        }

        this.stateRequestProcessing = false;
    }

    this.extrapolateTideData = function()
    {
        if (this.result.length < 2) return;

        // Calculate median tide height from API data
        let heights = this.result.map(event => event.tideHeight).sort((a, b) => a - b);
        let medianHeight = heights.length % 2 === 0
            ? (heights[heights.length / 2 - 1] + heights[heights.length / 2]) / 2
            : heights[Math.floor(heights.length / 2)];

        // Calculate average time between tide events
        let totalTime = 0;
        for (let i = 1; i < this.result.length; i++)
        {
            totalTime += this.result[i].date.getTime() - this.result[i-1].date.getTime();
        }
        const avgInterval = totalTime / (this.result.length - 1);

        // Extrapolate backwards ~1 year
        let backwardsArray = [];
        let backwardsDate = new Date(this.result[0].date.getTime());
        let backwardsTideType = this.result[0].tideType === "high" ? "low" : "high";
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;

        while (backwardsDate.getTime() > this.result[0].date.getTime() - oneYearMs)
        {
            backwardsDate.setTime(backwardsDate.getTime() - avgInterval);
            let event = {
                date: new Date(backwardsDate),
                dayPerc: this.calcCurrentDayPercentage(backwardsDate),
                tideHeight: medianHeight, // Extrapolated, uses median height
                tideType: backwardsTideType
            };
            backwardsArray.unshift(event);
            backwardsTideType = backwardsTideType === "high" ? "low" : "high";
        }

        // Extrapolate forwards ~1 year
        let forwardsArray = [];
        let forwardsDate = new Date(this.result[this.result.length - 1].date.getTime());
        let forwardsTideType = this.result[this.result.length - 1].tideType === "high" ? "low" : "high";

        while (forwardsDate.getTime() < this.result[this.result.length - 1].date.getTime() + oneYearMs)
        {
            forwardsDate.setTime(forwardsDate.getTime() + avgInterval);
            let event = {
                date: new Date(forwardsDate),
                dayPerc: this.calcCurrentDayPercentage(forwardsDate),
                tideHeight: medianHeight, // Extrapolated, uses median height
                tideType: forwardsTideType
            };
            forwardsArray.push(event);
            forwardsTideType = forwardsTideType === "high" ? "low" : "high";
        }

        // Combine backwards + original + forwards
        this.result = backwardsArray.concat(this.result, forwardsArray);
    }

    // HELPERS
    this.checkApiKeyReady = function()
    {
        if (settings.stormglassKey.input.value != globals.DEFAULT_API_KEY 
            && settings.stormglassKey.input.value != null
            && settings.stormglassKey.input.value.length > 70)
        {
            return true;
        }
        return false;
    }

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
        // Search entire array for yesterday's date (not just first 7 entries, since we now extrapolate backwards)
        for (let i = 0; i < dataObj.length; i++)
        {
            if (this.checkSameDate(this.getYesterdayDate(), new Date(dataObj[i].date)))
            {
                sameDate = true;
                break;
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
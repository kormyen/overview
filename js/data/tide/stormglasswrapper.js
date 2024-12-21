"use strict";

// Wrapper around https://stormglass.io/ api
function StormglassWrapper()
{
    const API_KEY = ``; // get this from https://dashboard.stormglass.io/
    const DAYS_TO_GET = 7;
    const REAL = false;

    const MS_IN_A_DAY = 86400000; // = 1000 * 60 * 60 * 24;

    this.complete = false;
    this.result = {};

    this.updateGregorian = function(dateStart, lat, long)
    {
        if (!this.complete)
        {
            const dateFormatedStart = this.formatDate(dateStart);
            const dateEnd = this.addDays(dateStart, DAYS_TO_GET);
            const dateFormatedEnd = this.formatDate(dateEnd);

            let response = null;

            if (REAL)
            {
                fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${long}&start=${dateFormatedStart}&end=${dateFormatedEnd}`, {
                    headers: {
                        'Authorization': API_KEY
                    }
                }).then((response) => response.json()).then((jsonData) => {
                    this.receiveData(jsonData);
                });
            }
            else
            {
                response = `{
                    "data": [
                        {
                            "height": -2.6740807172662198,
                            "time": "2023-07-31T01:24:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.1785980821491786,
                            "time": "2023-07-31T07:25:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.6888981387253708,
                            "time": "2023-07-31T13:51:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.1278358157173645,
                            "time": "2023-07-31T19:47:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.9197942271004393,
                            "time": "2023-08-01T02:09:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.3706702459244116,
                            "time": "2023-08-01T08:13:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.920474287690357,
                            "time": "2023-08-01T14:35:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.26576063094016,
                            "time": "2023-08-01T20:36:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.095831136923276,
                            "time": "2023-08-02T02:53:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.4742154483684344,
                            "time": "2023-08-02T09:02:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.0736560939545816,
                            "time": "2023-08-02T15:19:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.31626992155341,
                            "time": "2023-08-02T21:25:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.176534596878981,
                            "time": "2023-08-03T03:38:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.4740832695769375,
                            "time": "2023-08-03T09:51:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.1264832190319103,
                            "time": "2023-08-03T16:04:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.2696152615886787,
                            "time": "2023-08-03T22:16:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.1441802639027734,
                            "time": "2023-08-04T04:24:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.366989526351195,
                            "time": "2023-08-04T10:42:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -3.066699038786519,
                            "time": "2023-08-04T16:51:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.1291848233966024,
                            "time": "2023-08-04T23:08:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.9939136223580083,
                            "time": "2023-08-05T05:12:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 3.164362971703169,
                            "time": "2023-08-05T11:35:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.896270719848477,
                            "time": "2023-08-05T17:39:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 2.9136865368247045,
                            "time": "2023-08-06T00:03:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.7377572596192405,
                            "time": "2023-08-06T06:02:00+00:00",
                            "type": "low"
                        },
                        {
                            "height": 2.8932246794996215,
                            "time": "2023-08-06T12:30:00+00:00",
                            "type": "high"
                        },
                        {
                            "height": -2.6346789216076516,
                            "time": "2023-08-06T18:31:00+00:00",
                            "type": "low"
                        }
                    ],
                    "meta": {
                        "cost": 1,
                        "dailyQuota": 10,
                        "datum": "MSL",
                        "end": "2023-08-07 00:00",
                        "lat": -36.90155792236328,
                        "lng": 174.8676757812499,
                        "requestCount": 1,
                        "start": "2023-07-31 00:00",
                        "station": {
                            "distance": 8,
                            "lat": -36.93,
                            "lng": 174.78,
                            "name": "manukau harbour (onehunga wharf)",
                            "source": "sg"
                        }
                    }
                }`;
            }

            this.receiveData(response);

            this.complete = true;
        }
    }

    this.formatDate = function(date)
    {
        return date.getFullYear() + "-" +((date.getMonth()+1).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" + (date.getDate().toString().length != 2 ?"0" + date.getDate() : date.getDate());
    }

    this.addDays = function(date, days)
    {
        const dateCopy = new Date(date);
        dateCopy.setDate(date.getDate() + days);
        return dateCopy;
    }

    this.receiveData = function(response)
    {
        this.parseData(response);
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
      return ( dateGiven - startOfDay ) / MS_IN_A_DAY;
    }

    this.parseData = function(data)
    {
        let dataObj = JSON.parse(data);
        let result = {};

        for (let i = 0; i < dataObj.data.length; i++)
        {   
            let originalTimeString = dataObj.data[i].time;
            let originalTimeObj = new Date(originalTimeString);

            let dataTimeStringFixed = originalTimeString.substring(0, originalTimeString.length - 9); // Remove incorrect timezone content that breaks things
            let dateTimeObj = new Date(dataTimeStringFixed);
            let dayPerc = this.calcCurrentDayPercentage(dateTimeObj);

            let dateLabel = originalTimeObj.toISOString().split('T')[0];
            let timeLabel = originalTimeObj.toISOString().split('T')[1].substring(0, 5);;

            let tideData = {};
            tideData.date = dateTimeObj;
            tideData.dayPerc = dayPerc;
            tideData.tideHeight = dataObj.data[i].height;
            tideData.tideType = dataObj.data[i].type;

            if (!result[dateLabel])
            {
                result[dateLabel] = {};
            }
            result[dateLabel][timeLabel] = tideData;
        }
        console.log(result)
        this.result = result;
    }
}
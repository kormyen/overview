"use strict";

// Wrapper around https://stormglass.io/ api
function StormglassWrapper()
{
    const API_KEY = ``; // get this from https://dashboard.stormglass.io/
    const DAY_TO_GET = 7;
    const REAL = false;

    this.complete = false;
    this.result = {};

    this.updateGregorian = function(dateStart, lat, long)
    {
        if (!this.complete)
        {
            const dateFormatedStart = this.formatDate(dateStart);
            const dateEnd = this.addDays(dateStart, DAY_TO_GET);
            const dateFormatedEnd = this.formatDate(dateEnd);

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
                let response = `{
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
        console.log(response);
    }
}
const axios = require("axios");
const url = "http://localhost:8000/api/app?is_completed=true&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR";

const getData = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};

getData(url);

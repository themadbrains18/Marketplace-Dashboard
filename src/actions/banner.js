const axios = require("axios");
const {apiurl} = require('../config');

let token = localStorage.getItem('access_token');
const configtoken = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

export async function saveBanner(selectedBannerImage, config) {
    let formData = new FormData();
    for (let j = 0; j < selectedBannerImage.length; j++) {
        formData.append("bannerimage", selectedBannerImage[j]);
    }
    return await axios.post(apiurl + `banner`, formData, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function getBanner(config){
    return await axios.get(apiurl+'getbanner', config).then(function(response){
        if(response.data){
            return response;
        }
    })
}

export async function removeBanner(bannerid,config){
    return await axios.delete(apiurl + `removebanner/${bannerid}`, config).then(function (response) {
        if (response.data.deletedCount>0) {
            return response;
        }
    });
}
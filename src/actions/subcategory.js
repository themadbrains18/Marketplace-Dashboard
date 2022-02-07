
const axios = require("axios");

const {apiurl} = require('../config');

let token = localStorage.getItem('access_token');
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

export async function getSubCategory() {
    return await axios.get(apiurl + "subcategory/getAll", config);
}

export async function save(categoryid, name, admin) {
    return axios.post(apiurl + `subcategory/save`, { category:categoryid, name, admin }, config).then(function (response) {

        if (response.data) {
            return response;

        }

    });
}

export async function removeSubCategory(categoryid) {
    
    return await axios.delete(apiurl + `subcategory/delete/${categoryid}`, config).then(function (response) {
        if (response.data.deletedCount>0) {
            return response;
        }
    });
}

export async function update(id,categoryid, name, admin) {
    return axios.post(apiurl + `subcategory/update`, {id, categoryid, name, admin }, config).then(function (response) {

        if (response.data) {
            return response;

        }

    });
}

export async function getSubCategoryWithId(id){
    return await axios.get(apiurl + `subcategory/getcategorybyid/${id}`, config);
}
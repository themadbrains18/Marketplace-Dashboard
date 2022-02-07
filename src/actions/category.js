
const axios = require("axios");
const { apiurl } = require('../config');
let token = localStorage.getItem('access_token');
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

export async function getCategory() {

    return await axios.get(apiurl + "category/getAll",config);
}

export async function save(name, admin) {
    return await axios.post(apiurl + `category/save`, { name, admin }, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function update(id, name, admin) {
    return await axios.post(apiurl + `category/update`, { id, name, admin }, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function removeCategory(categoryid) {

    return await axios.delete(apiurl + `category/delete/${categoryid}`, config).then(function (response) {
        if (response.data.deletedCount > 0) {
            return response;
        }
    });
}

export async function getCategoryWithId(categoryid) {
    return await axios.get(apiurl + `category/getcategorybyid/${categoryid}`, config);
}
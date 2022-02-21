const axios = require("axios");
const {apiurl} = require('../config');

let token = localStorage.getItem('access_token');
const configtoken = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

export async function getProduct() {
    return await axios.get(apiurl + "product/getAll");
}

export async function save(formInputs, selectedImage, config) {
    let formData = new FormData();
    formData.set('category', formInputs.category);
    formData.set('subcategory', formInputs.subcategory);
    formData.set('tools', formInputs.tools);
    formData.set('admin', formInputs.admin);
    formData.set('title', formInputs.title);
    formData.set('link', formInputs.link);
    formData.set('overview', formInputs.overview);
    formData.set('highlight', formInputs.highlight);
    formData.set('template', formInputs.template);
    if (selectedImage != '') {
        formData.append("file", selectedImage);
    }

    return await axios.post(apiurl + `save`, formData, config).then(function (response) {

        if (response.data) {
            return response;
        }

    });
}

export async function update(productid, formInputs, selectedImage, config) {
    let formData = new FormData();
    formData.set('category', formInputs.category);
    formData.set('subcategory', formInputs.subcategory);
    formData.set('tools', formInputs.tools);
    formData.set('admin', formInputs.admin);
    formData.set('title', formInputs.title);
    formData.set('link', formInputs.link);
    formData.set('overview', formInputs.overview);
    formData.set('highlight', formInputs.highlight);
    formData.set('template', formInputs.template);
    if (selectedImage != '') {
        formData.append("file", selectedImage);
    }
    formData.set('id', productid);
    return await axios.post(apiurl + `product/modify`, formData, config).then(function (response) {

        return response;

    });

}

export async function saveSlider(productId, selectedSliderImage, config) {
    let formData = new FormData();
    formData.set('productid', productId);
    for (let j = 0; j < selectedSliderImage.length; j++) {
        formData.append("sliderImage", selectedSliderImage[j]);
    }
    return await axios.post(apiurl + `productslider`, formData, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function savePreview(productId, selectedPreviewImage, config) {
    let formData = new FormData();
    formData.set('productid', productId);
    for (let j = 0; j < selectedPreviewImage.length; j++) {
        formData.append("previewImage", selectedPreviewImage[j]);
    }
    return await axios.post(apiurl + `productpreview`, formData, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function removeProduct(productid) {

    return await axios.delete(apiurl + `product/delete/${productid}`, configtoken).then(function (response) {
        if (response.data.deletedCount > 0) {
            return response;
        }
    });
}

export async function getProductDetailById(productid) {
    return await axios.get(apiurl + `product/getproductbyid/${productid}`);
}


export async function saveDownloadFiles(name,productId, selectedPreviewImage, config) {
    debugger;
    let formData = new FormData();
    formData.set('name', name);
    formData.set('productid', productId);
    for (let j = 0; j < selectedPreviewImage.length; j++) {
        formData.append("downloadFile", selectedPreviewImage[j]);
    }
    return await axios.post(apiurl + `productdownload`, formData, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}
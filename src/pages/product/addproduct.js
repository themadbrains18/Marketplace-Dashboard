import React, { useState, useEffect } from "react";
import {
    Col,
    Row
} from "reactstrap";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { save, saveSlider, savePreview, saveDownloadFiles } from '../../actions/product';
import { getCategory } from '../../actions/category';
import { getSubCategory } from '../../actions/subcategory';
import { getTools } from '../../actions/tools';
import AlertNotification from '../../components/AlertNotification/notification';
import s from "./addproduct.module.scss";

const Addproduct = () => {

    const [subCategoryArray, setSubcategoryArray] = useState([]);
    const [selectedImage, setSelectedImage] = useState();
    const [selectedSliderImage, setSelectedSliderImage] = useState([]);
    const [selectedPreviewImage, setselectedPreviewImage] = useState([]);
    const [showFormSection, setShowFormSection] = useState(true);
    const [showSliderSection, setShowSliderSection] = useState(false);
    const [showPreviewSection, setShowPreviewSection] = useState(false);
    const [showDownloadFileSection, setShowDownloadFileSection] = useState(false);
    

    const [selectedDownloadableFile, setSelectedDownloadableFile] = useState([]);
    // Form field inputs values

    const [productId, setProductId] = useState(0);
    const [categoryArray, setCategoryArray] = useState([]);
    const [Subcategory, setSubCategoryData] = useState([]);
    const [Tools, setTools] = useState([]);
    const [validateMessage, setValidateMessage] = useState('');
    const [alert, setAlert] = useState({});
    const [buttonDisable, setButtonDisable] = useState(false);

    const initialState = {
        category: "",
        subcategory: "",
        tools: "",
        title: "",
        admin: "",
        link: "",
        overview: "",
        highlight: "",
        template:""
    };

    const [{ category, subcategory, tools, title, admin, link, overview, highlight,template }, setFormInputs] = useState([]);

    // onLoad get master table data
    useEffect(() => {
        getAllCategory();
        getSubcategoryData();
        getAllTools();
    }, [])

    // Get Category List data for dropdown
    async function getAllCategory() {
        try {
            const response = await getCategory();
            setCategoryArray(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    // Get SubCategory List data 
    async function getSubcategoryData() {
        try {
            const response = await getSubCategory();
            setSubCategoryData(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    // get Tools List data
    async function getAllTools() {
        try {
            const response = await getTools();
            setTools(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    // Filter subcategory based on category
    let filterSubcategory = (event) => {
        setFormInputs(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
        let SubcategoryArray = Subcategory.filter(item => item.category._id == event.target.value);
        setSubcategoryArray(SubcategoryArray);
    }

    // upload file that show in list of product
    let imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: e.target.files[0].name }));
        }
    };

    // upload slider files of product
    let sliderUpload = (e) => {
        let imageArray = [];
        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                imageArray.push(e.target.files[i]);
            }
            setSelectedSliderImage(imageArray);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: imageArray }));
        }
    };

    // upload preview files of product
    let previewUpload = (e) => {
        let previewArray = [];

        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                previewArray.push(e.target.files[i]);
            }
            setselectedPreviewImage(previewArray);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: previewArray }));
        }
    }

    let handleOverviewChange = (e) => {
        setFormInputs(prevState => ({ ...prevState, 'overview': e }));
    }

    let handleHighlightChange = (e) => {
        setFormInputs(prevState => ({ ...prevState, 'highlight': e }));
    }

    // upload downloadable files of product
    let downloadFileUpload = (e) => {
        debugger;
        let downloadFileArray = [];

        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                downloadFileArray.push(e.target.files[i]);
            }
            setSelectedDownloadableFile(downloadFileArray);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: downloadFileArray }));
        }
    }

    // Start upload data into database

    let token = localStorage.getItem('access_token');
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        }
    }

    let saveChanges = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (category == undefined) {
            setValidateMessage('Please select category');
        } else if (subcategory == undefined) {
            setValidateMessage('Please select subcategory');
        } else if (tools == undefined) {
            setValidateMessage('Please select tools');
        } else if (title == undefined) {
            setValidateMessage('Please enter title');
        } else if (admin == undefined) {
            setValidateMessage('Please enter admin name');
        } else if (link == undefined) {
            setValidateMessage('Please enter shareable link');
        } else if (overview == undefined) {
            setValidateMessage('Please enter product overview');
        }
        else if (highlight == undefined) {
            setValidateMessage('Please select product highlight');
        }
        else if (selectedImage == '') {
            setValidateMessage('Please upload image');
        }
        else {
            saveProduct();
        }

    }

    async function saveProduct() {

        let formInputs = { category, subcategory, tools, title, admin, link, overview, highlight,template }
        let response = await save(formInputs, selectedImage, config);
        if (response.data) {
            if (response.data.status == 401) {
                setAlert({ type: 'warning', message: response.data.message })
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                }, 3000)
            }
            else if (response.data.status == 200) {
                setAlert({ type: 'success', message: response.data.message })
                setTimeout(() => {
                    setAlert({})
                    setButtonDisable(false);
                    setProductId(response.data.productdata._id);
                    setFormInputs({ ...initialState });
                    setSelectedImage();
                    setShowFormSection(false);
                    setShowPreviewSection(false);
                    setShowSliderSection(true);
                    setShowDownloadFileSection(false);
                }, 3000);
            }
            else {
                setAlert({ type: 'error', message: response })
            }

        }
    }

    let uploadSlider = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (selectedSliderImage == '') {
            setValidateMessage('Please upload slider image');
        }
        else {
            saveProductSlider();
        }

    }

    async function saveProductSlider() {
        let response = await saveSlider(productId, selectedSliderImage, config);
        if (response.data) {
            if (response.data.status == 200) {
                setAlert({ type: 'success', message: response.data.message })
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                    setSelectedSliderImage([]);
                    setShowFormSection(false);
                    setShowSliderSection(false);
                    setShowPreviewSection(true);
                    setShowDownloadFileSection(false);
                }, 3000);
            }
            else{
                setButtonDisable(false);
            }
        }
    }

    let uploadPreview = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (selectedPreviewImage == '') {
            setValidateMessage('Please upload Preview image');
        }
        else {
            saveProductPreview();
        }

    }

    async function saveProductPreview() {
        let response = await savePreview(productId, selectedPreviewImage, config);
        if (response.data) {
            if (response.data.status == 200) {
                setAlert({ type: 'success', message: response.data.message })
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                    setselectedPreviewImage([]);
                    setShowSliderSection(false);
                    setShowPreviewSection(false);
                    setShowDownloadFileSection(true);
                    setShowFormSection(false);
                }, 3000);
            }
            else{
                setButtonDisable(false);
            }

        }

    }


    let uploadDownloadFile = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (selectedDownloadableFile == '') {
            setValidateMessage('Please upload download file');
        }
        else {
            saveDownloadFile();
        }

    }

    async function saveDownloadFile() {
        debugger;
        let response = await saveDownloadFiles('skilify',productId, selectedDownloadableFile, config);
        if (response.data) {
            if (response.data.status == 200) {
                setAlert({ type: 'success', message: response.data.message })
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                    setSelectedDownloadableFile([]);
                    setShowSliderSection(false);
                    setShowPreviewSection(false);
                    setShowDownloadFileSection(false);
                    setShowFormSection(true);
                    setProductId(0)
                }, 3000);
            }
            else{
                setButtonDisable(false);
            }

        }

    }

    // End upload data into database

    // Redirect to product list page
    const redirectProduct = () => {
        window.location.href = '/#/template/product';
    }

    return (
        <div>
            <Row>
                <Col className="pr-grid-col" xs={12} lg={12}>
                    <AlertNotification alert={alert} />
                    <Row className="gutter mb-4">
                        <Col xs={12}>
                            <div className="gutter mb-4 row">
                                <div className="col-12 col-lg-9" style={{ display: showFormSection == true ? 'block' : 'none', margin: 'auto' }}>
                                    <section className="Widget_widget__16nWC">
                                        <div className="widget-p-md">
                                            <div className="form-group">
                                                <form className="">
                                                    <div className={s.tableTitle}>
                                                        <div className="headline-2">Basic Information</div>
                                                        <div className="d-flex">
                                                            <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={(event) => redirectProduct(event)}>Prodcut View</button>
                                                        </div>
                                                    </div>

                                                    <div className="row form-group">
                                                        <label htmlFor="default-select" className="text-md-right col-md-4 col-form-label">Category</label>
                                                        <div className="col-md-8">
                                                            <div className=" css-2b097c-container">
                                                                <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                                <select name="category" id="category" value={category} className="css-yk16xz-control form-select" style={{ width: '100%' }} onChange={(event) => filterSubcategory(event)} aria-label="Default select example">
                                                                    <option selected>Select Category</option>
                                                                    {categoryArray.map((val, index) => {
                                                                        return <option value={val._id}>{val.name}</option>
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="grouped-select" className="text-md-right col-md-4 col-form-label">Subcategory</label>
                                                        <div className="col-md-8">
                                                            <div className=" css-2b097c-container">
                                                                <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                                <select name="subcategory" value={subcategory} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))}>
                                                                    <option selected>Select Subcategory</option>
                                                                    {subCategoryArray.map((val, index) => {
                                                                        return <option value={val._id}>{val.name}</option>
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="grouped-select" className="text-md-right col-md-4 col-form-label">Tools</label>
                                                        <div className="col-md-8">
                                                            <div className=" css-2b097c-container">
                                                                <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                                <select name="tools" value={tools} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))}>
                                                                    <option selected>Select Tools</option>
                                                                    {Tools.map((val, index) => {
                                                                        return <option value={val._id}>{val.name}</option>
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="grouped-select" className="text-md-right col-md-4 col-form-label">Template Type</label>
                                                        <div className="col-md-8">
                                                            <div className=" css-2b097c-container">
                                                                <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                                <select name="template" value={template} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))}>
                                                                    <option selected>Select Template</option>
                                                                    <option value="web">Website</option>
                                                                    <option value="mob">Mobile</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="normal-field" className="text-md-right col-md-4 col-form-label">Title</label>
                                                        <div className="col-md-8">
                                                            <input name="title" value={title} id="normal-field" placeholder="Title" type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="by-field" className="text-md-right col-md-4 col-form-label">By</label>
                                                        <div className="col-md-8">
                                                            <input name="admin" value={admin} id="by-field" placeholder="Admin Name" type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="link-field" className="text-md-right col-md-4 col-form-label">Shareable Link</label>
                                                        <div className="col-md-8">
                                                            <input name="link" value={link} id="link-field" placeholder="link" type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="hint-field" className="d-flex flex-column text-md-right col-md-4 col-form-label">Overview<span className="label muted">Some help text</span></label>
                                                        <div className="col-md-8">
                                                            <SunEditor id='overview' setContents={overview} name="overview" placeholder="Add Overview Here.." onChange={(e) => handleOverviewChange(e)} setOptions={{
                                                                height: 200,
                                                                buttonList: [
                                                                    ['undo', 'redo'],
                                                                    ['font', 'fontSize', 'formatBlock'],
                                                                    ['paragraphStyle', 'blockquote'],
                                                                    ['bold', 'underline', 'italic', 'strike'],
                                                                    ['fontColor', 'hiliteColor', 'textStyle'],
                                                                    ['removeFormat'],
                                                                    ['outdent', 'indent'],
                                                                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                                                                    ['table', 'link', 'image'],
                                                                    ['fullScreen'],
                                                                    ['preview', 'print'],
                                                                ]
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div className="row form-group">
                                                        <label htmlFor="tooltip-enabled" className="text-md-right col-md-4 col-form-label">Highlight</label>
                                                        <div className="col-md-8">
                                                            <SunEditor id='highlight' setContents={highlight} name="highlight" placeholder="Add Highlights Here.." onChange={(e) => handleHighlightChange(e)} setOptions={{
                                                                height: 200,
                                                                buttonList: [
                                                                    ['undo', 'redo'],
                                                                    ['font', 'fontSize', 'formatBlock'],
                                                                    ['paragraphStyle', 'blockquote'],
                                                                    ['bold', 'underline', 'italic', 'strike'],
                                                                    ['fontColor', 'hiliteColor', 'textStyle'],
                                                                    ['removeFormat'],
                                                                    ['outdent', 'indent'],
                                                                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                                                                    ['table', 'link', 'image'],
                                                                    ['fullScreen'],
                                                                    ['preview', 'print'],
                                                                ]
                                                            }} />
                                                        </div>
                                                    </div>

                                                    {/* single File upload start */}
                                                    <div className="row form-group">
                                                        <label className="text-md-right mt-3 col-lg-4 col-form-label">List File Upload</label>
                                                        <div className="col-lg-8">
                                                            <div className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                <input id="upload" name="listImage" type="file" onChange={(e) => imageChange(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                                <div className="input-group-append">
                                                                    <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"><i className="fa fa-cloud-upload mr-2 text-muted"></i></label>
                                                                </div>
                                                            </div>
                                                            <div className="label muted text-center mb-2">The image uploaded will be rendered inside the box below.</div>
                                                            <div className="mt-2 Elements_imageArea__1uoYY">
                                                                {selectedImage && (
                                                                    <img id="imageResult" src={URL.createObjectURL(selectedImage)} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* single File upload end */}

                                                    <div className="row form-group">
                                                        <label className="col-md-5 col-form-label"></label>
                                                        <div className="col-md-7">
                                                            <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == false ? saveChanges(event) : ''}>Save Changes</button>
                                                            <button className="mt-3 btn btn-default" onClick={() => setFormInputs([])}>Cancel</button>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="headline-4 col-lg-12" style={{ color: 'red', textAlign: 'center', paddingBottom: '15px' }}>{validateMessage}</div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div className="mt-4 mt-md-0 col-12 col-lg-9" style={{ display: showSliderSection == true ? 'block' : 'none', margin: 'auto' }}>
                                    <section className="Widget_widget__16nWC">
                                        <div className="widget-p-md">
                                            <form className="">
                                                <div className="headline-2">Slider File Upload </div>
                                                <div className="form-group">
                                                    {/* Multi File upload start */}
                                                    <div className="row form-group">
                                                        <label className="text-md-right mt-3 col-lg-3 col-form-label">Silder Files Upload</label>
                                                        <div className="col-lg-9">
                                                            <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                <input id="previewupload" name="sliderImage" multiple type="file" accept='image/*' onChange={(e) => sliderUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                <label id="previewupload-label" htmlFor="previewupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose files</label>
                                                            </div>
                                                            <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div>
                                                            <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                                {selectedSliderImage.map((val, index) => {
                                                                    return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Multi File upload end */}

                                                    <div className="row form-group">
                                                        <label className="col-md-5 col-form-label"></label>
                                                        <div className="col-md-7">
                                                            <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == true ?'':uploadSlider(event)}>Upload Slider</button>
                                                            <button className="mt-3 btn btn-default" onClick={() => setFormInputs([])}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-4 mt-md-0 col-12 col-lg-9" style={{ display: showPreviewSection == true ? 'block' : 'none', margin: 'auto' }}>
                                    <section className="Widget_widget__16nWC">
                                        <div className="widget-p-md">
                                            <div className="headline-2">Preview File Upload </div>
                                            <div className="form-group">
                                                {/* Multi Preview File upload start */}
                                                <div className="row form-group">
                                                    <label className="text-md-right mt-3 col-lg-4 col-form-label">Preview Files Upload</label>
                                                    <div className="col-lg-8">
                                                        <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                            <input id="multiupload" name="previewImage" multiple type="file" onChange={(e) => previewUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                            <label id="multiupload-label" htmlFor="multiupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose files</label>
                                                        </div>
                                                        <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div>
                                                        <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                            {selectedPreviewImage.map((val, index) => {
                                                                return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Multi Preview File upload end */}
                                                <div className="row form-group">
                                                    <label className="col-md-5 col-form-label"></label>
                                                    <div className="col-md-7">
                                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == true ?'':uploadPreview(event)}>Upload Preview</button>
                                                        <button className="mt-3 btn btn-default" onClick={() => setFormInputs([])}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-4 mt-md-0 col-12 col-lg-9" style={{ display: showDownloadFileSection == true ? 'block' : 'none', margin: 'auto' }}>
                                    <section className="Widget_widget__16nWC">
                                        <div className="widget-p-md">
                                            <div className="headline-2">Downloadable File Upload </div>
                                            <div className="form-group">
                                                {/* Multi Preview File upload start */}
                                                <div className="row form-group">
                                                    <label className="text-md-right mt-3 col-lg-4 col-form-label">Preview Files Upload</label>
                                                    <div className="col-lg-8">
                                                        <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                            <input id="multiupload" name="downloadFile" type="file" onChange={(e) => downloadFileUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                            <label id="multiupload-label" htmlFor="multiupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                        </div>
                                                        <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div>
                                                        <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                            {selectedDownloadableFile.map((val, index) => {
                                                                return  <label className="col-md-5 col-form-label">{val.name}</label>
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Multi Preview File upload end */}
                                                <div className="row form-group">
                                                    <label className="col-md-5 col-form-label"></label>
                                                    <div className="col-md-7">
                                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == true ?'': uploadDownloadFile(event)}>Upload Preview</button>
                                                        <button className="mt-3 btn btn-default" onClick={() => setFormInputs([])}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default Addproduct;

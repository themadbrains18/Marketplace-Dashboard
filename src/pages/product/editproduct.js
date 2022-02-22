import React, { useState, useEffect } from "react";
import {
    Col,
    Row,
    TabContent, TabPane, Nav, NavItem, NavLink,
    Card, Button, CardTitle, CardText, FormGroup, Label, Input, Form
} from "reactstrap";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { update, saveSlider, savePreview, getProductDetailById, saveDownloadFiles, saveHeroImage, saveThumbImage } from '../../actions/product';
import { getCategory } from '../../actions/category';
import { getSubCategory } from '../../actions/subcategory';
import { getTools } from '../../actions/tools';
import AlertNotification from '../../components/AlertNotification/notification';
import s from "./addproduct.module.scss";
const { apiurl, imageUrl } = require('../../config');

const Editproduct = (props) => {

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
    const [productUrl, setImageUrl] = useState('');
    const [sliderImages, setSliderImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [alert, setAlert] = useState({});
    const [buttonDisable, setButtonDisable] = useState(false);
    const [downloadableFile, setDownloadableFile] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const [tempId, setTempId] = useState(Math.random().toString(32).slice(2, 11));
    const [selectedHeroImage, setSelectedHeroImage] = useState([]);
    const [selectedThumbImage, setSelectedThumbImage] = useState([]);
    const [heroImage, setHeroImage] = useState([]);
    const [thumbImage, setThumbImage] = useState([]);

    const [checkedTools, setCheckedTools] = useState([]);

    const initialState = {
        category: "",
        subcategory: "",
        tools: "",
        title: "",
        admin: "",
        link: "",
        overview: "",
        highlight: "",
        template: "",
        fonts: "",
        productstatus: ""
    };

    const [{ category, subcategory, tools, title, admin, link, overview, highlight, template, fonts,
        productstatus }, setFormInputs] = useState([]);

    // onLoad get master table data
    useEffect(() => {
        getAllCategory();
        getSubcategoryData();
        getAllTools();
        getProductById();

    }, [])

    // tabs toggle 
    const toggle = (tab) => {
        if (activeTab != tab) {
            setActiveTab(tab);
        }
    }

    async function getProductById() {
        let productid = props.match.params.posturl;
        try {
            const response = await getProductDetailById(productid);
            console.log(response);
            let data = response.data.product;
            setSliderImages(response.data.productslider);
            setPreviewImages(response.data.productPreview);
            setDownloadableFile(response.data.downloadablefile);
            setHeroImage(response.data.productHeroImage);
            setThumbImage(response.data.productThumbImage);
            setImageUrl(imageUrl + "images/" + data.image);
            const responsesubcategory = await getSubCategory();
            let Array = responsesubcategory.data.filter(item => item.category._id == data.category);
            setSubcategoryArray(Array);
            setCheckedTools(data.tools.split(','));
            let features = data.highlight.split(',')
            var elements = document.getElementsByClassName("highlight");
            for (let j = 0; j < elements.length; j++) {
                if (features[j] != undefined) {
                    elements[j].value = features[j];
                }

            }
            setFormInputs({
                category: data.category, subcategory: data.subcategory, tools: data.tools._id, title: data.title,
                admin: data.adminname, link: data.sharelink, overview: data.overview, highlight: data.highlight, template: data.template,
                fonts: data.fonts, productstatus: data.productstatus
            });

        } catch (e) {
            console.error(e);
        }
    }

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
            setImageUrl('');
            setSelectedImage(e.target.files[0]);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: e.target.files[0].name }));
        }
    };

    let handleOverviewChange = (e) => {
        setFormInputs(prevState => ({ ...prevState, 'overview': e }));
    }

    let onChangeCompatibility = (e) => {
        let existitem = checkedTools.filter(item => item == e.target.value);
        if (existitem.length == 0) {
            setCheckedTools(oldArray => [...oldArray, e.target.value]);
        }
        else {
            setCheckedTools(checkedTools.filter(item => item !== e.target.value));
        }
        setAlert({})
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
        if (title == undefined) {
            setAlert({ type: 'warning', message: 'Please enter name' })
        } 
        else if (admin == undefined) {
            setAlert({ type: 'warning', message: 'Please enter admin name' })
        } 
        else if (category == undefined) {
            setAlert({ type: 'warning', message: 'Please select category' })
        } 
        else if (subcategory == undefined) {
            setAlert({ type: 'warning', message: 'Please select subcategory' })
        } 
        else if (productstatus == undefined) {
            setAlert({ type: 'warning', message: 'Please select product status' })
        }
        else if (template == undefined) {
            setAlert({ type: 'warning', message: 'Please select template type' })
        } 
        else if (checkedTools.length == 0) {
            setAlert({ type: 'warning', message: 'Please select Compatibility' })
        }
        // else if (link == undefined) {
        //     setValidateMessage('Please enter shareable link');
        // } 
        // else if (overview == undefined) {
        //     setValidateMessage('Please enter product overview');
        // }
        // else if (highlight == undefined) {
        //     setValidateMessage('Please select product highlight');
        // }
        else if (selectedImage == '') {
            setAlert({ type: 'warning', message: 'Please upload image' });
        }
        else {
            saveProduct();
        }
    }

    async function saveProduct() {
        setButtonDisable(true);
        let tools = '';
        for (let i = 0; i < checkedTools.length; i++) {
            if (tools == '') {
                tools = checkedTools[i];
            }
            else {
                tools += ',' + checkedTools[i];
            }
        }

        var elements = document.getElementsByClassName("highlight");

        let highlight='';
        for(let j=0;j<elements.length;j++){
            if(elements[j].value!='' && elements[j].value!=undefined){
                if (highlight == '') {
                    highlight = elements[j].value;
                }
                else {
                    highlight += ',' + elements[j].value;
                }
            }
        }
        let formInputs = { category, subcategory, tools, title, admin, link, overview, highlight, template, fonts,
            productstatus }

        let productid = props.match.params.posturl;
        let response = await update(productid, formInputs, selectedImage, config);
        if (response.data) {
            if (response.data.status == 401) {
                setAlert({ type: 'warning', message: response.data.message })
                setTimeout(() => {
                    setAlert({})
                    setButtonDisable(false);
                }, 3000)
            }
            else if (response.data.status == 200) {
                setAlert({ type: 'success', message: response.data.message })
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                    console.log(response);
                    setFormInputs({ ...initialState });
                    setSelectedImage();
                    setSelectedSliderImage([]);
                    setselectedPreviewImage([]);
                    setSelectedDownloadableFile([]);
                    setSelectedHeroImage([]);
                    setSelectedThumbImage([]);
                    var elements = document.getElementsByClassName("highlight");
                    for(let j=0;j<elements.length;j++){
                        elements[j].value='';
                    }
                    window.location.href = '#/template/product';
                }, 3000);
            }
            else {
                setAlert({ type: 'error', message: response })
            }

        }
    }

    // upload slider files of product end
    let sliderUpload = (e) => {
        let imageArray = [];
        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                imageArray.push(e.target.files[i]);
            }
            setSelectedSliderImage(imageArray);
            setSliderImages([]);
            saveProductSlider(imageArray);
        }
    };

    async function saveProductSlider(imageArray) {
        if (imageArray.length > 0) {
            let productid = props.match.params.posturl;
            let response = await saveSlider(productid, imageArray, config);
            if (response.data) {
                if (response.data.status == 200) {
                    setTimeout(() => {
                        setAlert({})
                    }, 3000);
                }
            }
        }
    }
    // upload slider files of product end

    // upload preview files of product start
    let previewUpload = (e) => {
        let previewArray = [];

        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                previewArray.push(e.target.files[i]);
            }
            setselectedPreviewImage(previewArray);
            setPreviewImages([]);
            saveProductPreview(previewArray);
        }
    }

    async function saveProductPreview(previewArray) {
        if (previewArray.length > 0) {
            let productid = props.match.params.posturl;
            let response = await savePreview(productid, previewArray, config);
            if (response.data) {
                if (response.data.status == 200) {
                    setTimeout(() => {
                        setAlert({})
                    }, 3000);
                }
            }
        }
    }
    // upload preview files of product end

    // upload downloadable files of product start
    let downloadFileUpload = (e) => {
        debugger;
        let downloadFileArray = [];

        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                downloadFileArray.push(e.target.files[i]);
            }
            setSelectedDownloadableFile(downloadFileArray);
            setDownloadableFile([]);
            saveDownloadFile(downloadFileArray);
        }
    }

    async function saveDownloadFile(downloadFileArray) {
        debugger;
        let productid = props.match.params.posturl;
        if (downloadFileArray.length > 0) {
            let response = await saveDownloadFiles('skilify', productid, downloadFileArray, config);
            if (response.data) {
                if (response.data.status == 200) {
                    setTimeout(() => {
                        setAlert({})
                    }, 3000);
                }
            }
        }
    }
    // upload downloadable files of product end

    // Upload Hero file that show product banner start
    let changeHeroImage = (e) => {
        let heroArray = [];
        if (e.target.files && e.target.files.length > 0) {
            heroArray.push(e.target.files[0]);
            setSelectedHeroImage(heroArray);
            setHeroImage([]);
            uploadHeroImage(heroArray);
        }
    };

    async function uploadHeroImage(imageFile) {
        let productid = props.match.params.posturl;
        let response = await saveHeroImage(productid, imageFile, config);
        console.log(response);
    }
    // Upload Hero file that show product banner end

    // upload Thumb file that show in product card start
    let changeThumbImage = (e) => {
        let thumbArray = [];
        if (e.target.files && e.target.files.length > 0) {
            thumbArray.push(e.target.files[0]);
            setSelectedThumbImage(thumbArray);
            setThumbImage([]);
            uploadThumbImage(thumbArray);
        }
    };

    async function uploadThumbImage(imageFile) {

        let productid = props.match.params.posturl;
        let response = await saveThumbImage(productid, imageFile, config);
        console.log(response);
    }
    // upload Thumb file that show in product card end

    // Redirect to product list page
    const redirectProduct = () => {
        window.location.href = '#/template/product';
    }

    const renderCheckbox = (val, index) => {
        if (checkedTools.filter(item => item == val._id).length > 0) {
            return <><Input type="checkbox" id={'checkbox' + (index + 1)} checked={true} value={val._id} onChange={(event) => onChangeCompatibility(event)} />
                <Label htmlFor={'checkbox' + (index + 1)}>{val.name}</Label><br /></>
        }
        else {
            return <><Input type="checkbox" id={'checkbox' + (index + 1)} value={val._id} onChange={(event) => onChangeCompatibility(event)} />
                <Label htmlFor={'checkbox' + (index + 1)}>{val.name}</Label><br /></>
        }

    }

    return (
        <div>
            <Row>
                <Col className="pr-grid-col" xs={12} lg={12}>
                    <AlertNotification alert={alert} />
                    <Row>
                        <Col xs={12} lg={12}>
                            <div className={s.tableTitle}>
                                <div className="headline-2"></div>
                                <div className="d-flex">
                                    <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == false ? saveChanges(event) : ''}>Save Changes</button>
                                    <button className="mt-3 btn btn-default" onClick={(event) => { setFormInputs([]); redirectProduct(event) }}>Cancel</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={12}>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={activeTab == '1' ? 'active' : ''}
                                        onClick={() => toggle('1')}
                                    >
                                        General
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab == '2' ? 'active' : ''}
                                        onClick={() => toggle('2')}
                                    >
                                        Images
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab == '3' ? 'active' : ''}
                                        onClick={() => toggle('3')}
                                    >
                                        Files
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="8">
                                            <div className="col-12 col-lg-12" style={{ display: showFormSection == true ? 'block' : 'none' }}>
                                                <section className="Widget_widget__16nWC">
                                                    <div className="widget-p-md">
                                                        <div className="form-group">
                                                            <Form className="">
                                                                <Row>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldName">Name<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input name="title" value={title} id="fieldName" placeholder="Title" type="text" className="form-control" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }} />
                                                                        </FormGroup>

                                                                    </Col>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldAuther">Created By<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Input name="admin" value={admin} id="fieldAuther" placeholder="Admin Name" type="text" className="form-control" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="exampleCategory">Category<span style={{ color: 'red' }}>*</span></Label>
                                                                            <select name="category" id="exampleCategory" value={category} className="css-yk16xz-control form-select" style={{ width: '100%' }} onChange={(event) => { filterSubcategory(event); setAlert({}) }} aria-label="Default select example">
                                                                                <option selected>Select Category</option>
                                                                                {categoryArray.map((val, index) => {
                                                                                    return <option value={val._id}>{val.name}</option>
                                                                                })}
                                                                            </select>
                                                                        </FormGroup>

                                                                    </Col>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldSubcategory">Subcategory<span style={{ color: 'red' }}>*</span></Label>
                                                                            <select name="subcategory" id="fieldSubcategory" value={subcategory} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }}>
                                                                                <option selected>Select Subcategory</option>
                                                                                {subCategoryArray.map((val, index) => {
                                                                                    return <option value={val._id}>{val.name}</option>
                                                                                })}
                                                                            </select>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="exampleTemplate">Template Type<span style={{ color: 'red' }}>*</span></Label>
                                                                            <select name="template" id="exampleTemplate" value={template} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }}>
                                                                                <option selected>Select Template</option>
                                                                                <option value="web">Website</option>
                                                                                <option value="mob">Mobile</option>
                                                                            </select>
                                                                        </FormGroup>

                                                                    </Col>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldlink">Shareable Link</Label>
                                                                            <Input name="link" value={link} id="link-field" placeholder="link" type="text" className="form-control" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldFonts">Fonts</Label>
                                                                            <Input name="fonts" value={fonts} id="fieldFonts" placeholder="Title" type="text" className="form-control" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }} />
                                                                        </FormGroup>

                                                                    </Col>

                                                                </Row>
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fielddescription">Description</Label>
                                                                            <SunEditor id='fielddescription' setContents={overview} name="overview" placeholder="Add Overview Here.." onChange={(e) => {handleOverviewChange(e); setAlert({})}} setOptions={{
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
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <CardTitle>Features and Compatibility</CardTitle>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="exampleTemplate">Features</Label>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col sm="12">
                                                                                    <Input type="text" name={highlight} className="form-control highlight" onChange={() => { setAlert({}) }} />
                                                                                </Col>
                                                                            </Row>

                                                                        </FormGroup>

                                                                    </Col>
                                                                    <Col sm="6">
                                                                        <FormGroup>
                                                                            <Label htmlFor="fieldlink">Compatibility<span style={{ color: 'red' }}>*</span></Label>
                                                                            <Row>
                                                                                <Col sm="11" style={{ margin: 'auto' }}>
                                                                                    {Tools.map((val, index) => {
                                                                                        { return renderCheckbox(val, index) }
                                                                                    })}
                                                                                </Col>
                                                                            </Row>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </Col>
                                        <Col sm="4">
                                            <Row>
                                                <Col>
                                                    <Card body>
                                                        <CardTitle>Status<span style={{ color: 'red' }}>*</span></CardTitle>
                                                        <div className="col-md-12">
                                                            <div className=" css-2b097c-container">
                                                                <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                                <select name="productstatus" id="exampleStatus" value={productstatus} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={({ target }) => { setFormInputs(prevState => ({ ...prevState, [target.name]: target.value })); setAlert({}) }}>
                                                                    <option selected>Select Status</option>
                                                                    <option value="dev">Devlopment</option>
                                                                    <option value="prev">Preview Mode</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col>
                                                    <Card body>
                                                        <CardTitle>Product Card Image<span style={{ color: 'red' }}>*</span></CardTitle>
                                                        <div className="row form-group">
                                                            <div className="col-lg-12">
                                                                <div className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                    <input id="upload" name="listImage" type="file" onChange={(e) => {imageChange(e); ; setAlert({})}} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                    <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                                    <div className="input-group-append">
                                                                        <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"><i className="fa fa-cloud-upload mr-2 text-muted"></i></label>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 Elements_imageArea__1uoYY">
                                                                    {selectedImage && (
                                                                        <img id="imageResult" src={URL.createObjectURL(selectedImage)} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                                    )}
                                                                    {productUrl && (
                                                                        <img id="imageResult" src={productUrl} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>


                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Hero Image</CardTitle>
                                                <div className="row form-group">
                                                    <div className="col-lg-12">
                                                        <div className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                            <input id="upload" name="listImage" type="file" onChange={(e) => changeHeroImage(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                            <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                            <div className="input-group-append">
                                                                <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"><i className="fa fa-cloud-upload mr-2 text-muted"></i></label>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 Elements_imageArea__1uoYY">
                                                            {selectedHeroImage.map((val, index) => {
                                                                return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                            })}
                                                            {heroImage.map((val, index) => {
                                                                                    return <img id={"imageResult" + index} src={imageUrl + "images/" + val.image} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Thumbs image<span style={{ color: 'red' }}>*</span></CardTitle>
                                                <div className="row form-group">
                                                    <div className="col-lg-12">
                                                        <div className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                            <input id="upload" name="listImage" type="file" onChange={(e) => changeThumbImage(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                            <label id="upload-label" htmlFor="upload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                            <div className="input-group-append">
                                                                <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4"><i className="fa fa-cloud-upload mr-2 text-muted"></i></label>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 Elements_imageArea__1uoYY">
                                                            {selectedThumbImage.map((val, index) => {
                                                                return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                            })}
                                                            {thumbImage.map((val, index) => {
                                                                                    return <img id={"imageResult" + index} src={imageUrl + "images/" + val.image} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Detail Images</CardTitle>
                                                <div className="mt-4 mt-md-0 col-12 col-lg-12">
                                                    <section className="Widget_widget__16nWC">
                                                        <div className="widget-p-md">
                                                            <form className="">
                                                                <div className="form-group">
                                                                    {/* Multi File upload start */}
                                                                    <div className="row form-group">
                                                                        <div className="col-lg-12">
                                                                            <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                                <input id="previewupload" name="sliderImage" multiple type="file" accept='image/*' onChange={(e) => sliderUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                                <label id="previewupload-label" htmlFor="previewupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose files</label>
                                                                            </div>
                                                                            {/* <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div> */}
                                                                            <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                                                {selectedSliderImage.map((val, index) => {
                                                                                    return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                                })}
                                                                                {sliderImages.map((val, index) => {
                                                                                    return <img id={"imageResult" + index} src={imageUrl + "images/" + val.image} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Multi File upload end */}
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </section>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Full Preview Images</CardTitle>
                                                <div className="mt-4 mt-md-0 col-12 col-lg-12">
                                                    <section className="Widget_widget__16nWC">
                                                        <div className="widget-p-md">
                                                            <div className="form-group">
                                                                {/* Multi Preview File upload start */}
                                                                <div className="row form-group">
                                                                    <div className="col-lg-12">
                                                                        <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                            <input id="multiupload" name="previewImage" multiple type="file" onChange={(e) => previewUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                            <label id="multiupload-label" htmlFor="multiupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose files</label>
                                                                        </div>
                                                                        {/* <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div> */}
                                                                        <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                                            {selectedPreviewImage.map((val, index) => {
                                                                                return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                                            })}
                                                                            {previewImages.map((val, index) => {
                                                                                return <img id={"imageResult" + index} src={imageUrl + "images/" + val.image} alt="" className="img-fluid rounded shadow-sm mx-auto d-block" />
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="3">
                                    <Row>
                                        <Col sm="8">
                                            <Card body>
                                                <CardTitle>Source File Upload</CardTitle>
                                                <div className="mt-4 mt-md-0 col-12 col-lg-12">
                                                    <section className="Widget_widget__16nWC">
                                                        <div className="widget-p-md">
                                                            <div className="form-group">
                                                                <div className="row form-group">
                                                                    <div className="col-lg-12">
                                                                        <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                            <input id="multiupload" name="downloadFile" type="file" onChange={(e) => downloadFileUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                            <label id="multiupload-label" htmlFor="multiupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose file</label>
                                                                        </div>
                                                                        <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                                            {selectedDownloadableFile.map((val, index) => {
                                                                                return <label className="col-md-5 col-form-label">{val.name}</label>
                                                                            })}
                                                                            {downloadableFile.map((val, index) => {
                                                                                return <label className="col-md-5 col-form-label">{val.name}</label>
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default Editproduct;

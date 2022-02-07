import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Col,
    Row,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import {getCategory } from '../../actions/category';
import {getSubCategoryWithId, update } from '../../actions/subcategory';
import AlertNotification from '../../components/AlertNotification/notification';
import s from "./subcategory.module.scss";


const axios = require("axios");

const EditSubCategory = function (props) {

    const [categoryArray, setCategoryArray] = useState([]);
    const [validateMessage, setValidateMessage] = useState('');
    const[subname,setName]=useState();
    const[subadmin,setAdmin]=useState();
    const[subcategoryid,setCategoryid]=useState();
    const[alert,setAlert]=useState({});
    const [buttonDisable , setButtonDisable]=useState(false);

    useEffect(async () => {
        getAllCategory();
        getSubCategoryById();
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

    const initialState = {
        name: "",
        admin: "",
        categoryid:""
    };
    let [{categoryid, name, admin }, setFormInputs] = useState(initialState);

    // get Category List data
    async function getSubCategoryById() {
        try {
            let id = props.match.params.posturl;
            const response = await getSubCategoryWithId(id);
            let data = response.data;
            setName(data.name);
            setAdmin(data.admin);
            setCategoryid(data.category);
            setFormInputs({
                name: data.name, admin: data.admin, categoryid:data.category
            });

        } catch (e) {
            console.error(e);
        }
    };

    // save category to database
    let saveChanges = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (name == "") {
            setValidateMessage('please enter subcategory name');
            return;
        }
        if (admin == "") {
            setValidateMessage('please enter admin name');
            return;
        }
        saveSubCategory();
    }

    async function saveSubCategory() {
        let id = props.match.params.posturl;
        if(name==undefined){
            name=subname;
        }
        if(admin==undefined){
            admin=subadmin;
        }
        if(categoryid==undefined){
            categoryid=subcategoryid;
        }
        let response = await update(id,categoryid, name, admin);
        if (response.data) {
            if (response.data.status == 401) {
                setAlert({type:'warning', message : response.data.message})
                setTimeout(() => {
                    setButtonDisable(false);
                    setAlert({})
                }, 3000);
            }
            else if (response.data.status == 200) {
                setAlert({type:'success', message : response.data.message})
                setTimeout(() => {
                    setAlert({})
                    setButtonDisable(false);
                    window.location.href='/#/template/subcategory';
                }, 3000);
            }
            else {
                setAlert({type:'error', message : response})
            }
            // window.location.href = '/#/template/subcategory';
        }
    }

    const subcategorylist =()=>{
        window.location.href = '/#/template/subcategory';
    }

    const onCategoryChange =(e)=>{
        setFormInputs({
            categoryid: e.target.value
        });
    }


    return (
        <div>
            <Row>
                <Col>
                    <AlertNotification alert={alert} />
                    <Row className="mb-4">
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2">Basic Information</div>
                                    <div className="d-flex">
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={()=>subcategorylist()}>Subcategory List</button>
                                    </div>
                                </div>
                                <div className="headline-4" style={{ padding: '0px 150px', color: 'red' }}>{validateMessage}</div>
                                <div className="widget-table-overflow">

                                    <div className="form-group">
                                        <form className="">
                                            <div className="row form-group">
                                                <label htmlFor="default-select" className="text-md-right col-md-1 col-form-label">Category</label>
                                                <div className="col-md-7">
                                                    <div className=" css-2b097c-container">
                                                        <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                        <select name="categoryid" id="category" value={categoryid} className="css-yk16xz-control form-select" style={{ width: '100%' }} aria-label="Default select example" onChange={(event) => onCategoryChange(event)}>
                                                            <option selected>Select Category</option>
                                                            {categoryArray.map((val, index) => {
                                                                return <option value={val._id}>{val.name}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <label htmlFor="normal-field" className="text-md-right col-md-1 col-form-label">Category</label>
                                                <div className="col-md-7">
                                                    <input name="name" id="normal-field" placeholder="Category" value={name} type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <label htmlFor="by-field" className="text-md-right col-md-1 col-form-label">By</label>
                                                <div className="col-md-7">
                                                    <input name="admin" id="by-field" placeholder="Admin Name" value={admin} type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <label className="col-md-1 col-form-label"></label>
                                                <div className="col-md-7">
                                                    <button type="submit" style={{ cursor:buttonDisable == true ? 'not-allowed' : '', pointerEvents:buttonDisable == true ? 'none' : '', opacity : buttonDisable == true ? 0.2 : 1 }} className="mr-3 mt-3 btn btn-primary" onClick={(event) => buttonDisable == false ? saveChanges(event) : ''}>Save Changes</button>
                                                    <button className="mt-3 btn btn-default" onClick={() => subcategorylist()}>Cancel</button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </Widget>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default EditSubCategory;

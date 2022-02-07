import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Col,
    Row,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import { getCategoryWithId, update } from '../../actions/category';
import AlertNotification from '../../components/AlertNotification/notification';
import s from "./category.module.scss";


const axios = require("axios");

const EditCategory = function (props) {

    const[validateMessage,setValidateMessage]=useState('');
    const[subname,setName]=useState();
    const[subadmin,setAdmin]=useState();
    const[alert,setAlert]=useState({});
    const [buttonDisable , setButtonDisable]=useState(false);

    useEffect(async () => {
        getCategoryById();
    }, [])

    const initialState = {
        name: "",
        admin: ""
    };
    let [{ name, admin }, setFormInputs] = useState(initialState);

    // get Category List data
    async function getCategoryById() {
        try {
            let id = props.match.params.posturl;
            const response = await getCategoryWithId(id);
            let data = response.data;
            setName(data.name);
            setAdmin(data.admin);
            setFormInputs({
                name: data.name, admin: data.admin
            });
            
        } catch (e) {
            console.error(e);
        }
    };

    // save category to database
    let saveChanges = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if(name==""){
            setValidateMessage('please enter subcategory name');
            return;
        }
        if(admin==""){
            setValidateMessage('please enter admin name');
            return;
        }
        saveCategory();
    }

    async function saveCategory() {
        let id = props.match.params.posturl;
        if(name==undefined){
            name=subname;
        }
        if(admin==undefined){
            admin=subadmin;
        }
        let response = await update(id,name, admin);
        if (response.data) {
            if (response.data) {
                if (response.data.status == 401) {
                    setAlert({type:'warning', message : response.data.message})
                    setTimeout(()=>{
                        setButtonDisable(false);
                        setAlert({})
                    },3000)
                }
                else if (response.data.status == 200) {
                    setAlert({type:'success', message : response.data.message})
                    setTimeout(() => {
                        setButtonDisable(false);
                        setAlert({})
                        window.location.href='/#/template/category';
                    }, 3000);
                }
                else {
                    setAlert({type:'error', message : response})
                }
            }
            
        }
    }

    const gotolist=()=>{
        window.location.href='/#/template/category';
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
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary">Category List</button>
                                    </div>
                                </div>
                                <div className="headline-4" style={{padding:'0px 150px', color:'red'}}>{validateMessage}</div>
                                <div className="widget-table-overflow">
                                    <div className="form-group">
                                        <form className="">
                                            <div className="row form-group">
                                                <label htmlFor="normal-field" className="text-md-right col-md-1 col-form-label" onClick={()=>gotolist()}>Category</label>
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
                                                    <button className="mt-3 btn btn-default" onClick={()=>gotolist()}>Cancel</button>
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

export default EditCategory;

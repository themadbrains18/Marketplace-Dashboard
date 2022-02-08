import React, { useState, useEffect } from "react";
import {
    Col,
    Row
} from "reactstrap";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { saveBanner } from '../../actions/banner';
import AlertNotification from '../../components/AlertNotification/notification';

const Addbanner = () => {

    const [selectedImage, setSelectedImage] = useState([]);
    const [alert, setAlert] = useState({});
    const [buttonDisable, setButtonDisable] = useState(false);
    const [formInputs, setFormInputs] = useState([]);

    // upload slider files of product
    let sliderUpload = (e) => {
        let imageArray = [];
        if (e.target.files && e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                imageArray.push(e.target.files[i]);
            }
            setSelectedImage(imageArray);
            setFormInputs(prevState => ({ ...prevState, [e.target.name]: imageArray }));
        }
    };

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
        saveBannerImage();

    }

    async function saveBannerImage() {

        let response = await saveBanner( selectedImage, config);
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
                    setSelectedImage([]);
                }, 3000);
            }
            else {
                setAlert({ type: 'error', message: response })
            }

        }
    }

    return (
        <div>
            <Row>
                <Col className="pr-grid-col" xs={12} lg={12}>
                    <AlertNotification alert={alert} />
                    <Row className="gutter mb-4">
                        <Col xs={12}>
                            <div className="gutter mb-4 row">

                                <div className="mt-4 mt-md-0 col-12 col-lg-9">
                                    <section className="Widget_widget__16nWC">
                                        <div className="widget-p-md">
                                            <form className="">
                                                <div className="headline-2">Banner File Upload </div>
                                                <div className="form-group">
                                                    {/* Multi File upload start */}
                                                    <div className="row form-group">
                                                        <label className="text-md-right mt-3 col-lg-3 col-form-label">Banner Files Upload</label>
                                                        <div className="col-lg-9">
                                                            <div tabindex="0" className="input-group mb-4 px-2 py-2 rounded-pill bg-light-gray">
                                                                <input id="previewupload" name="sliderImage" multiple type="file" accept='image/*' onChange={(e) => sliderUpload(e)} className="form-control border-0 Elements_upload__3DkRJ" />
                                                                <label id="previewupload-label" htmlFor="previewupload" className="font-weight-light text-muted Elements_uploadLabel__3xshw">Choose files</label>
                                                            </div>
                                                            <div className="label muted text-center mb-2">The images uploaded will be rendered inside the box below.</div>
                                                            <div className="mt-2 Elements_imageArea__1uoYY" style={{ height: '500px', overflow: 'auto' }}>
                                                                {selectedImage.map((val, index) => {
                                                                    return <img id={"imageResult" + index} src={URL.createObjectURL(val)} alt="" className="multi-img-fluid rounded shadow-sm mx-auto d-block" />
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Multi File upload end */}

                                                    <div className="row form-group">
                                                        <label className="col-md-5 col-form-label"></label>
                                                        <div className="col-md-7">
                                                            <button type="submit" className="mr-3 mt-3 btn btn-primary" style={{ cursor: buttonDisable == true ? 'not-allowed' : '', pointerEvents: buttonDisable == true ? 'none' : '', opacity: buttonDisable == true ? 0.2 : 1 }} onClick={(event) => buttonDisable == false ? saveChanges(event) : ''}>Upload Slider</button>
                                                            <button className="mt-3 btn btn-default" onClick={() => setFormInputs([])}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
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

export default Addbanner;

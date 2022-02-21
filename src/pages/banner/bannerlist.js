import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    Col,
    Row,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Label,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Form,
    FormGroup,
    InputGroupAddon,
    InputGroup,
    Input,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { getBanner , removeBanner } from '../../actions/banner';
import moreIcon from "../../assets/tables/moreIcon.svg";
import s from "./banner.module.scss";
import AlertNotification from '../../components/AlertNotification/notification';
const {apiurl ,imageUrl} = require('../../config');

const Bannerlist = () => {

    const [selectedImage, setSelectedImage] = useState([]);
    const [alert, setAlert] = useState({});

    const [firstTableCurrentPage, setFirstTableCurrentPage] = useState(0);

    const [firstTable, setFirstTable] = useState([]);

    const pageSize = 10;
    const firstTablePagesCount = Math.ceil(firstTable.length / pageSize);
    const [deletePopup, setDeletePopup] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    useEffect(async () => {
        getAllBanner();
    }, [])

    let token = localStorage.getItem('access_token');
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        }
    }

    async function getAllBanner(){
        let response = await getBanner(config);
        console.log(response);
        setFirstTable(response.data.map(transaction => {
            transaction.dropdownOpen = false;
            return transaction;
        }));
    }

    const setFirstTablePage = (e, index) => {
        e.preventDefault();
        setFirstTableCurrentPage(index);
    }

    // onclick more option 
    const tableMenuOpen = (id) => {
        setFirstTable(
            firstTable.map(transaction => {
                if (transaction._id === id) {
                    transaction.dropdownOpen = !transaction.dropdownOpen;
                }
                return transaction;
            })
        )
    }

    const openDeletePopup = (item) => {
        setDeletePopup(true);
        setSelectedRow(item);
    }

    const deletePopupreq = () => {
        finalDeletePopup();
    }

    async function finalDeletePopup() {
        try {
            let id = selectedRow._id;
            const response = await removeBanner(id,config);
            console.log(response);
            if (response.data.deletedCount > 0) {
                getAllBanner();
                setDeletePopup(false);
            }

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <Row>
                <Col>
                    <Row className="mb-4">
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2">
                                    </div>
                                    <div className="d-flex">
                                        {/* <button type="submit" className="mr-3 mt-3 btn btn-primary"></button> */}
                                    </div>
                                </div>
                                <div className="widget-table-overflow">
                                    <Table className={`table-striped table-borderless table-hover ${s.statesTable}`} responsive>
                                        <thead>
                                            <tr>
                                                <th className="w-20">Banner</th>
                                                <th className="w-20">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {firstTable
                                                .slice(
                                                    firstTableCurrentPage * pageSize,
                                                    (firstTableCurrentPage + 1) * pageSize
                                                )
                                                .map(item => (
                                                    <tr key={uuidv4()}>
                                                        <td className="d-flex"><img src={imageUrl +"images/"+item.image} className="img-fluid rounded shadow-sm d-block"/></td>
                                                        
                                                        <td>
                                                            <Dropdown
                                                                className="d-none d-sm-block"
                                                                nav
                                                                isOpen={item.dropdownOpen}
                                                                toggle={() => tableMenuOpen(item._id)}
                                                            >
                                                                <DropdownToggle nav>
                                                                    <img className="d-none d-sm-block" src={moreIcon} alt="More..." />
                                                                </DropdownToggle>
                                                                <DropdownMenu >
                                                                    <DropdownItem>
                                                                        <div onClick={() => openDeletePopup(item)}>Delete</div>
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                    <Pagination className="pagination-borderless" aria-label="Page navigation example">
                                        <PaginationItem disabled={firstTableCurrentPage <= 0}>
                                            <PaginationLink
                                                onClick={e => setFirstTablePage(e, firstTableCurrentPage - 1)}
                                                previous
                                                href="#top"
                                            />
                                        </PaginationItem>
                                        {[...Array(firstTablePagesCount)].map((page, i) =>
                                            <PaginationItem active={i === firstTableCurrentPage} key={i}>
                                                <PaginationLink onClick={e => setFirstTablePage(e, i)} href="#top">
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )}
                                        <PaginationItem disabled={firstTableCurrentPage >= firstTablePagesCount - 1}>
                                            <PaginationLink
                                                onClick={e => setFirstTablePage(e, firstTableCurrentPage + 1)}
                                                next
                                                href="#top"
                                            />
                                        </PaginationItem>
                                    </Pagination>
                                </div>
                            </Widget>
                        </Col>
                    </Row>

                    {deletePopup ?
                        <div className={s.popup} style={{ display: 'block' }}>
                            <div className={s.popup__wrapper} onClick={() => { setDeletePopup(false) }}></div>
                            <div className={s.social__share__popup} style={{ display: 'block' }}>
                                <div className={s.social__share__popup__inner}></div>
                                <div className={s.sec__content}>
                                    <div style={{ marginBottom: "25px" }}>
                                        <p style={{ color: 'black' }} className="msg__label" id="validate_msg">{"Please sure you want to remove " + selectedRow.title + " !!."}</p>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-md-12">
                                            <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={(event) => deletePopupreq(event)}>Yes</button>
                                            <button className="mt-3 btn btn-default" onClick={() => setDeletePopup(false)}>Cancel</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div> : null}

                </Col>
            </Row>
        </div>
    )
}

export default Bannerlist;

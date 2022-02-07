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
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import { getTools, save, removeTool } from '../../actions/tools';
import moreIcon from "../../assets/tables/moreIcon.svg";
import AlertNotification from '../../components/AlertNotification/notification';
import s from "./tools.module.scss";


const axios = require("axios");

const Tools = function () {


    const [firstTableCurrentPage, setFirstTableCurrentPage] = useState(0);

    const [listSection, setListSection] = useState(true);
    const [formSection, setFormSection] = useState(false);

    const [firstTable, setFirstTable] = useState([]);

    const pageSize = 10;
    const firstTablePagesCount = Math.ceil(firstTable.length / pageSize);
    const [validateMessage, setValidateMessage] = useState('');

    const [deletePopup, setDeletePopup] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [alert, setAlert] = useState({});
    const [buttonDisable , setButtonDisable]=useState(false);

    useEffect(async () => {
        getAllTools();
    }, [])

    // get Category List data
    async function getAllTools() {
        try {
            const response = await getTools();
            setAlert({})
            setFirstTable(response.data.map(transaction => {
                transaction.dropdownOpen = false;
                return transaction;
            }));
            // setFirstTable(response.data.rows);
        } catch (e) {
            console.error(e);
        }
    };

    const setFirstTablePage = (e, index) => {
        e.preventDefault();
        setFirstTableCurrentPage(index);
    }

    // show form section and hide list
    let categoryform = (e) => {
        e.preventDefault();
        setListSection(false);
        setFormSection(true);
    }

    // show list section and hide form 
    let viewList = (e) => {
        e.preventDefault();
        setListSection(true);
        setFormSection(false);
    }

    const initialState = {
        name: "",
        admin: ""
    };
    const [{ name, admin }, setFormInputs] = useState(initialState);

    // save category to database
    let saveChanges = (e) => {
        e.preventDefault();
        setButtonDisable(true);
        if (name == "") {
            setValidateMessage('please enter tool name');
            return;
        }
        if (admin == "") {
            setValidateMessage('please enter admin name');
            return;
        }
        saveTools();
    }

    async function saveTools() {
        let response = await save(name, admin);
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
                    setFormInputs({ ...initialState });
                    getAllTools();
                    setListSection(true);
                    setFormSection(false);
                }, 3000);
            }
            else {
                setAlert({ type: 'error', message: response })
            }

        }
        else {
            setAlert({ type: 'error', message: response })
        }
    }

    const clearFields = (e) => {
        e.preventDefault();
        setFormInputs({ ...initialState });
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
            const response = await removeTool(id);
            console.log(response);
            if (response.data.deletedCount > 0) {
                getAllTools()
                setDeletePopup(false);
            }

        } catch (e) {
            console.error(e);
        }
    }

    const editTool = (id) => {
        window.location.href = "/#/template/edittool/" + id;
    }

    return (
        <div>
            <Row>
                <Col>
                    <AlertNotification alert={alert} />
                    <Row className="mb-4" style={{ display: listSection == true ? 'block' : 'none' }}>
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2"></div>
                                    <div className="d-flex">
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={(event) => categoryform(event)}>Add New Tool</button>
                                    </div>
                                </div>
                                <div className="widget-table-overflow">
                                    <Table className={`table-striped table-borderless table-hover ${s.statesTable}`} responsive>
                                        <thead>
                                            <tr>
                                                
                                                <th className="w-25">NAME</th>
                                                <th className="w-25">Created By</th>
                                                <th className="w-25">Action</th>
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
                                                       
                                                        <td className="d-flex">{item.name}</td>
                                                        <td>{item.admin}</td>
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
                                                                        <div onClick={() => editTool(item._id)}>Edit</div>
                                                                    </DropdownItem>
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

                    <Row className="mb-4" style={{ display: formSection == true ? 'block' : 'none' }}>
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2">Basic Information</div>
                                    <div className="d-flex">
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={(event) => viewList(event)}>Tool List</button>
                                    </div>
                                </div>
                                <div className="headline-4" style={{ padding: '0px 150px', color: 'red' }}>{validateMessage}</div>
                                <div className="widget-table-overflow">
                                    <div className="form-group">
                                        <form className="">
                                            <div className="row form-group">
                                                <label htmlFor="normal-field" className="text-md-right col-md-1 col-form-label">Tool Name</label>
                                                <div className="col-md-7">
                                                    <input name="name" id="normal-field" placeholder="Tool Name" value={name} type="text" className="form-control" onChange={({ target }) => setFormInputs(prevState => ({ ...prevState, [target.name]: target.value }))} />
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
                                                    <button className="mt-3 btn btn-default" onClick={(e) => clearFields(e)}>Cancel</button>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
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
                                        <p style={{ color: 'black' }} className="msg__label" id="validate_msg">{"Please sure you want to remove " + selectedRow.name + " !!."}</p>
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

export default Tools;

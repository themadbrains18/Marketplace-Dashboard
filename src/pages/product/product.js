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
import { getProduct, removeProduct } from '../../actions/product';
import moreIcon from "../../assets/tables/moreIcon.svg";
import SearchBarIcon from "../../components/Icons/HeaderIcons/SearchBarIcon";
import s from "./product.module.scss";
import { func } from "prop-types";


const axios = require("axios");

const Product = function () {

    const [firstTableCurrentPage, setFirstTableCurrentPage] = useState(0);

    const [firstTable, setFirstTable] = useState([]);

    const pageSize = 10;
    const firstTablePagesCount = Math.ceil(firstTable.length / pageSize);
    const [deletePopup, setDeletePopup] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    useEffect(async () => {
        getAllProduct();
    }, [])

    // get Product List data
    async function getAllProduct() {
        try {
            const response = await getProduct();
            setFirstTable(response.data.map(transaction => {
                transaction.dropdownOpen = false;
                return transaction;
            }));
        } catch (e) {
            console.error(e);
        }
    };

    const setFirstTablePage = (e, index) => {
        e.preventDefault();
        setFirstTableCurrentPage(index);
    }

    const redirectProductform = (e) => {
        e.preventDefault();
        window.location.href = '/#/template/addproduct';
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
            const response = await removeProduct(id);
            console.log(response);
            if (response.data.deletedCount > 0) {
                getAllProduct();
                setDeletePopup(false);
            }

        } catch (e) {
            console.error(e);
        }
    }

    const editProduct = (id) => {
        window.location.href = "/#/template/editproduct/" + id;
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
                                        {/* <Form className="d-none d-sm-block" inline>
                                            <FormGroup>
                                                <InputGroup className='input-group-no-border'>
                                                    <Input id="search-input" placeholder="Search Dashboard" className='focus' />
                                                    <InputGroupAddon addonType="prepend">
                                                        <span>
                                                            <SearchBarIcon />
                                                        </span>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                        </Form> */}
                                    </div>
                                    <div className="d-flex">
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary" onClick={(event) => redirectProductform(event)}>Add New Prodcut</button>
                                    </div>
                                </div>
                                <div className="widget-table-overflow">
                                    <Table className={`table-striped table-borderless table-hover ${s.statesTable}`} responsive>
                                        <thead>
                                            <tr>
                                                <th className="w-20">NAME</th>
                                                <th className="w-20">CATEGORY</th>
                                                <th className="w-20">SUBCATEGORY</th>
                                                <th className="w-20">TOOLS</th>
                                                <th className="w-20">Created By</th>
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
                                                        <td className="d-flex">{item.title}</td>
                                                        <td>{item.category.name}</td>
                                                        <td>{item.subcategory.name}</td>
                                                        <td>{item.tools.name}</td>
                                                        <td>{item.adminname}</td>
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
                                                                        <div onClick={() => editProduct(item._id)}>Edit</div>
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

export default Product;

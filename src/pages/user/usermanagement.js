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
import moreIcon from "../../assets/tables/moreIcon.svg";

import s from "./usermanagement.module.scss";

const Usermanagement = function () {

    const [firstTableCurrentPage, setFirstTableCurrentPage] = useState(0);
    const [firstTable, setFirstTable] = useState([]);
    const pageSize = 10;
    const firstTablePagesCount = Math.ceil(firstTable.length / pageSize);
    const [selectedRow, setSelectedRow] = useState({});

    const setFirstTablePage = (e, index) => {
        e.preventDefault();
        setFirstTableCurrentPage(index);
    }

    return (
        <div>
            <Row>
                <Col>
                    <Row className="mb-4">
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2"></div>
                                    <div className="d-flex">
                                        <button type="submit" className="mr-3 mt-3 btn btn-primary">Add New Prodcut</button>
                                    </div>
                                </div>
                                <div className="widget-table-overflow">
                                    <Table className={`table-striped table-borderless table-hover ${s.statesTable}`} responsive>
                                        <thead>
                                            <tr>
                                                {/* <th className={s.checkboxCol}>
                                                    <div className="checkbox checkbox-primary">
                                                        <input
                                                            className="styled"
                                                            id="checkbox100"
                                                            type="checkbox"
                                                        />
                                                        <label for="checkbox100" />
                                                    </div>
                                                </th> */}
                                                <th className="w-15">AVATAR</th>
                                                <th className="w-15">FIRST NAME</th>
                                                <th className="w-15">LAST NAME</th>
                                                <th className="w-15">PHONE NUMBER</th>
                                                <th className="w-15">E-MAIL</th>
                                                <th className="w-15">ROLE</th>
                                                <th className="w-15">DISABLED</th>
                                                <th className="w-15">ACTIONS</th>
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
                                                        {/* <td>
                                                            <div className="checkbox checkbox-primary">
                                                                <input
                                                                    id={item.id}
                                                                    className="styled"
                                                                    type="checkbox"
                                                                />
                                                                <Label for={item.id} />
                                                            </div>
                                                        </td> */}
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
                                                                // toggle={() => tableMenuOpen(item._id)}
                                                            >
                                                                <DropdownToggle nav>
                                                                    <img className="d-none d-sm-block" src={moreIcon} alt="More..." />
                                                                </DropdownToggle>
                                                                <DropdownMenu >
                                                                    <DropdownItem>
                                                                        <div>Edit</div>
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <div>Delete</div>
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


                </Col>
            </Row>
        </div>
    )
}

export default Usermanagement;

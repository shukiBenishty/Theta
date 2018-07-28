// @flow
import React from 'react';
import firebase from './firebase.js';
import classNames from 'classnames';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Unit from './Unit';
import Groups from './Groups';
import withAuth from './FirebaseAuth';

import { Button, Row, Col } from 'reactstrap';

type State = {
  units: [],
  selectedUnit: {
    name: String,
    id: String
  },
  selectedRowIndex: Number,
  dropdownOpen: boolean,
  dataStatus: string
}

class Units extends React.Component<{}, State> {

  state = {
    units: [],
    selectedUnit: {
      name: '',
      id: ''
    },
    selectedRowIndex: -1,
    dropdownOpen: false,
    dataStatus: 'טוען נתונים...'
  };

  toggle() {
     this.setState(prevState => ({
       dropdownOpen: !prevState.dropdownOpen
     }));
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {

    if( this.props.secRoles.length != prevProps.secRoles.length ) {
      const userRoles = this.props.secRoles;

      const getOptions = {
        source: 'server'
      }

      const self = this;

      const response = await firebase.firestore().collection('units')
                         .get(getOptions);

      const _units = [];

      response.docs.forEach( (unit) => {

        const unitData = unit.data();

        const secRole = unitData.sec_role;
        const isSecGroupFound = userRoles.find( role => {
          return role === secRole
        });

        if( isSecGroupFound ) {
          _units.push({
            name: unitData.name_he,
            education_type: unitData.education_type,
            authority: unitData.authority,
            type: unitData.type,
            symbol: unitData.symbol,
            id: unit.id
          });
        }

      });

      this.setState({
        units: _units,
        dataStatus: _units.length == 0 ? 'No Units are allowed to view for this account'
                                        : this.state.dataStatus
      })
    }
  }

  onUnitSelected = (unit) => {
    this.setState({
      selectedUnit: unit
    })
  }

  onRowSelected = (rowInfo) => {

    this.setState({
      selectedUnit: {
        name: rowInfo.original.name,
        id: rowInfo.original.id
      },
      selectedRowIndex: rowInfo.index
    });
  }

  render() {

    let nextButtonClassName = classNames('btn btn-next btn-fill btn-success btn-wd', {
      'disabled': this.state.selectedUnit.name === ''
    });

    const dropdownTitle = this.state.selectedUnit.name == '' ? 'Select Unit'
                                                          : this.state.selectedUnit.name;

    let unit = this.state.selectedUnit.id == '' ? null
                : <Unit docId={this.state.selectedUnit.id} />

    const self = this;

    const columns = [{
      Header: '',
      expander: true,
      width: 65,
      Expander: ({ isExpanded, ...rest}) =>
        <div>
          { isExpanded ?
            <span>&#x2299;</span> :
            <span>&#x2295;</span>
          }
        </div>,
      style: {
        cursor: 'pointer',
        fontSize: 25,
        padding: 0,
        userSelect: 'none',
        textAlign: 'center'
      }
    }, {
      Header: 'שם',
      accessor: 'name'
    }, {
      Header: 'סמל',
      accessor: 'symbol',
    }, {
      Header: 'רשות',
      accessor: 'authority'
    }, {
      Header: 'סוג מוסד',
      accessor: 'type'
    }, {
      Header: 'סוג חינוך',
      accessor: 'education_type'
    }];

    return <div>
              <div className='panel-header panel-header-sm'></div>
              <div className='content container h-100'>
                <Row>
                  <div className='col col-md-12'>
                    <div className='card'>
                      <div className='card-header'>
                        <h5 className='title'>ניהול מוסדות</h5>
                      </div>
                      <div className='card-body'>
                        <Row>
                          <Col md='12'>
                            <div className='card'>
                              <div className='card-body'>
                                <ReactTable
                                  filterable
                                  data={this.state.units}
                                  columns={columns}
                                  showPagination={true}
                                  className="-striped -highlight"
                                  previousText = 'קודם'
                                  nextText = 'הבא'
                                  pageText = 'עמוד'
                                  ofText = 'מתוך'
                                  rowsText = 'שורות'
                                  getTrProps={(state, rowInfo, column) => {
                                      return {
                                        style: {
                                          cursor: 'pointer',
                                        }
                                      }
                                  }}
                                  getTheadThProps = { () => {
                                    return {
                                      style: {
                                        'textAlign': 'right'
                                      }
                                    }
                                  }}
                                  SubComponent={ row => {
                                    console.log(row.original.id);
                                    return (
                                      <div style={{ padding: "20px" }}>
                                        <br />
                                        <br />
                                          <Unit docId={row.original.id} />
                                      </div>
                                    )
                                  }}>
                                </ReactTable>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='12'>
                            {unit}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
           </div>
  }

}

export default withAuth(Units);

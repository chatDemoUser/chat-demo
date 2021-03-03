import axios from 'axios';
import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { getAllMessagesFromSender } from '../../api';

import TimeRenderer from './TimeRenderer';

import '@fortawesome/fontawesome-free/css/all.css';

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    Pragma: 'no-cache',
  },
};

async function insertMessage(chatUser, message) {
  const url = '/api/messages/insert';
  const data = {
    recipientName: chatUser,
    message,
  };

  const response = await axios.post(url, null, {
    params: data,
    headers: config.headers,
  });
  return response.data;
}

class ActivityStream extends Component {
  constructor(props) {
    super(props);

    this.updateData = this.updateData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRecipientValueChange = this.handleRecipientValueChange.bind(
      this,
    );
    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.handleMessageValueChange = this.handleMessageValueChange.bind(this);

    this.state = {
      message: '',
      chatUser: '',
      columnDefs: [
        {
          headerName: 'Time',
          field: 'created',
          cellRenderer: 'timeRenderer',
          minWidth: 50,
          width: 230,
          maxWidth: 230,
        },
        {
          headerName: 'From',
          field: 'sender',
          width: 70,
        },
        {
          headerName: 'Message',
          field: 'message',
          width: 500,
        },
      ],
      rowData: [],
      frameworkComponents: {
        timeRenderer: TimeRenderer,
      },
    };
  }

  handleSubmit(event) {
    const { chatUser, message } = this.state;
    insertMessage(chatUser, message).then((res) => {
      if (res === 'success') {
        this.updateData();
      }
    });

    event.preventDefault();
  }

  handleMessageValueChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  handleRecipientValueChange(event) {
    this.setState({
      chatUser: event.target.value,
    });
  }

  onRefresh() {
    this.updateData();
  }

  updateData() {
    const { chatUser } = this.state;
    getAllMessagesFromSender(chatUser).then((result) => {
      console.log(result);
      if (result) {
        this.setState({
          rowData: result,
        });
      }
    });
  }

  handleActivityChange(event) {
    const chatUserValue = event.target.value;
    this.setState(
      {
        chatUser: chatUserValue,
      },
      () => {
        this.updateData();
      },
    );
  }

  render() {
    const {
      columnDefs,
      rowData,
      frameworkComponents,
      message,
      chatUser,
    } = this.state;
    return (
      <div>
        <div className="row" style={{ marginLeft: '10px' }}>
          <div className="col-md-6">
            <div>
              <label htmlFor="fromValue">Chat with:</label>
              <select
                name="activity"
                className="form-control"
                value={chatUser}
                onChange={this.handleActivityChange}
              >
                <option value=""></option>
                <option value="user1">user1</option>
                <option value="user2">user2</option>
                <option value="user3">user3</option>
              </select>
              <br />
              <br />
              <div className="card">
                <div className="card-header">
                  Last messages&nbsp;&nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm btn-rnd"
                    title="Refresh"
                    onClick={this.onRefresh}
                    onKeyPress={this.onRefresh}
                  >
                    <i className="fas fa-sync-alt"></i>&nbsp;Refresh
                  </button>
                </div>
                <div className="form-group col-md-1"></div>
                <br />

                <div className="card-body">
                  <div className="ag-theme-balham">
                    <AgGridReact
                      domLayout="autoHeight"
                      columnDefs={columnDefs}
                      rowData={rowData}
                      frameworkComponents={frameworkComponents}
                    />
                  </div>
                </div>
              </div>
              <br />
              <br />
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    name="messageValue"
                    className="form-control"
                    placeholder="Type a message ..."
                    type="text"
                    value={message}
                    onChange={this.handleMessageValueChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Send
                </button>
                <br />
                <br />
              </form>
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ActivityStream;

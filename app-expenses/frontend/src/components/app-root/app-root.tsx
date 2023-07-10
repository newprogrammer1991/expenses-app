import { Component, Host, Listen, h, State, Element } from '@stencil/core';
import { urls, listTitles} from '../../constants/constant.js';
import {Expense} from '../../interfaces/expense';
import axios from 'axios';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() apiUrl: string = urls.URL_EXPENSES;
  @State() list: Expense[] = [];
  @State() updatingData: Expense = null;
  @State() newItem: Expense = null;


  componentDidLoad() {
    this.getData();
    if (localStorage.getItem('dark')) {
      // this.el.shadowRoot.querySelector('#my-id').classList.toggle('dark');
      // this.themeMode = 'dark';
    }
  }



  getData = () => {
    axios(urls.URL_EXPENSES)
    .then(response => response.data.expenses)
    .then(expenses => {
      this.list = expenses;
    })
    .catch(ex => {})
  }

  @Listen('updateLinkItem', { target: 'body' })
  updateForm(event: CustomEvent<any>) {
    this.updatingData = event.detail;
  }

  @Listen('updateListItem', { target: 'body' })
  onSaveClick(event: CustomEvent<any>) {
    const newValue = event.detail;
    const founIndex = this.list.findIndex((item) => item.id === newValue.id);
    debugger
    if(founIndex > -1) {
      this.list[founIndex] = newValue;
    }
    else {
      this.list = [...this.list, newValue]
    }
  }


  @Listen('deleteItem', { target: 'body' })
  onDeleteClick(event: CustomEvent<any>) {
    if (!event.detail.id) {
      return;
    }

    const itemId = event.detail.id;
    const itemName = event.detail.name;

    this.sendDeleteRequest(this.apiUrl, itemId).then(
      () => {
        const itemList = this.list.filter(d => d['id'] !== itemId);
        this.list = itemList;
        alert('item was deleted')
      },
      err => {
      },
    );
  }

  sendDeleteRequest = async (apiUrl, id) => {
    try {
      const result = await axios.delete(`${apiUrl}/${id}`, {
        withCredentials: false,
        data: {},
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });

      void result;

      return { success: true };
    } catch (ex) {
      return { success: false };
    }
  };

  render() {
    return (
      <div>
        {/* <header>
          <h1>Bettson</h1>
        </header> */}
        <main class="content">
          <app-expenses-form updatingData={this.updatingData}></app-expenses-form>
          <app-expenses-list list={this.list}></app-expenses-list>
        </main>
      </div>
    );
  }
}

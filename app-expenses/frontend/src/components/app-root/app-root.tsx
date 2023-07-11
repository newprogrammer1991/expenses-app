import { Component, Listen, h, State } from '@stencil/core';
import { urls } from '../../constants/constant.js';
import { Expense } from '../../interfaces/expense';
import { themes } from '../../theme/theme';
import axios from 'axios';

enum Themes {
  light = 'light',
  dark = 'dark',
}

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
  @State() activeLightMode = true;

  componentDidLoad() {
    this.getData();
    this.setTheme('light');
  }

  getData = () => {
    axios(urls.URL_EXPENSES)
      .then(response => response.data.expenses)
      .then(expenses => {
        this.list = expenses;
      })
      .catch(() => {});
  };

  @Listen('updateItem', { target: 'body' })
  updateForm(event: CustomEvent<any>) {
    this.updatingData = event.detail;
  }

  @Listen('updateListItem', { target: 'body' })
  onSaveClick(event: CustomEvent<any>) {
    const newValue = event.detail;
    const founIndex = this.list.findIndex(item => item.id === newValue.id);
    if (founIndex > -1) {
      this.list[founIndex] = newValue;
    } else {
      this.list = [...this.list, newValue];
    }
  }

  @Listen('deleteItem', { target: 'body' })
  onDeleteClick(event: CustomEvent<any>) {
    if (!event.detail.id) {
      return;
    }

    const itemId = event.detail.id;

    this.sendDeleteRequest(this.apiUrl, itemId).then(
      () => {
        const itemList = this.list.filter(d => d['id'] !== itemId);
        this.list = itemList;
        alert('item was deleted');
      },
      () => {},
    );
  }

  @Listen('swithBtnChanged', { target: 'body' })
  swithBtnChanged() {
    this.toggleTheme();
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

  toggleTheme = () => {
    this.activeLightMode = !this.activeLightMode;
    const mode = this.activeLightMode ? Themes.light : Themes.dark;
    this.setTheme(mode);
  };

  setTheme = (mode: string) => {
    const theme = themes[mode];
    for (const key in theme) {
      document.body.style.setProperty(key, theme[key]);
    }
  };

  render() {
    return (
      <div>
        <div class="theme-mode-wrap">
          Dark mode
          <app-switch-btn></app-switch-btn>
        </div>
        <main class="content">
          <app-expenses-form updatingData={this.updatingData}></app-expenses-form>
          <div class="content__right">
            <app-expenses-list list={this.list}></app-expenses-list>
            <app-stacked-chart data={this.list}></app-stacked-chart>
          </div>
        </main>
      </div>
    );
  }
}

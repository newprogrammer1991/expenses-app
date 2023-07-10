import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { urls, initialExpensesForm } from '../../constants/constant.js';
import axios from 'axios';
import { Expense } from '../../interfaces/expense';

const generateId = () => {
  return String(Math.floor(Math.random() * 99999999));
};

@Component({
  tag: 'app-expenses-form',
  styleUrl: 'app-expenses-form.css',
  shadow: true,
})
export class AppExpensesForm {
  @Prop({ mutable: true }) updatingData: Expense;
  @State() apiUrl: string = urls.URL_EXPENSES;
  @State() formModel: {
    id: string;
    description: string;
    amount: string;
    date: string;
  } = initialExpensesForm;

  componentDidLoad() {
    this.formModel.id = generateId();
  }

  @Watch('updatingData')
  watchPropHandler(newValue: boolean) {
    Object.keys(this.formModel).forEach(item => {
      this.formModel[item] = this.updatingData === null ? '' : newValue[item];
    });
  }

  onFormSubmit = async (updatingData, e) => {
    e.preventDefault();

    const obj = {
      id: this.formModel.id.trim() === '',
      description: this.formModel.description.trim() === '',
      amount: this.formModel.amount.trim() === '',
      date: this.formModel.date.trim() === '',
    };

    if (Object.values(obj).includes(true)) {
      alert('Please fill the required fields');
      return;
    } else {
      updatingData ? await this.onFormSave(updatingData) : await this.onFormSave(null);
    }
  };

  onFormSave = async (updatingData: any) => {
    try {
      const { success } = await this.sendAddOrUpdateRequest(this.apiUrl, this.formModel, updatingData?.id);
      if (!updatingData) {
        this.formModel.id = generateId();
      }

      if (!success) {
        alert('something wrong');
        return;
      } else {
        this.sendUpdatedData(this.formModel);
        alert('expense was created/updated');
      }
    } catch (ex) {
      alert('something wrong');
    }
    this.updatingData = null;
  };

  sendAddOrUpdateRequest = async (apiUrl, formModel, itemID) => {
    try {
      const result =
        itemID && itemID
          ? await axios.put(`${apiUrl}/${itemID}`, formModel, {
              withCredentials: false,
              headers: { 'content-type': 'application/json; charset=utf-8' },
            })
          : await axios.post(apiUrl, formModel, {
              withCredentials: false,
              headers: { 'content-type': 'application/json; charset=utf-8' },
            });

      if (result && result.data && result.status === 200) {
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  };

  @Event({ bubbles: true, composed: true }) updateListItem: EventEmitter<any>;
  sendUpdatedData(item: any) {
    this.updateListItem.emit(item);
  }

  onChangeInput = e => {
    const name = e.target.name;
    this.formModel[name] = e.target.value;
  };

  render() {
    return (
      <div class="expenses">
        <p>{this.updatingData ? 'UPDATE' : 'ADD NEW'}</p>
        <form class="expenses__form">
          <div class="expenses__form-inputs">
            <app-input
              name="description"
              id="description"
              label={'Description'}
              required={true}
              value={this.formModel.description}
              onChange={(e: any) => {
                this.onChangeInput(e);
              }}
            />

            <app-input
              type="number"
              name="amount"
              id="amount"
              label={'Amount'}
              required={true}
              value={this.formModel.amount}
              onChange={(e: any) => {
                this.onChangeInput(e);
              }}
            />

            <app-input
              type="date"
              name="date"
              id="date"
              label={'Date'}
              required={true}
              value={this.formModel.date}
              onChange={(e: any) => {
                this.onChangeInput(e);
              }}
            />

            <div>
              <app-button content={this.updatingData ? 'Update' : 'Save'} onClick={(e: any) => this.onFormSubmit(this.updatingData, e)}></app-button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

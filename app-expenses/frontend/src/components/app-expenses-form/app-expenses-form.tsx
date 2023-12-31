import { Component, Event, EventEmitter, Prop, State, Watch, h, Listen, Element } from '@stencil/core';
import { urls } from '../../constants/constant.js';
import axios from 'axios';
import { Expense } from '../../interfaces/expense';

const generateId = () => {
  return String(Math.floor(Math.random() * 99999999));
};

const initialVForm = {
  id: '',
  description: '',
  amount: null,
  date: '',
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
    amount: number;
    date: string;
  } = initialVForm;

  @Element()
  private el: HTMLElement;

  componentDidLoad() {
    this.formModel.id = generateId();
  }

  @Watch('updatingData')
  watchPropHandler(newValue) {
    Object.keys(this.formModel).forEach(item => {
      this.formModel[item] = this.updatingData === null ? '' : newValue[item];
    });
  }

  @Listen('updateItem', { target: 'body' })
  updateForm() {
    this.el.shadowRoot.querySelector('app-input').shadowRoot.querySelector('input').focus();
  }

  isValidForm = () => {
    const obj = {
      description: this.formModel.description.trim() === '',
      amount: String(this.formModel.amount).trim() === '',
      date: this.formModel.date.trim() === '',
    };
    return !Object.values(obj).includes(true);
  };

  onFormSubmit = async (updatingData: Expense) => {
    if (!updatingData) {
      this.formModel.id = generateId();
    }

    if (!this.isValidForm()) {
      alert('Please fill the required fields');
      return;
    } else {
      updatingData ? await this.onFormSave(updatingData) : await this.onFormSave(null);
    }
  };

  onFormSave = async (updatingData: Expense) => {
    try {
      const { success } = await this.sendAddOrUpdateRequest(this.apiUrl, this.formModel, updatingData?.id);
      if (!success) {
        alert('something wrong');
        return;
      } else {
        this.sendUpdatedData(this.formModel);
        alert('expense was created/updated');
      }
      this.updatingData = null;
    } catch (ex) {
      alert('something wrong');
    }
  };

  sendAddOrUpdateRequest = async (apiUrl: string, formModel: Expense, itemID: string) => {
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
  sendUpdatedData(item: Expense) {
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
              <app-button content={this.updatingData ? 'Update' : 'Save'} onClick={() => this.onFormSubmit(this.updatingData)}></app-button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

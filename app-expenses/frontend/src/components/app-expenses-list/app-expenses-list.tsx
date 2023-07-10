import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';
import {Expense} from '../../interfaces/expense'
@Component({
  tag: 'app-expenses-list',
  styleUrl: 'app-expenses-list.css',
  shadow: true,
})
export class AppExpensesList {
  @Prop({ mutable: true }) list: Expense[] = [];
  @Event({ bubbles: true, composed: true }) updateLinkItem: EventEmitter<any>;

  onUpdateLinkClick(row: any) {
    this.updateLinkItem.emit(row);
  }

  @Event({ bubbles: true, composed: true }) deleteItem: EventEmitter<any>;

  


 onDeleteLinkClick(row: any) {
  this.deleteItem.emit(row);
}
  renderItems = () => {
   return  this.list.map((item) => {
      return <div  class="expenses__item">
        <div>
          {item.id}
          <div class="expenses__item-date">{item.date}</div>
          <div class="expenses__item-desc">{item.description}</div>
        </div>
        <div>
          <span class="expenses__item-amount">{item.amount} USD</span>
          <div class="expenses__item-btns">


          <app-button
              content="Edit"
              onClick={() => this.onUpdateLinkClick(item)}
            ></app-button>

            <app-button
              content="Delete"
              onClick={() => this.onDeleteLinkClick(item)}
            ></app-button>
          </div>
        </div>
      </div>
    })
  }

  render() {
    return (
      <Host>
        <div class="expenses__items">       
           {this.renderItems()}
           </div>

      </Host>
    );
  }
}

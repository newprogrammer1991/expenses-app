import { Component, Host, Event, h, EventEmitter } from '@stencil/core';

@Component({
  tag: 'app-switch-btn',
  styleUrl: 'app-switch-btn.css',
  shadow: true,
})
export class AppSwitchBtn {
    @Event({ bubbles: true, composed: true }) swithBtnChanged: EventEmitter<boolean>;

  render() {
    return (
      <Host>
        <div>
          <label class="switch-btn">
            <input type="checkbox" onClick={() => this.swithBtnChanged.emit(true)}/>
            <span class="slider"></span>
          </label>
        </div>
      </Host>
    );
  }
}

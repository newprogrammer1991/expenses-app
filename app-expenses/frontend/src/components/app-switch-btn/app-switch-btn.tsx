import { Component, Host, Event, h, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'app-switch-btn',
  styleUrl: 'app-switch-btn.css',
  shadow: true,
})
export class AppSwitchBtn {
    @Prop() checked: boolean;
    @Event({ bubbles: true, composed: true }) swithBtnChanged: EventEmitter<boolean>;

  render() {
    return (
      <Host>
        <div>
          <label class="switch-btn">
            <input type="checkbox" checked={this.checked} onClick={() => this.swithBtnChanged.emit(true)}/>
            <span class="slider"></span>
          </label>
        </div>
      </Host>
    );
  }
}

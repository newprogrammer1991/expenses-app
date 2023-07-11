import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
})
export class InputField {
  @Prop() id: string;
  @Prop() name: string;
  @Prop() type: string;
  @Prop() value: string | number;
  @Prop() required: boolean;
  @Prop() label: string;
  @Prop() onChange: any;


  render() {
    return (
      <Host>
        <div class="form-element">
          {this.label && (
            <label class="form-element__label" htmlFor={this.name || ''}>
              {this.label} {this.required && '*'}
            </label>
          )}
          <div>
            <input
              type={this.type || 'text'}
              name={this.name || ''}
              value={this.value || ''}
              class="form-element__input"
              required={this.required || false}
              onChange={this.onChange}
            />
          </div>
        </div>
      </Host>
    );
  }
}

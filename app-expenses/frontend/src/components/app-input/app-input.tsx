import { Component, Host, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
})
export class InputField {
  @Prop({ mutable: true }) id: string;
  @Prop({ mutable: true }) name: string;
  @Prop({ mutable: true }) type: string;
  @Prop({ mutable: true }) value: string;
  @Prop({ mutable: true }) required: boolean;
  @Prop({ mutable: true }) label: string;
  @Prop({ mutable: true }) onChange: any;


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

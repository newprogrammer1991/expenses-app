import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-button',
  styleUrl: 'app-button.css',
  shadow: true,
})
export class AppButton {
  @Prop() content: string;
  @Prop() onClick: any;

  handleClick = e => {
    this.onClick?.(e);
  };

  render() {
    return (
      <button class="button" type="button" onClick={this.handleClick}>
        <span>{this.content}</span>
      </button>
    );
  }
}

import { Component, Prop, State, h } from '@stencil/core';
import { CONTROL_SIZES, SIZES } from '../../constants/constant';

@Component({
  tag: 'app-button',
  styleUrl: 'app-button.css',
  shadow: true,
})
export class AppButton {
  @Prop({ mutable: true }) content: string;
  @Prop({ mutable: true }) loading: boolean;
  @Prop({ mutable: true }) onClick: any;



  handleClick = e => {
    if (this.loading) {
      e.preventDefault();
      return;
    }
    this.onClick?.(e);
  };

  renderText = () => {
    if (this.loading && this.content) {
      return <span>{this.content}</span>;
    }

    if (!this.content && this.loading) {
      return <p> Loading...</p>;
    }

    if (this.content && !this.loading) {
      return (
          <span >{this.content}</span>
      );
    }

    return <span>{this.content}</span>;
  };

  render() {
    return (
      <button class="button" type="button" onClick={this.handleClick}>
        {this.renderText()}
      </button>
    );
  }
}

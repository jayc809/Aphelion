import React from "react";

class ChangingProgressProvider extends React.Component {
  static defaultProps = {
    interval: 50
  };

  state = {
    valuesIndex: 0
  };

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({
        valuesIndex: this.state.valuesIndex + 1
      });
      this.props.setText(this.props.values[this.state.valuesIndex])
      if (this.state.valuesIndex == this.props.values.length - 1) {
        clearInterval(interval)
      }
    }, this.props.interval);
  }

  render() {
    return this.props.children(this.props.values[this.state.valuesIndex]);
  }
}

export default ChangingProgressProvider;
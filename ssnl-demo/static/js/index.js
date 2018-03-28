import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';

class IntroPage extends React.Component {
  render() {
    return (
      <div className="intropage">
        Hello World!
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <IntroPage />,
  document.getElementById('root')
);


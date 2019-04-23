import React, { Component, Fragment } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "unstated";
import "./App.scss";
import Header from "./components/header";
import Footer from "./components/footer";
import Index from "./containers/index";

class App extends Component {
  render() {
    return (
      <Provider>
        <BrowserRouter>
          <Fragment>
            <Header />
            <div className={"main-content"}>
              <Route exact path="/" component={Index} />
              <Route exact path="/index" component={()=>(<div>233</div>)} />
            </div>
            <Footer />
          </Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

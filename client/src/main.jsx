import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// redux
import { Provider } from 'react-redux';
import { store, persistor } from "./redux/store.js";
import { PersistGate } from 'redux-persist/integration/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <Provider> makes store available in the whole application
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <DndProvider backend={HTML5Backend}>
        <App />
        </DndProvider>
    </PersistGate>
  </Provider>
)

import ReactDOM from 'react-dom/client'
import Router from './presentation/routes/router';
import './index.scss'
import { StrictMode } from 'react';

ReactDOM.createRoot(document.getElementById('root')).render(  
    <StrictMode>
        <Router />
    </StrictMode>
)

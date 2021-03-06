import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contacts: []
        }
    }

    componentWillMount() {
        localStorage.getItem('contacts') && this.setState({
            contacts: JSON.parse(localStorage.getItem('contacts')),
            isLoading: false
        })
    }

    componentDidMount() {
        const date = localStorage.getItem('contactsDate');
        const contactsDate = date && new Date(parseInt(date));
        const now = new Date();

        const dataAge = Math.round((now - contactsDate) / (1000 * 60));
        const tooOld = dataAge >= 15;

        if (tooOld) {
            this.fatchData();
        } else {
            console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
        }
    }

    fatchData() {

        this.setState({
            isLoading: true,
            contacts: []
        })

        fetch('https://randomuser.me/api/?results=50&nat=us')
            .then(Response => Response.json())
            .then(parsedJSON => parsedJSON.results.map(user => ({
                name: `${user.name.first} ${user.name.last}`,
                username: `${user.login.username}`,
                email: `${user.email}`,
                phone: `${user.phone}`,
                location: `${user.location.state}, ${user.location.city}`,
                picture: `${user.picture.medium}`
            })))
            .then(contacts => this.setState({
                contacts,
                isLoading: false
            }))
            .catch(error => console.log('parsing failed ', error))
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
        localStorage.setItem('contactsDate', Date.now());
    }

    render() {
        const { isLoading, contacts } = this.state;
        return (
            <div>
                <header>
                    <img src={image} />
                    <h1>Fetching Data <button className="btn btn-sm btn-danger" onClick={(e) => {
                        this.fatchData();
                    }}>Fetch now</button></h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">
                        {
                            !isLoading && contacts.length > 0 ? contacts.map(contact => {
                                const { username, name, email, phone, location, picture } = contact;
                                return (
                                    <Collapsible key={username} title={name}>
                                        <div className="media">
                                            <div className="media-left">
                                                <img className="media-object" src={picture} alt="" />
                                            </div>
                                            <div className="media-body">
                                                <p>{email}<br />{phone}<br />{location}</p>
                                            </div>
                                        </div>
                                    </Collapsible>
                                )
                            }) : null
                        }
                    </div>
                    <div className="loader">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;

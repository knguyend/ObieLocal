import React from "react";
import AgendaEventItem from "./AgendaEventItem"

import constants from './constants'

class AgendaEventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [{title: "dfsfsdfsdfsdfsfs", location_name: "awasasdads", start_time: "19:00 PM", description: "asdasdsjdfbajfbhaegfujsgfliagiefipuegirlgesgijlfggesklfealjfegaiw;fgiuwagfiluaegfi;awgfilagfil"}]
        }
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch('https://obielocal-1541269219020.appspot.com/query')
          // fetch("http://localhost:3001/query")
          .then(response => response.json())
          .then(data => {
              this.storeEvents(data);
              console.log(data);
          }
          )
          .catch(error => console.error('Loading agenda failed ', error));
      }

    storeEvents = data => {
        const events = data.map(result => {
          const  { title, photo_url, location_name, start_time, description } = result;
          return { title, photo_url, location_name, start_time, description };
        });
        this.setState({ events })
      }
    
        
    render() {
        return (
        <section>
            <ul className="AgendaEventList">
            {
                this.state.events.map( event => (
                <AgendaEventItem key={event.id} event={event} handleAgendaClick={this.props.handleAgendaClick}/>
                ))
            }
            </ul>
        </section>
        );
    }   
}

export default AgendaEventList;

import React from 'react';
import styled from 'styled-components';
import constants from './constants';
import dateTime from 'node-datetime';

// 18 hours in minutes
const LATEST_POSSIBLE = 1080;

const getColorFromStartTime = minutes => {
  /*minutes = Math.abs(minutes);*/
  /* Color runs from:
    RED ------------> YELLOW ------> GREEN -------> CYAN 
    (173,21,21) -> (173,173,21) -> (21,173,21) -> (21,173,173)
    */
  if (minutes > LATEST_POSSIBLE) {
    minutes = LATEST_POSSIBLE;
  } else if (minutes < 0) {
    minutes = 0;
  }
  const spectrum = (minutes / LATEST_POSSIBLE) * 152*3;
  var red, green, blue;
  if (spectrum <= 152) {
    red = 173;
    green = 21 + spectrum;
    blue = 21;
  } else if (spectrum <= 152 * 2) {
    red = 173 - (spectrum - 152);
    green = 173;
    blue = 21;
  } else {
    red = 21;
    green = 173;
    blue = 21 + (spectrum - 152 * 2);
  }
  return `rgb(${red}, ${green}, ${blue})`;
  /*
    const bAmount = minutes / LATEST_POSSIBLE;
    const rGAmount = 1 - bAmount;
    return `rgb(${rGAmount * 207}, 16, ${45 + bAmount * (200 - 45)})`;*/
};

const getMinutesUntilStart = eventObj => {
  const now = new Date();
  const startTime = new Date(eventObj.start_time);
  const hoursUntilStart =
    (startTime.getTime() - now.getTime()) / constants.HOUR_TO_MILLISECONDS;
    console.log(hoursUntilStart);
  return hoursUntilStart * 60;
};

const Button = styled.button`
  width: 35px;
  height: 35px;
  padding: 0px;
  border-radius: 50%;
  border-width: 0.5px;
  box-shadow: 1px 1px 5px 1px #4e4e4e;
  background-color: ${props => getColorFromStartTime(props.minutesUntilStart)};
  animation-delay: ${props => props.animationDelay};

  /* Set clock number font*/
  .numbers {
    font-family: 'digital-7', sans-serif;
    color: whitesmoke;
  }

  /* The rotating semicircle in the animation. */
`;
//   ::before {
//     content: ' ';
//     display: block;
//     padding: 0px;
//     margin-left: 50%;
//     height: 99%;
//     border-radius: 0 100% 100% 0 / 50%;
//     background-color: #f7f7f7;
//     transform-origin: left;
//     transform: rotate(0);
//     overflow: hidden;

//     /* Each marker represents 6 hours, so the animation reflects that. */
//     animation-name: spin, ${props => props.animationName};
//     animation-duration: 10800s, 21600s;
//     animation-timing-function: linear, step-end;
//     animation-iteration-count: infinite;
//     animation-play-state: paused;
//     animation-delay: inherit;
//   }
// `;

const MarkerWrap = styled.div`
  opacity: ${props => props.opacity};
  animation-name: ${props => (props.blink ? 'marker-blink' : '')};
  animation-duration: 1.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const StyledMarker = styled.button`
  position: absolute;
  /*top: 40%;
  left: 50%;*/
  top: -25px;
  left: -22px;
  background-color: ${props => getColorFromStartTime(props.minutesUntilStart)};
  border-radius: 20%;
  /* Needs to store color somewhere*/
  border: 3px solid ${props => getColorFromStartTime(props.minutesUntilStart)};
  width: 50px;
  height: 20px;
  z-index: 2;

  ::after {
    position: absolute;
    content: '';
    width: 0px;
    height: 0px;
    bottom: -24px;
    left: 17px;
    border: 5px solid transparent;
    border-top: 17px solid
      ${props => getColorFromStartTime(props.minutesUntilStart)};
  }

  .numbers {
    font-family: 'digital-7', sans-serif;
    color: whitesmoke;
    font-size: 14px;
    font-weight: bold;
  }

  .am-pm {
    color: whitesmoke;    
    font-family: 'digital-7', sans-serif;
    font-size: 10px;
  }
`;

const Shadow = styled.div`
  background: #d6d4d4;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  left: 8px;
  top: -6px;
  position: absolute;
  margin: 11px 0px -0px -12px;
  transform: rotateX(55deg);
  z-index: -2;
`;

class Marker extends React.Component {
  constructor(props) {
    super(props);
    this.displayData = this.getDisplayData();
  }

  /**
   * Determines marker display information based on event timing.
   * @returns An object including display properties.
   */
  getDisplayData = () => {
    const minutesUntilStart = getMinutesUntilStart(this.props.eventArray[0]);
    // console.log(minutesUntilStart);
    const displayData = {
      animationDelay: '0s',
      opacity: 1.0,
      animationName: this.props.eventArray[0].verified
        ? 'bg-verified'
        : 'bg-unverified',
      blink: 0
    };
    if (minutesUntilStart > 360) {
      displayData.animationDelay = '0s';
      displayData.opacity = 0.7;
    } else if (minutesUntilStart < 0) {
      displayData.animationDelay = '-21599s';
      displayData.blink = 1;
    } else {
      const deg = 360 - minutesUntilStart;
      const sec = deg * 60;
      displayData.animationDelay = `-${sec}s`;
    }
    return displayData;
  };

  render() {
    const firstEvent = this.props.eventArray[0];
    // const verified = firstEvent.verified;
    const startTime = firstEvent.start_time
      ? dateTime.create(new Date(firstEvent.start_time), 'I:M').format()
      : '??';
    const minutesUntilStart = getMinutesUntilStart(firstEvent);
    return (
      <MarkerWrap
        blink={this.displayData.blink}
        opacity={this.displayData.opacity}
      >
        <StyledMarker
          //   className={verified ? 'Marker-verified' : 'Marker-unverified'}
          onClick={() => this.props.handleMarkerClick(this.props.eventArray)}
          //   animationName={this.displayData.animationName}
          //   animationDelay={this.displayData.animationDelay}
          minutesUntilStart={minutesUntilStart}
        >
          <span className="numbers">{startTime}</span>
          <span className="am-pm"> P</span>
        </StyledMarker>
        <Shadow />
      </MarkerWrap>
    );
  }
}

export default Marker;

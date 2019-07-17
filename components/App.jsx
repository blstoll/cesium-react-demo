import React, {Component} from 'react';

import CesiumGlobe from './cesium/CesiumGlobe';

import {gstime, propagate, eciToGeodetic, twoline2satrec} from 'satellite.js';

import houseLogo from './logo.svg';

export default class App extends Component {
   state = {
      houseLogo: { lat: 37.484505, lon: -122.1478977, image: houseLogo },
      label: { lat: 35.0, lon: -100.0, text: 'Look at this!' },
      line: [
         { lat: 47.5, lon: -122.3, alt: 2000000 },
         { lat: 36.2, lon: -115.0, alt: 20000 },
         { lat: 39.0, lon: -94.6, alt: 2000 },
         { lat: 30.4, lon: -81.6, alt: 20000 },
      ],
      flyToLocation: null,
   };

   handleLeftClick = (coords) => {
      const {lat, lon} = coords;
      console.log(`Left mouse clicked at ${lat} ${lon}`);
   };

   handleFlyToClicked = () => {
      this.setState({
         flyToLocation: {lat: 32.6925, lon: -117.1587, alt: 100000}
      });
   };

   render() {

      const tle1 = '1 25544U 98067A   18282.68010179  .00001200  00000-0  25646-4 0  9993';
      const tle2 = '2 25544  51.6418 168.1582 0003545 263.2788 123.8988 15.53792760136320';
      const satrec = twoline2satrec(tle1, tle2);

      const now = new Date();
      const nowMillisEpoch = now.valueOf();

      const lines = [];
      for(let i = 89; i >= 0; --i) {
         const minsInMillis = 1000 * i * 60;
         const dateTime = new Date(nowMillisEpoch - minsInMillis);
         const gmst = gstime(dateTime);

         let {position} = propagate(satrec, dateTime);

         const {latitude, longitude, height} = eciToGeodetic(position, gmst);
         lines.push({
            lat: latitude * 180.0 / Math.PI,
            lon: longitude * 180.0 / Math.PI,
            alt: height * 1000,
         });

         //console.log(`Velocity x = ${velocity.x}, y = ${velocity.y}, z = ${velocity.z}`);
      }

      const containerStyle = {
         width: '100%',
         height: '100%',
         top: 0,
         left: 0,
         bottom: 0,
         right: 0,
         position: 'fixed',
      };

      const {houseLogo, label, line, flyToLocation} = this.state;

      const icons = [houseLogo];
      const labels = [label];
      //const polylines = [line];
      const polylines = [lines];

      return (
         <div style={containerStyle}>
            <CesiumGlobe
               icons={icons}
               labels={labels}
               polylines={polylines}
               onLeftClick={this.handleLeftClick}
               flyToLocation={flyToLocation}/>

            <div style={{ position: 'fixed', top: 0 }}>
               <div style={{ color: 'white', fontSize: 40, }}>
                  Text Over the Globe
               </div>
               <button onClick={this.handleFlyToClicked} style={{ fontSize: 40 }}>
                  Jump Camera Location
               </button>
            </div>
         </div>
      );
   }
}
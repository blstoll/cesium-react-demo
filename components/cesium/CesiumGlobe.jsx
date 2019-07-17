import React, {Component} from 'react';
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';

import CesiumProjectContents from './CesiumProjectContents';
import CesiumClickHandler from './CesiumClickHandler';
import CesiumCameraManager from './CesiumCameraManager';

export default class CesiumGlobe extends Component {
   state = {
      viewerLoaded: false
   };

   componentDidMount() {
      //const imageryProvider = undefined;
      //const terrainProvider = undefined;

      this.viewer = new Viewer(this.cesiumContainer, {
         animation: false,
         baseLayerPicker: false,
         fullscreenButton: false,
         geocoder: false,
         homeButton: false,
         infoBox: false,
         sceneModePicker: true,
         selectionIndicator: false,
         timeline: false,
         navigationHelpButton: false,
         scene3DOnly: false,
         //FIXME
         //imageryProvider,
         //terrainProvider,
      });

      // Force immediate re-render now that the Cesium viewer is created
      this.setState({ viewerLoaded: true });
   }

   componentWillUnmount() {
      if (this.viewer) {
         this.viewer.destroy();
         this.viewer = undefined;
      }
   }

   renderContents() {
      const { viewerLoaded } = this.state;
      const { icons, labels, polylines, onLeftClick, flyToLocation } = this.props;
      let contents = null;

      if (viewerLoaded) {
         const { scene } = this.viewer;
         contents = (
            <span>
               <CesiumProjectContents
                  scene={scene}
                  icons={icons}
                  labels={labels}
                  polylines={polylines}
               />
               <CesiumClickHandler scene={scene} onLeftClick={onLeftClick}/>
               <CesiumCameraManager camera={scene.camera} flyToLocation={flyToLocation}/>
            </span>
         );
      }
      return contents;
   }

   render() {
      const containerStyle = {
         width: '100%',
         height: '100%',
         display: 'flex',
         alignItems: 'stretch'
      };

      const widgetStyle = {
         flexGrow: 2
      };

      const contents = this.renderContents();
      return (
         <div className="cesiumGlobeWrapper" style={containerStyle}>
            <div className="cesiumWidget"
               ref={el => this.cesiumContainer = el} style={widgetStyle}>
               {contents}
            </div>
         </div>
      );
   }
}
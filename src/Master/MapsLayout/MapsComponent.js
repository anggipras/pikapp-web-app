// MyGoogleMaps.js
import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';

import styled from 'styled-components';

import AutoComplete from './AutoCompleteComponent';
import Marker from './MarkerComponent';

import { MapInstance, MapApi, District, FormattedAddress, Places, Lat, Lng, Center } from '../../Redux/Actions'
import { connect } from "react-redux";

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class MapsComponent extends Component {


    state = {
        mapApiLoaded: false,
        mapInstance: null,
        mapApi: null,
        geoCoder: null,
        places: [],
        center: [],
        zoom: 12,
        address: '',
        draggable: true,
        lat: null,
        lng: null
    };

    componentWillMount() {
        this.setCurrentLocation();
    }


    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });

        this.props.Lat(mouse.lat);
        this.props.Lng(mouse.lng);
    }
    onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        this._generateAddress();
    }

    _onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });

    }

    _onClick = (value) => {
        this.setState({
            lat: value.lat,
            lng: value.lng
        });
        
        this.props.Lat(value.lat);
        this.props.Lng(value.lng);
        this._generateAddress();
    }

    apiHasLoaded = (map, maps) => {
        this.setState({
            mapApiLoaded: true,
            mapInstance: map,
            mapApi: maps,
        });

        this.props.MapInstance(map);
        this.props.MapApi(maps);
        this._generateAddress();
    };

    addPlace = (place) => {
        this.setState({
            places: [place],
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        });
        this._generateAddress()
    };

    _generateAddress() {
        const {
            mapApi
        } = this.state;

        const geocoder = new mapApi.Geocoder;

        // if(this.props.CartRedu.lat !== 0) {
        //     this.setState({
        //         places: this.props.CartRedu.places,
        //         lat: this.props.CartRedu.lat,
        //         lng: this.props.CartRedu.lng
        //     });
        // }

        geocoder.geocode({ 'location': { lat: this.props.CartRedu.lat, lng: this.props.CartRedu.lng } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    results[0].address_components.map((res) => {
                        if(res.types[0] == "administrative_area_level_3") {
                            this.props.District(res.short_name);
                        }
                    })
                    this.setState({ address: results[0].formatted_address });
                    this.props.FormattedAddress(results[0].formatted_address);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }

    // Get Current Location Coordinates
    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

                this.props.Center([position.coords.latitude, position.coords.longitude]);
                this.props.Lat(position.coords.latitude);
                this.props.Lng(position.coords.longitude);
            });
        }
    }

    render() {
        const {
            places, mapApiLoaded, mapInstance, mapApi,
        } = this.state;


        return (
            <Wrapper>
                <GoogleMapReact
                    center={this.state.center}
                    zoom={this.state.zoom}
                    draggable={this.state.draggable}
                    onChange={this._onChange}
                    onChildMouseDown={this.onMarkerInteraction}
                    onChildMouseUp={this.onMarkerInteractionMouseUp}
                    onChildMouseMove={this.onMarkerInteraction}
                    onChildClick={() => console.log('child click')}
                    onClick={this._onClick}
                    bootstrapURLKeys={{
                        key: 'AIzaSyAhpg4G_EANh5cM9sHUY04XZaTAJVrd0Us',
                        libraries: ['places', 'geometry'],
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                >

                    <Marker
                        text={this.props.CartRedu.formattedAddress}
                        lat={this.props.CartRedu.lat}
                        lng={this.props.CartRedu.lng}
                    />


                </GoogleMapReact>

                {/* {mapApiLoaded && (
                    <div>
                        <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
                    </div>
                )} */}

                {/* <div className="info-wrapper">
                    <div className="map-details">Latitude: <span>{this.state.lat}</span>, Longitude: <span>{this.state.lng}</span></div>
                    <div className="map-details">Zoom: <span>{this.state.zoom}</span></div>
                    <div className="map-details">Address: <span>{this.state.address}</span></div>
                </div> */}


            </Wrapper >
        );
    }
}

const Mapstatetoprops = (state) => {
    return {
      AllRedu: state.AllRedu,
      AuthRedu: state.AuthRedu,
      CartRedu: state.CartRedu
    }
}

export default connect(Mapstatetoprops, { MapInstance, MapApi, District, FormattedAddress, Places, Lat, Lng, Center })(MapsComponent)

// export default MapsComponent;
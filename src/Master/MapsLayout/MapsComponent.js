// MyGoogleMaps.js
import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';

import styled from 'styled-components';

import AutoComplete from './AutoCompleteComponent';
import Marker from './MarkerComponent';

import { MapInstance, MapApi, District, FormattedAddress, Places, Lat, Lng, Center, PostalCode, StreetNumber, StreetName, City, Province, IsMarkerChange, PermissionLocation } from '../../Redux/Actions'
import { connect } from "react-redux";

import Button from "react-bootstrap/Button";

import CurrentLocationIcon from  "../../Asset/Icon/current-location.png";

import { mapsApiKey } from '../../Asset/Constant/APIConstant';

import NoLocationIcon from "../../Asset/Icon/no-location.png";
import ReloadIcon from "../../Asset/Icon/reload-icon.png";

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
        lng: null,
        oldLat: null,
        permissionLocation : null
    };

    componentWillMount() {
        // if(this.props.CartRedu.lat === 0) {
        //     this.setCurrentLocation();
        // } else {
        //     this._generateAddress()
        // }
        this.setCurrentLocation();
    }

    // componentDidUpdate() {
    //     if(this.state.address !== this.props.CartRedu.formattedAddress) {
    //         this.props.FormattedAddress(this.state.address);
    //     }
    // }

    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });

        this.props.Lat(mouse.lat);
        localStorage.setItem("LAT", JSON.stringify(mouse.lat))
        this.props.Lng(mouse.lng);
        localStorage.setItem("LNG", JSON.stringify(mouse.lng))
        this.props.IsMarkerChange(true);
    }
    onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        this.props.IsMarkerChange(true);
        this._generateAddress();
    }

    _onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });
        // this.props.Center(center);
        // this.props.Lat(center.lat);
        // this.props.Lng(center.lng);
        // if(this.props.CartRedu.mapApi !== "") {
        //     this._generateAddress();
        // }
    }

    _onClick = (value) => {
        this.setState({
            draggable: true,
            lat: value.lat,
            lng: value.lng,
            oldLat: value.lat
        }, () => {
            this._generateAddress();
        });
        
        this.props.Lat(value.lat);
        localStorage.setItem("LAT", JSON.stringify(value.lat))
        this.props.Lng(value.lng);
        localStorage.setItem("LNG", JSON.stringify(value.lng))
        this.props.IsMarkerChange(true);
        // this._generateAddress();
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
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    results[0].address_components.map((res) => {
                        if(res.types[0] == "street_number") {
                            this.props.StreetNumber("No. " + res.short_name);
                        }
                        if(res.types[0] == "route") {
                            this.props.StreetName(res.short_name);
                        }
                        if(res.types[0] == "administrative_area_level_3") {
                            this.props.District(res.short_name);
                            localStorage.setItem("DISTRICT", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "postal_code") {
                            this.props.PostalCode(res.short_name);
                            localStorage.setItem("POSTALCODE", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "administrative_area_level_2") {
                            this.props.City(res.short_name);
                            localStorage.setItem("CITY", JSON.stringify(res.short_name))
                        }
                        if(res.types[0] == "administrative_area_level_1") {
                            this.props.Province(res.short_name);
                            localStorage.setItem("PROVINCE", JSON.stringify(res.short_name))
                        }
                    })
                    this.setState({ center: [this.props.CartRedu.lat, this.props.CartRedu.lng] });
                    this.setState({ address: results[0].formatted_address });
                    this.props.FormattedAddress(results[0].formatted_address.split(",")[0]);
                    localStorage.setItem("FORMATTEDADDRESS", JSON.stringify(results[0].formatted_address.split(",")[0]))
                    this.props.Center([this.props.CartRedu.lat, this.props.CartRedu.lng]);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }

    // Get Current Location Coordinates
    setCurrentLocation = () => {
        if ('geolocation' in navigator) {
            this.setState({ isLoading : true });
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            
            const success = (position) => {
                this.setState({ permissionLocation : true });
                this.props.PermissionLocation(true);
                if(this.props.CartRedu.lat === 0) {
                    this.props.Center([position.coords.latitude, position.coords.longitude]);
                    this.props.Lat(position.coords.latitude);
                    localStorage.setItem("LAT", JSON.stringify(position.coords.latitude))
                    this.props.Lng(position.coords.longitude);
                    localStorage.setItem("LNG", JSON.stringify(position.coords.longitude));
                }
            }
            
            const error = (err) => {
                this.setState({ permissionLocation : false });
                localStorage.setItem("permissionLocation", false);
                this.props.PermissionLocation(false);
            }
            
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    }

    getCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {

                this.props.Center([position.coords.latitude, position.coords.longitude]);
                this.props.Lat(position.coords.latitude);
                localStorage.setItem("LAT", JSON.stringify(position.coords.latitude))
                this.props.Lng(position.coords.longitude);
                localStorage.setItem("LNG", JSON.stringify(position.coords.longitude))
                this.props.IsMarkerChange(false);
                this.props.StreetNumber("");
                this.props.StreetName("");

                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, () => {
                    this._generateAddress();
                });
            });
        }
    }

    render() {
        const {
            places, mapApiLoaded, mapInstance, mapApi,
        } = this.state;


        return (
            this.state.permissionLocation ?
            <Wrapper>
                <GoogleMapReact
                    center={this.props.CartRedu.center}
                    zoom={this.state.zoom}
                    draggable={this.state.draggable}
                    onChange={this._onChange}
                    onChildMouseDown={this.onMarkerInteraction}
                    onChildMouseUp={this.onMarkerInteractionMouseUp}
                    onChildMouseMove={this.onMarkerInteraction}
                    onChildClick={() => console.log('child click')}
                    onClick={this._onClick}
                    bootstrapURLKeys={{
                        key: mapsApiKey,
                        libraries: ['places', 'geometry'],
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >

                    <Marker
                        text={this.props.CartRedu.formattedAddress}
                        lat={this.props.CartRedu.lat}
                        lng={this.props.CartRedu.lng}
                    />
                </GoogleMapReact>
                <div style={{display: this.props.CartRedu.isMarkerChange ? 'block' : 'none'}} className='addressmaps-currentlocation-sec' onClick={() => this.getCurrentLocation()}>
                    <div className='addressmaps-location-title'>
                        <img className='addressmaps-location-logo' src={CurrentLocationIcon} alt='' />
                        <div className='addressmaps-location-mainName'>
                            Gunakan Lokasi Saat Ini
                        </div>
                    </div>
                </div>
                
            </Wrapper >
            :
            this.state.permissionLocation === false ?
            <div className="addressmaps-location-error">
                <img src={NoLocationIcon} className="addressmaps-location-error-img"></img>
                <div className='addressmaps-buttonretry-section' onClick={() => window.location.reload()} >
                    <div className='addressmaps-buttonretry'>
                        <h1 className='addressmaps-buttonretry-word'>Coba Lagi</h1>
                        <img className="addressmaps-buttonretry-img" src={ReloadIcon}></img>
                    </div>
                </div>
            </div>
            :
            <></>
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

export default connect(Mapstatetoprops, { MapInstance, MapApi, District, FormattedAddress, Places, Lat, Lng, Center, PostalCode, StreetNumber, StreetName, City, Province, IsMarkerChange, PermissionLocation })(MapsComponent)

// export default MapsComponent;
// Autocomplete.js
import React, { Component } from 'react';
import styled from 'styled-components';
import { SearchInput } from '../../Redux/Actions'
import { connect } from "react-redux";

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  text-align:center;
`;

class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.clearSearchBox = this.clearSearchBox.bind(this);
    }

    componentDidMount({ map, mapApi } = this.props) {
        const options = {
            // restrict your search to a specific type of result
            types: ['address'],
            // restrict your search to a specific country, or an array of countries
            // componentRestrictions: { country: ['gb', 'us'] },
        };
        this.autoComplete = new mapApi.places.Autocomplete(
            this.searchInput,
            options,
        );
        this.autoComplete.addListener('place_changed', this.onPlaceChanged);
        this.autoComplete.bindTo('bounds', map);
        if(this.props.CartRedu.searchInput !== "") {
            this.searchInput.value = this.props.CartRedu.searchInput;
        }
    }

    componentWillUnmount({ mapApi } = this.props) {
        mapApi.event.clearInstanceListeners(this.searchInput);
    }

    componentDidUpdate() {
        if(this.props.CartRedu.searchInput !== "") {
            this.searchInput.value = this.props.CartRedu.searchInput;
            this.props.SearchInput("");
        }
    }

    onPlaceChanged = ({ map, addplace } = this.props) => {
        const place = this.autoComplete.getPlace();

        if (!place.geometry) return;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        addplace(place);
        this.searchInput.blur();
    };

    clearSearchBox() {
        this.searchInput.value = '';
        // this.props.SearchInput.value('')
    }

    render() {
        return (
            <Wrapper>
                <input
                    className="search-input"
                    ref={(ref) => {
                        this.searchInput = ref;
                        // this.props.CartRedu.searchInput = ref;
                    }}
                    type="text"
                    onFocus={this.clearSearchBox}
                    placeholder="Enter a location"
                />
            </Wrapper>
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

export default connect(Mapstatetoprops, { SearchInput })(AutoComplete)

// export default AutoComplete;
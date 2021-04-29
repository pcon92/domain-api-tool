const PROPERTY_TILE = document.getElementById("property-tile-div");
const BEDROOMS_MIN = document.getElementById("bedrooms-min-select");
const BEDROOMS_MAX = document.getElementById("bedrooms-max-select");
const BATHROOMS_MIN = document.getElementById("bathrooms-min-select");
const BATHROOMS_MAX = document.getElementById("bathrooms-max-select");
const CARSPACES_MIN = document.getElementById("carspaces-min-select");
const CARSPACES_MAX = document.getElementById("carspaces-max-select");
const NUMBER_OF_PROPERTIES = document.getElementById("number-of-properties-select");
const BOTTOM_AREA = document.getElementById("bottom-area");
const LOADING_OVERLAY = document.getElementById("loading-overlay");
const LOCATION_STATE = document.getElementById("location-state-select");
const MIN_PRICE = document.getElementById("min-price-select");
const MAX_PRICE = document.getElementById('max-price-select');
const LISTING_TYPE = document.getElementById('listing-type-select');
const PRICE_WITHHELD = document.getElementById('price-withheld-select');
const PROPERTY_TYPE = document.getElementById('property-types-select');
const POSTCODE = document.getElementById('location-postcode-select');

let id_array = [];


document.getElementById("search-btn").addEventListener("click", e => {

    let randomPageNum = Math.floor(Math.random() * 10);

    e.preventDefault(); 
    const  formValueArray = {
        "minBedrooms" : BEDROOMS_MIN.value,
        "maxBedrooms" : BEDROOMS_MAX.value,
        "minBathrooms" : BATHROOMS_MIN.value,
        "maxBathrooms" :BATHROOMS_MAX.value,
        "minCarspaces": CARSPACES_MIN.value,
        "maxCarSpaces" : CARSPACES_MAX.value,
        "pageSize" : NUMBER_OF_PROPERTIES.value,
        "pageNumber" : randomPageNum,
        "locations" : [{ "state": `${LOCATION_STATE.value}`, "postcode" : `${POSTCODE.value}` }],
        "minPrice" : MIN_PRICE.value,
        "maxPrice" : MAX_PRICE.value,
        "listingType" : LISTING_TYPE.value,
        "excludePriceWithheld" : PRICE_WITHHELD.value,
        "propertyTypes" : [PROPERTY_TYPE.value]
    }

    remove_property_tiles();
    display_loading();
    setTimeout(get_property_info, 1000, formValueArray);

});


document.getElementById("get-property-from-id-btn").addEventListener("click", e => {
    display_loading();
    setTimeout(get_property_from_id, 1000);
});

function remove_property_tiles() {

    const allTiles = document.querySelectorAll(".property-tile");
    allTiles.forEach(tile => tile.style.display = "none");
}


async function get_property_from_id() {

    remove_property_tiles();
    const property_id = '2016886197';
    const id_url = `https://api.domain.com.au/v1/listings/${property_id}`
    const result = await fetch(id_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Api-Key' : API_KEY
        }
    }).then(hide_loading())
    id_array = [];
    id_array.push(property_id);
    get_property_from_id_array(id_array)

}


function display_loading() { 
    LOADING_OVERLAY.style.display = "block";
}


function hide_loading() { 
    LOADING_OVERLAY.style.display = "none";
}


async function get_property_info(formValueArray) {

    display_loading();

    id_array = [];
    const auth_url = 'https://api.domain.com.au/v1/listings/residential/_search'; 
    const data = await fetch(auth_url, {
        method: 'POST',
        headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key' : API_KEY
        },
        body: JSON.stringify(formValueArray)
    }).then(hide_loading());
    const data_json = await data.json();
    for (el in data_json) {
        if (data_json[el].type === "Project") {
            id_array.push(data_json[el].listings[0].id.toString())
        } else {
            id_array.push(data_json[el].listing.id.toString())
        }

    }
    get_property_from_id_array(id_array);

}


async function get_property_from_id_array(id_array) {

    for (id in id_array) {
        const id_url = `https://api.domain.com.au/v1/listings/${id_array[id]}`
        const result = await fetch(id_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Api-Key' : API_KEY
            }
        })
        const result_json = await result.json();

        const newPropTileDiv = document.createElement("div");
        newPropTileDiv.setAttribute("id", `${id}`);
        newPropTileDiv.setAttribute("class", "property-tile");
        newPropTileDiv.style.display = "flex";
        newPropTileDiv.style.flexDirection = "column";
        newPropTileDiv.style.justifyContent = "center";
        newPropTileDiv.style.alignItems = "center";
        BOTTOM_AREA.appendChild(newPropTileDiv);
        
        const propImageDivWrapper = document.createElement("div");
        const propImageDiv = document.createElement("img");
        propImageDivWrapper.setAttribute("class", "image-wrapper");
        propImageDiv.setAttribute("src", `${result_json.media[0].url}`);
        propImageDiv.setAttribute("height", "300");
        propImageDiv.setAttribute("width", "300");
        propImageDiv.setAttribute("alt", "property-image");
        propImageDiv.setAttribute("class", "image");
        propImageDiv.style.border = "1px solid black";
        newPropTileDiv.appendChild(propImageDivWrapper);
        propImageDivWrapper.appendChild(propImageDiv);

        const newPropTileDivAddress = document.createElement("div");
        newPropTileDivAddress.setAttribute("class", "address");
        newPropTileDivAddress.innerText = result_json.addressParts.displayAddress;
        newPropTileDiv.appendChild(newPropTileDivAddress);

        const newPropTileDivBedBathCar = document.createElement("div");
        newPropTileDivBedBathCar.setAttribute("class", "bedbathcar-div");
        newPropTileDiv.appendChild(newPropTileDivBedBathCar);

        const newPropTileDivBedrooms = document.createElement("div");
        newPropTileDivBedrooms.setAttribute("class", "bedbathcar");
        newPropTileDivBedrooms.innerHTML =  `${result_json.bedrooms} <i class="fas fa-bed"></i>`
        newPropTileDivBedBathCar.appendChild(newPropTileDivBedrooms);

        const newPropTileDivBathrooms = document.createElement("div");
        newPropTileDivBathrooms.setAttribute("class", "bedbathcar");
        newPropTileDivBathrooms.innerHTML = `${result_json.bathrooms} <i class="fas fa-bath"></i>`;
        newPropTileDivBedBathCar.appendChild(newPropTileDivBathrooms);

        const newPropTileDivCarspaces = document.createElement("div");
        newPropTileDivCarspaces.setAttribute("class", "bedbathcar");
        newPropTileDivCarspaces.innerHTML = `${result_json.carspaces} <i class="fas fa-car"></i>`;
        newPropTileDivBedBathCar.appendChild(newPropTileDivCarspaces);

        const newPropTileDivPrice = document.createElement("div");
        newPropTileDivPrice.setAttribute("class", "price");
        newPropTileDivPrice.innerText = `Price: ${result_json.priceDetails.displayPrice}`;
        newPropTileDiv.appendChild(newPropTileDivPrice);

        const newPropTileDivDescription = document.createElement("div");
        newPropTileDivDescription.innerText = `${result_json.description}`;
        newPropTileDivDescription.setAttribute("class", "description-div");
        newPropTileDiv.appendChild(newPropTileDivDescription);

    }   
}


/*



*/

const PROPERTY_TILE = document.getElementById("property-tile-div");
const BEDROOMS_MIN = document.getElementById("bedrooms-min-select");
const BEDROOMS_MAX = document.getElementById("bedrooms-max-select");
const BATHROOMS_MIN = document.getElementById("bathrooms-min-select");
const BATHROOMS_MAX = document.getElementById("bathrooms-max-select");
const CARSPACES_MIN = document.getElementById("carspaces-min-select");
const CARSPACES_MAX = document.getElementById("carspaces-max-select");
const NUMBER_OF_PROPERTIES = document.getElementById("number-of-properties-select");

let id_array = [];
const auth_url = 'https://api.domain.com.au/v1/listings/residential/_search'; 


document.addEventListener("submit", e => {

    e.preventDefault(); 

    const  formValueArray = {
        "minBedrooms" : BEDROOMS_MIN.value,
        "maxBedrooms" : BEDROOMS_MAX.value,
        "minBathrooms" : BATHROOMS_MIN.value,
        "maxBathrooms" :BATHROOMS_MAX.value,
        "minCarspaces": CARSPACES_MIN.value,
        "maxCarSpaces" : CARSPACES_MAX.value,
        "pageSize" : NUMBER_OF_PROPERTIES.value,
        "pageNumber" : Math.floor(Math.random() * 10)
    }
    
    get_property_info(formValueArray);

});

async function get_property_from_id() {

    const property_id = '2016886197';
    const id_url = `https://api.domain.com.au/v1/listings/${property_id}`

    const result = await fetch(id_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Api-Key' : API_KEY
        }
    })

    id_array = [];
    id_array.push(property_id);
    get_property_from_id_array(id_array);

}


async function get_property_info(formValueArray) {
    
    id_array = [];

    const data = await fetch(auth_url, {
        method: 'POST',
        headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key' : API_KEY
        },
        body: JSON.stringify(formValueArray)
    });

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
        PROPERTY_TILE.appendChild(newPropTileDiv);
        
        const propImageDiv = document.createElement("img");
        propImageDiv.setAttribute("src", `${result_json.media[0].url}`);
        propImageDiv.setAttribute("height", "100");
        propImageDiv.setAttribute("width", "100");
        propImageDiv.setAttribute("alt", "property-image");
        newPropTileDiv.appendChild(propImageDiv);

        const newPropTileDivAddress = document.createElement("div");
        newPropTileDivAddress.innerText = result_json.addressParts.displayAddress;
        newPropTileDiv.appendChild(newPropTileDivAddress);

        const newPropTileDivBedrooms = document.createElement("div");
        newPropTileDivBedrooms.innerText = `Bedrooms: ${result_json.bedrooms}`;
        newPropTileDiv.appendChild(newPropTileDivBedrooms);

        const newPropTileDivBathrooms = document.createElement("div");
        newPropTileDivBathrooms.innerText = `Bathrooms: ${result_json.bathrooms}`;
        newPropTileDiv.appendChild(newPropTileDivBathrooms);

        const newPropTileDivCarspaces = document.createElement("div");
        newPropTileDivCarspaces.innerText = `Car Spaces: ${result_json.carspaces}`;
        newPropTileDiv.appendChild(newPropTileDivCarspaces);

        const newPropTileDivPrice = document.createElement("div");
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


const PROPERTY_ADDRESS = document.getElementById("property-address");
const PROPERTY_IMAGE = document.getElementById("property-image");
const PROPERTY_BEDROOMS = document.getElementById("property-bedrooms");
const PROPERTY_BATHROOMS = document.getElementById("property-bathrooms");
const PROPERTY_CAR_SPACES = document.getElementById("property-car-spaces");
const PROPERTY_PRICE = document.getElementById("price");
const PROPERTY_DESCRIPTION = document.getElementById("description-div")

const property_id = '2016886197';

const id_url = `https://api.domain.com.au/v1/listings/${property_id}`


async function get_property_from_id() {

    const result = await fetch(id_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Api-Key' : API_KEY
        }
    })

    const result_json = await result.json();
    console.log(result_json);

    PROPERTY_ADDRESS.innerText = result_json.addressParts.displayAddress;

    const propImageDiv = document.createElement("img");
    propImageDiv.setAttribute("src", `${result_json.media[0].url}`);
    propImageDiv.setAttribute("height", "300");
    propImageDiv.setAttribute("width", "300");
    propImageDiv.setAttribute("alt", "property-image");
    PROPERTY_IMAGE.appendChild(propImageDiv);

    PROPERTY_BEDROOMS.innerText = `Bedrooms: ${result_json.bedrooms}`;
    PROPERTY_BATHROOMS.innerText = `Bathrooms: ${result_json.bathrooms}`;
    PROPERTY_CAR_SPACES.innerText = `Car Spaces: ${result_json.carspaces}`;
    PROPERTY_PRICE.innerText = `Price: ${result_json.priceDetails.displayPrice}`;
    PROPERTY_DESCRIPTION.innerText = `${result_json.description}`;
}

const auth_url = 'https://api.domain.com.au/v1/listings/residential/_search'; 

async function get_property_info() {
    const data = await fetch(auth_url, {
        method: 'POST',
        headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key' : API_KEY
        },
        body: JSON.stringify({
                "minBedrooms": 5, 
                "maxBedrooms": 6,
          })
    });

    const data_json = await data.json();

    console.log(data_json);
    console.log(data_json[0].listings[0].id);

}


/* Search Parameters */ 

/*

*/

import { useEffect, useState, useContext } from 'react';
import { Shipment } from '../dto/shipment';
import LocationContext from '../context/location';

export default function Cart() {
    // eslint-disable-next-line global-require
    const shippo = require('shippo')(process.env.NEXT_PUBLIC_REACT_APP_SHIPPO_API_TOKEN);
    const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
    const location = useContext(LocationContext);

    async function getReverseGeocode() {
        if (location) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                });

                if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('resultttt: ', data);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('location null');
        }
    }

    async function getShipmentInfo() {
        const addressFrom = {
            street1: '0199 old main hill',
            city: 'Logan',
            state: 'UT',
            zip: '84321',
            country: 'US',
        };

        const addressTo = {
            street1: '215 Clayton St.',
            city: 'San Francisco',
            state: 'CA',
            zip: '94117',
            country: 'US',
        };

        const parcel = {
            length: '5',
            width: '5',
            height: '5',
            distance_unit: 'in',
            weight: '2',
            mass_unit: 'lb',
        };

        const shipment = {
            address_from: addressFrom,
            address_to: addressTo,
            parcels: [parcel],
        };

        shippo.shipment.create(shipment, (err: string, shipmentInfo: Shipment) => {
            if (err) {
                console.log(err);
            } else {
                console.log('rates : %s', JSON.stringify(shipmentInfo.rates, null, 2));
                setShipmentData(shipmentInfo);
            }
        });
    }

    useEffect(() => {
        getShipmentInfo();
        console.log('in use effect: ', shipmentData);
    }, []);

    // function getAllRates() {
    //     if (shipmentData) {
    //         console.log('in getall rates');
    //         for (let i = 0; i < shipmentData.rates.length; i += 1) {
    //             console.log(shipmentData.rates[i].attributes);
    //             console.log(shipmentData.rates[i].amount);
    //             console.log('duration terms: ', shipmentData.rates[i].duration_terms);
    //             console.log('estimated days: ', shipmentData.rates[i].estimated_days);
    //         }
    //     }
    // }

    return (
        <>
            <p>welcome to the cart page</p>
            <button type="button" onClick={getReverseGeocode}>button</button>
        </>
    );
}

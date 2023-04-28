import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ref, get, child } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { Antique } from '../../../dto/antique';
import { Shipment } from '../../../dto/shipment';
import { Address } from '../../../dto/address';
import LocationContext from '../../../context/location';

export default function AntiqueTest() {
    const router = useRouter();
    const [antique, setAntique] = useState<Antique>();
    const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
    const [address, setAddress] = useState<Address | null>(null);

    // eslint-disable-next-line global-require
    const shippo = require('shippo')(process.env.NEXT_PUBLIC_REACT_APP_SHIPPO_API_TOKEN);
    const location = useContext(LocationContext);

    const CHEAPEST = 0;
    const BESTVALUE = 1;

    async function getAntiqueId() {
        const { id } = await router.query;
        const parameters = id as string;
        const index = parameters.lastIndexOf('/');
        return parameters.substring(index + 1);
    }

    async function getAntiqueData() {
        const dbRef = ref(db);
        const id = await getAntiqueId();
        try {
          const snapshot = await get(child(dbRef, `antiques/${id}`));
          if (snapshot.exists()) {
            const data = snapshot.val() as Antique;
            setAntique(data);
          } else {
            console.log('No data available');
          }
        } catch (error) {
          console.error(error);
        }
      }

    useEffect(() => {
        getAntiqueData();
    }, []);

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
                const addressData = await data.address;
                setAddress(addressData);
            } catch (error) {
                console.error(error);
            }
        }
    }

    function getShipmentInfo() {
        if (address) {
            console.log('beglength ', antique?.length);
            console.log('begwidth ', antique?.width);
            console.log('begheight ', antique?.height);
            console.log('begweight ', antique?.weight);
            const addressFrom = {
                street1: address.road,
                city: address.city,
                state: address.state,
                zip: address.postcode,
                country: address.country,
            };
            const addressTo = {
                street1: '1045 N 2000 W',
                city: 'Springville',
                state: 'UT',
                zip: '84663',
                country: 'US',
              };
            const parcel = {
                length: antique?.length,
                width: antique?.width,
                height: antique?.height,
                distance_unit: 'in',
                weight: antique?.weight,
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
    }

    function getAllRates() {
        if (shipmentData) {
            console.log('in getall rates');
            for (let i = 0; i < shipmentData.rates.length; i += 1) {
                console.log('value of i: ', i);
                console.log(shipmentData.rates[i].attributes);
                console.log(shipmentData.rates[i].amount);
                console.log('duration terms: ', shipmentData.rates[i].duration_terms);
                console.log('estimated days: ', shipmentData.rates[i].estimated_days);
            }
        }
    }

    useEffect(() => {
        getReverseGeocode();
    }, [location]);

    useEffect(() => {
        getShipmentInfo();
    }, [address]);

    useEffect(() => {
        getAllRates();
    }, [shipmentData]);

    return (
        <>
            {antique ? (
                <div>
                    <p>{antique.name}</p>
                    <p>{antique.description}</p>
                    <p>{antique.price}</p>
                    <img src={antique.url} alt="antique" width={400} height={400} />
                    <p>address: {address ? address.country + address.city + address.road + address.state : ''}</p>
                    <p>cheapest cost: {shipmentData ? shipmentData.rates[CHEAPEST].amount : ''}</p>
                    <p>best value: {shipmentData ? shipmentData.rates[BESTVALUE].amount : ''}</p>
                </div>
            )
                 : (
                    <div>
                        <p>antiques was null or something?</p>
                        <p>antique data: {antique}</p>
                        <p>antique id</p>
                    </div>
                 )}
        </>
    );
}
